import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonService } from 'src/app/services/common.service';
import { WardsService } from 'src/app/services/wards.service';
import { AppStatusCode, AppMessageResponse, StorageData } from 'src/app/shared/constants/app.constants';
import { StorageService } from 'src/app/shared/services/storage.service';
import { Paging } from 'src/app/viewModels/paging';
import { ResApi } from 'src/app/viewModels/res-api';
import { Wards } from 'src/app/viewModels/wards/wards';

@Component({
  selector: 'app-add-ward',
  templateUrl: './add-ward.component.html',
  styleUrls: ['./add-ward.component.scss']
})
export class AddWardComponent implements OnInit {

  lstWard: Wards;
  public Id: any;
   fWard: any ;
  public data: any;
  public filterParrams : Paging ;
  public loading = [false];
  lstProvince: any;
  lstDistrict: any;
  filterDistrict: any;
  lstCountries: any;
  public Idc: any;
  userId: any;

  constructor(
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private readonly fb: FormBuilder,
    private readonly wardService: WardsService,
    private readonly storeService: StorageService,
    private readonly commonService: CommonService,
    private readonly route: ActivatedRoute,
    private router: Router,
    
  ) {
    this.lstWard = new Wards();
    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 100;
    this.data = {};

    
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.Id =  params.get('id');
    });
    this.formGroup();
    
    if(this.Id)
      this.getWardById(this.Id);
    this.getListDistrict();
    this.getCompanyId();
    this.getUserId();
    this.fWard = this.fb.group({
      Id:  [0],
      CreatedById: this.userId,
      CompanyId: this.Idc,
      UpdatedById: this.userId,
      Code: ['' ,  Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(150)])],
      Name: ['' ,  Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(150)])],
      DistrictId: ['' ,  Validators.required],
      Note: [''],
    })

  }
  getCompanyId() {
    this.Idc = this.storeService.get(StorageData.companyId); 
  }
  getUserId() {
    this.userId = this.storeService.get(StorageData.userId); 
  }

  markAllAsDirty() {
    Object.keys(this.fWard.controls).forEach(key => {
      const control = this.fWard.get(key);
      if (control.enabled && control.invalid) {
        control.markAsDirty();
      }
    });
  }
  onSubmit() {
    if(this.fWard.invalid){
      this.markAllAsDirty();
      console.log(111);
      
    }else{
      if(this.Id == null) {
        const reqData = Object.assign({}, this.fWard.value);
      
        this.loading[0] = true;
        this.wardService.createWard(reqData).subscribe((res: ResApi) => {
          this.loading[0] = false;
          if(res.meta.error_code == AppStatusCode.StatusCode200) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.CreatedSuccess });

            setTimeout(() => {this.onReturnPage('/commons/wards/list')}, 1500);
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
        const reqData = Object.assign({}, this.fWard.value);
      
        this.loading[0] = true;
        this.wardService.updateWardById(this.Id, reqData).subscribe((res: ResApi) => {
          this.loading[0] = false;
          if(res.meta.error_code == AppStatusCode.StatusCode200) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.CreatedSuccess });

            setTimeout(() => {this.onReturnPage('/commons/wards/list')}, 1500);
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
  onReturnPage(url: string) : void {
    this.router.navigate([url]);
  }
  formGroup(){
    this.fWard = this.fb.group({
      Id: this.Id,
      CreatedById: this.userId,
      UpdatedById: this.userId,
      CompanyId: this.Idc,
      Code: this.data.Code,
      DistrictId: this.data.DistrictId,
      Name: this.data.Name,
      Note: this.data.Note,
    })
  }

  getWardById(id: number) {    
    if( this.Id > 0) {
      this.wardService.getWardById(id).subscribe((res: ResApi) => {
        if(res.meta.error_code == AppStatusCode.StatusCode200) {
          this.data = res.data;      
          this.formGroup();
        }
        else {
          this.data = [];
          this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
        }
      }) 
      this.data={...this.data}
    }else{
      this.data = [];
    }
  }

  getListDistrict() {
    this.commonService.getListDistrictByPaging(this.filterParrams).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstDistrict = res.data;
        
      }
      else {
        this.lstDistrict = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
      
    })
  }
  onBack(event: Event) {
    let isShow = true;

    if (isShow) {
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: !(this.Id > 0) ? 'Hủy thêm mới' : 'Hủy cập nhật' ,
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Xác nhận',
        rejectLabel: 'Hủy bỏ',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
        accept: () => {
          this.router.navigate(['/commons/wards/list']);
        },
        reject: () => {
            return;
        }
      });
    } else {
      this.router.navigate(['/commons/wards/list']);
    }
  }
}

