import { Component} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonService } from 'src/app/services/common.service';
import { AppMessageResponse, AppStatusCode, IsStatus, ServiceType, StorageData } from 'src/app/shared/constants/app.constants';
import { Paging } from 'src/app/viewModels/paging';
import { ResApi } from 'src/app/viewModels/res-api';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from 'src/app/services/project.service';
import { FloorService } from 'src/app/services/floor.service';
import { TowerService } from 'src/app/services/tower.service';
import { HttpClient} from '@angular/common/http';
import { ZoneService } from 'src/app/services/zone.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { listYardSettings } from 'src/app/viewModels/yard-config/yard-config';
import { AddYardDialogComponent } from '../dialog/add-yard-dialog/add-yard-dialog.component';
import { ConfigBookingService } from 'src/app/services/config-booking.service';

@Component({
  selector: 'app-add-yard-config',
  templateUrl: './add-yard-config.component.html',
  styleUrls: ['./add-yard-config.component.scss']
})
export class AddYardConfigComponent {

  public id: any;
  fBooking: any ;
  public isStatus = IsStatus;
  public serviceType = ServiceType;
  public lstProject: any[];
  public lstTower: any[];
  public Tower: any;
  public lstYard: any = [];
  public uploadedImageUrl: any;
  public imgName = ''
  Idc: any;
  submitted = false
  public filterParrams : Paging ;
  public allChecked: boolean = false;
  public loading = [false];
  public Editor = ClassicEditor;
  userId: any;;
  public ida: any;
  public item: any;
  public listYardSettings: any[]=[];

