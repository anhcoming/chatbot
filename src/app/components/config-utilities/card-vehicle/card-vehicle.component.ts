import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { VehicleService } from 'src/app/services/vehicle.service';
import { AppStatusCode, AppMessageResponse } from 'src/app/shared/constants/app.constants';
import { Paging } from 'src/app/viewModels/paging';
import { ResApi } from 'src/app/viewModels/res-api';
import { Vehicle } from 'src/app/viewModels/vehicle/vehicle';

@Component({
  selector: 'app-card-vehicle',
  templateUrl: './card-vehicle.component.html',
  styleUrls: ['./card-vehicle.component.scss']
})
export class CardVehicleComponent {
  public lstVehicle: Array<Vehicle>;
  public filterParrams : Paging;
  public first = 0;
  public rows = 10;
  public isLoadingTable: boolean = false;
  public loading = [false];
  search: string = '';
  isInputEmpty: boolean = true;

  constructor(
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private readonly vehicleService: VehicleService,
    private readonly fb: FormBuilder,
    private route: ActivatedRoute, 
    private router: Router
  ) {
    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 10;

    this.lstVehicle = new Array<Vehicle>();

  }

ngOnInit(): void {
  //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
  //Add 'implements OnInit' to the class.
  this.getVehicleActive();
}

  onDelete(id: number ) {
    
    this.confirmationService.confirm({
      message: 'Bạn có muốn xóa phương tiện này không?',
      header: 'XÓA PHƯƠNG TIỆN',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.vehicleService.deleteVehicleById(0, id).subscribe(
          (res: any) => {
            this.loading[0] = false;
            if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
              this.lstVehicle = this.lstVehicle.filter(s => s.Id !== id);
              this.messageService.add({ severity: 'success', summary: 'Success', detail: res.meta.error_message || AppMessageResponse.CreatedSuccess });
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
}
