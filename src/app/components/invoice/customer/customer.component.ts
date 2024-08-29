import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ApartmentService } from 'src/app/services/apartment.service';
import { FloorService } from 'src/app/services/floor.service';
import { ProjectService } from 'src/app/services/project.service';
import { TowerService } from 'src/app/services/tower.service';
import { AppMessageResponse, AppStatusCode } from 'src/app/shared/constants/app.constants';
import { Apartment } from 'src/app/viewModels/apartment/apartment';
import { Floor } from 'src/app/viewModels/floor/floor';
import { Paging } from 'src/app/viewModels/paging';
import { Project } from 'src/app/viewModels/project/project';
import { ResApi } from 'src/app/viewModels/res-api';
import { Customer } from 'src/app/viewModels/customer/customer';
import { DbTower } from 'src/app/viewModels/tower/db-tower';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent { 
  public filterParrams: Paging;
  public lstFloor!: Array<Floor>;
  public lstProject!: Array<Project>;
  public lstTower!: Array<DbTower>;
  public lstApartment: Array<Apartment>;
  public lstUserRole!: any[];
  public lstAccount!: any[];
  public filterText: string;
  public first = 0;
  public rows = 10;
  public filterTower!: Paging;
  public filterZone!: Paging;
  public filterProject!: Paging;
  public isLoadingTable: boolean = false;
  public filterFloor!: Paging;
  search: string = '';
  isInputEmpty: boolean = true;
  public fSearch: FormGroup;
  public lstRedident!: any[]
  public lstCustomer : Array<Customer>;
  public loading = [false];

  constructor(
    private readonly customerService: CustomerService,
    private readonly floorService: FloorService,
    private readonly apartmentService: ApartmentService,
    private readonly towerService: TowerService,
    private readonly projectService: ProjectService,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private readonly fb: FormBuilder,
  ) {
    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 100;
    this.filterText = '';
    this.lstFloor = new Array<Floor>();
    this.lstProject = new Array<Project>();
    this.lstApartment = new Array<Apartment>();
    this.lstTower = new Array<DbTower>();
    this.lstCustomer = new Array<Customer>;
    this.fSearch = fb.group({
      ProjectId:  ['' ],
      TowerId: ['' ],
      RoleApartId: ['' ],
      FloorId: ['' ],
      ApartmentId: [''],
      Type:  [''],
      
    });
  }

  ngOnInit() {
    this.getLstCustomerByPaging();
    this.getListFloorByPaging();
    this.getListProject();
    this.getListApartmentByPaging();
    this.getListTowersByPaging();
  }
  getListProject() {
    this.lstProject = [];
    this.projectService.getListByPaging(this.filterParrams).subscribe((res: ResApi) => {
      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstProject = res.data;
      }
      else {
        this.lstProject = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })
  }
  getListFloorByPaging() {
    this.lstFloor = [];
    this.floorService.getListFloorByPaging(this.filterParrams).subscribe((res: ResApi) => {
      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstFloor = res.data;
      }
      else {
        this.lstFloor = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }

    })
  }
  getLstCustomerByPaging() {
    this.isLoadingTable = true;
    
    this.customerService.getListCustomerByPaging(this.filterParrams).subscribe((res: ResApi) => {
      this.isLoadingTable = false;

      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstCustomer = res.data;
      }
      else {
        this.lstCustomer = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    },
    () => {
      this.isLoadingTable = false;
  
      this.lstCustomer = [];
      this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest });
    })
  }
 
  getListTowersByPaging() {
    this.lstTower = [];
    this.towerService.getListTowerByPaging(this.filterParrams).subscribe((res: ResApi) => {
      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstTower = res.data;
      }
      else {
        this.lstTower = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })
  }
  getListApartmentByPaging(){
    this.lstApartment = [];
    this.apartmentService.getListApartmentByPaging(this.filterParrams).subscribe((res:ResApi) => {
      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstApartment = res.data;
      }
      else {
        this.lstApartment = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })
  }
  onSearch(event: any) {
    const searchValue = event.target.value.toLowerCase().trim();
    this.filterParrams.query = `FullName.ToLower().Contains("${searchValue}") OR CardId.ToLower().Contains("${searchValue}")`;
    this.getLstCustomerByPaging();
  }
  onDelete(id: number){
    this.confirmationService.confirm({
      message: 'Bạn có muốn xóa khách hàng <b>"'+ this.lstCustomer.filter((i: any) => i.Id == id)[0].FullName +'"</b> không?',
      header: 'XÓA KHÁCH HÀNG',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xác nhận',
      rejectLabel: 'Hủy bỏ',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.customerService.deleteCustomer(id).subscribe(
          (res: any) => {
            this.loading[0] = false;
            if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
              this.lstCustomer = this.lstCustomer.filter(s => s.Id !== id);
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
  lockCustomer(){}
  onClearInput() {
    this.search = '';
    this.isInputEmpty = true;
    this.filterParrams.query = `FullName.ToLower().Contains("${this.search}") OR CardId.ToLower().Contains("${this.search}")`;
    this.getLstCustomerByPaging();
  }
}
