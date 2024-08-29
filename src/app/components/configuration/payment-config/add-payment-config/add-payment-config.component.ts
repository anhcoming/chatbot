import { Component} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonService } from 'src/app/services/common.service';
import { AppMessageResponse, AppStatusCode, IsStatus, StorageData } from 'src/app/shared/constants/app.constants';
import { Paging } from 'src/app/viewModels/paging';
import { ResApi } from 'src/app/viewModels/res-api';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from 'src/app/services/project.service';
import { FloorService } from 'src/app/services/floor.service';
import { TowerService } from 'src/app/services/tower.service';
import { HttpClient} from '@angular/common/http';
import { ZoneService } from 'src/app/services/zone.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ConfigPaymentService } from 'src/app/services/config-payment.service';

@Component({
  selector: 'app-add-payment-config',
  templateUrl: './add-payment-config.component.html',
  styleUrls: ['./add-payment-config.component.scss']
})
export class AddPaymentConfigComponent {

  public id: any;
  fPayment: any ;
  public isStatus = IsStatus;
  public lstProject: any[];
  public lstTower: any[];
  public Tower: any;
  public lstPayment: any = [];
  public uploadedImageUrl: any;
  public isImageSelected: boolean = false; 
  public imgName = ''
  Idc: any;
  submitted = false
  public filterFloor: Paging;
  public filterProject: Paging;
  public filterTower: Paging;
  public filterZone: Paging;
  public filterParrams : Paging ;
  public allChecked: boolean = false;
  public loading = [false];
  userId: any;

