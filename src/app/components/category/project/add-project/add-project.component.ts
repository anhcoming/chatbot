import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonService } from 'src/app/services/common.service';
import { AppMessageResponse, AppStatusCode, StorageData } from 'src/app/shared/constants/app.constants';
import { Paging } from 'src/app/viewModels/paging';
import { ActivatedRoute } from '@angular/router';
import {FormGroup , FormBuilder ,Validators} from "@angular/forms";
import { ProjectService } from 'src/app/services/project.service';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { Router } from '@angular/router';
import { Project } from 'src/app/viewModels/project/project';
import { ResApi } from 'src/app/viewModels/res-api';
import { HttpClient} from '@angular/common/http';
import { StorageService } from 'src/app/shared/services/storage.service';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.scss']
})
export class AddProjectComponent {
  // @ViewChild('file') fileInput: ElementRef;
  public itemProject: Project;

  public fProject: any;
  public projectId: any;
  Idc: any;
  userId: any;
  public data: any;
  public uploadedImageUrl: any;
  public imgName = ''
  public lstWard: any[];
  public lstProvince: any[];
  public lstDistrict: any[];
  public filterProvince: Paging;
  public filterWard: Paging;
  public filterDistrict: Paging;
  isImageSelected : boolean = false;
  public loading = [false];

