import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { VehicleService } from 'src/app/services/vehicle.service';
import { AppStatusCode, AppMessageResponse, StorageData } from 'src/app/shared/constants/app.constants';
import { StorageService } from 'src/app/shared/services/storage.service';
import { Paging } from 'src/app/viewModels/paging';
import { ResApi } from 'src/app/viewModels/res-api';
import { Vehicle } from 'src/app/viewModels/vehicle/vehicle';

@Component({
  selector: 'app-add-card-vehicle',
  templateUrl: './add-card-vehicle.component.html',
  styleUrls: ['./add-card-vehicle.component.scss']
})
export class AddCardVehicleComponent {

  public itemVehicle: Vehicle;
  public lstCard: any;
  fVehicle: any ;
  Idc: any;
  submitted = false
  public filterFloor: Paging;
  public filterProject: Paging;
  public filterTower: Paging;
  public filterZone: Paging;
  public filterParrams : Paging ;

  public loading = [false];

  constructor(
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private router: Router,
    private readonly storeService: StorageService,
    private readonly vehicleService: VehicleService
  ) {
    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 10;

    this.filterFloor = new Object as Paging;
    this.filterZone = new Object as Paging;

    this.filterProject = new Object as Paging;
    this.filterTower = new Object as Paging;

    this.itemVehicle = new Vehicle();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParram =  params.get('id');

      if (idParram && parseInt(idParram) > 0) {
        this.itemVehicle.Id = parseInt(idParram);

        this.getVehicleById();
      }
    });

    this.fVehicle = this.fb.group({
      CompanyId: this.Idc,
      Name: ['' , Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(150)])],
      Description: ['' ],
    });
  }

  onReturnPage(url: string) : void {
    this.router.navigate([url]);
  }

  getVehicleById() {
    this.vehicleService.getVehicleById(this.itemVehicle.Id).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.itemVehicle = res.data;

        this.formGroup();
      }
      else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })
  }

  onSubmit() {
    if (!this.fVehicle.valid) {
      return;
    }

    if(!this.itemVehicle.Id) {
      const reqData = Object.assign({}, this.fVehicle.value);
    
      this.loading[0] = true;
      this.vehicleService.createVehicle(reqData).subscribe((res: ResApi) => {
        this.loading[0] = false;
        if(res.meta.error_code == AppStatusCode.StatusCode200) {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.CreatedSuccess });

          setTimeout(() => {this.onReturnPage('/config-utilities/card-vehicle/list')}, 1500);
        }
        else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
        }
      },
      () => {this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest }) },
      () => {this.loading[0] = false} 
      ) 
    }
    else{
      const reqData = Object.assign({}, this.fVehicle.value);
    
      this.loading[0] = true;
      this.vehicleService.updateVehicleById(this.itemVehicle.Id, reqData).subscribe((res: ResApi) => {
        this.loading[0] = false;
        if(res.meta.error_code == AppStatusCode.StatusCode200) {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.CreatedSuccess });

          setTimeout(() => {this.onReturnPage('/config-utilities/card-vehicle/list')}, 1500);
        }
        else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
        }
      },
      () => {this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest }) },
      () => {this.loading[0] = false} 
      )
    }
  }

  formGroup() {
    this.fVehicle = this.fb.group({
      Name: this.itemVehicle.Name,
      Description: this.itemVehicle.Description
    }); 
  }

  getCompanyId() {
    this.Idc = this.storeService.get(StorageData.companyId); 
  }

  onBack(event: Event) {
    let isShow = true;

    if (isShow) {
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: "Bạn có muốn quay lại?",
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.router.navigate(['/config-utilities/card-vehicle/list']);
        },
        reject: () => {
            return;
        }
      });
    } else {
      this.router.navigate(['/config-utilities/card-vehicle/list']);
    }
  }
}