  constructor(
    private readonly projectService: ProjectService,
    private readonly towerService: TowerService,
    private readonly bookingService: ConfigBookingService,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private readonly http: HttpClient,
    private readonly fb: FormBuilder,
    private readonly floorService: FloorService,
    private readonly zoneService: ZoneService,
    private readonly route: ActivatedRoute,
    private router: Router,
    public dialogService: DialogService,
    private ref: DynamicDialogRef,
    private readonly storeService: StorageService,
  ) {
    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 100;

    this.lstProject = [];
    this.lstTower = [];
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id =  params.get('id');
    });
    if(this.id) {
      this.getYard(this.id)
    }
    this.getCompanyId()
    this.getUserId();
    this.formGroup();

    this.getListProject();
    this.fBooking = this.fb.group({
      Id:  [0],
      CreatedById: this.userId,
      UpdatedById: this.userId,
      CompanyId: this.Idc,
      ProjectId:  ['' , Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(150)])],
      Name: ['' , Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(150)])],
      Status: ['' , Validators.required],
      Note: ['' ],
      listTowerMaps: [''],
    });
  }

  getUserId() {
    this.userId = this.storeService.get(StorageData.userId); 
  }
  onReturnPage(url: string) : void {
    this.router.navigate([url]);
  }
  markAllAsDirty() {
    Object.keys(this.fBooking.controls).forEach(key => {
      const control = this.fBooking.get(key);
      if (control.enabled && control.invalid) {
        control.markAsDirty();
      }
    });
  }
  onSubmit() {
    if(this.fBooking.invalid){
      this.markAllAsDirty();
      this.checkTower();
    }else{
      this.checkTower();
      if(this.fBooking.controls['listTowerMaps'].dirty == true) {
        return
      }else{
        this.onCheck();
        const reqData = Object.assign({}, this.fBooking.value);
        reqData.listTowerMaps = this.Tower;
        reqData.listYardSettings = this.listYardSettings;
        if(this.id == null) {
          this.loading[0] = true;
          this.bookingService.createConfigBooking(reqData).subscribe((res: ResApi) => {
            this.loading[0] = false;
            if(res.meta.error_code == AppStatusCode.StatusCode200) {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.CreatedSuccess });

              setTimeout(() => {this.onReturnPage('/configuration/yard-config/list')}, 1500);
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
          this.loading[0] = true;
          this.bookingService.updateConfigBookingById(this.id, reqData).subscribe((res: ResApi) => {
            this.loading[0] = false;
            if(res.meta.error_code == AppStatusCode.StatusCode200) {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.CreatedSuccess });

              setTimeout(() => {this.onReturnPage('/configuration/yard-config/list')}, 1500);
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
  }
  getYard(id: number) {
    this.bookingService.getConfigBookingById(id).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200 ) {
        this.lstYard = res.data;
        this.listYardSettings = this.lstYard.listYardSettings;
        this.listYardSettings.forEach((items: any) => {
          items.isStatus = this.isStatus.filter(item => item.value === items.Status)[0]?.label;
        })
        this.listYardSettings.forEach((items: any) => {
          items.serviceType = this.serviceType.filter(item => item.Id == items.Type)[0]?.Name;
        })
        this.setFormGroup();
        this.getListTower(this.lstYard.ProjectId)
      }
    })
  }
  checkTower() {
    const isAnyChecked = this.lstTower.some((tower) => tower.checked === true);
    
    if(isAnyChecked == false) {
      const control = this.fBooking.get('listTowerMaps');
      control.markAsDirty();
      return;
    }else{
      const control = this.fBooking.get('listTowerMaps');
      control.markAsPristine();
    }
  }
  formGroup() {
    this.fBooking = this.fb.group({
    }); 
  }
  getCompanyId() {
    this.Idc = this.storeService.get(StorageData.companyId); 
  }
 

  getListProject() {
    this.lstProject = [];
    this.projectService.getListByPaging(this.filterParrams).subscribe((res: ResApi) => {
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

    this.filterParrams.query = `ProjectId=${event.value || event}`;
    this.allChecked = false;
    this.towerService.getListTowerByPaging(this.filterParrams)
    .subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstTower = res.data;
        for(let i=0; i<this.lstTower.length; i++){
          this.lstTower[i].checked = false;
        }
        this.setTower();
      }
      else {
        this.lstTower = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })
  }
  setTower(){
    if(this.lstYard?.listTowerMaps) {
      
      for(let i=0; i<this.lstYard.listTowerMaps.length;i++){
        const towerId = this.lstYard.listTowerMaps[i].TowerId;
        this.lstTower.map(item =>{
          if(item.Id == towerId){
            item.checked = true;
            this.allChecked = this.lstTower.every(item => item.checked);
          }
        })
      }
    }
  }
  onBack(event: Event) {
    let isShow = true;

    if (isShow) {
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: !(this.id > 0) ? 'Bạn có muốn dừng thêm mới cấu hình Yard' : `Bạn có muốn dừng cập nhật Yard <b>"`+ this.lstYard.Name +`"</b>?`,
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Xác nhận',
        rejectLabel: 'Hủy bỏ',
        acceptButtonStyleClass: 'p-button-success',
        rejectButtonStyleClass: 'p-button-danger',
        accept: () => {
          this.router.navigate(['/configuration/Yard-config/list']);
        },
        reject: () => {
            return;
        }
      });
    } else {
      this.router.navigate(['/configuration/Yard-config/list']);
    }
  }
  onCheck() {
    this.Tower = this.lstTower.filter((i: any) => i.checked === true).map((item: any) => ({TowerId: item.Id, ProjectId: item.ProjectId ,TargetId: 0}))
  }
  checkAll() {
    this.allChecked = this.lstTower.every(item => item.checked);
    this.checkTower()
  }
  toggleAll() {
    this.lstTower.forEach(item => item.checked = this.allChecked);
    this.checkTower()
  }
  onOpenDialog(ida: string, id: number, item: any) {
    this.ref = this.dialogService.open(AddYardDialogComponent, {
      header: 'Cập nhật cấu hình đặt sân',
      width: '80%',
      height: '90%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
      data: {
        Id: id,
        Ida: ida,
        listYardSettings: item
      }
    });
  
    this.ref.onClose.subscribe((data: listYardSettings) => {
      if(!ida) {
        if (data) {
          this.listYardSettings =  [...this.listYardSettings, data];
          this.listYardSettings.forEach((items: any) => {
            items.isStatus = this.isStatus.filter(item => item.value === items.Status)[0]?.label;
          })
          this.listYardSettings.forEach((items: any) => {
            items.serviceType = this.serviceType.filter(item => item.Id == items.Type)[0]?.Name;
          })
        }
      }else{
        if (data) {
          this.listYardSettings = this.listYardSettings.map((item: any) => {
            if (item.Id === ida) {
              return data;
            } else {
              return item;
            }
          });
          this.listYardSettings.forEach((items: any) => {
            items.isStatus = this.isStatus.filter(item => item.value === items.Status)[0]?.label;
          })
          this.listYardSettings.forEach((items: any) => {
            items.serviceType = this.serviceType.filter(item => item.Id == items.Type)[0]?.Name;
          })
        }
      }
    });
  }
  setFormGroup() {
    this.fBooking = this.fb.group({
      Id:  this.id,
      CreatedById: this.userId,
      UpdatedById: this.userId,
      CompanyId: this.Idc,
      ProjectId:  this.lstYard.ProjectId,
      Password: this.lstYard.Password,
      UserName: this.lstYard.Username,
      Name: this.lstYard.Name,
      UrlCar: this.lstYard.UrlCar,
      Status: this.lstYard.Status,
      Note: this.lstYard.Note,
      listTowerMaps: this.lstYard.listTowerMaps,
    });
  }
}