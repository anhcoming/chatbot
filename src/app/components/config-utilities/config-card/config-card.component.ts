import { filter } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ProjectService } from 'src/app/services/project.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { Paging } from 'src/app/viewModels/paging';
import { Project } from 'src/app/viewModels/project/project';
import { TypeCardService } from './../../../services/type-card.service';
import { Component } from '@angular/core';
import { TypeCard } from 'src/app/viewModels/type-card/type-card';
import { ResApi } from 'src/app/viewModels/res-api';
import { AppMessageResponse, AppStatusCode, GroupCard } from 'src/app/shared/constants/app.constants';
import { Vehicle } from 'src/app/viewModels/vehicle/vehicle';
import { VehicleService } from 'src/app/services/vehicle.service';
import { TypeCardProject } from 'src/app/viewModels/type-card/type-card-project';
import { ConfigCard } from 'src/app/viewModels/config-card/config-card';
import { ConfigCardService } from 'src/app/services/config-card.service';
import { ConfigCardTower } from 'src/app/viewModels/config-card/config-card-tower';
import { ConfigCardDetail } from 'src/app/viewModels/config-card/config-card-detail';

@Component({
  selector: 'app-config-card',
  templateUrl: './config-card.component.html',
  styleUrls: ['./config-card.component.scss']
})
export class ConfigCardComponent {
  public lstTypeCard: Array<TypeCard>;
  public lstConfigCard: Array<ConfigCard>;
  public lstVehicle: Array<Vehicle>;
  public lstProject: Array<Project>;
  public lstGroupCard = GroupCard;
  public filterParrams : Paging;
  public isLoadingTable: boolean = false;
  public loading = [false];
  

  constructor(
    private readonly configCardService: ConfigCardService,
    private readonly projectService: ProjectService,
    private readonly typeCardService: TypeCardService,
    private readonly vehicleService: VehicleService,
    private readonly messageService: MessageService,
    private readonly storeService: StorageService,
    private readonly confirmationService: ConfirmationService,
    private readonly fb: FormBuilder,
    private route: ActivatedRoute, 
    private router: Router
  ) {
    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 100;
    this.filterParrams.query = '';

    this.lstTypeCard = new Array<TypeCard>();
    this.lstVehicle = new Array<Vehicle>();
    this.lstConfigCard = new Array<ConfigCard>();
    this.lstProject = new Array<Project>();
  }

  ngOnInit() {
    this.getListProjectByPaging();
    this.getConfigCardByPaging()
  }

  getConfigCardByPaging() {
    this.isLoadingTable = true;

    this.configCardService.getListConfigCardByPaging(this.filterParrams, 0).subscribe((res: ResApi) => {
      this.isLoadingTable = false;

      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstConfigCard = res.data.Results;
      }
      else {
        this.lstConfigCard = new Array<ConfigCard>();
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    },
    () => {
      this.isLoadingTable = false;
  
      this.lstConfigCard = [];
      this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest });
    })
  }


  getTypeCardByPaging() {

    this.typeCardService.getListTypeCardByPaging(this.filterParrams, 0).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstTypeCard = res.data.Results;
      }
      else {
        this.lstTypeCard = new Array<TypeCard>();
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    },
    () => {
      this.lstTypeCard = [];
      this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest });
    })
  }

  onSearch(event: any) {
    this.filterParrams.query = event.target.value.toLowerCase().trim();
    this.getTypeCardByPaging();
  }

  getVehicleActive() {
    this.vehicleService.getVehicleActive().subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstVehicle = res.data;
      }
      else {
        this.lstVehicle = new Array<Vehicle>();
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    },
    () => {
      this.lstVehicle = [];
      this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest });
    })
  }

  onDelete(item: ConfigCard) {
    this.confirmationService.confirm({
      message: 'Bạn có muốn xóa kiểu thẻ này không?',
      header: 'XÓA KIỂU THẺ',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.configCardService.deleteConfigCardById(0, item.IdIndex).subscribe(
          (res: any) => {
            this.loading[0] = false;
            if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
              this.lstConfigCard = this.lstConfigCard.filter(s => s.IdIndex !== item.IdIndex);
              this.messageService.add({ severity: 'success', summary: 'Success', detail: res.meta.error_message || AppMessageResponse.DeletedSuccess });
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

  getListProjectByPaging() {
    let filterParr = new Object as Paging;
    filterParr.page = 1;
    filterParr.page_size = 100;
    filterParr.select = 'Id, Name';

    this.projectService.getListByPaging(filterParr).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstProject = res.data;
      }
      else {
        this.lstProject = new Array<Project>();
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    },
    () => {
      this.lstProject = [];
      this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest });
    })
  }


  getGroupCardName(groupCard: number) {
    return this.lstGroupCard.find(s => s.id == groupCard)?.name || '';
  }

  getVehicleName(vehicleId: number) {
    return vehicleId ? this.lstVehicle.find(s => s.Id == vehicleId)?.Name : '';
  }

  getProjectName(projectId: number) {
    return projectId ? this.lstProject.find(s => s.Id == projectId)?.Name : '';
  }

  getTowerName(lstTower: Array<ConfigCardTower>) {
    let tower_names = '';

    for(let i = 0 ; i < lstTower.length; i ++) {
      tower_names += lstTower[i].Name;
      
      if ((i != (lstTower.length - 1))) {
        tower_names = tower_names.concat(', ');
      }
    }

    return tower_names;
  }

  getConfigCardName(lstConfigCardDetail: Array<ConfigCardDetail>) {
    let config_card_names = '';

    for(let i = 0 ; i < lstConfigCardDetail.length; i ++) {
      config_card_names += lstConfigCardDetail[i].Name;
      
      if ((i != (lstConfigCardDetail.length - 1))) {
        config_card_names = config_card_names.concat(', ');
      }
    }

    return config_card_names;
  }
}
