import { Component} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonService } from 'src/app/services/common.service';
import { AppMessageResponse, AppStatusCode, IsStatus, Role, StorageData, Utilities } from 'src/app/shared/constants/app.constants';
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
import { ConfigRegisterService } from 'src/app/services/config-utilities.service';

@Component({
  selector: 'app-add-utilities-config',
  templateUrl: './add-utilities-config.component.html',
  styleUrls: ['./add-utilities-config.component.scss']
})
export class AddUtilitiesConfigComponent {

  public id: any;
  fConfigUtilities: any ;
  public isStatus = IsStatus;
  public utilities = Utilities;
  public role = Role;
  public lstProject: any[];
  public lstTower: any[];
  public Tower: any;
  public listUtilities: any;
  public TypeRegister: any;
  public listRegisterMaps: any;
  public lstUtilities: any;
  public uploadedImageUrl: any;
  public imgName = ''
  Idc: any;
  submitted = false
  public filterParrams : Paging ;
  public filterUtilities : Paging ;
  public allChecked: boolean = false;
  public loading = [false];
  public Editor = ClassicEditor;
  userId: any;

  constructor(
    private readonly projectService: ProjectService,
    private readonly towerService: TowerService,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private readonly commonService: CommonService,
    private readonly http: HttpClient,
    private readonly fb: FormBuilder,
    private readonly configRegisterService: ConfigRegisterService,
    private readonly route: ActivatedRoute,
    private router: Router,
    private readonly storeService: StorageService,
  ) {
    this.filterUtilities = new Object as Paging;
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
      this.getConfigRegister(this.id)
    }
    this.getCompanyId()
    this.getUserId();
    this.getListUtilities();
    this.getListProject();
    this.fConfigUtilities = this.fb.group({
      Id:  [0],
      CreatedById: this.userId,
      UpdatedById: this.userId,
      CompanyId: this.Idc,
      ProjectId:  [null , Validators.required],
      Status: [null, Validators.required],
      ServiceUtilitiesId: [null , Validators.required],
      listTowerMaps: [null],
      TypeRegister: [null],
    });
  }

  getUserId() {
    this.userId = this.storeService.get(StorageData.userId); 
  }
  onReturnPage(url: string) : void {
    this.router.navigate([url]);
  }
  markAllAsDirty() {
    Object.keys(this.fConfigUtilities.controls).forEach(key => {
      const control = this.fConfigUtilities.get(key);
      if (control.enabled && control.invalid) {
        control.markAsDirty();
      }
    });
    const TypeRegister = this.fConfigUtilities.get('TypeRegister');
    if (TypeRegister.enabled && TypeRegister.invalid) {
      TypeRegister.markAsDirty();
    }
  }
  onSubmit() {
    if(this.fConfigUtilities.invalid){
      this.markAllAsDirty();
      this.checkTower();
    }else{
      this.checkTower();
      if(this.fConfigUtilities.controls['listTowerMaps'].dirty == true) {
        console.log(this.fConfigUtilities.controls['listTowerMaps'].dirty);
        
        return
      }else{
        this.onCheck();
        const reqData = Object.assign({}, this.fConfigUtilities.value);
        reqData.listTowerMaps = this.Tower;
        this.listRegisterMaps = this.TypeRegister.filter((i: any) => i).map((item: any) => ({TypeRegister: item}))
        reqData.listRegisterMaps = this.listRegisterMaps;
        if(this.id == null) {
          this.loading[0] = true;
          this.configRegisterService.createConfigRegister(reqData).subscribe((res: ResApi) => {
            this.loading[0] = false;
            if(res.meta.error_code == AppStatusCode.StatusCode200) {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.CreatedSuccess });

              setTimeout(() => {this.onReturnPage('/configuration/utilities-config/list')}, 1500);
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
          this.configRegisterService.updateConfigRegisterById(this.id, reqData).subscribe((res: ResApi) => {
            this.loading[0] = false;
            if(res.meta.error_code == AppStatusCode.StatusCode200) {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.CreatedSuccess });

              setTimeout(() => {this.onReturnPage('/configuration/utilities-config/list')}, 1500);
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
  getConfigRegister(id: number) {
    this.configRegisterService.getConfigRegisterById(id).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200 ) {
        this.lstUtilities = res.data;
        this.TypeRegister = this.lstUtilities.listRegisterMaps.filter((i: any) => i).map((item: any) => item.TypeRegister);
        console.log(this.TypeRegister);
        
        this.setFormGroup();
        this.getListTower(this.lstUtilities.ProjectId)
      }
    })
  }
  getListUtilities() {
    this.filterUtilities.query = 'type=3 OR type=4'
    this.commonService.getServiceUtilities(this.filterUtilities).subscribe((res: ResApi) => {
      if(res.meta.error_code = AppStatusCode.StatusCode200) {
        this.listUtilities = res.data;
      }
    })
  }
  checkTower() {
    const isAnyChecked = this.lstTower.some((tower) => tower.checked === true);
    
    if(isAnyChecked == false) {
      const control = this.fConfigUtilities.get('listTowerMaps');
      control.markAsDirty();
      return;
    }else{
      const control = this.fConfigUtilities.get('listTowerMaps');
      control.markAsPristine();
    }
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
          this.allChecked = this.lstTower.every(item => item.checked);
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
    if(this.lstUtilities?.listTowerMaps) {
      
      for(let i=0; i<this.lstUtilities.listTowerMaps.length;i++){
        const towerId = this.lstUtilities.listTowerMaps[i].TowerId;
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
        message: !(this.id > 0) ? 'Bạn có muốn dừng thêm mới cấu hình người đăng ký tiện ích' : `Bạn có muốn dừng cập nhật cấu hình người đăng ký tiện ích <b>"`+ this.lstUtilities.Name +`"</b>?`,
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Xác nhận',
        rejectLabel: 'Hủy bỏ',
        acceptButtonStyleClass: 'p-button-success',
        rejectButtonStyleClass: 'p-button-danger',
        accept: () => {
          this.router.navigate(['/configuration/utilities-config/list']);
        },
        reject: () => {
            return;
        }
      });
    } else {
      this.router.navigate(['/configuration/utilities-config/list']);
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
    this.fConfigUtilities = this.fb.group({
      Id:  this.id,
      CreatedById: this.userId,
      UpdatedById: this.userId,
      CompanyId: this.Idc,
      ServiceUtilitiesId: this.lstUtilities.ServiceUtilitiesId,
      ProjectId:  this.lstUtilities.ProjectId,
      Password: this.lstUtilities.Password,
      Status: this.lstUtilities.Status,
      listTowerMaps: this.lstUtilities.listTowerMaps,
      TypeRegister: [null],
    });
  }
  onSelectTypeRegister(){
    console.log(this.TypeRegister);
  }
}
