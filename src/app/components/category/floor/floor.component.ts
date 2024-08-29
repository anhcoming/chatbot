import { HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FloorService } from 'src/app/services/floor.service';
import { ProjectService } from 'src/app/services/project.service';
import { AppMessageResponse, AppStatusCode, StorageData } from 'src/app/shared/constants/app.constants';
import { Floor } from 'src/app/viewModels/floor/floor';
import { Project } from 'src/app/viewModels/project/project';
import { Paging } from 'src/app/viewModels/paging';
import { ResApi } from 'src/app/viewModels/res-api';
import { ZoneService } from 'src/app/services/zone.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { TowerService } from 'src/app/services/tower.service';

@Component({
  selector: 'app-floor',
  templateUrl: './floor.component.html',
  styleUrls: ['./floor.component.scss']
})
export class FloorComponent {
  public filterParrams : Paging ;
  public lstFloor!: Array<Floor>;
  public first = 0;
  public rows = 10;
  public Idc: any
  public menuItems: any
  public selectedItems: any
  public lstDelete: any[] = [];
  data = [];
  public selectedProjectId: number | undefined;
  public itemFloor: Floor;

  public fTower: FormGroup ;
  public fSearch: FormGroup ;

  public lstZone: any[];
  public lstTower: [];
  public lstProject: Array<Project>;

  public filterTower: Paging;
  public filterZone: Paging;
  public filterProject: Paging;
  public isLoadingTable: boolean = false;
  public loading = [false];
  search: string = '';
  isInputEmpty: boolean = true;
  constructor(
    private readonly floorService: FloorService,
    private readonly towerService: TowerService,
    private readonly zoneService: ZoneService,
    private readonly storeService: StorageService,
    private readonly projectService: ProjectService,
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService,
    private readonly fb: FormBuilder,
    //private readonly customerService: CustomerService
  ) {
    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 1000;

    this.lstFloor = new Array<Floor>();
    this.itemFloor = new Floor();

    this.filterTower = new Object as Paging;

    this.filterZone = new Object as Paging;

    this.filterProject = new Object as Paging;

    this.lstTower = [];
    this.lstZone = [];
    this.lstProject = [];

    this.fTower = fb.group({
      Code: ['' , Validators.required],
      Name: ['' , Validators.required],
      ProjectId: ['' , Validators.required],
      TowerId: ['' , Validators.required],
      ZoneId: ['' ,],
      Note: ['' , ]
    })

    this.fSearch = fb.group({
      ProjectId: [''],
      TowerId: [''],
      ZoneId: [''],
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
    this.getCompanyId();
    this.getListTower();
}

getListFloorByPaging() {
  this.isLoadingTable = true;
  this.floorService.getListFloorByPaging(this.filterParrams).subscribe((res: ResApi) => {
    this.isLoadingTable = false;
    if(res.meta.error_code == AppStatusCode.StatusCode200) {
      this.lstFloor = res.data;
    }
    else {
      this.lstFloor = [];
      this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
    }
    
  },
  () => {
    this.isLoadingTable = false;

    this.lstFloor = [];
    this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest });
  })
}
getListProject() {
  this.lstProject = [];
  this.projectService.getListByPaging(this.filterProject).subscribe((res: ResApi) => {
    if(res.meta.error_code == AppStatusCode.StatusCode200) {
      this.lstProject = res.data;
    }
    else {
      this.lstProject = [];
      this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
    }
  })  
}
getListTower() {
  this.lstProject = [];
  this.towerService.getListTowerByPaging(this.filterParrams).subscribe((res: ResApi) => {
    if(res.meta.error_code == AppStatusCode.StatusCode200) {
      this.lstTower = res.data;
    }
    else {
      this.lstTower = [];
      this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
    }
  })  
}
getListZone() {
  this.lstZone = [];
  this.zoneService.getListZoneByPaging(this.filterZone).subscribe((res: ResApi) => {
    if(res.meta.error_code == AppStatusCode.StatusCode200) {
      this.lstZone = res.data;
    }
    else {
      this.lstZone = [];
      this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
    }
  })  
}
onDelete(id: number) {
  this.confirmationService.confirm({
    message: 'Bạn có muốn xóa tầng <b>"'+ this.lstFloor.filter((i: any) => i.Id == id)[0].Name +'"</b> này không?',
    header: 'XÓA TẦNG',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Xác nhận',
    rejectLabel: 'Hủy bỏ',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
    accept: () => {
      this.floorService.deleteFloorById(this.Idc, id).subscribe(
        (res: any) => {
          this.loading[0] = false;
          if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
            this.lstFloor = this.lstFloor.filter(s => s.Id !== id);
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

  onSelect(event: any) {
    
    if(event.value == null){
      this.filterParrams.query = '1=1';
      this.getListFloorByPaging();
    } else{
      this.filterParrams.query = `ProjectId=${event.value}`;
    }
    this.getListFloorByPaging();
    
  }
  onSelectTower(event: any) {
    if(event.value == null){
      this.filterParrams.query = '1=1';
      this.getListFloorByPaging();
    } else{
      this.filterParrams.query = `TowerId=${event.value}`;
    }
    this.getListFloorByPaging();
  }
  onSelectZone(event: any) {
    if(event.value == null){
      this.filterParrams.query = '1=1';
      this.getListFloorByPaging();
    } else{
      this.filterParrams.query = `ZoneId=${event.value}`;
    }
    this.getListFloorByPaging();
  }

  onSearch(event: any) {
    const searchValue = event.target.value.toLowerCase().trim();
    this.filterParrams.query = `Name.ToLower().Contains("${searchValue}") OR Code.ToLower().Contains("${searchValue}")`;
    this.getListFloorByPaging();
  }
  onClearInput() {
    this.search = '';
    this.isInputEmpty = true;
    this.filterParrams.query = `Name.ToLower().Contains("${this.search}") OR Code.ToLower().Contains("${this.search}")`;
    this.getListFloorByPaging();
  }
  getCompanyId() {
    this.Idc = this.storeService.get(StorageData.companyId); 
  }
  onDeletes() {
    this.confirmationService.confirm({
      message: 'Bạn có muốn xóa danh sách tầng được chọn không?',
      header: 'XÓA TẦNG',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xác nhận',
      rejectLabel: 'Hủy bỏ',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
      accept: () => {
        if(!this.selectedItems) {
          this.messageService.add({severity: 'warn', summary: 'Warn', detail: 'Không có mục nào được chọn!'})
        }
        this.floorService.deletesFloor(this.Idc, this.selectedItems).subscribe(
          (res: any) => {
            this.loading[0] = false;
            if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
              this.selectedItems.map((item: any) => {
                this.lstFloor = this.lstFloor.filter(s => s.Id !== item.Id);
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
