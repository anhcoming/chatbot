import { Router,ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApartmentService } from 'src/app/services/apartment.service';
import { FloorService } from 'src/app/services/floor.service';
import { ProjectService } from 'src/app/services/project.service';
import { TowerService } from 'src/app/services/tower.service';
import { AppMessageResponse, AppStatusCode } from 'src/app/shared/constants/app.constants';
import { StorageService } from 'src/app/shared/services/storage.service';
import { Paging, PagingInvoiceContract } from 'src/app/viewModels/paging';
import { ResApi } from 'src/app/viewModels/res-api';
import { CustomerService } from 'src/app/services/customer.service';
import { InvoiceContractService } from 'src/app/services/inv-contract.service';

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.scss']
})
export class ContractComponent implements OnInit {
  public selectedItems: any;
  search: string = '';
  public fSearch: any;
  lstCustomerGroup: any;
  public filterProject: Paging;
  public filterTower: Paging;
  public filterFloor: Paging;
  public filterApartment: Paging;
  lstCustomerType: any;
  lstCustomer: any;
  lstProject: any;
  lstTower: any;
  public filterParam: PagingInvoiceContract;
  lstFloor: any;
  lstApartment: any;
  CustomerIdSelect: any = 0;
  ProjectIdSelect: any = 0;
  TowerIdSelect: any = 0;
  FloorIdSelect: any = 0;
  ApartmentIdSelect: any = 0;
  ContractIdSelect: any = 0;
  lstContract: any;
  searchTxt = '';
  id:any;
  public isLoadingTable: boolean = false;
  public loading = [false];
  isInputEmpty: boolean = true;
  constructor(
    private router: Router, private readonly route: ActivatedRoute,
    private readonly floorService: FloorService,
    private readonly customerService: CustomerService,
    private readonly apartmentService: ApartmentService,
    private readonly projectService: ProjectService,
    private readonly storeService: StorageService,
    private readonly towerService: TowerService,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private readonly invoiceContractService: InvoiceContractService,
    private readonly fb: FormBuilder,
  ) {

    this.filterProject = new Object as Paging;
    this.filterFloor = new Object as Paging;
    this.filterTower = new Object as Paging;
    this.filterApartment = new Object as Paging;
    this.filterParam = new Object as PagingInvoiceContract;
    this.filterParam.ApartmentId = 0;
    this.filterParam.Code = '';
    this.filterParam.keyword='';
    this.filterParam.pageIndex = 1;
    this.filterParam.pageSize = 1000;
    this.filterParam.CustomerId = 0;
    this.filterParam.InvContractTypeId = 0;
    this.filterParam.InvContractGroupId = 0;
    this.filterParam.ProjectId = 0;
    this.filterParam.TowerId = 0;
    this.filterParam.ZoneId = 0;
    this.filterParam.FloorId = 0;
    this.filterParam.ApartmentId = 0;

    this.fSearch = fb.group({
      CustomerGroupId: [''],
      CustomerTypeId: [''],
      CustomerId: [''],
      ProjectId: [''],
      TowerId: [''],
      ApartmentId: [''],
      FloorId: [''],
      ContractId: [''],
      Search: [''],
    })
  }
  ngOnInit(): void {
    this.getListContractByPaging();
    this.getListProject();
    this.getListCustomer()
  }
  getListProject() {
    this.lstProject = [];
    this.projectService.getListByPaging(this.filterProject).subscribe((res: ResApi) => {
      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstProject = res.data;
      }
      else {
        this.lstProject = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })
  }
  getListCustomer() {
    this.lstCustomer = [];
    let filter = new Object as Paging
    this.customerService.getListCustomerByPaging(filter).subscribe((res: ResApi) => {
      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstCustomer = res.data;
        console.log(res.data);

      }
      else {
        this.lstCustomer = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })
  }
  onSearch() {
    this.filterParam.keyword = this.searchTxt;
    this.getListContractByPaging();
  }
  getListFloorByPaging(id: number) {
    this.lstFloor = [];
    this.floorService.getListFloorByPaging(this.filterFloor).subscribe((res: ResApi) => {
      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstFloor = res.data;
      }
      else {
        this.lstFloor = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }

    })
  }
  getListTowersByPaging(id: number) {
    this.lstTower = [];
    this.towerService.getListTowerByPaging(this.filterTower).subscribe((res: ResApi) => {
      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstTower = res.data;
      }
      else {
        this.lstTower = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })
  }
  getListApartmentByPaging(id: number) {
    this.lstApartment = [];
    this.apartmentService.getListApartmentByPaging(this.filterApartment).subscribe((res: ResApi) => {
      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstApartment = res.data;
      }
      else {
        this.lstApartment = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })
  }
  onClearInput() {
  }
  getListContractByPaging() {
    this.lstContract = [];
    this.invoiceContractService.getListInvoiceByPaging(this.filterParam).subscribe((res: ResApi) => {
      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstContract = res.data.Items;
        this.lstContract.forEach((contract:any) => {
          contract.ContractStatusName = this.getContractStatusName(contract.ContractStatus);
        });
      }
      else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })
  }
  getContractStatusName(contractStatusValue: number): any {
    switch (contractStatusValue) {
      case 1:
        return 'Đang hoạt động';
      case 2:
        return 'Đã hủy';
      case 3:
        return 'Thanh lý';
    }
  }
  onDelete(id:number) {
    this.confirmationService.confirm({
      message: 'Bạn có muốn xóa nhóm hợp đồng này không?',
      header: 'XÓA NHÓM HỢP ĐỒNG',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xác nhận',
      rejectLabel: 'Hủy bỏ',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.invoiceContractService.deleteInvoice(id).subscribe(
          (res: any) => {
            this.loading[0] = false;
            if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
              this.lstContract = this.lstContract.filter((s:any) => s.Id !== id);
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
  onSelectByCustomerGroupId(event: any) {

  }
  onSelectByCustomerTypeId(event: any) {

  }
  onSelectByCustomerId(event: any) {
    this.CustomerIdSelect = event.value;
  }
  onSelectByProject(event: any) {
    this.ProjectIdSelect = event.value;
    this.TowerIdSelect = 0;
    this.FloorIdSelect = 0;
    this.ApartmentIdSelect = 0;
    this.lstFloor = [];
    this.lstApartment = [];
    this.getListTowersByPaging(event.value)
  }
  onSelectByTower(event: any) {
    this.TowerIdSelect = event.value;
    this.FloorIdSelect = 0;
    this.ApartmentIdSelect = 0;
    this.lstApartment = [];
    this.getListFloorByPaging(event.value)

  }
  onSelectByFloor(event: any) {
    this.FloorIdSelect = event.value;
    this.ApartmentIdSelect = 0;
    this.getListApartmentByPaging(event.value)
  }
  onSelectContract(event: any) {
    this.ContractIdSelect = event.value;

  }
  onSelectByApartment(event: any) {
    this.ApartmentIdSelect = event.value;
  }
}
