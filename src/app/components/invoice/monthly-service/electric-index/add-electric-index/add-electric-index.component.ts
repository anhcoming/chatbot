import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProjectService } from 'src/app/services/project.service';
import { TowerService } from 'src/app/services/tower.service';
import { AppMessageResponse, AppStatusCode, StorageData } from 'src/app/shared/constants/app.constants';
import { StorageService } from 'src/app/shared/services/storage.service';
import { Paging } from 'src/app/viewModels/paging';
import { Project } from 'src/app/viewModels/project/project';
import { ResApi } from 'src/app/viewModels/res-api';
import { DbTower } from 'src/app/viewModels/tower/db-tower';

@Component({
  selector: 'app-add-electric-index',
  templateUrl: './add-electric-index.component.html',
  styleUrls: ['./add-electric-index.component.scss']
})
export class AddElectricIndexComponent {
  fElectricIndex : any;
  id : any;
  loading = [false];
  public isLoadingTable : boolean = false;
  public lstProject : Array<Project>;
  public lstTower : Array<DbTower>;
  public filterProject : Paging;
  public filterTower : Paging;
  public lstElectricIndex : any;
  Idc: any;
  constructor(
    private readonly projectService: ProjectService,
    private readonly towerService : TowerService,
    private readonly storeService: StorageService,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private readonly router : Router,
    private readonly fb : FormBuilder,
  ){
    this.lstProject = new Array<Project>();
    this.lstTower = new Array<DbTower>();
    this.filterProject = new Object as Paging;
    this.filterTower = new Object as Paging;
    this.fElectricIndex = this.fb.group({
      Notice : [''],
      DateStart : [''],
      DateEnd : [''],
      Tax : [''],
      DatePayment : [''],
      ProjectId : [''],
      TowerId : [''],
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
  onSubmit(){}
  onSearch(){}
  onBack(event:any){}
}
