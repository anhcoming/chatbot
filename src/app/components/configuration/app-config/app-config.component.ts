import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfigAppService } from 'src/app/services/config-app.service';
import { ProjectService } from 'src/app/services/project.service';
import { TowerService } from 'src/app/services/tower.service';
import { AppMessageResponse, AppStatusCode, IsStatus, StorageData } from 'src/app/shared/constants/app.constants';
import { StorageService } from 'src/app/shared/services/storage.service';
import { Paging } from 'src/app/viewModels/paging';
import { ResApi } from 'src/app/viewModels/res-api';

@Component({
  selector: 'app-app-config',
  templateUrl: './app-config.component.html',
  styleUrls: ['./app-config.component.scss']
})
export class AppConfigComponent {
  public filterParrams: Paging;
  public lstAppConfig: any;
  public first = 0;
  public rows = 10;
  public Idc: any;
  public fSearch: FormGroup;
  public lstTower: any[];
  public Tower: any;
  public lstProject: any;
  public ConfigApp: any;
  public listConfigApp: any;
  public isLoadingTable: boolean = false;
  public loading = [false];
  public isStatus = IsStatus;
  search: string = '';
  isInputEmpty: boolean = true;
  constructor(
    private readonly storeService: StorageService,
    private readonly configappService: ConfigAppService,
    private readonly projectService: ProjectService,
    private readonly towerService: TowerService,
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService,
    private readonly fb: FormBuilder
  ) {
    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 100;

    this.lstTower = [];
    this.lstProject = [];

    this.fSearch = fb.group({
      ProjectId: [''],
      TowerId: [''],
    });
  }

  ngOnInit() {
    this.getListProject();
    this.getCompanyId();
    this.getTower();
    this.getListConfigApp();
  }
  getListConfigApp() {
    this.isLoadingTable = true;
    this.configappService.getListConfigAppByPaging(this.filterParrams).subscribe((res: ResApi) => {
      this.isLoadingTable = false;
      if(res.meta.error_code == AppStatusCode.StatusCode200){
        this.ConfigApp = res.data;
        this.listConfigApp = [...this.ConfigApp]       
        this.listConfigApp.forEach((items: any) => {
          items.isStatus = this.isStatus.filter(item => item.value === items.Status)[0]?.label;
        })
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
        this.lstTower = [...this.Tower];
      }
      else {
        this.lstTower = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    });
  }

  onDelete(id: any) {
    this.confirmationService.confirm({
      message: `Bạn có muốn xóa cấu hình App <b>"` + this.listConfigApp.filter((item: any) => item.Id == id)[0].Name +`"</b> này không?`,
      header: 'XÓA CẤU HÌNH APP',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xác nhận',
      rejectLabel: 'Hủy bỏ',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.configappService.deleteConfigAppById(id).subscribe(
          (res: any) => {
            this.loading[0] = false;
            if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
              this.listConfigApp = this.listConfigApp.filter((s: any) => s.Id !== id);
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
      this.filterParrams.query = '1=1';
      this.lstTower = [...this.Tower];
      this.listConfigApp = [...this.ConfigApp];
      this.fSearch.get('TowerId')?.setValue('');
    } else {
      this.listConfigApp = this.ConfigApp.filter((item: any) => item.ProjectId == event.value);
      this.lstTower = this.Tower.filter((item: any) => item.ProjectId == event.value);
    }
  }
  onSelectTower(event: any) {
    if (event.value == null) {
      this.listConfigApp = [...this.ConfigApp]
      if(this.fSearch.get('ProjectId')?.value){
        this.listConfigApp = this.ConfigApp.filter((item: any) => item.ProjectId == this.fSearch.get('ProjectId')?.value);
      }
    } else {
      this.listConfigApp = this.ConfigApp.filter((item: any) => {
        const filterList = item.listTowerMaps.filter((items: any) => items.TowerId == event.value);
        return filterList.length > 0;
      });
    }
  }

  onSearch(event: any) {
    const searchValue = event.target.value.toLowerCase().trim();
    this.filterParrams.query = `Name.ToLower().Contains("${searchValue}")`;
    this.getListConfigApp();
  }
  onClearInput() {
    this.search = '';
    this.isInputEmpty = true;
    this.filterParrams.query = `Name.ToLower().Contains("${this.search}")`;
    this.getListConfigApp();
  }
  getCompanyId() {
    this.Idc = this.storeService.get(StorageData.companyId);
  }
}