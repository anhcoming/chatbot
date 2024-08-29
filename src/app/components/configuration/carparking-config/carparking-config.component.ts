import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfigCarparkingService } from 'src/app/services/config-carparking.service';
import { ProjectService } from 'src/app/services/project.service';
import { TowerService } from 'src/app/services/tower.service';
import { AppMessageResponse, AppStatusCode, StorageData } from 'src/app/shared/constants/app.constants';
import { StorageService } from 'src/app/shared/services/storage.service';
import { Paging } from 'src/app/viewModels/paging';
import { ResApi } from 'src/app/viewModels/res-api';

@Component({
  selector: 'app-carparking-config',
  templateUrl: './carparking-config.component.html',
  styleUrls: ['./carparking-config.component.scss']
})
export class CarParkingConfigComponent {
  public filterParrams: Paging;
  public lstCarParking: any[] = [];
  public CarParking: any;
  public first = 0;
  public rows = 10;
  public Idc: any;
  public menuItems: any;
  public selectedItems: any;
  public lstDelete: any[] = [];
  data = [];
  public selectedProjectId: number | undefined;
  public itemFloor: any;
  public fSearch: FormGroup;
  public lstTower: any[] = [];
  public Tower: any[] = [];
  public lstProject: any;
  public isLoadingTable: boolean = false;
  public loading = [false];
  search: string = '';
  isInputEmpty: boolean = true;
  constructor(
    private readonly storeService: StorageService,
    private readonly carparkingService: ConfigCarparkingService,
    private readonly projectService: ProjectService,
    private readonly towerService: TowerService,
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService,
    private readonly fb: FormBuilder
  ) {
    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 1000;

    this.lstTower = [];
    this.lstProject = [];

    this.fSearch = fb.group({
      ProjectId: [''],
      TowerId: [''],
      ZoneId: [''],
    });
  }

  ngOnInit() {
    this.getListCarparking();
    this.getListProject();
    this.getCompanyId();
    this.getTower();
  }
  getListCarparking() {
    this.isLoadingTable = true;
    this.carparkingService.getListConfigCarparkingByPaging(this.filterParrams).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.isLoadingTable = false;
        this.CarParking = res.data;
        this.lstCarParking = [...this.CarParking];
      }else{
        this.isLoadingTable = false;
        this.lstCarParking = [];
      }
    })
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
    });
  }
  getTower() {
    this.towerService.getListTowerByPaging(this.filterParrams).subscribe((res: ResApi) => {
      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.Tower = res.data;
        this.lstTower = [...this.Tower]
      }
      else {
        this.lstTower = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    });
  }

  onDelete(id: number) {
    this.confirmationService.confirm({
      message: `Bạn có muốn xóa cấu hình Carparking <b>"` + this.lstCarParking.filter((item: any) => item.Id == id)[0].Name +`"</b> này không?`,
      header: 'XÓA CẤU HÌNH CARPARKING',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xác nhận',
      rejectLabel: 'Hủy bỏ',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.carparkingService.deleteConfigCarparkingById(id).subscribe(
          (res: any) => {
            this.loading[0] = false;
            if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
              this.lstCarParking = this.lstCarParking.filter(s => s.Id !== id);
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
    if (event.value == null) {
      this.lstCarParking = [...this.CarParking];
      this.lstTower = [...this.Tower];
    } else {
      this.lstCarParking = this.CarParking.filter((item: any) => item.ProjectId == event.value);
      this.lstTower = this.Tower.filter(item => item.ProjectId == event.value)
    }
  }
  onSelectTower(event: any) {
    if (event.value == null) {
      if(this.fSearch.get('ProjectId')?.value){
        this.lstCarParking = this.CarParking.filter((i: any) => i.ProjectId == this.fSearch.get('ProjectId')?.value);
      }else{
        this.lstCarParking = [...this.CarParking]
      }
    } else {
      this.lstCarParking = this.CarParking.filter((item: any) => {
        return item.listTowerMaps.some((i: any) => i.TowerId === event.value);
      });
      
    }
  }

  onSearch(event: any) {
    const searchValue = event.target.value.toLowerCase().trim();
    this.filterParrams.query = `Name.ToLower().Contains("${searchValue}") `;
    this.getListCarparking()
  }
  onClearInput() {
    this.search = '';
    this.isInputEmpty = true;
    this.filterParrams.query = `Name.ToLower().Contains("${this.search}") `;
    this.getListCarparking()
  }
  getCompanyId() {
    this.Idc = this.storeService.get(StorageData.companyId);
  }
}