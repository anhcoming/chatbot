import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { AppStatusCode, AppMessageResponse, StorageData } from 'src/app/shared/constants/app.constants';
import { StorageService } from 'src/app/shared/services/storage.service';
import { Paging } from 'src/app/viewModels/paging';
import { ResApi } from 'src/app/viewModels/res-api';

@Component({
  selector: 'app-add-card-vehicle',
  templateUrl: './add-card-vehicle.component.html',
  styleUrls: ['./add-card-vehicle.component.scss']
})
export class AddCardVehicleComponent {

  public id: any;
  public lstCard: any;
  fCard: any ;
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
  ) {
    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 10;

    this.filterFloor = new Object as Paging;
    this.filterZone = new Object as Paging;

    this.filterProject = new Object as Paging;
    this.filterTower = new Object as Paging;

    

    
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id =  params.get('floorId');
    });

    this.fCard = this.fb.group({
      Id:  [0],
      CreatedById: [8],
      UpdatedById: [8],
      CompanyId: this.Idc,
      Name: ['' , Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(150)])],
      Note: ['' ],
    });
    }
  onReturnPage(url: string) : void {
    this.router.navigate([url]);
  }
  onSubmit() {
    // if(this.id == null) {
    //   const reqData = Object.assign({}, this.fCard.value);
    
    //   this.loading[0] = true;
    //   this.floorService.createFloor(reqData).subscribe((res: ResApi) => {
    //     this.loading[0] = false;
    //     if(res.meta.error_code == AppStatusCode.StatusCode200) {
    //       this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.CreatedSuccess });

    //       setTimeout(() => {this.onReturnPage('/config-card/card-vehicle/list')}, 1500);
    //     }
    //     else {
    //       this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
    //     }
    //   },
    //   () => {this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest }) },
    //   () => {this.loading[0] = false} 
    //   ) 
    // }
    // else{
    //   const reqData = Object.assign({}, this.fCard.value);
    
    //   this.loading[0] = true;
    //   this.floorService.updateFloorById(this.id, reqData).subscribe((res: ResApi) => {
    //     this.loading[0] = false;
    //     if(res.meta.error_code == AppStatusCode.StatusCode200) {
    //       this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.CreatedSuccess });

    //       setTimeout(() => {this.onReturnPage('/config-card/card-vehicle/list')}, 1500);
    //     }
    //     else {
    //       this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
    //     }
    //   },
    //   () => {this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest }) },
    //   () => {this.loading[0] = false} 
    //   )
    // }
  }

  formGroup() {
    this.fCard = this.fb.group({
      Id:  this.id,
      Name: this.lstCard.Name,
      Description: this.lstCard.Description
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
          this.router.navigate(['/config-card/card-vehicle/list']);
        },
        reject: () => {
            return;
        }
      });
    } else {
      this.router.navigate(['/config-card/card-vehicle/list']);
    }
  }
}

