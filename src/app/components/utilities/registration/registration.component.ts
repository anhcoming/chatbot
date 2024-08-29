import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, ConfirmationService, MenuItem, PrimeNGConfig } from 'primeng/api';
import { ProjectService } from 'src/app/services/project.service';
import { ApiConstant } from 'src/app/shared/constants/api.constants';
import { AppMessageResponse, AppStatusCode, CardRequestProcessStatus, StatusPayment, StatusReceive, StorageData, TypeCardRequest, TypePayment } from 'src/app/shared/constants/app.constants';
import { StorageService } from 'src/app/shared/services/storage.service';
import { Paging } from 'src/app/viewModels/paging';
import { Project } from 'src/app/viewModels/project/project';
import { ResApi } from 'src/app/viewModels/res-api';
import { HttpHeaders } from '@angular/common/http';
import { TowerService } from 'src/app/services/tower.service';
import { FloorService } from 'src/app/services/floor.service';
import { ApartmentService } from 'src/app/services/apartment.service';
import { CardRequestService } from 'src/app/services/card-request.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent {
  Idc: any;
  id:any;
  public fSearch : FormGroup;
  public lstDelete: any[] =[];
  public selectedRows: any;
  public selectedItems: any;
  menuItems: MenuItem[] = [];
  public filterParrams : Paging;
  public filterTower : Paging;
  public filterFloor : Paging;
  public filterApartment : Paging;
  public lstProject: any[] = [];
  public lstTower: any;
  public lstFloor: any;
  public lstApartment: any;
  public Project: any;
  public Tower: any;
  public Floor: any;
  public Apartment: any;
  public lstUserRole: any;
  public CardRequest: any[] = [];
  public lstCardRequest: any;
  public first = 0;
  public rows = 10;
  public isLoadingTable: boolean = false;
  public loading = [false];
  public popup: boolean = true;
  search: string = '';
  isInputEmpty: boolean = true;
  public idFrozen: boolean = true;
  public loadingSelect: boolean = false;
  public ProcessStatus = CardRequestProcessStatus;
  public TypeCardRequest = TypeCardRequest;
  public TypePayment = TypePayment;
  public StatusPayment = StatusPayment;
  public StatusReceive = StatusReceive;
  constructor(
    private readonly projectService: ProjectService,
    private readonly cardRequestService: CardRequestService,
    private readonly towerService: TowerService,
    private readonly floorService: FloorService,
    private readonly apartmentService: ApartmentService,
    private readonly messageService: MessageService,
    private readonly storeService: StorageService,
    private readonly confirmationService: ConfirmationService,
    private primengConfig: PrimeNGConfig,
    private readonly fb: FormBuilder,
    private route: ActivatedRoute, 
    private router: Router
  ) {
    this.filterTower = new Object as Paging;
    this.filterTower.page = 1;
    this.filterFloor = new Object as Paging;
    this.filterFloor.page = 1;
    this.filterApartment = new Object as Paging;
    this.filterApartment.page = 1;
    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 1000;

    this.lstProject = new Array<Project>();
    this.menuItems = [
      {label: 'Delete', icon: 'pi pi-fw pi-trash', command: () => { this.onDeletes()}},
      {label: 'Lọc', icon: 'pi pi-filter', command: () => { }},
      {label: 'Làm mới', icon: 'pi pi-refresh', command: () => { this.btnReset()}},
    ];
    this.fSearch = fb.group({
      ProjectId: [],
      TowerId: [],
      RoleApartId: [],
      FloorId: [],
      ApartmentId: [],
      Type: [],
      IsAccount: [],
      Date: [],

    });
  }

  ngOnInit() {
    this.getlistCardRequest();
    this.primengConfig.ripple = true;
    this.getCompanyId();
    this.getListProject();
    this.getListTowersByPaging();
    this.getListFloorByPaging();
    this.getListApartmentByPaging();
  }
  getlistCardRequest() {
    this.isLoadingTable = true;
    this.cardRequestService.getListCardRequestByPaging(this.filterParrams).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.isLoadingTable = false;
        this.CardRequest = res.data.Results;
        this.lstCardRequest = [...this.CardRequest]
        this.lstCardRequest.forEach((items: any) => {
          items.ProcessStatusName = this.ProcessStatus.filter(item => item.code === items.ProcessStatus)[0]?.name;
        })
        this.lstCardRequest.forEach((items: any) => {
          items.TypeCardRequestName = this.TypeCardRequest.filter(item => item.code === items.TypeCardRequest)[0]?.name;
        })
        this.lstCardRequest.forEach((items: any) => {
          items.StatusPaymentName = this.StatusPayment.filter((item: any) => item.Code == items.InfoPayment?.StatusPayment)[0]?.Name;
        })
      }else{
        this.isLoadingTable = false;
        this.lstCardRequest = []
      }
    })
  }
  getListProjectByPaging() {
    this.isLoadingTable = true;

    this.projectService.getListByPaging(this.filterParrams).subscribe((res: ResApi) => {
      this.isLoadingTable = false;

      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstProject = res.data;
      }
      else {
        this.lstProject = new Array<Project>();
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    },
    () => {
      this.isLoadingTable = false;
  
      this.lstProject = [];
      this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest });
    })
  }
  
  onSearch(event: any) {
    const searchValue = event.target.value.toLowerCase().trim();
    this.filterParrams.query = `Name.ToLower().Contains("${searchValue}") OR Code.ToLower().Contains("${searchValue}")`;
    this.getListProjectByPaging();
  }

  onDelete(item: any) {
    this.confirmationService.confirm({
      message: `Bạn có muốn xóa đơn đăng ký của căn hộ <b>"`+ item.ApartmentName + `"</b> không?`,
      header: 'XÓA ĐƠN ĐĂNG KÝ',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.cardRequestService.deleteCardRequest(item.Id).subscribe(
          (res: any) => {
            this.loading[0] = false;
            if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
              this.lstCardRequest = this.lstCardRequest.filter((s: any) => s.Id !== item.Id);
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
  onClearInput() {
    this.search = '';
    this.isInputEmpty = true;
    this.filterParrams.query = `Name.ToLower().Contains("${this.search}") OR Code.ToLower().Contains("${this.search}")`;
    this.getListProjectByPaging();
  }
  getCompanyId() {
    this.Idc = this.storeService.get(StorageData.companyId); 
  }
  exportExcel() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    
    this.projectService.ExportExcel(this.Idc).subscribe((res: Blob) => {
      const url = window.URL.createObjectURL(res);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'project_data.xlsx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }
  toggle(event: any) {
    if(this.popup = true){
      this.popup = false;
    }else{
      this.popup = true
    }
  }
  onDeletes() {
    this.confirmationService.confirm({
      message: 'Bạn có muốn xóa khu đô thị này không?',
      header: 'XÓA KHU ĐÔ THỊ',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xác nhận',
      rejectLabel: 'Hủy bỏ',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
      accept: () => {
        if(!this.selectedItems) {
          this.messageService.add({severity: 'warn', summary: 'Warn', detail: 'Không có mục nào được chọn!'})
        }
        this.cardRequestService.deleteCardRequest(this.Idc).subscribe(
          (res: any) => {
            this.loading[0] = false;
            if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
              this.selectedItems.map((item: any) => {
                this.lstProject = this.lstProject.filter(s => s.Id !== item.Id);
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
  btnReset() {
    this.router.navigateByUrl('/utilities/registration/list').then(() => {
      window.location.reload();
    });
  }
  onSelectProject(event: any) {
    if(event.value == null) {
      this.lstTower = [...this.Tower];
    }else{
      this.lstTower = this.Tower.filter((item: any) => item.ProjectId == event.value);
      this.lstFloor = this.Floor.filter((item: any) => item.ProjectId == event.value);
      this.lstApartment = this.Apartment.filter((item: any) => item.ProjectId == event.value);
    }
  }
  onSelectTower(event: any) {
    console.log(event);
    
    if(event?.Id == null) {
      this.lstFloor = [...this.Floor];
    }else{
      console.log(this.Floor.filter((item: any) => item.TowerId == event.Id));
      
      this.lstFloor = this.Floor.filter((item: any) => item.TowerId == event.Id);
      this.lstApartment = this.Apartment.filter((item: any) => item.TowerId == event.Id);
    }
  }
  onSelectFloor(event: any) {
    if(event?.Id == null) {
      this.lstApartment = [...this.Apartment];
    }else{
      this.lstApartment = this.Apartment.filter((item: any) => item.FloorId == event.Id);
    }
  }
  onRole(event: any) {

  }
  getListProject() {
    this.lstProject = [];
    this.projectService.getListByPaging(this.filterParrams).subscribe((res: ResApi) => {
      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.Project = res.data;
        this.lstProject = [...this.Project];
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
        this.Floor = res.data;
        this.lstFloor = [...this.Floor];
      }
      else {
        this.lstFloor = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }

    })
  }
  getListTowersByPaging() {
    this.lstTower = [];
    this.towerService.getListTowerByPaging(this.filterParrams).subscribe((res: ResApi) => {
      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.Tower = res.data;
        this.lstTower = [...this.Tower];
      }
      else {
        this.lstTower = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })
  }
  getListApartmentByPaging() {
    this.lstApartment = [];
    this.apartmentService.getListApartmentByPaging(this.filterParrams).subscribe((res: ResApi) => {
      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.Apartment = res.data;
        this.lstApartment = [...this.Apartment];
      }
      else {
        this.lstApartment = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })
  }
  fetchMoreTower() {
    this.filterTower.page = this.filterTower.page + 1;
    
    this.towerService.getListTowerByPaging(this.filterTower).subscribe((res: ResApi) => {
      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.Tower = [...this.Tower.concat(res.data)];
        this.lstTower = [...this.Tower];
      }
      else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })
  }
  fetchMoreFloor() {
    
    this.filterFloor.page = this.filterFloor.page + 1;
    this.loadingSelect = true;
    this.floorService.getListFloorByPaging(this.filterFloor).subscribe((res: ResApi) => {
      this.loadingSelect = false;
      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.Floor = [...this.Floor.concat(res.data)];
        this.lstFloor = [...this.Floor];
      }
      else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })
  }
  fetchMoreApartment() {
    this.filterApartment.page = this.filterApartment.page + 1;
    this.loadingSelect = true;
    this.apartmentService.getListApartmentByPaging(this.filterApartment).subscribe((res: ResApi) => {
      this.loadingSelect = false;
      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.Apartment = [...this.Apartment.concat(res.data)];
        this.lstApartment = [...this.Apartment];
      }
      else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })
  }
}
