import { Component } from '@angular/core';
import { ProjectService } from 'src/app/services/project.service';
import { ZoneService } from 'src/app/services/zone.service';
import { Floor } from 'src/app/viewModels/floor/floor';
import { Paging } from 'src/app/viewModels/paging';
import { Project } from 'src/app/viewModels/project/project';
import { DbTower } from 'src/app/viewModels/tower/db-tower';
import { Zone } from 'src/app/viewModels/zone/zone';
import { FloorService } from 'src/app/services/floor.service'
import { MessageService, ConfirmationService } from 'primeng/api';
import { AppMessageResponse, AppStatusCode, StorageData } from 'src/app/shared/constants/app.constants';
import { ResApi } from 'src/app/viewModels/res-api';
import { TowerService } from 'src/app/services/tower.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Apartment } from 'src/app/viewModels/apartment/apartment';
import { ApartmentService } from 'src/app/services/apartment.service';
import { docmainQrCode } from 'src/app/shared/constants/api.constants';
import { StorageService } from 'src/app/shared/services/storage.service';

@Component({
  selector: 'app-apartment',
  templateUrl: './apartment.component.html',
  styleUrls: ['./apartment.component.scss']
})
export class ApartmentComponent {
  public docmainQrcode = docmainQrCode;
  public Idc: any;
  public menuItems: any;
  public selectedItems: any;
  public lstDelete: any[] = [];
  public filterParrams: Paging;
  public lstFloor!: Array<Floor>;
  public lstProject!: Array<Project>;
  public lstZone!: Array<Zone>;
  public lstTower!: Array<DbTower>;
  public lstApartment: Array<Apartment>;
  public first = 0;
  public rows = 10;
  public filterTower: Paging;
  public filterZone: Paging;
  public filterProject: Paging;
  public filterFloor: Paging;
  public fSearch: FormGroup;
  public isLoadingTable: boolean = false;
  public loading = [false];
  search: string = '';
  isInputEmpty: boolean = true;
  public QrCode: any;
  constructor(
    private readonly floorService: FloorService,
    private readonly zoneService: ZoneService,
    private readonly apartmentService: ApartmentService,
    private readonly projectService: ProjectService,
    private readonly storeService: StorageService,
    private readonly towerService: TowerService,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private readonly fb: FormBuilder,
  ) {
    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 100;
    this.lstFloor = new Array<Floor>();
    this.lstProject = new Array<Project>();
    this.lstApartment = new Array<Apartment>();
    this.lstTower = new Array<DbTower>;
    this.lstZone = new Array<Zone>();
    this.filterFloor = new Object as Paging;
    this.filterZone = new Object as Paging;
    this.filterTower = new Object as Paging;
    this.filterProject = new Object as Paging;
    this.fSearch = fb.group({
      ProjectId: [''],
      TowerId: [''],
      ZoneId: [''],
      FloorId: [''],
    })
    this.menuItems = [{
      label: 'Delete', 
      icon: 'pi pi-fw pi-trash',
      command: () => {
        this.onDeletes();
    }}];
  }

  ngOnInit() {
    this.getListFloorByPaging();
    this.getListProject();
    this.getListZone();
    this.getListTowersByPaging();
    this.getListApartmentByPaging();
    this.getCompanyId()
  }
  getCompanyId() {
    this.Idc = this.storeService.get(StorageData.companyId); 
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
  getListZone() {
    this.lstZone = [];
    this.zoneService.getListZoneByPaging(this.filterZone).subscribe((res: ResApi) => {
      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstZone = res.data;
      }
      else {
        this.lstZone = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
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
    this.isLoadingTable = true;

    this.apartmentService.getListApartmentByPaging(this.filterParrams).subscribe((res:ResApi) => {
      this.isLoadingTable = false;

      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstApartment = res.data;
        this.lstApartment.forEach(apartment => {
          if (apartment.Status === 1) {
            apartment.StatusName = 'Đang sử dụng';
          }else {
            apartment.StatusName = 'Không sử dụng';
          }
        });
      }
      else {
        this.lstApartment = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    },
    () => {
      this.isLoadingTable =false;
      this.lstApartment = [];
      this.messageService.add({ severity: 'error', summary: 'Error', detail:  AppMessageResponse.BadRequest });
    })
  }
  onSearch(event: any) {
    const searchValue = event.target.value.toLowerCase().trim();
    this.filterParrams.query = `Name.ToLower().Contains("${searchValue}") OR Code.ToLower().Contains("${searchValue}")`;
    this.getListApartmentByPaging();
  }
  onDelete(id: number) {
    this.confirmationService.confirm({
      message: 'Bạn có muốn xóa căn hộ '+ this.lstApartment.filter((i: any) => i.Id == id)[0].Name +' không?',
      header: 'XÓA CĂN HỘ',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xác nhận',
      rejectLabel: 'Hủy bỏ',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.apartmentService.deleteApartmentById(this.Idc, id).subscribe(
          (res: any) => {
            this.loading[0] = false;
            if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
              this.lstApartment = this.lstApartment.filter(s => s.Id !== id);
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
  onSelectByProject(event: any) {
    if(event.value > 0) {
      this.filterParrams.query = `ProjectId=${event.value}`
    }else{
      this.filterParrams.query = `1=1`;
    }
    this.getListApartmentByPaging();
    this.getListTowersByPaging();
  }
  onSelectByFloor(event: any) {
    if(event.value > 0) {
      this.filterParrams.query = `FloorId=${event.value}`
    }else{
      this.filterParrams.query = `1=1`;
    }
    this.getListApartmentByPaging();
  }
  onSelectByTower(event: any) {
    if(event.value > 0) {
      this.filterParrams.query = `TowerId=${event.value}`
    }else{
      this.filterParrams.query = `1=1`;
    }
    this.getListApartmentByPaging();
  }
  onSelectByAddress(event: any) {
    if(event.value > 0) {
      this.filterParrams.query = `ZoneId=${event.value}`
    }else{
      this.filterParrams.query = `1=1`;
    }
    this.getListApartmentByPaging();
  }
  onClearInput() {
    this.search = '';
    this.isInputEmpty = true;
    this.filterParrams.query = `Name.ToLower().Contains("${this.search}") OR Code.ToLower().Contains("${this.search}")`;
    this.getListApartmentByPaging();
  }
  onDeletes() {
    this.confirmationService.confirm({
      message: 'Bạn có muốn xóa tòa nhà này không?',
      header: 'XÓA TÒA NHÀ',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if(!this.selectedItems) {
          this.messageService.add({severity: 'warn', summary: 'Warn', detail: 'Không có mục nào được chọn!'})
        }
        this.apartmentService.deletesApartment(this.Idc, this.selectedItems).subscribe(
          (res: any) => {
            this.loading[0] = false;
            if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
              this.selectedItems.map((item: any) => {
                this.lstApartment = this.lstApartment.filter(s => s.Id !== item.Id);
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
}