  constructor(
    private readonly commonService: CommonService,
    private readonly messageService: MessageService,
    private readonly fb: FormBuilder,
    private readonly projectService: ProjectService,
    private readonly layoutService: LayoutService,
    private readonly http: HttpClient,
    private confirmationService: ConfirmationService,
    private router: Router,
    private readonly route: ActivatedRoute,
    private readonly storeService: StorageService,
    private renderer: Renderer2,
     private el: ElementRef
  ) {
    this.itemProject = new Project();

    this.filterProvince = new Object as Paging;

    this.filterWard = new Object as Paging;

    this.filterDistrict = new Object as Paging;

    this.lstProvince = [];
    this.lstWard = [];
    this.lstDistrict = [];

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.projectId =  params.get('Id');
      if(this.projectId == null) {
        this.projectId = 0;
      }
    });
    this.getCompanyId();
    this.getUserId();
    this.getProjectById(this.Idc, this.projectId);
    this.getListProvince();
    this.formGroup();
    
    this.fProject = this.fb.group({
      Id:  [0],
      CreatedById: this.userId,
      UpdatedById: this.userId,
      CompanyId: this.Idc,
      Name: ['' , Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(150)])],
      Code: ['' , Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])],
      ContactName: ['' ],
      ContactPhone: ['', Validators.pattern('[0-9\s]*') ],
      ProvinceId: ['' , ],
      Image : [''],
      DistrictId: ['' , ],
      WardId: ['' , ],
      Address: ['' , ],
      Note: ['' , ]
    })
  }
  getCompanyId() {
    this.Idc = this.storeService.get(StorageData.companyId); 
  }
  
  getUserId() {
    this.userId = this.storeService.get(StorageData.userId); 
  }

  onReturnPage(url: string) : void {
    this.router.navigate([url]);
  }
  markAllAsDirty() {
    Object.keys(this.fProject.controls).forEach(key => {
      const control = this.fProject.get(key);
      if (control.enabled && control.invalid) {
        control.markAsDirty();
      }
    });
  }
  onSubmit() {
    if(this.fProject.invalid){
      this.markAllAsDirty();
    }else{
      if(!this.fProject.get('Code').value) {
        this.messageService.add({severity: 'error', summary:'Error', detail: 'Mã khu đô thị không được để trống!'})
        return
      }
      if(this.projectId == 0) {
        const reqData = Object.assign({}, this.fProject.value);
        reqData.Image = this.data.Image;
        this.uploadedImageUrl = `http://i-apigw.cnttvietnam.com.vn/uploads/images/${this.data.Image}`;
        this.loading[0] = true;
        this.projectService.createProject(reqData).subscribe((res: ResApi) => {
          this.loading[0] = false;
          if(res.meta.error_code == AppStatusCode.StatusCode200) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.CreatedSuccess });
  
            setTimeout(() => {this.onReturnPage('/category/project/list')}, 1500);
          }
          else {
            this.loading[0] = false;
            this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
          }
        },
        () => {
          this.loading[0] = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest }) },
        () => {this.loading[0] = false} 
        ) 
      }
      else{
        const reqData = Object.assign({}, this.fProject.value);
        reqData.Image = this.data.Image;
        this.uploadedImageUrl = `http://i-apigw.cnttvietnam.com.vn/uploads/images/${this.data.Image}`;
        this.loading[0] = true;
        this.projectService.updateProjectById(this.projectId, reqData).subscribe((res: ResApi) => {
          this.loading[0] = false;
          if(res.meta.error_code == AppStatusCode.StatusCode200) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.CreatedSuccess });
  
            setTimeout(() => {this.onReturnPage('/category/project/list')}, 1500);
          }
          else {
            this.loading[0] = false;
            this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
          }
        },
        () => {
          this.loading[0] = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest }) },
        () => {this.loading[0] = false} 
        )
      }
    }
  }

  getProjectById(idc: number, id: number) {    
    if(this.projectId != 0) {
      this.projectService.getProjectById(idc, id).subscribe((res: ResApi) => {
        this.isImageSelected=true;
        if(res.meta.error_code == AppStatusCode.StatusCode200) {
          this.data = res.data;
          this.data.Image = res.data.Image;
          this.onSelectDistrict(this.data.ProvinceId);
          this.onSelectWards(this.data.DistrictId);
          this.formGroup();
          this.uploadedImageUrl = `http://i-apigw.cnttvietnam.com.vn/uploads/images/${this.data.Image}`;
        }
        else {
          this.data = [];
          this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
        }
      }) 
      this.data={...this.data}
    }else{
      this.data = []
    }
  }
  formGroup(){
    this.fProject = this.fb.group({
      Id:  this.projectId,
      CreatedById: this.userId,
      UpdatedById: this.userId,
      CompanyId: this.Idc,
      Name: this.data.Name,
      Status: this.data.Status,
      Code: this.data.Code,
      Image : '',
      ContactName: this.data.ContactName,
      ContactPhone: this.data.ContactPhone,
      ProvinceId: this.data.ProvinceId,
      DistrictId: this.data.DistrictId,
      WardId: this.data.WardId,
      Address: this.data.Address,
      Note: this.data.Note
    })

  }

  getListProvince() {
    this.commonService.getListProvinceByPaging(this.filterProvince)
    .subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstProvince = res.data;
      }
      else {
        this.lstProvince = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
      
    })
  }

  getListDistrict() {
    this.commonService.getListDistrictByPaging(this.filterDistrict)
    .subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstDistrict = res.data;
      }
      else {
        this.lstDistrict = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
      
    })
  }
  onImageSelected(event: any) {
    const file: File = event.target.files[0]; // Lấy file từ sự kiện event
    if (file) {
      const formData: FormData = new FormData();
      formData.append('image', file, file.name); // Gắn file vào FormData
  
      // Gửi yêu cầu POST tới API endpoint hỗ trợ việc upload file
      this.http.post('https://i-apigw.cnttvietnam.com.vn/api/upload/uploadImage', formData)
        .subscribe(
          (response: any) => {
            this.isImageSelected=true;
            // Lấy đường dẫn ảnh đã upload từ phản hồi của server
            const uploadedImageName = response.data;
            this.data.Image = uploadedImageName[0];
            this.imgName = uploadedImageName[0];
            console.log('Upload thành công:', response);
            this.uploadedImageUrl = `http://i-apigw.cnttvietnam.com.vn/uploads/images/${uploadedImageName}`;
          },
          (error) => {
            // Xử lý lỗi nếu có
            console.error('Lỗi upload:', error); 
          }
        );
    }
  }


  Imagenull(){
    this.uploadedImageUrl = '';
    this.data.Image = undefined;
    this.isImageSelected=false;
  }
  getListWard() {
    this.commonService.getListWardByPaging(this.filterWard)
    .subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstWard = res.data;
      }
      else {
        this.lstWard = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
      
    })
  }
  onSelectWards(event: any) {
    if(event?.value == null && event == null) {
      if(event == null)
        return
      this.filterWard.query = '1=1';
    }else{
      this.filterWard.query = `DistrictId=${event.value || event}`;
    }
    this.getListWard();
  }
  onSelectDistrict(event: any) {
    
    if(event?.value == null && event == null) {
      if(event == null)
        return
      this.filterDistrict.query = '1=1';
    }else{
      this.filterDistrict.query = `ProvinceId=${event.value || event}`;
    }
    this.getListDistrict();

  }

  onBack(event: Event) {
    let isShow = true;//this.layoutService.getIsShow();

    if (isShow) {
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: !(this.projectId > 0) ? 'Bạn có muốn hủy Thêm mới khu đô thị không? ' : 'Bạn có muốn hủy sửa khu đô thị <b>"'+ this.data?.Name +'"</b> không? ',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Xác nhận',
        rejectLabel: 'Hủy bỏ',
        acceptButtonStyleClass: 'p-button-success',
        rejectButtonStyleClass: 'p-button-danger',
        accept: () => {
          this.router.navigate(['category/project/list']);
        },
        reject: () => {
            return;
        }
      });
    } else {
      this.router.navigate(['category/project/list']);
    }
  }
}
