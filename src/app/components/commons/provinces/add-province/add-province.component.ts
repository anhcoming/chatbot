import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonService } from 'src/app/services/common.service';
import { ProvincesService } from 'src/app/services/provinces.service';
import { AppStatusCode, AppMessageResponse, StorageData } from 'src/app/shared/constants/app.constants';
import { StorageService } from 'src/app/shared/services/storage.service';
import { Paging } from 'src/app/viewModels/paging';
import { Provinces } from 'src/app/viewModels/provinces/provinces';
import { ResApi } from 'src/app/viewModels/res-api';

@Component({
  selector: 'app-add-province',
  templateUrl: './add-province.component.html',
  styleUrls: ['./add-province.component.scss']
})
export class AddProvinceComponent implements OnInit {

  lstProvince: Provinces;
  public Id: any;
   fProvince: any ;
  public data: any;
  public lstCountry: any;
  public filterParrams : Paging ;
  public loading = [false];
  userId: any;
  Idc: any;

  constructor(
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private readonly fb: FormBuilder,
    private readonly provinceService: ProvincesService,
    private readonly commonService: CommonService,
    private readonly route: ActivatedRoute,
    private router: Router,
    private readonly storeService : StorageService,
  ) {
    this.lstProvince = new Provinces();
    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 100;
    this.lstCountry = [];
    this.data = {};

    
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.Id =  params.get('id');
    });

    this.formGroup();
    this.getListCountry();
    
    if(this.Id)
      this.getProvinceById(this.Id);

    this.getCompanyId();
    this.getUserId();
    this.fProvince = this.fb.group({
      Id:  [0],
      CompanyId : this.Idc,
      CreatedById: this.userId,
      UpdatedById: this.userId,
      CountryId: ['', Validators.required],
      Code: ['' ,  Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(150)])],
      Name: ['' ,  Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(150)])],
      Note: [''],
    })

  }
  getUserId() {
    this.userId = this.storeService.get(StorageData.userId); 
  }
  getCompanyId() {
    this.Idc = this.storeService.get(StorageData.companyId); 
  }

  markAllAsDirty() {
    Object.keys(this.fProvince.controls).forEach(key => {
      const control = this.fProvince.get(key);
      if (control.enabled && control.invalid) {
        control.markAsDirty();
      }
    });
  }
  onSubmit() {
    if(this.fProvince.invalid){
      this.markAllAsDirty();
      console.log(111);
      
    }else{
      if(this.Id == null) {
        const reqData = Object.assign({}, this.fProvince.value);
      
        this.loading[0] = true;
        this.provinceService.createProvince(reqData).subscribe((res: ResApi) => {
          this.loading[0] = false;
          if(res.meta.error_code == AppStatusCode.StatusCode200) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.CreatedSuccess });

            setTimeout(() => {this.onReturnPage('/commons/provinces/list')}, 1500);
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
        const reqData = Object.assign({}, this.fProvince.value);
      
        this.loading[0] = true;
        this.provinceService.updateProvinceById(this.Id, reqData).subscribe((res: ResApi) => {
          this.loading[0] = false;
          if(res.meta.error_code == AppStatusCode.StatusCode200) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.CreatedSuccess });

            setTimeout(() => {this.onReturnPage('/commons/provinces/list')}, 1500);
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
    this.fProvince = this.fb.group({
      id: this.Id,
      CreatedById: this.userId,
      UpdatedById: this.userId,
      CountryId: this.data.CountryId,
      Code: this.data.Code,
      Name: this.data.Name,
      Note: this.data.Note,
    })
  }

  getProvinceById(id: number) {    
    if( this.Id > 0) {
      this.provinceService.getProvinceById(id).subscribe((res: ResApi) => {
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
  getListCountry() {
      this.commonService.getListCountrieByPaging(this.filterParrams)
      .subscribe((res: ResApi) => {
        if(res.meta.error_code == AppStatusCode.StatusCode200) {
          this.lstCountry = res.data;
        }
        else {
          this.lstCountry = [];
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
            this.router.navigate(['/commons/provinces/list']);
          },
          reject: () => {
              return;
          }
        });
      } else {
        this.router.navigate(['/commons/provinces/list']);
      }
    }
}
