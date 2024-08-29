import { Component } from '@angular/core';
import { FormBuilder,Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InvoiceContractGroup } from 'src/app/services/inv-contract-group.service';
import { InvoiceContractTypeService } from 'src/app/services/inv-contract-type.service';
import { DistrictsService } from 'src/app/services/districts.service';
import { ProvincesService } from 'src/app/services/provinces.service';
import { TowerService } from 'src/app/services/tower.service';
import { WardsService } from 'src/app/services/wards.service';
import { AppMessageResponse, AppStatusCode, InvContractType } from 'src/app/shared/constants/app.constants';
import { InvoiceContractService } from 'src/app/services/inv-contract.service';
import { CustomerService } from 'src/app/services/customer.service';
import { ResApi } from 'src/app/viewModels/res-api';
import { Paging, PagingInvoice } from 'src/app/viewModels/paging';
import { FloorService } from 'src/app/services/floor.service';
import { ProjectService } from 'src/app/services/project.service';
import { ApartmentService } from 'src/app/services/apartment.service';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-add-contract',
  templateUrl: './add-contract.component.html',
  styleUrls: ['./add-contract.component.scss']
})
export class AddContractComponent {
  fContract: any;
  id: any;
  public filterParrams: PagingInvoice;

  dataProject: any;
  projectName:any;
  towerName:any;
  floorName:any;
  apartmentName:any;
  public lstCustomer: any;
  public lstApartment: any;
  public lstContractType: any;
  public lstContract: any;
  public lstContractGroup: any;
  public lstStatus = InvContractType;
  public lstProvince: any;
  public lstDistrict: any;
  public lstWard: any;
  public lstService: any;

