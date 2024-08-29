import { Component } from '@angular/core';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApartmentService } from 'src/app/services/apartment.service';
import { InvService_Type, Tax, AppStatusCode, AppMessageResponse } from 'src/app/shared/constants/app.constants';
import { StorageService } from 'src/app/shared/services/storage.service';
import { InvoiceContractTypeService } from 'src/app/services/inv-contract-type.service';
import { InvoiceContractServiceService } from 'src/app/services/inv-contract-service.service';
import { PagingInvoice, PagingInvoiceContract,PagingInvoiceService,PagingInvoiceServices } from 'src/app/viewModels/paging';
import { ResApi } from 'src/app/viewModels/res-api';
import { InvoiceContractGroup } from 'src/app/services/inv-contract-group.service';
import { InvoiceContractService } from 'src/app/services/inv-contract.service';
import { InvoiceService } from 'src/app/services/inv-service.service';
import { InvoiceServiceGroup } from 'src/app/services/inv-service-group.service';


@Component({
  selector: 'app-add-manager-service',
  templateUrl: './add-manager-service.component.html',
  styleUrls: ['./add-manager-service.component.scss']
})
export class AddManagerServiceComponent {
  fManagerService: any;
  id: any;
  contractSelected: any;
  serviceConfigSelected:any;
  lstContractType: any;
  lstContractGroup: any;
  lstContract: any;
  public lstServiceType = InvService_Type;
  public lstServiceGroup: any;
  public lstService: any;
  public filterParrams: PagingInvoice;
  public lstTax = Tax;
  public loading = [false]
  constructor(
    private readonly route: ActivatedRoute,
    private readonly apartmentService: ApartmentService,
    private readonly storeService: StorageService,
    private readonly messageService: MessageService,
    private readonly invoiceService: InvoiceService,
    private readonly invoiceServiceGroup: InvoiceServiceGroup,
    private readonly confirmationService: ConfirmationService,
    private readonly invoiceContractServiceService: InvoiceContractServiceService,
    private readonly invoiceContractTypeService: InvoiceContractTypeService,
    private readonly invoiceContractGroup: InvoiceContractGroup,
    private readonly invoiceContractService: InvoiceContractService,
    private readonly router: Router,

    private readonly fb: FormBuilder
  ) {
    this.filterParrams = new Object as PagingInvoice;
    this.filterParrams.keyword = "";
    this.filterParrams.pageIndex = 1;
    this.filterParrams.pageSize = 1000;
    this.fManagerService = this.fb.group({
      id: 0,
      invContractCode: undefined,
      invServiceId: undefined,
      invContractTypeId: undefined,
      invContractGroupId: undefined,
      invContractId: [undefined,Validators.compose([Validators.required])],
      serviceType: undefined,
      customerId: undefined,
      customerCode: [{ value: undefined, disabled: true }],
      customerName: [{ value: undefined, disabled: true }],
      customerPhone: [{ value: undefined, disabled: true }],
      apartmentInfo:  [{ value: undefined, disabled: true }],
      invServiceGroupId: undefined,
      fromDate: undefined,
      toDate: undefined,
      endDate: undefined,
      area: undefined,
      tax: undefined,
      factor: undefined,
      Info: undefined,
      qL_Quantity: undefined,
      qL_UnitPrice: undefined,
      qL_Price: undefined,
      qL_Tax: undefined,
      qL_TaxMoney: undefined,
      hT_Value: undefined,
      hT_Tax: undefined
    })
  }

