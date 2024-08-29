import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonService } from 'src/app/services/common.service';
import { AppMessageResponse, AppStatusCode, StorageData } from 'src/app/shared/constants/app.constants';
import { Paging } from 'src/app/viewModels/paging';
import { ResApi } from 'src/app/viewModels/res-api';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from 'src/app/services/project.service';
import { FloorService } from 'src/app/services/floor.service';
import { TowerService } from 'src/app/services/tower.service';
import { ZoneService } from 'src/app/services/zone.service';
import { StorageService } from 'src/app/shared/services/storage.service';

@Component({
  selector: 'app-add-floor',
  templateUrl: './add-floor.component.html',
  styleUrls: ['./add-floor.component.scss']
})
export class AddFloorComponent {

  public id: any;
   fFloor: any ;

  public lstProject: any[];
  public lstTower: any[];
  public lstZone: any[];
  public lstFloor: any;
  Idc: any;
  submitted = false
  public filterFloor: Paging;
  public filterProject: Paging;
  public filterTower: Paging;
  public filterZone: Paging;
  public filterParrams : Paging ;

  public loading = [false];
  userId: any;

  constructor(
    private readonly projectService: ProjectService,
    private readonly towerService: TowerService,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private readonly fb: FormBuilder,
    private readonly floorService: FloorService,
    private readonly zoneService: ZoneService,
    private readonly route: ActivatedRoute,
    private router: Router,
    private readonly storeService: StorageService,
  ) {
    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 100;

    this.filterFloor = new Object as Paging;
    this.filterZone = new Object as Paging;

    this.filterProject = new Object as Paging;
    this.filterTower = new Object as Paging;

    this.lstProject = [];
    this.lstTower = [];
    this.lstZone = [];
    this.lstFloor = {};

    

    
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id =  params.get('floorId');
    });
    this.getCompanyId()
   
    this.formGroup();
    this.getUserId();

    this.getListProject();

    this.getListZone();

    if(this.id)
      this.getFloorById(this.Idc, this.id);   
      this.fFloor = this.fb.group({
        ProjectId:  ['' , Validators.required],
        TowerId: ['' , Validators.required],
        ZoneId: ['' , Validators.required],
        Id:  [0],
        CreatedById: this.userId,
        UpdatedById: this.userId,
        CompanyId: this.Idc,
        Code: ['' , Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(150)])],
        Name: ['' , Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(150)])],
        Note: ['' ],
      });
    }
  onReturnPage(url: string) : void {
    this.router.navigate([url]);
  }
  getUserId() {
    this.userId = this.storeService.get(StorageData.userId); 
  }
  markAllAsDirty() {
    Object.keys(this.fFloor.controls).forEach(key => {
      const control = this.fFloor.get(key);
      if (control.enabled && control.invalid) {
        control.markAsDirty();
      }
    });
  }
  onSubmit() {
    if(this.fFloor.invalid){
      this.markAllAsDirty()
    }else{
      if(this.id == null) {
        const reqData = Object.assign({}, this.fFloor.value);
      
        this.loading[0] = true;
        this.floorService.createFloor(reqData).subscribe((res: ResApi) => {
          this.loading[0] = false;
          if(res.meta.error_code == AppStatusCode.StatusCode200) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.CreatedSuccess });

            setTimeout(() => {this.onReturnPage('/category/floor/list')}, 1500);
          }
          else {
            this.loading[0] = false
            
            this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
          }
        },
        () => {
          this.loading[0] = false
          this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest }) },
        () => {this.loading[0] = false} 
        ) 
      }
      else{
        const reqData = Object.assign({}, this.fFloor.value);
      
        this.loading[0] = true;
        this.floorService.updateFloorById(this.id, reqData).subscribe((res: ResApi) => {
          this.loading[0] = false;
          if(res.meta.error_code == AppStatusCode.StatusCode200) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.CreatedSuccess });

            setTimeout(() => {this.onReturnPage('/category/floor/list')}, 1500);
          }
          else {
            
            this.loading[0] = false
            this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
          }
        },
        () => {
          this.loading[0] = false
          this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest }) },
        () => {this.loading[0] = false} 
        )
      }
    }
  }

  formGroup() {
    this.fFloor = this.fb.group({
      Id:  this.id,
      ProjectId:  this.lstFloor.ProjectId,
      TowerId: this.lstFloor.TowerId,
      ZoneId: this.lstFloor.ZoneId,
      CreatedById: this.userId,
      UpdatedById: this.userId,
      CompanyId: this.Idc,
      Code: this.lstFloor.Code,
      Name: this.lstFloor.Name,
      Note: this.lstFloor.Note,
    }); 
  }
  getCompanyId() {
    this.Idc = this.storeService.get(StorageData.companyId); 
  }
  getFloorById(idc: number, id: number) {
    if(this.id > 0){
      this.floorService.getFloorById(idc, id).subscribe((res: ResApi) => {
        if(res.meta.error_code == AppStatusCode.StatusCode200) {
          this.lstFloor = res.data;
          this.getListTower(this.lstFloor?.ProjectId);
          this.formGroup();
        }
        else {
          this.lstFloor = [];
          this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
        }
        
      }) 
      this.lstFloor={...this.lstFloor}
    }
    else{
      this.lstFloor = [];
    }
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
  getListZone() {  
    this.lstZone = [];
    this.zoneService.getListZoneByPaging(this.filterZone).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstZone = res.data;
      }
      else {
        this.lstZone = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })  
  }
  onBack(event: Event) {
    let isShow = true;

    if (isShow) {
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message:  !(this.id > 0) ? 'Hủy thêm mới tầng' : 'Hủy cập nhật tầng: <b>"' + this.lstFloor?.Name +'"</b>' ,
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Xác nhận',
        rejectLabel: 'Hủy bỏ',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
        accept: () => {
          this.router.navigate(['/category/floor/list']);
        },
        reject: () => {
            return;
        }
      });
    } else {
      this.router.navigate(['/category/floor/list']);
    }
  }
}