  constructor(
    private readonly projectService: ProjectService,
    private readonly towerService: TowerService,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private readonly http: HttpClient,
    private readonly fb: FormBuilder,
    private readonly floorService: FloorService,
    private readonly paymentService: ConfigPaymentService,
    private readonly route: ActivatedRoute,
    private router: Router,
    private readonly storeService: StorageService,
  ) {
    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 100;

    this.filterFloor = new Object as Paging;
    this.filterZone = new Object as Paging;

    this.filterProject = new Object as Paging;
    this.filterTower = new Object as Paging;

    this.lstProject = [];
    this.lstTower = [];
    this.fPayment = this.fb.group({
      ProjectId: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(150)])],
      Id:  [0],
      CreatedById: this.userId,
      UpdatedById: this.userId,
      CompanyId: this.Idc,
      Name: ['' , Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(150)])],
      Image: [''],
      Status: ['', Validators.required],
      UrlPay: ['' , Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(1000)])],
      UrlQuery: ['' , Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(1000)])],
      Merchant: ['' , Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(1000)])],
      AccessCode: ['' , Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(1000)])],
      AccessKey: ['' , Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(1000)])],
      UserName: ['' , Validators.required],
      Password: ['' , Validators.required],
      ExchangRate: ['' , Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(1000)])],
      PriceFee: ['' , Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(1000)])],
      CardList: ['' , Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(1000)])],
      Note: ['' , Validators.required],
      listTowerMaps: this.fb.array(['', Validators.required])
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id =  params.get('id');
    });
    if(this.id) {
      this.getConfigPaymentById(this.id);
    }
    this.getCompanyId()
    this.getListProject();
    this.getUserId();
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
    Object.keys(this.fPayment.controls).forEach(key => {
      const control = this.fPayment.get(key);
      if (control.enabled && control.invalid) {
        control.markAsDirty();
      }
    });
  }
  onSubmit() {
    if(this.fPayment.invalid){
      this.markAllAsDirty();
      this.checkTower()
    }else{
      this.checkTower();
      if(this.fPayment.controls['listTowerMaps'].dirty == true) {
        return
      }else{
        this.onCheck()
        if(this.id == null) {
          const reqData = Object.assign({}, this.fPayment.value);
          reqData.Id = 0;
          reqData.CreatedById = this.userId;
          reqData.CompanyId = this.Idc;
          reqData.Image = this.lstPayment.Image;
          reqData.listTowerMaps = this.Tower;
          this.loading[0] = true;
          this.paymentService.createConfigPayment(reqData).subscribe((res: ResApi) => {
            this.loading[0] = false;
            if(res.meta.error_code == AppStatusCode.StatusCode200) {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.CreatedSuccess });

              setTimeout(() => {this.onReturnPage('/configuration/payment-config/list')}, 1500);
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
          const reqData = Object.assign({}, this.fPayment.value);
          reqData.listTowerMaps = this.Tower;
          reqData.Image = this.lstPayment.Image;
          console.log(reqData);
          
          this.loading[0] = true;
          this.paymentService.updateConfigPaymentById(this.id, reqData).subscribe((res: ResApi) => {
            this.loading[0] = false;
            if(res.meta.error_code == AppStatusCode.StatusCode200) {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.CreatedSuccess });

              setTimeout(() => {this.onReturnPage('/configuration/payment-config/list')}, 1500);
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
  }
  checkTower() {
    const isAnyChecked = this.lstTower.some((tower) => tower.checked === true);
    if(isAnyChecked == false) {
      const control = this.fPayment.get('listTowerMaps');
      control.markAsDirty();
    }else{
      const control = this.fPayment.get('listTowerMaps');
      control.markAsPristine();
    }
  }
  setFormGroup() {
    this.fPayment = this.fb.group({
      ProjectId: this.lstPayment.ProjectId ,
      Id:  this.lstPayment.Id,
      CreatedById: this.userId,
      UpdatedById: this.userId,
      CompanyId: this.Idc,
      Name: this.lstPayment.Name,
      Status: this.lstPayment.Status ,
      UrlPay: this.lstPayment.UrlPay,
      UrlQuery: this.lstPayment.UrlQuery ,
      Merchant: this.lstPayment.Merchant ,
      AccessCode: this.lstPayment.AccessCode ,
      AccessKey: this.lstPayment.AccessKey ,
      UserName: this.lstPayment.Username  ,
      Password: this.lstPayment.Password  ,
      ExchangRate: this.lstPayment.ExchangRate ,
      PriceFee: this.lstPayment.PriceFee ,
      CardList: this.lstPayment.CardList ,
      Note: this.lstPayment.Note  ,
      listTowerMaps: this.lstPayment.listTowerMaps ,
      Image: '',
    });
    
  }
  
 
 

  getListProject() {
    this.lstProject = [];
    this.projectService.getListByPaging(this.filterProject).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstProject = res.data;
      }
      else {
        this.lstProject  = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })  
  }
  getListTower(event: any) {
    this.allChecked = false;
    if (!event || event.value) {
      this.lstTower = [];
    }

    this.filterTower.query = `ProjectId=${event.value || event}`;

    this.towerService.getListTowerByPaging(this.filterTower)
    .subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstTower = res.data;
        for(let i=0; i<this.lstTower.length; i++){
          this.lstTower[i].checked = false;
        }
        if(this.lstPayment.listTowerMaps){
          this.lstPayment.listTowerMaps.map((items: any) => {
            this.lstTower.forEach((item) => {
              if (item.Id == items.TowerId) {
                item.checked = true;
              }
            });
          })
          this.allChecked = this.lstTower.every(item => item.checked);
        }
      }
      else {
        this.lstTower = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })
  }
  getConfigPaymentById(id: number) {
    this.isImageSelected = true;
    this.paymentService.getConfigPaymentById(id).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstPayment = res.data;
        this.lstPayment.Image = res.data.Image;
        this.uploadedImageUrl = `http://i-apigw.cnttvietnam.com.vn/uploads/images/${this.lstPayment.Image}`;
        this.getListTower(this.lstPayment.ProjectId);
        
        this.setFormGroup();
      }
    })
  }
  onBack(event: Event) {
    let isShow = true;

    if (isShow) {
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: !(this.id > 0) ? 'Bạn có muốn dừng thêm mới cấu hình thanh toán' : `Bạn có muốn dừng cập nhật cấu hình thanh toán <b>"`+ this.lstPayment.Name +`"</b>?`,
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Xác nhận',
        rejectLabel: 'Hủy bỏ',
        acceptButtonStyleClass: 'p-button-success',
        rejectButtonStyleClass: 'p-button-danger',
        accept: () => {
          this.router.navigate(['/configuration/payment-config/list']);
        },
        reject: () => {
            return;
        }
      });
    } else {
      this.router.navigate(['/configuration/payment-config/list']);
    }
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
            this.lstPayment.Image = uploadedImageName[0];
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
    this.fPayment.controls['Image'].setValue('')
    this.uploadedImageUrl = '';
    this.lstPayment.Image = '';
    this.isImageSelected = false;
  }
  onCheck() {
    this.Tower = this.lstTower.filter((i: any) => i.checked === true).map((item: any) => ({TowerId: item.Id, ProjectId: item.ProjectId ,TargetId: 0}))
  }
  checkAll() {
    this.allChecked = this.lstTower.every(item => item.checked);
    this.checkTower()
  }
  toggleAll() {
    this.lstTower.forEach(item => item.checked = this.allChecked);
    this.checkTower()
  }
}

