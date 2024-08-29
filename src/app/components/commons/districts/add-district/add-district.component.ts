import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonService } from 'src/app/services/common.service';
import { DistrictsService } from 'src/app/services/districts.service';
import { AppStatusCode, AppMessageResponse, StorageData } from 'src/app/shared/constants/app.constants';
import { StorageService } from 'src/app/shared/services/storage.service';
import { Districts } from 'src/app/viewModels/districts/districts';
import { Paging } from 'src/app/viewModels/paging';
import { ResApi } from 'src/app/viewModels/res-api';

@Component({
  selector: 'app-add-district',
  templateUrl: './add-district.component.html',
  styleUrls: ['./add-district.component.scss']
})
export class AddDistrictComponent implements OnInit {

  lstDistrict: Districts;
  public Id: any;
  fDistrict: any ;
  lstProvinces: any ;
  public data: any;
  public filterParrams : Paging ;
  public loading = [false];
  Idc: any;
  userId: any;

  constructor(
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private readonly fb: FormBuilder,
    private readonly districtService: DistrictsService,
    private readonly commonService: CommonService,
    private readonly route: ActivatedRoute,
    private router: Router,
    private readonly storeService : StorageService,
    
  ) {
    this.lstDistrict = new Districts();
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
      this.getDistrictById(this.Id);
      this.getListProvinces();

    this.getCompanyId();
    this.getUserId();
    this.fDistrict = this.fb.group({
      Id:  [0],
      CreatedById: this.userId,
      UpdatedById: this.userId,
      CompanyId: this.Idc,
      ProvinceId: ['' ,  Validators.required],
      Code: ['' ,  Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(150)])],
      Name: ['' ,  Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(150)])],
      Note: [''],
    })

  }

  markAllAsDirty() {
    Object.keys(this.fDistrict.controls).forEach(key => {
      const control = this.fDistrict.get(key);
      if (control.enabled && control.invalid) {
        control.markAsDirty();
      }
    });
  }
  onSubmit() {
    if(this.fDistrict.invalid){
      this.markAllAsDirty();
      console.log(111);
        
      }else{
      if(this.Id == null) {
        const reqData = Object.assign({}, this.fDistrict.value);
      
        this.loading[0] = true;
        this.districtService.createDistrict(reqData).subscribe((res: ResApi) => {
          this.loading[0] = false;
          if(res.meta.error_code == AppStatusCode.StatusCode200) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.CreatedSuccess });

            setTimeout(() => {this.onReturnPage('/commons/districts/list')}, 1500);
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
        const reqData = Object.assign({}, this.fDistrict.value);
      
        this.loading[0] = true;
        this.districtService.updateDistrictById(this.Id, reqData).subscribe((res: ResApi) => {
          this.loading[0] = false;
          if(res.meta.error_code == AppStatusCode.StatusCode200) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.CreatedSuccess });

            setTimeout(() => {this.onReturnPage('/commons/districts/list')}, 1500);
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
    this.fDistrict = this.fb.group({
      id: this.Id,
      CreatedById: this.userId,
      UpdatedById: this.userId,
      CompanyId: [1],
      ProvinceId: this.data.ProvinceId,
      Code: this.data.Code,
      Name: this.data.Name,
      Note: this.data.Note,
    })
  }

  getDistrictById(id: number) {    
    if( this.Id > 0) {
      this.districtService.getDistrictById(id).subscribe((res: ResApi) => {
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
  getUserId() {
    this.userId = this.storeService.get(StorageData.userId); 
  }
  getCompanyId() {
    this.Idc = this.storeService.get(StorageData.companyId); 
  }
  getListProvinces() {
    this.commonService.getListProvinceByPaging(this.filterParrams).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstProvinces = res.data;
        
      }
      else {
        this.lstProvinces = [];
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
          this.router.navigate(['/commons/districts/list']);
        },
        reject: () => {
            return;
        }
      });
    } else {
      this.router.navigate(['/commons/districts/list']);
    }
  }
}