import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ApartmentService } from 'src/app/services/apartment.service';
import { ProjectService } from 'src/app/services/project.service';
import { TowerService } from 'src/app/services/tower.service';
import { AppMessageResponse, AppStatusCode } from 'src/app/shared/constants/app.constants';
import { Apartment } from 'src/app/viewModels/apartment/apartment';
import { Paging } from 'src/app/viewModels/paging';
import { Project } from 'src/app/viewModels/project/project';
import { ResApi } from 'src/app/viewModels/res-api';
import { DbTower } from 'src/app/viewModels/tower/db-tower';

@Component({
  selector: 'app-detail-water-index',
  templateUrl: './detail-water-index.component.html',
  styleUrls: ['./detail-water-index.component.scss']
})
export class DetailWaterIndexComponent implements OnInit {
  fWaterIndex : any;
  public lstWaterIndex : any;
  public isLoadingTable : boolean = false;
  public lstProject : Array<Project>;
  public lstTower : Array<DbTower>;
  public filterProject : Paging;
  public filterTower: Paging;
  public filterApartment : Paging;
  public lstApartment : Array<Apartment>;
  constructor(
    private readonly fb : FormBuilder,
    private readonly projectService : ProjectService,
    private readonly towerService : TowerService,
    private readonly apartmentService : ApartmentService,
    private readonly messageService : MessageService,
    private readonly router : Router,
    private readonly route : ActivatedRoute,
  ){
    this.lstProject = new Array<Project>();
    this.lstTower = new Array<DbTower>();
    this.lstApartment = new Array<Apartment>();
    this.filterProject = new Object as Paging;
    this.filterTower = new Object as Paging;
    this.filterApartment = new Object as Paging
    this.fWaterIndex = fb.group({
      Id : 0,
      Notice : undefined,
      DateStart : undefined,
      DateEnd: undefined,
      Tax: undefined,
      DatePayment: undefined,
      ProjectId: undefined,
      TowerId: undefined,
    })
  }
  ngOnInit(): void {
    this.getListProject();
    this.getlistTower(event);
    this.getListApartmentName(event);
  }
  onSubmit(){}
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
  getlistTower(event: any) {
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
  getListApartmentName(event:any) {
    if (!event || event.value) {
      this.lstTower = [];
    }

    this.filterApartment.query = `TowerId=${event.value || event}`;

    this.apartmentService.getListApartmentByPaging(this.filterApartment).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstApartment = res.data;
      }
      else {
        this.lstApartment = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })  
  }
  onSearch(){}
}
