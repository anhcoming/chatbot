import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonService } from 'src/app/services/common.service';
import { TowerService } from 'src/app/services/tower.service';
import { AppMessageResponse, AppStatusCode, StorageData } from 'src/app/shared/constants/app.constants';
import { Paging } from 'src/app/viewModels/paging';
import { ResApi } from 'src/app/viewModels/res-api';
import { DbTower } from 'src/app/viewModels/tower/db-tower';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from 'src/app/services/project.service';
import { StorageService } from 'src/app/shared/services/storage.service';

@Component({
  selector: 'app-add-tower',
  templateUrl: './add-tower.component.html',
  styleUrls: ['./add-tower.component.scss']
})
export class AddTowerComponent implements OnInit {

  tower: DbTower;
  Idc: any;
  public itemTower: DbTower;

  public towerId: any;
   fTower: any ;

  public lstWard: any[];
  public lstTower: any[];
  public lstProject: any[];
  public data: any;


  public filterTower: Paging;
  public filterProject: Paging;

  public filterParrams : Paging ;

  public loading = [false];
  userId: any;

  constructor(
    private readonly projectService: ProjectService,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private readonly storeService: StorageService,
    private readonly fb: FormBuilder,
    private readonly towerService: TowerService,
    private readonly route: ActivatedRoute,
    private router: Router,
    
  ) {
    this.tower = new DbTower();
    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 100;
    this.itemTower = new DbTower();

    this.filterTower = new Object as Paging;

    this.filterProject = new Object as Paging;

    this.lstTower = [];
    this.lstWard = [];
    this.lstProject = [];
    this.data = {};

    
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.towerId =  params.get('towerId');
    });
    this.getCompanyId();
    this.getListProject()
    this.getUserId();
    this.formGroup();
    
    if(this.towerId)
      this.getTowerById(this.Idc, this.towerId);


    this.fTower = this.fb.group({
      Id:  [0],
      CreatedById: this.userId,
      UpdatedById: this.userId,
      CompanyId: this.Idc,
      ProjectId: ['' ,  Validators.required],
      Code: ['' ,  Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(150)])],
      Name: ['' ,  Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(150)])],
      ContactPhone: ['', Validators.pattern('[0-9\s]*')],
      ContactName: [''],
      Note: [''],
    })

  }
  getCompanyId() {
    this.Idc = this.storeService.get(StorageData.companyId); 
  }
  getUserId() {
    this.userId = this.storeService.get(StorageData.userId); 
  }
  onSubmit() {
    if(this.fTower.invalid){
      this.markAllAsDirty();
    }else{
      if(this.towerId == null) {
        const reqData = Object.assign({}, this.fTower.value);
      
        this.loading[0] = true;
        this.towerService.createTower(reqData).subscribe((res: ResApi) => {
          this.loading[0] = false;
          if(res.meta.error_code == AppStatusCode.StatusCode200) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.CreatedSuccess });

            setTimeout(() => {this.onReturnPage('/category/tower/list')}, 1500);
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
        const reqData = Object.assign({}, this.fTower.value);
      
        this.loading[0] = true;
        this.towerService.updateTowerById(this.towerId, reqData).subscribe((res: ResApi) => {
          this.loading[0] = false;
          if(res.meta.error_code == AppStatusCode.StatusCode200) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.CreatedSuccess });

            setTimeout(() => {this.onReturnPage('/category/tower/list')}, 1500);
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
  markAllAsDirty() {
    Object.keys(this.fTower.controls).forEach(key => {
      const control = this.fTower.get(key);
      if (control.enabled && control.invalid) {
        control.markAsDirty();
      }
    });
  }
  onReturnPage(url: string) : void {
    this.router.navigate([url]);
  }
  formGroup(){
    this.fTower = this.fb.group({
      id: this.towerId,
      CreatedById: this.userId,
      UpdatedById: this.userId,
      CompanyId: this.Idc,
      ProjectId: this.data.ProjectId,
      Code: this.data.Code,
      Name: this.data.Name,
      ContactPhone: this.data.ContactPhone,
      ContactName: this.data.ContactName,
      Note: this.data.Note,
    })
  }

  getTowerById(idc: number, id: number) {    
    if( this.towerId > 0) {
      this.towerService.getTowerById(idc, id).subscribe((res: ResApi) => {
        if(res.meta.error_code == AppStatusCode.StatusCode200) {
          this.data = res.data;      
          this.formGroup();
        }
        else {
          this.data = [];
          this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
        }
      }) 
      this.data={...this.data}
    }else{
      this.data = [];
    }
  }

  getListProject() {
    this.lstProject = [];
    this.projectService.getListByPaging(this.filterProject).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstProject = res.data;
      }
      else {
        this.data = new Array<DbTower>();
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })  
  }
  onBack(event: Event) {
    let isShow = true;

    if (isShow) {
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: !(this.towerId > 0) ? 'Hủy thêm mới tòa nhà' : 'Hủy cập nhật tòa nhà: <b>"'+ this.data?.Name +'"</b>' ,
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Xác nhận',
        rejectLabel: 'Hủy bỏ',
        acceptButtonStyleClass: 'p-button-success',
        rejectButtonStyleClass: 'p-button-danger',
        accept: () => {
          this.router.navigate(['/category/tower/list']);
        },
        reject: () => {
            return;
        }
      });
    } else {
      this.router.navigate(['/category/tower/list']);
    }
  }
}