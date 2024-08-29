import { Component } from '@angular/core';
import { FormBuilder, FormGroup ,Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Zone } from 'src/app/viewModels/zone/zone';
import { Paging } from 'src/app/viewModels/paging';
import { Location } from '@angular/common';
import { ZoneService } from 'src/app/services/zone.service';
import { AppMessageResponse, AppStatusCode, StorageData } from 'src/app/shared/constants/app.constants';
import { ResApi } from 'src/app/viewModels/res-api';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ProjectService } from 'src/app/services/project.service';
import { TowerService } from 'src/app/services/tower.service';



@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.component.html',
  styleUrls: ['./add-address.component.scss']
})
export class AddAddressComponent {
  zone!: Zone;
  public Idc: any;
  public itemZone: Zone;
  public filterCode: Paging;
  public filterAddress: Paging;
  public filterParrams : Paging ;

  public fZone: any;
  userId : any;
  currentDate = new Date();
  public addressCode: any;
  public dataZone : any;
  public loading = [false];
  public lstProject: any [] = [];
  public lstTower: any [] = [];
  public Project: any [] = [];
  public Tower: any [] = [];
  lstAddressCode: any[];
  lstAddressName: {};
  lstAddress: any[];
  zoneId : any;
  event: any;
  constructor(
    private readonly zoneService: ZoneService,
    private readonly projectService: ProjectService,
    private readonly towerService: TowerService,
    private readonly storeService: StorageService,
    private readonly messageService: MessageService,
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private location: Location,

    private router: Router,

    private confirmationService: ConfirmationService,

  ) {
    this.zone = new Zone();
    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 100;
    this.itemZone = new Zone();

    this.filterCode = new Object as Paging;

    this.filterAddress = new Object as Paging;

    this.lstAddress = [];
    this.lstAddressCode = [];
    this.lstAddressName = {};
    this.dataZone = {}
    this.fZone = fb.group({
      Id: [0],
      Code: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(150)])],
      Name: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(150)])],
      Note: [''],
      ProjectId : [''],
      TowerId: [''],
      CreatedAt : [''],
      UpdatedAt : [''],
      Status : [1],
      CompanyId: this.Idc,
      createdById: this.userId,
      updatedById: this.userId,
    })
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.zoneId = params.get('id');
    });
    this.markAllAsDirty();
    this.getProject();
    this.getCompanyId();
    this.getUserId();
    
    this.onSelectTower(event);
    if(this.zoneId)
      this.getZoneById(this.Idc, this.zoneId)
    
     
 
      this.fZone = this.fb.group({
        Id: [0],
        Code: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(150)])],
        Name: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(150)])],
        Note: ['', ],
        CreatedBy: [''],
        UpdatedBy : [''],
        Status : [1],
        CreatedAt : this.currentDate,
        UpdatedAt : this.currentDate,
        ProjectId: [''],
        TowerId: [''],
        CompanyId: this.Idc,
        CreatedById: this.userId,
        UpdatedById: this.userId,
      })
    
  }
  getCompanyId() {
    this.Idc = this.storeService.get(StorageData.companyId); 
  }
  getUserId() {
    this.userId = this.storeService.get(StorageData.userId); 
  }
  getProject() {
    this.projectService.getListByPaging(this.filterParrams).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.Project = res.data;
        this.lstProject= [...this.Project];
      }
    })
  }
  getListTower(event: any) {
    if (!event || event.value) {
      this.lstTower = [];
    }
    let filterTower = new Object as Paging;
    filterTower.query = `ProjectId=${event.value || event}`;

    this.towerService.getListTowerByPaging(filterTower)
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
  onSelectProject(event: any) {
    if(event.value == null){
      this.lstProject = [...this.Project];
      this.lstTower =[...this.Tower];
    }else{
      this.lstTower = this.Tower.filter(i => i.ProjectId == event.value);      
    }
  }
  onSelectTower(event: any) {
    if(event.value == null) {
      this.fZone.get('ProjectId').setValue('');
      this.lstTower = [...this.Tower];
    }else{
      this.fZone.get('ProjectId').setValue(this.lstTower.filter(i => i.Id == event.value)[0]?.ProjectId);
    }
    const control = this.fZone.get('ProjectId');
    if(control.enabled && control.invalid){
      control.markAsDirty();
    }
  }
  markAllAsDirty() {
    Object.keys(this.fZone.controls).forEach(key => {
      const control = this.fZone.get(key);
      if (control.enabled && control.invalid) {
        control.markAsDirty();
      }
    });
  }
  onSubmit() {
    if(this.fZone.invalid){
      this.markAllAsDirty()
    }else{
      if(this.zoneId == null) {
        // if (this.fZone.controls['Name'].value == null || typeof this.fZone.controls['Name'].value === 'undefined') {
        //   this.fZone.controls['Name'].setValue(0);
        // }
        this.fZone.controls['Id'].setValue(0);
        
        const reqData = Object.assign({}, this.fZone.value);
        
        this.loading[0] = true;
        this.zoneService.createZone(reqData).subscribe(
          (res: any) => {
            this.loading[0] = false;
            if (res?.meta?.error_code == AppStatusCode.StatusCode200) {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.CreatedSuccess });
              
              setTimeout(() => {this.onReturnPage('/category/zone/list')}, 1000);
            } 
            else { 
              this.loading[0] = false
              
              this.messageService.add({ severity: 'warn', summary: 'Warn', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
            }
          },
          () => {
            this.loading[0] = false;
            this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest });
          },
          () => {
            this.loading[0] = false;
          }
        );
      }else{
        // if (this.fZone.controls['Name'].value == null || typeof this.fZone.controls['Name'].value === 'undefined') {
        //   this.fZone.controls['Name'].setValue(0);
        // }

        const reqData = Object.assign({}, this.fZone.value);
    
        this.loading[0] = true;
        this.zoneService.updateZone(this.zoneId, reqData).subscribe(
          (res: any) => {
            this.loading[0] = false;
            if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: res.meta.error_message || AppMessageResponse.CreatedSuccess });

              setTimeout(() => {this.onReturnPage('/category/zone/list')}, 1500);
            } else {
              this.loading[0] = false
              this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
            }
          },
          () => {
            this.loading[0] = false;
            this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest });
          },
          () => {
            this.loading[0] = false;
          }
        );
      }
    }
  }
  onReturnPage(url: string) : void {
    this.router.navigate([url]);
  }

  getZoneById(idc: number, id: number) {    
    if( this.zoneId > 0) {
      this.zoneService.getZoneById(idc, id).subscribe((res: ResApi) => {
        if(res.meta.error_code == AppStatusCode.StatusCode200) {
          this.dataZone = res.data;    
          this.getListTower(this.dataZone?.ProjectId);  
          this.formGroup();
        }
        else {
          this.dataZone = [];
          this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
        }
      }) 
      this.dataZone={...this.dataZone}
    }else{
      this.dataZone = [];
    }
  }


  formGroup() {
    this.fZone = this.fb.group({
      ProjectId: this.dataZone.ProjectId,
      Id : this.dataZone.Id,
      Status : this.dataZone.Status,
      TowerId: this.dataZone.TowerId,
      CompanyId: this.Idc,
      Code: this.dataZone.Code,
      CreatedAt : this.dataZone.CreatedAt,
      UpdatedAt : this.currentDate,
      Name: this.dataZone.Name,
      Note: this.dataZone.Note,
      CreatedById: this.userId,
      UpdatedById: this.userId,
    })
  }

  onBack(event: Event) {
    let isShow = true;
    // this.layoutService.getIsShow();

    if (isShow) {
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: !(this.zoneId > 0) ? "Chưa hoàn tất thêm mới vị trí, Bạn có muốn Hủy?" :  "Chưa hoàn tất sửa vị trí, Bạn có muốn Hủy?",
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Xác nhận',
        rejectLabel: 'Hủy bỏ',
        acceptButtonStyleClass: 'p-button-success',
        rejectButtonStyleClass: 'p-button-danger',
        accept: () => {
          this.router.navigate(['category/zone/list']);
        },
        reject: () => {
          return;
        }
      });
    } else {
      this.router.navigate(['category/zone/list']);
    }
  }
  
}
