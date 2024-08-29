import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CountriesService } from 'src/app/services/countries.service';
import { AppStatusCode, AppMessageResponse, StorageData } from 'src/app/shared/constants/app.constants';
import { Paging } from 'src/app/viewModels/paging';
import { ResApi } from 'src/app/viewModels/res-api';
import { Countries } from 'src/app/viewModels/countries/countries';
import { StorageService } from 'src/app/shared/services/storage.service';


@Component({
  selector: 'app-add-country',
  templateUrl: './add-country.component.html',
  styleUrls: ['./add-country.component.scss']
})
export class AddCountryComponent  implements OnInit {

  lstCountrie: Countries;
  public Id: any;
   fCountry: any ;
  public data: any;
  public filterParrams : Paging ;
  public loading = [false];
  userId: any;
  Idc: any;

  constructor(
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private readonly fb: FormBuilder,
    private readonly countrieService: CountriesService,
    private readonly route: ActivatedRoute,
    private router: Router,
    private readonly storeService : StorageService,
  
  ) {
    this.lstCountrie = new Countries();
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
      this.getCountrieById(this.Id);

    this.getCompanyId();
    this.getUserId();

    this.fCountry = this.fb.group({
      Id:  [0],
      CreatedById: this.userId,
      UpdatedById: this.userId,
      CompanyId: this.Idc,
      // ProjectId: ['' ,  Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(150)])],
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
    Object.keys(this.fCountry.controls).forEach(key => {
      const control = this.fCountry.get(key);
      if (control.enabled && control.invalid) {
        control.markAsDirty();
      }
    });
  }
  onSubmit() {
    if(this.fCountry.invalid){
      this.markAllAsDirty();
      
    }else{
      if(this.Id == null) {
        const reqData = Object.assign({}, this.fCountry.value);
      
        this.loading[0] = true;
        this.countrieService.createCountrie(reqData).subscribe((res: ResApi) => {
          this.loading[0] = false;
          if(res.meta.error_code == AppStatusCode.StatusCode200) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.CreatedSuccess });

            setTimeout(() => {this.onReturnPage('/commons/countries/list')}, 1500);
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
        const reqData = Object.assign({}, this.fCountry.value);
      
        this.loading[0] = true;
        this.countrieService.updateCountrieById(this.Id, reqData).subscribe((res: ResApi) => {
          this.loading[0] = false;
          if(res.meta.error_code == AppStatusCode.StatusCode200) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.CreatedSuccess });

            setTimeout(() => {this.onReturnPage('/commons/countries/list')}, 1500);
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
    this.fCountry = this.fb.group({
      id: this.Id,
      CreatedById: this.userId,
      UpdatedById: this.userId,
      CompanyId: [1],
      // ProjectId: this.data.ProjectId,
      Code: this.data.Code,
      Name: this.data.Name,
      Note: this.data.Note,
    })
  }

  getCountrieById(id: number) {    
    if( this.Id > 0) {
      this.countrieService.getCountrieById(id).subscribe((res: ResApi) => {
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
          this.router.navigate(['/commons/countries/list']);
        },
        reject: () => {
            return;
        }
      });
    } else {
      this.router.navigate(['/commons/countries/list']);
    }
  }
}