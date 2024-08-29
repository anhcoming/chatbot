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
import { ConfigEmailService } from 'src/app/services/config-email.service';

@Component({
  selector: 'app-add-email-config',
  templateUrl: './add-email-config.component.html',
  styleUrls: ['./add-email-config.component.scss']
})
export class AddEmailConfigComponent {

  public id: any;
  fEmail: any ;
  public isStatus = IsStatus;
  public lstProject: any[];
  public lstTower: any[];
  public Tower: any;
  public lstCarparking: any = [];
  Idc: any;
  submitted = false
  public filterParrams : Paging ;
  public allChecked: boolean = false;
  public loading = [false];
  public Editor = ClassicEditor;
  userId: any;

  constructor(
    private readonly projectService: ProjectService,
    private readonly configEmailService: ConfigEmailService,
    private readonly towerService: TowerService,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private readonly http: HttpClient,
    private readonly fb: FormBuilder,
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
      this.getConfigRegister(this.id);
    }
    this.getCompanyId()
    this.getUserId();

    this.getListProject();
    this.fEmail = this.fb.group({
      Id:  [0],
      CreatedById: this.userId,
      UpdatedById: this.userId,
      CompanyId: this.Idc,
      Status: ['' , Validators.required],
      ProjectId:  [null , Validators.required],
      EmailDisplayName: ['' , Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(150)])],
      EmailHost: [''],
      EmailSender: [''],
      EmailUserName: ['' , Validators.required],
      EmailPasswordHash: ['' ],
      EmailReceive: ['' , Validators.required],
      EmailPort: [''] ,
      Note: [''],
      listTowerMaps: ['']
    });
  }
  onReturnPage(url: string) : void {
    this.router.navigate([url]);
  }
  getUserId() {
    this.userId = this.storeService.get(StorageData.userId); 
  }
  markAllAsDirty() {
    Object.keys(this.fEmail.controls).forEach(key => {
      const control = this.fEmail.get(key);
      if (control.enabled && control.invalid) {
        control.markAsDirty();
      }
    });
  }
  onSubmit() {
    if(this.fEmail.invalid){
      this.markAllAsDirty();
      this.checkTower();
    }else{
      this.checkTower();
      if(this.fEmail.controls['listTowerMaps'].dirty == true) {
        return;
      }else{
        this.onCheck();
        const reqData = Object.assign({}, this.fEmail.value);
        reqData.EmailPort = this.fEmail.get('EmailPort').value
        reqData.listTowerMaps = this.Tower;
        if(this.id == null) {
          this.loading[0] = true;
          this.configEmailService.createConfigEmail(reqData).subscribe((res: ResApi) => {
            this.loading[0] = false;
            if(res.meta.error_code == AppStatusCode.StatusCode200) {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.CreatedSuccess });

              setTimeout(() => {this.onReturnPage('/configuration/email-config/list')}, 1500);
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
          this.configEmailService.updateConfigEmailById(this.id, reqData).subscribe((res: ResApi) => {
            this.loading[0] = false;
            if(res.meta.error_code == AppStatusCode.StatusCode200) {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.CreatedSuccess });

              setTimeout(() => {this.onReturnPage('/configuration/email-config/list')}, 1500);
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
    this.configEmailService.getConfigEmailById(id).subscribe((res: ResApi) => {
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
      const control = this.fEmail.get('listTowerMaps');
      control.markAsDirty();
    }else{
      const control = this.fEmail.get('listTowerMaps');
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
        message: !(this.id > 0) ? 'Bạn có muốn dừng thêm mới cấu hình Email' : `Bạn có muốn dừng cập nhật cấu hình Email <b>"`+ this.lstCarparking.EmailDisplayName +`"</b>?`,
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Xác nhận',
        rejectLabel: 'Hủy bỏ',
        acceptButtonStyleClass: 'p-button-success',
        rejectButtonStyleClass: 'p-button-danger',
        accept: () => {
          this.router.navigate(['/configuration/email-config/list']);
        },
        reject: () => {
            return;
        }
      });
    } else {
      this.router.navigate(['/configuration/email-config/list']);
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
    this.fEmail = this.fb.group({
      Id:  this.id,
      CreatedById: this.userId,
      UpdatedById: this.userId,
      CompanyId: this.Idc,
      Status: this.lstCarparking.Status,
      ProjectId:  this.lstCarparking.ProjectId,
      EmailDisplayName: this.lstCarparking.EmailDisplayName,
      EmailHost: this.lstCarparking.EmailHost,
      EmailSender: this.lstCarparking.EmailSender,
      EmailUserName: this.lstCarparking.EmailUserName,
      EmailPasswordHash: this.lstCarparking.EmailPasswordHash,
      EmailReceive: this.lstCarparking.EmailReceive,
      EmailPort: this.lstCarparking.EmailPort,
      Note: this.lstCarparking.ServiceUtilitiesId,
      listTowerMaps: this.lstCarparking.listTowerMaps,
    });
  }
}
