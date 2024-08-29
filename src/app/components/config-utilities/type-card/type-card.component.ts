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

@Component({
  selector: 'app-type-card',
  templateUrl: './type-card.component.html',
  styleUrls: ['./type-card.component.scss']
})
export class TypeCardComponent {
  public lstTypeCard: Array<TypeCard>;
  public lstVehicle: Array<Vehicle>;
  public lstGroupCard = GroupCard;
  public filterParrams : Paging;
  filterText : string = '';
  public isLoadingTable: boolean = false;
  public loading = [false];

  constructor(
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
  }

  ngOnInit() {
    this.getVehicleActive();

    setTimeout(() => this.getTypeCardByPaging(), 1000);
  }

  getTypeCardByPaging() {
    this.isLoadingTable = true;

    this.typeCardService.getListTypeCardByPaging(this.filterParrams, 0).subscribe((res: ResApi) => {
      this.isLoadingTable = false;

      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstTypeCard = res.data.Results;
      }
      else {
        this.lstTypeCard = new Array<TypeCard>();
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    },
    () => {
      this.isLoadingTable = false;
  
      this.lstTypeCard = [];
      this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest });
    }) 
  }

  onSearch(event: any) {
    this.filterParrams.query = event.target.value.toLowerCase().trim();
    // this.filterParrams.query = `Name.ToLower().Contains("${this.filterText}") `
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

  onDelete(item: TypeCard) {
    this.confirmationService.confirm({
      message: 'Bạn có muốn loại thẻ này không?',
      header: 'XÓA LOẠI THẺ',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.typeCardService.deleteTypeCardById(0, item.Id).subscribe(
          (res: any) => {
            this.loading[0] = false;
            if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
              this.lstTypeCard = this.lstTypeCard.filter(s => s.Id !== item.Id);
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

  getGroupCardName(groupCard: number) {
    return this.lstGroupCard.find(s => s.id == groupCard)?.name || '';
  }

  getVehicleName(vehicleId: number) {
    return vehicleId ? this.lstVehicle.find(s => s.Id == vehicleId)?.Name : '';
  }

  getProjectName(lstProject: Array<TypeCardProject>) {
    let projectNames = '';

    for(let i = 0 ; i < lstProject.length; i ++) {
      projectNames += lstProject[i].Name;
      
      if ((i != (lstProject.length - 1))) {
        projectNames = projectNames.concat(', ');
      }
    }

    return projectNames;
  }
}