  ngOnInit(): void {
    this.getData();
    this.filterContract();
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
    });
    if (this.id == null) this.id = 0;
    if (this.id != 0) {

    }
  }

  filterContract() {
    let filterContracts = new Object as PagingInvoiceContract;
    filterContracts.Code = "";
    filterContracts.CustomerId = 0;
    filterContracts.InvContractGroupId = 0;
    filterContracts.InvContractTypeId = 0;
    filterContracts.keyword = "";
    filterContracts.pageIndex = 1;
    filterContracts.pageSize = 1000;


    if (this.fManagerService.value.invContractTypeId != null)
      filterContracts.InvContractTypeId = this.fManagerService.value.invContractTypeId;
    if (this.fManagerService.value.invContractGroupId != null) {
      filterContracts.InvContractGroupId = this.fManagerService.value.invContractGroupId;
    }
    this.invoiceContractService.getListInvoiceByPaging(filterContracts).subscribe((res: ResApi) => {
      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstContract = res.data.Items;
      }
      else {
        this.lstContract = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    });

  }
  getData() {
    this.invoiceContractGroup.getListInvoiceByPaging(this.filterParrams).subscribe((res: ResApi) => {
      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstContractGroup = res.data.Items;
      }
      else {
        this.lstContractGroup = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    });
    this.invoiceContractTypeService.getListInvoiceByPaging(this.filterParrams).subscribe((res: ResApi) => {
      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstContractType = res.data.Items;
      }
      else {
        this.lstContractType = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    });
    
  }
  selectServiceType(event:any)
  {
    //this.fManagerService.get("serviceType").setValue(event.value);
    this.getListServiceGroup(event.value);
  }
  selectServiceGroup(event:any){
    this.getListService(event.value);
  }
  selectService(event:any){
    this.invoiceService.getInvoiceByID(event.value).subscribe((res: ResApi) => {
      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.serviceConfigSelected = res.data;
      }
      else {
        this.contractSelected = {};
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    });
  }
  getListService(value:any)
  {
    let filterService=new Object as PagingInvoiceServices;
    filterService.keyword="";
    filterService.pageIndex=1;
    filterService.pageSize=1000;
    filterService.type=0;
    filterService.InvServiceGroupId=value;
    this.invoiceService.getListInvoiceByPaging(filterService).subscribe((res: ResApi) => {
      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstService = res.data.Items;
        console.log(res.data);
        
      }
      else {
        this.lstService = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    });
  }
  getListServiceGroup(value:any)
  {
    let filterService=new Object as PagingInvoiceService;
    filterService.keyword="";
    filterService.pageIndex=1;
    filterService.pageSize=1000;
    filterService.type=value;
    this.invoiceServiceGroup.getListInvoiceByPaging(filterService).subscribe((res: ResApi) => {
      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstServiceGroup = res.data.Items;
        console.log(res.data);
        
      }
      else {
        this.lstServiceGroup = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    });
  }

  onReturnPage(url: string): void {
    this.router.navigate([url]);
  }
  onSubmit() {
    if(this.id == 0) {
      const reqData = Object.assign({}, this.fManagerService.getRawValue());
      this.loading[0] = true;
      this.invoiceContractServiceService.createInvoice(reqData).subscribe(
        (res: any) => {
          this.loading[0] = false;
          if (res?.meta?.error_code == AppStatusCode.StatusCode200) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.CreatedSuccess });
            
            setTimeout(() => {this.onReturnPage('/invoice/manager-service/list')}, 1000);
          } 
          else 
            this.messageService.add({ severity: 'warn', summary: 'Warn', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
          
        },
        () => {
          this.loading[0] = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest });
        },
        () => {
          this.loading[0] = false;
        }
      );
    }else{
      const reqData = Object.assign({}, this.fManagerService.getRawValue());
      this.loading[0] = true;
      this.invoiceContractServiceService.updateInvoice(reqData).subscribe(
        (res: any) => {
          this.loading[0] = false;
          if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: res.meta.error_message || AppMessageResponse.CreatedSuccess });

            setTimeout(() => {this.onReturnPage('/invoice/manager-service/list')}, 1500);
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
          }
        },
        () => {
          this.loading[0] = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest });
        },
        () => {
          this.loading[0] = false;
        }
      );
    }

  }
  selectContract(event: any) {
    this.fManagerService.get('invContractCode')?.setValue(event.originalEvent.srcElement.ariaLabel);
    this.invoiceContractService.getInvoiceByID(event.value).subscribe((res: ResApi) => {
      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.contractSelected = res.data;
        this.fManagerService.get('customerId')?.setValue(this.contractSelected.CustomerId);
        this.fManagerService.get('customerCode')?.setValue(this.contractSelected.CustomerCode);
        this.fManagerService.get('customerName')?.setValue(this.contractSelected.CustomerName);
        this.fManagerService.get('customerPhone')?.setValue(this.contractSelected.CustomerPhone);
        this.fManagerService.get('apartmentInfo')?.setValue(this.contractSelected.ApartmentInfo);
      }
      else {
        this.contractSelected = {};
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    });


  }

  onBack(event: Event) {
    let isShow = true;

    if (isShow) {
      this.confirmationService.confirm({
        header:"Thông báo",
        target: event.target as EventTarget,
        message: !(this.id > 0) ? 'Hủy thêm mới dịch vụ quản lý' : 'Hủy cập nhật dịch vụ quản lý',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Xác nhận',
        rejectLabel: 'Hủy bỏ',
        acceptButtonStyleClass: 'p-button-success',
        rejectButtonStyleClass: 'p-button-danger',
        accept: () => {
          this.router.navigate(['/invoice/manager-service/list']);
        },
        reject: () => {
          return;
        }
      });
    } else {
      this.router.navigate(['/invoice/manager-service/list']);
    }
  }
}
