import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ApartmentService } from 'src/app/services/apartment.service';
import { FloorService } from 'src/app/services/floor.service';
import { ProjectService } from 'src/app/services/project.service';
import { ResidentService } from 'src/app/services/resident.service';
import { TowerService } from 'src/app/services/tower.service';
import { AppStatusCode, AppMessageResponse, RelationshipOption, Role, Staying, StatusOption, StorageData } from 'src/app/shared/constants/app.constants';
import { Apartment } from 'src/app/viewModels/apartment/apartment';
import { Floor } from 'src/app/viewModels/floor/floor';
import { Paging } from 'src/app/viewModels/paging';
import { Project } from 'src/app/viewModels/project/project';
import { ResApi } from 'src/app/viewModels/res-api';
import { Resident, user } from 'src/app/viewModels/resident/resident';
import { DbTower } from 'src/app/viewModels/tower/db-tower';
import { CreateAccountComponent } from './dialogs/create-account/create-account.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { StorageService } from 'src/app/shared/services/storage.service';
import { DetailResidentComponent } from './dialogs/detail-resident/detail-resident.component';
import { ResetPasswordComponent } from './dialogs/reset-password/reset-password.component';
import { CommonService } from 'src/app/services/common.service';
import { Router } from '@angular/router';
import { CardAcceptedComponent } from './dialogs/card-accepted/card-accepted.component';

@Component({
  selector: 'app-resident',
  templateUrl: './resident.component.html',
  styleUrls: ['./resident.component.scss']
})
export class ResidentComponent {
  public filterParrams: Paging;
  public filterTower: Paging;
  public filterFloor: Paging;
  public filterApartment: Paging;
  public lstFloor!: Array<Floor>;
  public Floor: any;
  public lstProject!: Array<Project>;
  public Project: any;
  public lstTower!: Array<DbTower>;
  public Tower: any;
  public lstApartment: Array<Apartment>;
  public Apartment: any;
  public lstUserRole = Role;
  public listApartmentMaps: any;
  public filterText: string;
  public menuItems: any;
  public Idc: any;
  public user: any;
  public selectedItems: any[] = [];
  public isLoadingTable: boolean = false;
  public fSearch: any;
  public lstResident: Array<Resident>;
  public Resident: any
  public loading = [false];
  public idFrozen: boolean = true;
  public statusOption = StatusOption;
  public staying = Staying;
  public role = Role;
  public status: any;
  public relationshipOption = RelationshipOption;
  search: string = '';
  isInputEmpty: boolean = true;
  loadingSelect: boolean = true;
  constructor(
    private readonly residentService: ResidentService,
    private readonly commonService: CommonService,
    private readonly floorService: FloorService,
    private readonly apartmentService: ApartmentService,
    private readonly towerService: TowerService,
    private readonly projectService: ProjectService,
    private readonly storeService: StorageService,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    public dialogService: DialogService,
    private router: Router,
    public ref: DynamicDialogRef,
    private readonly fb: FormBuilder,
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
    this.filterText = '';
    this.lstFloor = new Array<Floor>();
    this.lstProject = new Array<Project>();
    this.lstApartment = new Array<Apartment>();
    this.lstTower = new Array<DbTower>();
    this.lstResident = new Array<Resident>();
    this.menuItems = [
      { label: 'Delete',  icon: 'pi pi-fw pi-trash', command: () => { this.onDeletes(); }},
    ];
  }

  ngOnInit() {
    this.getLstResidentByPaging();
    this.getListFloorByPaging();
    this.getListProject();
    this.getListApartmentByPaging();
    this.getListTowersByPaging();
    this.getCompanyId();
    this.fSearch = this.fb.group({
      ProjectId: null,
      TowerId: null,
      FloorId: null,
      ApartmentId: null,
      residentStatus: null,
      Type: null,
      Status: null,
      IsAccount: null,

    });
  }
  getCompanyId() {
    this.Idc = this.storeService.get(StorageData.companyId)
  }
  
