import { Component} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonService } from 'src/app/services/common.service';
import { AppMessageResponse, AppStatusCode, IsStatus, StorageData } from 'src/app/shared/constants/app.constants';
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
import { ConfigCarparkingService } from 'src/app/services/config-carparking.service';

@Component({
  selector: 'app-add-carparking-config',
  templateUrl: './add-carparking-config.component.html',
  styleUrls: ['./add-carparking-config.component.scss']
})
export class AddCarParkingConfigComponent {

  public id: any;
  fCarparking: any ;
  public isStatus = IsStatus;
  public lstProject: any[];
  public lstTower: any[];
  public Tower: any;
  public lstCarparking: any = [];
  public uploadedImageUrl: any;
  public imgName = ''
  Idc: any;
  submitted = false
  public filterParrams : Paging ;
  public allChecked: boolean = false;
  public loading = [false];
  public Editor = ClassicEditor;
  userId: any;

  constructor(
    private readonly projectService: ProjectService,
    private readonly towerService: TowerService,
    private readonly carparkingService: ConfigCarparkingService,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private readonly http: HttpClient,
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

    this.lstProject = [];
    this.lstTower = [];
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id =  params.get('id');
    });
    if(this.id) {
      this.getCarparking(this.id)
    }
    this.getCompanyId()
    this.getUserId();
    this.formGroup();

    this.getListProject();
    this.fCarparking = this.fb.group({
      Id:  [0],
      CreatedById: this.userId,
      UpdatedById: this.userId,
      CompanyId: this.Idc,
      ProjectId:  ['' , Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(150)])],
      Password: ['' , Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(150)])],
      UserName: ['' , Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(150)])],
      Name: ['' , Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(150)])],
      UrlCar: ['' , Validators.required],
      Status: ['', Validators.required],
      Note: ['' , Validators.required],
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
    Object.keys(this.fCarparking.controls).forEach(key => {
      const control = this.fCarparking.get(key);
      if (control.enabled && control.invalid) {
        control.markAsDirty();
      }
    });
  }
  onSubmit() {
    if(this.fCarparking.invalid){
      this.markAllAsDirty();
      this.checkTower();
    }else{
      this.checkTower();
      if(this.fCarparking.controls['listTowerMaps'].dirty == true) {
        return
      }else{
        this.onCheck();
        const reqData = Object.assign({}, this.fCarparking.value);
        reqData.listTowerMaps = this.Tower;
        if(this.id == null) {
          this.loading[0] = true;
          this.carparkingService.createConfigCarparking(reqData).subscribe((res: ResApi) => {
            this.loading[0] = false;
            if(res.meta.error_code == AppStatusCode.StatusCode200) {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.CreatedSuccess });

              setTimeout(() => {this.onReturnPage('/configuration/carparking-config/list')}, 1500);
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
          this.carparkingService.updateConfigCarparkingById(this.id, reqData).subscribe((res: ResApi) => {
            this.loading[0] = false;
            if(res.meta.error_code == AppStatusCode.StatusCode200) {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.CreatedSuccess });

              setTimeout(() => {this.onReturnPage('/configuration/carparking-config/list')}, 1500);
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
  getCarparking(id: number) {
    this.carparkingService.getConfigCarparkingById(id).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200 ) {
        this.lstCarparking = res.data;
        this.setFormGroup();
        this.getListTower(this.lstCarparking.ProjectId)
      }
    })
  }
  checkTower() {
    const isAnyChecked = this.lstTower.some((tower) => tower.checked === true);
    
    if(isAnyChecked == false) {
      const control = this.fCarparking.get('listTowerMaps');
      control.markAsDirty();
      return;
    }else{
      const control = this.fCarparking.get('listTowerMaps');
      control.markAsPristine();
    }
  }
  formGroup() {
    this.fCarparking = this.fb.group({
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
    if(this.lstCarparking?.listTowerMaps) {
      
      for(let i=0; i<this.lstCarparking.listTowerMaps.length;i++){
        const towerId = this.lstCarparking.listTowerMaps[i].TowerId;
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
        message: !(this.id > 0) ? 'Bạn có muốn dừng thêm mới cấu hình Carparking' : `Bạn có muốn dừng cập nhật Carparking <b>"`+ this.lstCarparking.Name +`"</b>?`,
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Xác nhận',
        rejectLabel: 'Hủy bỏ',
        acceptButtonStyleClass: 'p-button-success',
        rejectButtonStyleClass: 'p-button-danger',
        accept: () => {
          this.router.navigate(['/configuration/carparking-config/list']);
        },
        reject: () => {
            return;
        }
      });
    } else {
      this.router.navigate(['/configuration/carparking-config/list']);
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
  setFormGroup() {
    this.fCarparking = this.fb.group({
      Id:  this.id,
      CreatedById: this.userId,
      UpdatedById: this.userId,
      CompanyId: this.Idc,
      ProjectId:  this.lstCarparking.ProjectId,
      Password: this.lstCarparking.Password,
      UserName: this.lstCarparking.Username,
      Name: this.lstCarparking.Name,
      UrlCar: this.lstCarparking.UrlCar,
      Status: this.lstCarparking.Status,
      Note: this.lstCarparking.Note,
      listTowerMaps: this.lstCarparking.listTowerMaps,
    });
  }
}
