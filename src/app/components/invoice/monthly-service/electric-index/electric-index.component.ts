import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ProjectService } from 'src/app/services/project.service';
import { TowerService } from 'src/app/services/tower.service';
import { AppMessageResponse, AppStatusCode, StorageData } from 'src/app/shared/constants/app.constants';
import { StorageService } from 'src/app/shared/services/storage.service';
import { Paging } from 'src/app/viewModels/paging';
import { Project } from 'src/app/viewModels/project/project';
import { ResApi } from 'src/app/viewModels/res-api';
import { DbTower } from 'src/app/viewModels/tower/db-tower';

@Component({
  selector: 'app-electric-index',
  templateUrl: './electric-index.component.html',
  styleUrls: ['./electric-index.component.scss']
})
export class ElectricIndexComponent implements OnInit {
  fSearch : any;
  isInputEmpty: boolean = false;
  search : string = '';
  isLoadingTable: boolean = false;
  public lstElectricIndex : any;
  public filterParrams : Paging;
  public filterProject : Paging;
  public filterTower: Paging;
  public lstProject : Array<Project>;
  public lstTower : Array<DbTower>;
  Idc: any;
  constructor(
    private readonly fb : FormBuilder,
    private readonly storeService : StorageService,
    private readonly messageService : MessageService,
    private readonly projectService : ProjectService,
    private readonly towerService : TowerService,
  ){
    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 1000;
    this.filterProject = new Object as Paging;
    this.filterTower = new Object as Paging;
    this.lstProject = new Array<Project>();
    this.lstTower = new Array<DbTower>();

    this.fSearch = this.fb.group({
      DateStart: [''],
      DateEnd: [''],
      Notice : [''],
      NewNotice: [''],
      ProjectId : [''],
      TowerId : [''],
      Search : [''],
    })
  }
  ngOnInit() {

    this.getListProject();
    this.getListTower(event);
    this.getCompanyId();
  }
  getCompanyId() {
    this.Idc = this.storeService.get(StorageData.companyId); 
  }

  getListProject() {
    this.lstProject = [];
    this.projectService.getListByPaging(this.filterProject).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstProject = res.data;
      }
      else {
        this.lstProject  = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })  
  }
  getListTower(event: any) {
    if (!event || event.value) {
      this.lstTower = [];
    }

    this.filterTower.query = `ProjectId=${event.value || event}`;

    this.towerService.getListTowerByPaging(this.filterTower)
    .subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstTower = res.data;
      }
      else {
        this.lstTower = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })
  }
  onSelectTower(event:any){}
  onSearch(event:any){}
  Search(){}
}