  onSelect() {
    if(this.fSearch.get('ProjectId')?.value){
      this.filterParrams.ProjectId = `${this.fSearch.get('ProjectId')?.value}`;
    }else{
      this.lstTower
      this.filterParrams.ProjectId = "";
    }
    if(this.fSearch.get('TowerId')?.value){
      this.filterParrams.TowerId = `${this.fSearch.get('TowerId')?.value}`
    }else{
      this.filterParrams.TowerId = ""
    }
    if(this.fSearch.get('FloorId')?.value){
      this.filterParrams.FloorId = `${this.fSearch.get('FloorId')?.value}`
    }else{
      this.filterParrams.FloorId = ""
    }
    if(this.fSearch.get('ApartmentId')?.value){
      this.filterParrams.ApartmentId = `${this.fSearch.get('ApartmentId')?.value}`;
    }else{
      this.filterParrams.ApartmentId = ""
    }
    if(this.fSearch.get('Type')?.value){
      this.filterParrams.type = `${this.fSearch.get('Type')?.value}`
    }else{
      this.filterParrams.type = ""
    }
    if(this.fSearch.get('residentStatus')?.value){
      this.filterParrams.residentStatus = `${this.fSearch.get('residentStatus')?.value}`
    }else{
      this.filterParrams.residentStatus = ""
    }
    if(this.fSearch.get('Status')?.value){
      this.filterParrams.status = `${this.fSearch.get('Status')?.value}`
    }else{
      this.filterParrams.status = ""
    }
    if(this.fSearch.get('IsAccount').value == null){
      this.filterParrams.query = "1=1"
      this.filterParrams.page_size = 100
    }else{
      console.log(this.fSearch.get('IsAccount').value);
      
      this.filterParrams.query = `IsAccount=${this.fSearch.get('IsAccount')?.value}`
    }
    this.getLstResidentByPaging();
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
  getListProject() {
    this.projectService.getListByPaging(this.filterParrams).subscribe((res: ResApi) => {
      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.Project = res.data;
        this.lstProject = [...this.Project]
      }
      else {
        this.lstProject = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })
  }
  getListFloorByPaging() {
    this.filterParrams.page_size = 15;
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

  getLstResidentByPaging() {
    this.isLoadingTable = true;

    this.residentService.getListResidentByPaging(this.filterParrams).subscribe((res: ResApi) => {
      this.isLoadingTable = false;

      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.Resident = res.data;
        this.Resident.map((item: any) => {
          item.Account = item.listApartmentMaps.some((item: any) => item.Status == 10);
        })
      }
      else {
        this.Resident = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
      this.lstResident = [...this.Resident];
      if (this.lstResident.length){
      for (let i = 0; i < this.lstResident.length; i++) {
        let ResidentItem = this.lstResident[i]
        this.lstResident[i].rowSpan = 1;
        if(ResidentItem.listApartmentMaps.length){
          this.lstResident[i].rowSpan = ResidentItem.listApartmentMaps.length;
        }
        this.listApartmentMaps = ResidentItem.listApartmentMaps
        
        this.listApartmentMaps.forEach((apartment: any) => {
          apartment.relationshipOptionName = this.relationshipOption.filter(item => item.value === apartment.RelationshipId)[0]?.label;
          apartment.statusOptionName = this.statusOption.filter(item => item.value === apartment.Status)[0]?.label;
          apartment.stayingName = this.staying.filter(item => item.value === apartment.ResidentStatus)[0]?.label;
          apartment.roleName = this.role.filter(item => item.value === apartment.Type)[0]?.label;
        })

      }}

    },
      () => {
        this.isLoadingTable = false;
        this.lstResident = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest });
      })
  }

