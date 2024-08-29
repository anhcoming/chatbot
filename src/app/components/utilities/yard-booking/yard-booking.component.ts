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
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ReqLoginModel } from 'src/app/view-models/auth/req-login-model';
import { Md5 } from 'ts-md5';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ServicePricingService } from 'src/app/services/service-pricing.service';
import { DatePipe } from '@angular/common';
import { CommonService } from 'src/app/services/common.service';
import { OrderYardService } from 'src/app/services/order-yard.service';
import { ConfigBookingService } from 'src/app/services/config-booking.service';
@Component({
  selector: 'app-yard-booking',
  templateUrl: './yard-booking.component.html',
  styleUrls: ['./yard-booking.component.scss']
})
export class YardBookingComponent {
  public filterParrams : Paging ;
  public lstYard!: Array<Company>;
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
  public lstYardBooking: any[]=[];
  public lstConfigYarn: any;
  public ConfigYarn: any[]=[];
  constructor(
    private readonly orderyardService: OrderYardService,
    private readonly bookingService: ConfigBookingService,
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

    this.lstYard = new Array<Company>();
    this.menuItems = [{
      label: 'Delete', 
      icon: 'pi pi-fw pi-trash',
      command: () => {
        this.onDeletes();
    }}];
    this.fSearch = fb.group({
      DateStart: [''],
      DateEnd: [''],
      bookingid: [''],

    });
    
  }
  ngOnInit() {
    this.getCompanyId();
    this.getListYard();
  }
  getCompanyId() {
    this.Idc = this.storeService.get(StorageData.companyId); 
  }
  getListYard() {
    this.isLoadingTable = true;
    this.bookingService.getListConfigBookingByPaging(this.filterParrams).subscribe((res: ResApi) => {
      this.isLoadingTable = false;
      if(res.meta.error_code = AppStatusCode.StatusCode200) {
        this.lstConfigYarn = res.data;
        this.lstConfigYarn.map((item: any) => {
          item.listYardSettings.map((items: any)=> {
            this.ConfigYarn.push({
              Id: item.Id,
              Name: `${items.Name} - ${item.project.Name}`,
              ConfigYardId: items.Id,
            })
          })
        })
        
        this.getListOrderYard();
      }
    })
  }
  getListOrderYard() {
    this.isLoadingTable = true;
    this.orderyardService.getOrderYardByPaging(this.filterParrams).subscribe((res: ResApi) => {
      this.isLoadingTable = false;
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.isLoadingTable = false;
        this.lstYard = res.data;
        this.lstYardBooking = [...this.lstYard];
        this.lstYard.forEach((items: any) => {
          items.isStatus = this.isStatus.filter(item => item.value === items?.Status)[0]?.label;
          this.lstConfigYarn.map((item: any) => {
            item.listYardSettings.map((i: any)=> {
              if(i.Id == items.YardSettingId) {
                items.YardSettingName = i.Name;
              }
            })
          })
          if(items.YardTypeId == 1) {
            items.YardTypeName = 'Thuê sân theo giờ';
          }
          if(items.YardTypeId == 2) {
            items.YardTypeName = 'Thuê sân khung giờ';
          }
          if(items.YardTypeId == 3) {
            items.YardTypeName = 'Thuê sân lũy tiến';
          }
        })
      }
      else {
        this.isLoadingTable = false;
        this.lstYardBooking = [];
        this.messageService.add({severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest})
      }
    },
    () => {
      this.isLoadingTable = false;
      this.lstYardBooking = [];
      this.messageService.add({severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest})
    })
  }
  
  onSearch(event: any) {
    const searchValue = event.target.value.toLowerCase().trim();
    this.filterParrams.query = `Name.ToLower().Contains("${searchValue}") OR Code.ToLower().Contains("${searchValue}")`;
    this.getListOrderYard();
  }
  
  onReturnPage(url: string) : void {
    this.router.navigate([url]);
  }
  btnReset() {
    this.router.navigateByUrl('/utilities/yard-booking/list').then(() => {
      window.location.reload();
    });
  }
  onDelete(id: number){
    this.confirmationService.confirm({
      message: 'Bạn có muốn xóa đơn đặt sân <b>"'+ this.lstYardBooking.filter((i: any) => i.Id == id)[0].Code +'"</b> không?',
      header: 'XÓA ĐƠN ĐẶT SÂN',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xác nhận',
      rejectLabel: 'Hủy bỏ',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.orderyardService.deleteOrderYardById(this.Idc, id).subscribe(
          (res: any) => {
            this.loading[0] = false;
            if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
              this.lstYardBooking = this.lstYardBooking.filter(s => s.Id !== id);
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
    this.getListOrderYard();
  }
  onDeletes() {
    this.confirmationService.confirm({
      message: 'Bạn có muốn xóa các đơn đặt sân được chọn không?',
      header: 'XÓA ĐƠN ĐẶT SÂN',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xác nhận',
      rejectLabel: 'Hủy bỏ',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
      accept: () => {
        if(!this.selectedItems) {
          this.messageService.add({severity: 'warn', summary: 'Warn', detail: 'Không có mục nào được chọn!'})
        }
        
        this.orderyardService.deletesListOrderYard(this.Idc, this.selectedItems).subscribe(
          (res: any) => {
            this.loading[0] = false;
            if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
              this.selectedItems.map((item: any) => {
                this.lstYardBooking = this.lstYardBooking.filter(s => s.Id !== item.Id);
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
    this.getListOrderYard();
  }
  onTimeStart(event: any){
    if(event.value == null) {
      this.filterParrams.query = '1=1'
    } else{
      this.filterParrams.query = `RegistrationStart=${event.target.value}`
    }
    this.getListOrderYard();
  }
  onTimeEnd(event: any){
    if(event.value == null) {
      this.filterParrams.query = '1=1'
    } else{
      this.filterParrams.query = `RegistrationEnd=${event.target.value}`
    }
    this.getListOrderYard();
  }
  onNew(event: any){
    if( event == 0 ) {
      this.filterParrams.query = `1=1`
      this.getListOrderYard();
    } else {
      this.filterParrams.query = `OrderStatus=${event}`
      this.getListOrderYard();
    }
  }
  onSelectFilter() {
    if(this.fSearch.get('DateStart').value) {
      this.filterParrams.DateStart = `${this.fSearch.get('DateStart').value}`;
    }else{
      this.filterParrams.DateStart = ``;
    }
    if(this.fSearch.get('DateEnd').value) {
      this.filterParrams.DateEnd = `${this.fSearch.get('DateEnd').value}`;
    }else{
      this.filterParrams.DateEnd = ``;
    }
    this.getListOrderYard()
  }
}

