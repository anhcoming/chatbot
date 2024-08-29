import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef, DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { CommonService } from 'src/app/services/common.service';
import { CompanyService } from 'src/app/services/company.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { ServicePricingService } from 'src/app/services/service-pricing.service';
import { AppStatusCode, AppMessageResponse, StorageData } from 'src/app/shared/constants/app.constants';
import { StorageService } from 'src/app/shared/services/storage.service';
import { Paging } from 'src/app/viewModels/paging';
import { ResApi } from 'src/app/viewModels/res-api';
import { Md5 } from 'ts-md5';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {
  public listCompany: any;
  public itemCompany: any;
  public listFunction: any;
  public lstPricingCompany: any;
  public lstSPC: any;
  public PricingCompany: any;
  public ServicePricing: any;
  PricingCompanyItem:any;
  id: any;
  public Idc: any;
  isCustom:boolean=false;
  fPassword: any ;
  public lstCountry: any[];
  public lstProvince: any[];
  public data: any;
  public selectedOption: any;
  password!: string;
  public filterList: Paging;

  public filterParrams : Paging ;

  public loading = [false];
  public pakage_custom = {
    Id: 1,
    Name : 'Custom',
  }

  constructor(
    private readonly commonService: CommonService,
    private readonly companyService: CompanyService,
    private readonly employeeService: EmployeeService,
    private readonly storeService: StorageService,
    private readonly messageService: MessageService,
    private readonly fb: FormBuilder,
    private readonly pricingService: ServicePricingService,
    private readonly route: ActivatedRoute,
    private router: Router,
    public dialogService: DialogService,
    private config: DynamicDialogConfig,
    public ref: DynamicDialogRef
  ) {
    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 100;

    this.filterList = new Object as Paging;

    this.lstCountry = [];
    this.listCompany = [];
    this.listFunction = [];
    this.lstProvince = [];
    this.data = [];
    this.PricingCompany = [];
    this.selectedOption = [];
    this.ServicePricing={
      Name:'',
      Code:'',
      IsCustom: true,
      Id: '',
    }
    this.id = this.config.data.Id;
  }
  ngOnInit() {
    this.getCompanyById(this.id);
    this.getCompanyId();
    this.fPassword = this.fb.group({
      UserId : this.id,
      PasswordNew: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(15)])],
      UserName: this.listCompany.UserName,
      NewPassword: ['', Validators.required],
    })
  }
  getCompanyId() {
    this.Idc = this.storeService.get(StorageData.companyId);
  }
  matchingPasswords() {
    const password = this.fPassword.get('PasswordNew').value;
    let NewPassword = this.fPassword.get('NewPassword').value;
    if (password !== NewPassword) {
      this.fPassword.get('NewPassword').setErrors({mismatchedPasswords: true});
    } else {
      this.fPassword.get('NewPassword').setErrors(null);
    }
  }
  markAllAsDirty() {
    Object.keys(this.fPassword.controls).forEach(key => {
      const control = this.fPassword.get(key);
      if (control.enabled && control.invalid) {
        control.markAsDirty();
      }
    });
  }
  onSubmit() {
    if(this.fPassword.invalid){
      this.markAllAsDirty()
    }else{
      const reqData = Object.assign({}, this.fPassword.value);
          reqData.currentPassword = this.listCompany.Password;
          reqData.passwordOld = this.listCompany.Password;
          reqData.PasswordNew  = Md5.hashStr(this.fPassword.get('PasswordNew').value)
          reqData.NewPassword  = Md5.hashStr(this.fPassword.get('NewPassword').value)
          this.commonService.changePassword(this.Idc, this.id, 6 ,reqData).subscribe(
            (res: ResApi) => {
              this.messageService.add({severity: 'success', summary:'Success', detail: res.meta.error_message })
              this.ref.close(reqData.NewPassword)
          })
    }
  }
  onReturnPage(url: string) : void {
    this.router.navigate([url]);
  }
  getCompanyById(id: number) {
    this.companyService.getCompany(id).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.listCompany = res.data;
        this.setUserName();
      }
      else {
        this.listCompany = [];
        this.messageService.add({ severity:'error', summary:'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest})
      }
    })
  }
  setUserName() {
    this.fPassword = this.fb.group({
      UserId : this.id,
      PasswordNew: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(15)])],
      CurrentPassword: this.listCompany.Password,
      UserName: this.listCompany.UserName,
      NewPassword: [''],
    })
  }
  onBack() {
    this.ref.close()
  }
}
