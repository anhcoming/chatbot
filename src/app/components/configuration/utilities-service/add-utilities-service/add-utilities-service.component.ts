import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FunctionService } from 'src/app/services/function.service';
import { UtilitiesServiceService } from 'src/app/services/utilities-service.service';
import { AppMessageResponse, AppStatusCode, IsShow, StorageData, TypeViewApp } from 'src/app/shared/constants/app.constants';
import { StorageService } from 'src/app/shared/services/storage.service';
import { Paging } from 'src/app/viewModels/paging';
import { ResApi } from 'src/app/viewModels/res-api';
import { UtilitiesService } from 'src/app/viewModels/utilities-service/ultilities-service';

@Component({
  selector: 'app-add-utilities-service',
  templateUrl: './add-utilities-service.component.html',
  styleUrls: ['./add-utilities-service.component.scss']
})
export class AddUtilitiesServiceComponent {
  fService : any;
  id : any;
  lstFunction : any;
  isStatus : any;
  imgName : string = '';
  iconName : string = '';
  public lstType = TypeViewApp;
  uploadedImageUrl: string = '';
  uploadedIconUrl : string = '';
  isShowConfig  = IsShow;
  public loading = [false];
  isImageSelected : boolean = false;
  isIconSelected : boolean = false;
  public lstService : any;
  userId: any;
  Idc: any;
  constructor(
    private readonly functionService: FunctionService,
    private readonly confirmationService: ConfirmationService,
    private readonly http: HttpClient,
    private readonly fb: FormBuilder,
    private readonly utilitiesService: UtilitiesServiceService,
    private readonly route: ActivatedRoute,
    private router: Router,
    private readonly messageService : MessageService,
    private readonly storeService : StorageService,
  ){
    this.lstService = {};
    this.fService = this.fb.group({
      Id : [0],
      Code : ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(150)])],
      Name : ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(150)])],
      Status : [1],
      Icon: ['',Validators.required],
      CreatedById : this.userId,
      UpdatedById : this.userId,
      CompanyId : this.Idc,
      Image: [''],
      Type : [0,Validators.required],
      FunctionId: [0,Validators.required],
      Location : [0,Validators.required],
    })
  }



  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id =  params.get('id');
    });
    if(this.id) {
      this.getUtilitiesServiceById(this.id);
    }
    this.getCompanyId()
    this.getUserId();
    this.GetlistFunctions()
  }

  getUserId() {
    this.userId = this.storeService.get(StorageData.userId); 
  }
  getCompanyId() {
    this.Idc = this.storeService.get(StorageData.companyId); 
  }

  onReturnPage(url: string) : void {
    this.router.navigate([url]);
  }
  markAllAsDirty() {
    Object.keys(this.fService.controls).forEach(key => {
      const control = this.fService.get(key);
      if (control.enabled && control.invalid) {
        control.markAsDirty();
      }
    });
  }
  onSubmit() {
    if(this.fService.invalid){
      this.markAllAsDirty();  
    }else{
        if(this.id == null) {
          const reqData = Object.assign({}, this.fService.value);
          reqData.CreatedById = this.userId;
          reqData.UpdatedById = this.userId;
          reqData.CompanyId = this.Idc;
          reqData.Image = this.lstService.Image;
          reqData.Icon = this.lstService.Icon;
          reqData.UpdatedById = this.userId;
          this.loading[0] = true;
          this.utilitiesService.createUtilitiesService(reqData).subscribe((res: ResApi) => {
            this.loading[0] = false;
            if(res.meta.error_code == AppStatusCode.StatusCode200) {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.CreatedSuccess });

              setTimeout(() => {this.onReturnPage('/configuration/utilities-service/list')}, 1500);
            }
            else {
              this.loading[0] = false
              
              this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
            }
          },
          () => {
            this.loading[0] = false
            this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest }) },
          () => {this.loading[0] = false} 
          ) 
        }
        else{
          const reqData = Object.assign({}, this.fService.value);
          reqData.Icon = this.lstService.Icon;
          reqData.Image = this.lstService.Image;
          reqData.CreatedById = this.userId;
          reqData.UpdatedById = this.userId;
          reqData.CompanyId = this.Idc;
          this.loading[0] = true;
          this.utilitiesService.updateUtilitiesServiceById(this.id, reqData).subscribe((res: ResApi) => {
            this.loading[0] = false;
            if(res.meta.error_code == AppStatusCode.StatusCode200) {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.CreatedSuccess });

              setTimeout(() => {this.onReturnPage('/configuration/utilities-service/list')}, 1500);
            }
            else {
              
              this.loading[0] = false
              this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
            }
          },
          () => {
            this.loading[0] = false
            this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest }) },
          () => {this.loading[0] = false} 
          )
      }
    }
  }

  // getListFunctionPerant() {
  //   this.functionService.getTreeFunction(this.id).subscribe((res:ResApi) => {
  //     if(res.meta.error_code == AppStatusCode.StatusCode200) {
  //       this.lstFunction = res.data; 
  //     }
  //     else {
  //       this.lstFunction = []
  //       this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
  //     }
  //   })  
  // }
  GetlistFunctions() {
    this.functionService.getTreeFunction(this.id).subscribe(
      (res: any) => {
        this.loading[0] = false;
        if (res?.meta?.error_code == AppStatusCode.StatusCode200) {
          this.lstFunction = res.data;
        }   else {
                this.lstFunction = []
                this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
              }
      },
    );
  }
 
  getUtilitiesServiceById(id: number) {    
    if( this.id > 0) {
      this.isIconSelected = true;
      this.isImageSelected = true;
      this.utilitiesService.getUtilitiesServiceById(id).subscribe((res: ResApi) => {
        if(res.meta.error_code == AppStatusCode.StatusCode200) {
          this.lstService = res.data;    
          this.setFormGroup();
          this.uploadedImageUrl = `http://i-apigw.cnttvietnam.com.vn/uploads/images/${this.lstService.Image}`;
          this.uploadedIconUrl = `http://i-apigw.cnttvietnam.com.vn/uploads/images/${this.lstService.Icon}`;
        }
        else {
          this.lstService = [];
          this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
        }
      }) 
      this.lstService={...this.lstService}
    }else{
      this.lstService = [];
    }
  }
  setFormGroup(){
   this.fService = this.fb.group({
    Id : this.lstService.Id,
    Code : this.lstService.Code,
    Name : this.lstService.Name,
    Status : this.lstService.Status,
    Icon: '',
    CreatedById : this.userId,
    UpdatedById : this.userId,
    CompanyId : this.Idc,
    FunctionId : this.lstService.FunctionId,
    Image: '',
    Type : this.lstService.Type,
    Location : this.lstService.Location,
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
            this.isImageSelected = true;
            // Lấy đường dẫn ảnh đã upload từ phản hồi của server
            const uploadedImageName = response.data;
            this.lstService.Image = uploadedImageName[0];
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
    this.lstService.Image = '';
    this.isImageSelected = false;
  }
  onIconSelected(event: any) {
    const file: File = event.target.files[0]; // Lấy file từ sự kiện event
    if (file) {
      const formData: FormData = new FormData();
      formData.append('image', file, file.name); // Gắn file vào FormData
  
      // Gửi yêu cầu POST tới API endpoint hỗ trợ việc upload file
      this.http.post('https://i-apigw.cnttvietnam.com.vn/api/upload/uploadImage', formData)
        .subscribe(
          (response: any) => {
            this.isIconSelected = true;
            // Lấy đường dẫn ảnh đã upload từ phản hồi của server
            const uploadedIconName = response.data;
            this.lstService.Icon = uploadedIconName[0];
            this.iconName = uploadedIconName[0];
            console.log('Upload thành công:', response);
            this.uploadedIconUrl = `http://i-apigw.cnttvietnam.com.vn/uploads/images/${uploadedIconName}`;
          },
          (error) => {
            // Xử lý lỗi nếu có
            console.error('Lỗi upload:', error); 
          }
        );
    }
  }
  Iconnull(){
    this.uploadedIconUrl = '';
    this.lstService.Icon = '';
    this.isIconSelected = false;
  }
  onBack(event: Event) {
    let isShow = true;

    if (isShow) {
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: "Bạn có muốn Hủy?",
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Xác nhận',
        rejectLabel: 'Hủy bỏ',
        acceptButtonStyleClass: 'p-button-success',
        rejectButtonStyleClass: 'p-button-danger',
        accept: () => {
          this.router.navigate(['/configuration/utilities-service/list']);
        },
        reject: () => {
            return;
        }
      });
    } else {
      this.router.navigate(['/configuration/utilities-service/list']);
    }
  }
}
