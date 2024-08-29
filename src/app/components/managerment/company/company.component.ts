import { Component, Injector } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CompanyService } from 'src/app/services/company.service';
import { AppMessageResponse, AppStatusCode, IsShow, IsStatus, StorageData } from 'src/app/shared/constants/app.constants';
import { Company } from 'src/app/viewModels/company/company';
import { Paging } from 'src/app/viewModels/paging';
import { ResApi } from 'src/app/viewModels/res-api';
import { PricingCompanyComponent } from './dialogs/pricing-company/pricing-company.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ReqLoginModel } from 'src/app/view-models/auth/req-login-model';
import { Md5 } from 'ts-md5';
import { ChangePasswordComponent } from './dialogs/change-password/change-password.component';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ServicePricingService } from 'src/app/services/service-pricing.service';
import { DatePipe } from '@angular/common';
import { CommonService } from 'src/app/services/common.service';
@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent {
  public filterParrams : Paging ;
  public filterParram : Paging ;
  public lstCompany!: Array<Company>;
  public first = 0;
  public rows = 10;
  public fSearch: any;
  search: string = '';
  isInputEmpty: boolean = true;
  searchTower: string | undefined;
  data = [];
  public isLoadingTable: boolean = false;
  public loading = [false];
  positions = [];
  departments = [];
  valCheck: string[] = ['remember'];
  public UserName!: string ;
  public Password! : string ;
  loginFormSubmitted = false;
  isLoginFailed = false;
  resMessageLogin = '';
  returnUrl = '/';
  isLogging = false;
  ServicePricingId: any;
  ServicePricing: any[] = []
  public lstServicePricing: any[] = [];
  public Idc: any;
  public menuItems: any;
  public selectedItems: any;
  public lstDelete: any[] = []
  public idFrozen: boolean = true;
  public user: any;
  public status: any;
  public isStatus = IsStatus;
  public totalRecords: any
  constructor(
    private readonly companyService: CompanyService,
    private readonly commonService: CommonService,
    private readonly storeService: StorageService,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private readonly servicepricingService : ServicePricingService,
    private activeRoute: ActivatedRoute,
    private authService: AuthService,
    private modalService: NgbModal,
    public dialogService: DialogService,
    public ref: DynamicDialogRef,
    private readonly fb: FormBuilder,
    private router: Router,
    private injector: Injector,
    public datePipe : DatePipe
    //private readonly customerService: CustomerService
  ) {
    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 100;
    this.filterParram = new Object as Paging;
    this.filterParram.page = 1;
    this.filterParram.page_size = 10;

    this.lstCompany = new Array<Company>();
    this.menuItems = [{
      label: 'Delete',
      icon: 'pi pi-fw pi-trash',
      command: () => {
        this.onDeletes();
    }}];
    this.fSearch = fb.group({
      DateStart: undefined,
      DateEnd: undefined,
      ServicePricingId: null,

    });

  }
  ngOnInit() {
    this.getListCompany();
    this.getCompanyId();
    this.getServicePricing();
  }
  getCompanyId() {
    this.Idc = this.storeService.get(StorageData.companyId);
  }
  getListCompany() {
    this.isLoadingTable = true;
    this.companyService.getListCompanyByPaging(this.filterParrams).subscribe((res: ResApi) => {
      this.isLoadingTable = false;
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.isLoadingTable = false;
        this.lstCompany = res.data;
        this.totalRecords = res.metadata;
        console.log(this.totalRecords);
        this.lstCompany.forEach((items: any) => {
          items.isStatus = this.isStatus.filter(item => item.value === items?.Status)[0]?.label;
        })
      }
      else {
        this.isLoadingTable = false;
        this.lstCompany = [];
        this.messageService.add({severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest})
      }
    },
    () => {
      this.isLoadingTable = false;
      this.lstCompany = [];
      this.messageService.add({severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest})
    })
  }

  onSearch(event: any) {
    const searchValue = event.target.value.toLowerCase().trim();
    this.filterParrams.query = `Name.ToLower().Contains("${searchValue}") OR Code.ToLower().Contains("${searchValue}")`;
    this.getListCompany();
  }
  onOpenConfigDialog(id: number) {
    const servicePricingId = this.lstCompany.filter((i: any) => i.Id == id)[0].ServicePricingId;

    this.ref = this.dialogService.open(PricingCompanyComponent, {
      header:  `Xem thông tin gói dịch vụ`,
      width: '60%',
      height: '80%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
      data: {
        servicePricingId: servicePricingId
      }
    });
    this.ref.onClose.subscribe();
  }
  onOpenChangePassword(id: number) {
    const Id = this.lstCompany.filter((i: any) => i.Id == id)[0].Id;

    this.ref = this.dialogService.open(ChangePasswordComponent, {
      header:  `RESET MẬT KHẨU`,
      width: '60%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
      data: {
        Id: Id
      }
    });
    this.ref.onClose.subscribe((data: any) => {
      if(data) {
        this.lstCompany.map((item: any) => {
          if(item.Id == Id) {
            item.Password = data;
          }
        })
      }
    })
  }
  onReturnPage(url: string) : void {
    this.router.navigate([url]);
  }
  btnReset() {
    this.router.navigateByUrl('/managerment/company/list').then(() => {
      window.location.reload();
    });
  }
  onLogin(id: number) {
    this.confirmationService.confirm({
      message:  'Xác nhận đăng nhập bằng tài khoản khách hàng <b>"'+ this.lstCompany.filter((i: any) => i.Id == id)[0]?.Name +'"</b>',
      header: 'ĐĂNG NHẬP BẰNG TÀI KHOẢN KHÁCH HÀNG',
      icon: 'pi pi-check-circle',
      acceptLabel: 'Xác nhận',
      rejectLabel: 'Hủy bỏ',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
      accept: () => {
        let CompanyItem = this.lstCompany.filter((i: any) => i.Id == id)[0];
        this.UserName = CompanyItem.UserName;
        this.Password = CompanyItem.Password;

        this.loginFormSubmitted = true;
        this.isLoginFailed = false;
        const reqLogin = new ReqLoginModel();
        reqLogin.username = this.UserName;
        reqLogin.password = this.Password;
        console.log(reqLogin);

        this.isLogging = true;

        this.authService.login(reqLogin).subscribe((res : any) => {
            this.isLogging = false;
            if (res.meta.error_code == AppStatusCode.StatusCode200) {
                this.isLoginFailed = false;
                this.messageService.add({ severity: 'success', summary: 'Success', detail: res.meta.error_message || AppMessageResponse.CreatedSuccess });
                this.resMessageLogin = "Đăng nhập thành công!";
                this.authService.setStoreData(res.data);

                setTimeout(() => {this.onReturnPage('/')}, 1000);
            }
            else {
                this.isLoginFailed = true;
                this.resMessageLogin = res.meta.error_message;
                this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
            }
        },
        () => {
            this.isLogging = true;
            this.resMessageLogin = AppMessageResponse.BadRequest;
        },
        () => this.isLogging = false);

      },
      reject: (type: any) => {
          return;
      }
    });

  }
  onDelete(id: number){
    this.confirmationService.confirm({
      message: 'Bạn có muốn xóa khách hàng <b>"'+ this.lstCompany.filter((i: any) => i.Id == id)[0].Name +'"</b> không?',
      header: 'XÓA KHÁCH HÀNG',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xác nhận',
      rejectLabel: 'Hủy bỏ',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.companyService.deleteCompany(id).subscribe(
          (res: any) => {
            this.loading[0] = false;
            if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
              this.lstCompany = this.lstCompany.filter(s => s.Id !== id);
              this.messageService.add({ severity: 'success', summary: 'Success', detail: res.meta.error_message || AppMessageResponse.CreatedSuccess });


              //return;
            } else {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
              return;
            }
          }
        );

      },
      reject: (type: any) => {
          return;
      }
    });
  }
  onClearInput() {
    this.search = '';
    this.isInputEmpty = true;
    this.filterParrams.query = `Name.ToLower().Contains("${this.search}") OR Code.ToLower().Contains("${this.search}")`;
    this.getListCompany();
  }
  onDeletes() {
    this.confirmationService.confirm({
      message: 'Bạn có muốn xóa các khách hàng được chọn không?',
      header: 'XÓA KHÁCH HÀNG',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xác nhận',
      rejectLabel: 'Hủy bỏ',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
      accept: () => {
        if(!this.selectedItems) {
          this.messageService.add({severity: 'warn', summary: 'Warn', detail: 'Không có mục nào được chọn!'})
        }

        this.companyService.deletesCompany(this.selectedItems).subscribe(
          (res: any) => {
            this.loading[0] = false;
            if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
              this.selectedItems.map((item: any) => {
                this.lstCompany = this.lstCompany.filter(s => s.Id !== item.Id);
              })
              this.messageService.add({ severity: 'success', summary: 'Success', detail: res.meta.error_message || AppMessageResponse.CreatedSuccess });
              //return;
            } else {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
              return;
            }
          }
        );

      },
      reject: (type: any) => {
          return;
      }
    });
  }
  onSelect(event: any){
    if(event.value == null) {
      this.filterParrams.query = '1=1'
    } else{
      this.filterParrams.query = `ServicePricingId=${event.value}`
    }
    this.getListCompany();
  }
  onTimeStart(event: any){
    if(event.value == null) {
      this.filterParrams.query = '1=1'
    } else{
      this.filterParrams.query = `RegistrationStart=${event.target.value}`
    }
    this.getListCompany();
  }
  onTimeEnd(event: any){
    if(event.value == null) {
      this.filterParrams.query = '1=1'
    } else{
      this.filterParrams.query = `RegistrationEnd=${event.target.value}`
    }
    this.getListCompany();
  }
  getServicePricing() {
    this.filterParrams.query = 'CompanyId=0'
    this.servicepricingService.getListServicePricingByPaging(this.filterParrams).subscribe((res: ResApi) => {
      this.lstServicePricing = res.data;
    })
  }
  onLockAccount(Company: any) {
    this.confirmationService.confirm({
      message: `Bạn có muốn khóa tài khoản cư dân <b>"`+ Company.Name +'"</b> không?',
      header: 'XÓA CƯ DÂN',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xác nhận',
      rejectLabel: 'Hủy bỏ',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.user = Company;
        if(this.user.Status == 98){
          this.status = 1;
        }else{
          this.status = 98
        }
        this.commonService.LockUser(this.Idc, Company.Id, this.status).subscribe(
          (res: any) => {
            this.loading[0] = false;
              if (res.meta.error_code == AppStatusCode.StatusCode200) {
                this.user = Company;
              if(this.user.Status == 98){
                this.user.Status = 1;
              }else{
                this.user.Status = 98;
              }
                this.messageService.add({ severity: 'success', summary: 'Success', detail: res.meta.error_message || AppMessageResponse.CreatedSuccess });
            } else {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
              return;
            }
          }
        );

      },
      reject: (type: any) => {
        return;
      }
    });
  }
  onSelectFilter() {
    if(this.fSearch.get('DateStart').value) {
      const dateStart = this.datePipe.transform(this.fSearch.get('DateStart').value, 'dd/MM/yyyy');
      this.filterParrams.DateStart = `${dateStart}`;
    }else{
      this.filterParrams.DateStart = ``;
    }
    if(this.fSearch.get('DateEnd').value) {
      const dateEnd = this.datePipe.transform(this.fSearch.get('DateEnd').value, 'dd/MM/yyyy');
      this.filterParrams.DateEnd = `${dateEnd}`;
    }else{
      this.filterParrams.DateEnd = ``;
    }
    this.getListCompany()
  }
  handlePageChange(event: any){
    console.log(event);
  //   if(event.first !== this.totalRecords){
  //     this.filterParram.page++
  //     this.companyService.getListCompanyByPaging(this.filterParram).subscribe((res: ResApi) => {
  //       this.isLoadingTable = false;
  //       if(res.meta.error_code == AppStatusCode.StatusCode200) {
  //         this.isLoadingTable = false;
  //         this.lstCompany = res.data;
  //         this.lstCompany.forEach((items: any) => {
  //           items.isStatus = this.isStatus.filter(item => item.value === items?.Status)[0]?.label;
  //         })
  //       }
  //       else {
  //         this.isLoadingTable = false;
  //         this.lstCompany = [];
  //         this.messageService.add({severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest})
  //       }
  //     },
  //     () => {
  //       this.isLoadingTable = false;
  //       this.lstCompany = [];
  //       this.messageService.add({severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest})
  //     })
  //   }
  }
}