  getListTowersByPaging() {
    this.filterParrams.page_size = 15;
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
    this.filterParrams.page_size = 15;
    this.apartmentService.getListApartmentByPaging(this.filterParrams).subscribe((res: ResApi) => {
      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.Apartment = res.data;
        this.lstApartment = [...this.Apartment]
      }
      else {
        this.lstApartment = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })
  }
  onSearch(event: any) {
    const searchValue = event.target.value.toLowerCase().trim();
    this.filterParrams.query = `FullName.ToLower().Contains("${searchValue}") OR CardId.ToLower().Contains("${searchValue}") OR Phone.ToLower().Contains("${this.search}")`;
    this.getLstResidentByPaging();
  }
  onDelete(id: number) {
    this.confirmationService.confirm({
      message: 'Bạn có muốn xóa cư dân <b>"'+ this.lstResident.filter((i: any) => i.Id == id)[0].FullName +'"</b> không?',
      header: 'XÓA CƯ DÂN',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xác nhận',
      rejectLabel: 'Hủy bỏ',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.residentService.deleteResident(id).subscribe(
          (res: any) => {
            this.loading[0] = false;
            if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
              this.lstResident = this.lstResident.filter(s => s.Id !== id);
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
  onAccount(event: any) {
    if(event.value == ''){
      this.filterParrams.query = '1=1';
    }else{
      this.filterParrams.query = `IsAccount=${event.value}`
    }
    this.getLstResidentByPaging()
  }
  onClearInput() {
    this.search = '';
    this.isInputEmpty = true;
    this.filterParrams.query = `1=1`;
    this.getLstResidentByPaging();
  }
  onOpenDialog( id: number) {
    this.ref = this.dialogService.open(CreateAccountComponent, {
      header: 'Tạo tài khoản cho cư dân: '+ this.lstResident.filter((i: any) => i.Id == id)[0]?.FullName ,
      width: '70%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
      data:{ Id:  id, Phone: this.lstResident.filter((i: any) => i.Id == id)[0]?.Phone}
    });
    this.ref.onClose.subscribe(()=>{
      this.router.navigateByUrl('/category/resident/list').then(() => {
        window.location.reload();
      });
    });
  }
  btnReset() {
    window.location.reload();
  }
  onDeletes() {
    this.confirmationService.confirm({
      message: 'Bạn có muốn xóa danh sách cư dân được chọn không?',
      header: 'XÓA CƯ DÂN',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xác nhận',
      rejectLabel: 'Hủy bỏ',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
      accept: () => {
        if(!this.selectedItems) {
          this.messageService.add({severity: 'warn', summary: 'Warn', detail: 'Không có mục nào được chọn!'})
        }
        const item = this.selectedItems.map(item => ({Id: item.Id}));
        
        this.residentService.deletesResident(this.Idc, item).subscribe(
          (res: any) => {
            this.loading[0] = false;
            if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
              this.selectedItems.map((item: any) => {
                this.lstResident = this.lstResident.filter(s => s.Id !== item.Id);
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
  onLockAccount(id: number) {
    this.confirmationService.confirm({
      message: 'Bạn có muốn khóa tài khoản cư dân '+ this.lstResident.filter((i: any) => i.Id == id)[0]?.FullName +' không?',
      header: 'XÓA CƯ DÂN',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xác nhận',
      rejectLabel: 'Hủy bỏ',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.user = this.lstResident.filter((i: any) => i.Id == id)[0].user;
        if(this.user.Status == 98){
          this.status = 1;
        }else{
          this.status = 98
        }
        this.commonService.LockUser(this.Idc, this.user.UserId, this.status).subscribe(
          (res: any) => {
            this.loading[0] = false;
              if (res.meta.error_code == AppStatusCode.StatusCode200) {
                this.user = this.lstResident.filter((i: any) => i.Id == id)[0].user;
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

  onOpenDialogDetail(item: any) {
    
    this.ref = this.dialogService.open(DetailResidentComponent, {
      header: 'Chi tiết thông tin cư dân',
      width: '80%',
      height: '95%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
      data: {
        Resident: item,
      }
    });
  
    this.ref.onClose.subscribe();
  }
  onOpenDialogCardAccepted(item: any) {
    
    this.ref = this.dialogService.open(CardAcceptedComponent, {
      header: 'Chi tiết thông tin thẻ được kích hoạt',
      width: '60%',
      height: '80%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
      data: {
        Resident: item,
      }
    });
  
    this.ref.onClose.subscribe();
  }
  onOpenDialogResetPassword(item: any) {
    
    this.ref = this.dialogService.open(ResetPasswordComponent, {
      header: `Đổi mật khẩu tài khoản cư dân: `+ item.FullName,
      width: '40%',
      height: '55%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
      data: {
        lstResident: item,
      }
    });
  
    this.ref.onClose.subscribe();
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
    console.log(this.filterFloor.page);
    
    this.floorService.getListFloorByPaging(this.filterFloor).subscribe((res: ResApi) => {
      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.Floor = [...this.Floor.concat(res.data)];
        this.lstFloor = [...this.Floor];
      }
      else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })
  }
  fetchMore() {
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