  customerData:any= {};
  isLoadingTable: boolean = false;
  loading = [false];
  dataFloor: any;
  dataTower: any;
  constructor(
    public ref: DynamicDialogRef,
    public dialogService: DialogService,
    private readonly provinceService: ProvincesService,
    private readonly districtService: DistrictsService,
    private readonly apartmentService: ApartmentService,
    private readonly wardService: WardsService,
    private readonly invoiceContractType: InvoiceContractTypeService,
    private readonly invoiceContractService: InvoiceContractService,
    private readonly customerService: CustomerService,
    private readonly projectService: ProjectService,
    private readonly floorService: FloorService,

    private readonly invoiceContractGroup: InvoiceContractGroup,
    private readonly towerService: TowerService,
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService,
    private readonly route: ActivatedRoute,
    private router: Router,
    private readonly fb: FormBuilder,
    public datePipe : DatePipe

  ) {
    this.filterParrams = new Object as PagingInvoice;
    this.filterParrams.keyword = "";
    this.filterParrams.pageIndex = 1;
    this.filterParrams.pageSize = 1000;
    this.lstCustomer = [];
    this.lstApartment = [];
    this.lstContractType = [];
    this.lstContractGroup = [];
    this.lstProvince = [];
    this.lstDistrict = [];
    this.lstWard = [];
    this.fContract = this.fb.group({
      id: 0,
      code: undefined,
      invContractTypeId: undefined,
      invContractGroupId: undefined,
      customerId: undefined,
      customerCode: [{value: undefined, disabled: true}],
      customerName:undefined ,
      customerPhone: [{value: undefined, disabled: true}],
      fromDate: undefined,
      toDate: undefined,
      note: undefined,
      projectId: undefined,
      towerId: undefined,
      zoneId: undefined,
      floorId: undefined,
      apartmentId: undefined,
      apartmentInfo: undefined,
      receiver: undefined,
      receiverAddress: undefined,
      receiverPhone: undefined,
      contractStatus: undefined,
    })
  }
  ngOnInit(): void {
    this.getListCustomer();
    this.getListData();
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
    });
    if (this.id == null) this.id = 0;
    else {
      this.invoiceContractService.getInvoiceByID(this.id).subscribe((res: ResApi) => {
        if (res.meta.error_code == AppStatusCode.StatusCode200) {
          this.lstContract = res.data
          this.fContract = this.fb.group({
            id: this.lstContract.Id,
            code:[ this.lstContract.Code, Validators.required] ,
            invContractTypeId: this.lstContract.InvContractTypeId,
            invContractGroupId: this.lstContract.InvContractGroupId,
            customerId: this.lstContract.CustomerId,
            customerCode:[{value: this.lstContract.CustomerCode, disabled: true}],
            customerName: this.lstContract.CustomerName,
            customerPhone: [{value: this.lstContract.CustomerPhone, disabled: true}],
            fromDate: new Date(this.lstContract.FromDate),
            toDate: new Date(this.lstContract.ToDate),
            note: this.lstContract.Note,
            projectId: this.lstContract.ProjectId,
            towerId: this.lstContract.TowerId,
            // zoneId: this.lstContract.ZoneId,
            floorId: this.lstContract.FloorId,
            apartmentId: this.lstContract.ApartmentId,
            // apartmentInfo: this.lstContract.ApartmentInfo,
            receiver: this.lstContract.Receiver,
            receiverAddress: this.lstContract.ReceiverAddress,
            receiverPhone: this.lstContract.ReceiverPhone,
            contractStatus: this.lstContract.ContractStatus,
          })
          this.getListTower(this.fContract.value.projectId);
          this.getListFloor(this.fContract.value.towerId);
          this.getListApartment(this.fContract.value.floorId);
        }
        else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
        }

      })

    }
  }
  selectCustomer(event:any) {
    this.fContract.get('customerId')?.setValue(event.value);
    this.customerService.getCustomer(event.value).subscribe((res: ResApi) => {
      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.customerData = res.data;
        this.fContract.get('customerCode')?.setValue(res.data.AccountCode);
        this.fContract.get('customerPhone')?.setValue(res.data.Phone);
      }
      else {
        this.customerData = {};
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    });
     
  }
  getListCustomer() {
    let filter = new Object as Paging
    this.customerService.getListCustomerByPaging(filter).subscribe((res: ResApi) => {
      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstCustomer = res.data;
      }
      else {
        this.lstCustomer = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })
  }
  getListApartment(id: any) {
    let filter = new Object as Paging;
    filter.query = `FloorId=${id}`;
    this.apartmentService.getListApartmentByPaging(filter).subscribe((res: ResApi) => {
      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstApartment = res.data;
      }
      else {
        this.lstApartment = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })
  }
  getApartment(event: any) {
    this.fContract.get('apartmentId')?.setValue(event.value);
    this.apartmentName=event.originalEvent.srcElement.ariaLabel;
  }
  onReturnPage(url: string) : void {
    this.router.navigate([url]);
  }
  onSubmit() {
    this.fContract.get('customerName')?.setValue(this.customerData.FullName);
    const reqData = this.fContract.getRawValue();
    reqData.fromDate = this.datePipe.transform(reqData.fromDate, 'yyyy-MM-dd');
    reqData.toDate = this.datePipe.transform(reqData.toDate, 'yyyy-MM-dd');
    reqData.apartmentInfo =this.projectName+" / "+this.towerName+" / "+this.floorName+" / "+this.apartmentName;
    if(reqData.note==undefined) reqData.note="";
    this.loading[0] = true;
    if(this.id==0)
    {
    this.invoiceContractService.createInvoice(reqData).subscribe(
      (res: any) => {
        this.loading[0] = false;
        if (res?.meta?.error_code == AppStatusCode.StatusCode200) {
          this.id==0?this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.CreatedSuccess }):this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.UpdatedSuccess });
          setTimeout(() => {this.onReturnPage('/manager-contract/contracts/list')}, 1000);
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
    }
    else{
      
    this.invoiceContractService.updateInvoice(reqData).subscribe(
      (res: any) => {
        this.loading[0] = false;
        if (res?.meta?.error_code == AppStatusCode.StatusCode200) {
          this.id==0?this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.CreatedSuccess }):this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.UpdatedSuccess });
          setTimeout(() => {this.onReturnPage('/manager-contract/contracts/list')}, 1000);
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
    }
}
  onBack(event: any) {
   
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: !(this.id > 0) ? 'Hủy thêm mới hợp đồng' : 'Hủy cập nhật hợp đồng',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Xác nhận',
        rejectLabel: 'Hủy bỏ',
        acceptButtonStyleClass: 'p-button-success',
        rejectButtonStyleClass: 'p-button-danger',
        accept: () => {
          this.router.navigate(['/manager-contract/contracts/list']);
        },
        reject: () => {
          return;
        }
      });
  }
  getProjects(event: any) {
    this.fContract.get('projectId')?.setValue(event.value);
    this.getListTower(event.value);
    this.projectName=event.originalEvent.srcElement.ariaLabel;

  }
  getTower(event: any) {
    this.fContract.get('towerId')?.setValue(event.value);
    this.getListFloor(event.value);
    this.towerName=event.originalEvent.srcElement.ariaLabel;

  }
  getFloor(event: any) {
    this.fContract.get('floorId')?.setValue(event.value);
    this.getListApartment(event.value);
    this.floorName=event.originalEvent.srcElement.ariaLabel;

  }
  getListFloor(id: any) {
    let filter = new Object as Paging;
    filter.query = `TowerId=${id}`;
    this.floorService.getListFloorByPaging(filter).subscribe((res: ResApi) => {
      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.dataFloor = res.data;
      }
      else {
        this.dataFloor = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })
  }
  getListTower(id: any) {
    let filterTower = new Object as Paging;
    filterTower.query = `ProjectId=${id}`;
    this.towerService.getListTowerByPaging(filterTower).subscribe((res: ResApi) => {
      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.dataTower = res.data;
      }
      else {
        this.dataTower = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })
  }
  getListData() {
    let filter = new Object as Paging;
    this.projectService.getListByPaging(filter).subscribe((res: ResApi) => {
      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.dataProject = res.data;
      }
      else {
        this.dataProject = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    });
    this.invoiceContractGroup.getListInvoiceByPaging(this.filterParrams).subscribe((res: ResApi) => {
      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstContractGroup = res.data.Items;
      }
      else {
        this.lstContractGroup = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    });
    this.invoiceContractType.getListInvoiceByPaging(this.filterParrams).subscribe((res: ResApi) => {
      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstContractType = res.data.Items;
      }
      else {
        this.lstContractType = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })
  }
}
