import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProjectService } from 'src/app/services/project.service';
import { AppMessageResponse, AppStatusCode, StorageData } from 'src/app/shared/constants/app.constants';
import { Paging } from 'src/app/viewModels/paging';
import { DbPosition } from 'src/app/viewModels/position/position';
import { ResApi } from 'src/app/viewModels/res-api';
import { Router } from '@angular/router';
import { PositionService } from 'src/app/services/position.service';
import { StorageService } from 'src/app/shared/services/storage.service';

@Component({
  selector: 'app-add-position',
  templateUrl: './add-position.component.html',
  styleUrls: ['./add-position.component.scss']
})
export class AddPositionComponent {
  public lstPosition: Array<DbPosition>;
  public itemPosition: any[];
  public id: any;
  public Idc: any;
  public fPosition: any ;
  public lstProject: any[];
  posID : any
  public filterProject: Paging;
  public filterParrams : Paging ;
  public loading = [false];
  public dataPosition: any;
  userId: any;
  constructor(
    private readonly projectService: ProjectService,
    private readonly positionService: PositionService,
    private readonly storeService: StorageService,
    private readonly messageService: MessageService,
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService,
    
  ) {
    this.lstPosition = new Array<DbPosition>();
    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 100;
    this.itemPosition = [];

    this.filterProject = new Object as Paging;

    this.lstProject = [];
    this.dataPosition = {}

   
    
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.posID = params.get('posID');
    });

    if(this.posID)
      this.getPositionByID(this.posID)
   
    this.getListProject();
    this.getCompanyId()
    this.getUserId();
    this.fPosition = this.fb.group({
      Id: [0],
      Code: ['' , Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(20)])],
      Name: ['' , Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(150)])],
      LevelId: ['' , Validators.compose([Validators.required, Validators.minLength(0), Validators.maxLength(9999)])],
      IsNotification: [false],
      ProjectId: null,
      Note: [''],
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
  getPositionByID(id: number) {

    this.positionService.getPositionById(id).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.dataPosition = res.data;
        
        this.formGroup();
      }
      else {
        this.dataPosition = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
      
    }) 
    this.dataPosition={...this.dataPosition}
  }

  formGroup() {
    this.fPosition = this.fb.group({
      Id : this.dataPosition.Id,
      // Code: this.dataPosition.Code,
      Code : this.dataPosition.Code ,
      Name: this.dataPosition.Name,
      LevelId: this.dataPosition.LevelId,
      IsNotification: this.dataPosition.IsNotification,
      Note: this.dataPosition.Note,
      ProjectId: this.dataPosition.ProjectId,
      CompanyId: this.Idc,
      CreatedById: this.dataPosition.CreatedById,
      UpdatedById: this.dataPosition.UpdatedById,

    })
  }
  markAllAsDirty() {
    Object.keys(this.fPosition.controls).forEach(key => {
      const control = this.fPosition.get(key);
      if (control.enabled && control.invalid) {
        control.markAsDirty();
      }
    });
  }
  
  onSubmit() {
    if(this.fPosition.invalid){
      this.markAllAsDirty()
    }else{
      if(this.posID == null) {
        // if (this.fZone.controls['Name'].value == null || typeof this.fZone.controls['Name'].value === 'undefined') {
        //   this.fZone.controls['Name'].setValue(0);
        // }
        this.fPosition.controls['Id'].setValue(0);
        
        const reqData = Object.assign({}, this.fPosition.value);
        
        this.loading[0] = true;
        this.positionService.createPosition(reqData).subscribe(
          (res: any) => {
            this.loading[0] = false;
            if (res?.meta?.error_code == AppStatusCode.StatusCode200) {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.CreatedSuccess });
              
              setTimeout(() => {this.onReturnPage('/category/position/list')}, 1000);
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

        const reqData = Object.assign({}, this.fPosition.value);
    
        this.loading[0] = true;
        this.positionService.updatePosition(this.posID, reqData).subscribe(
          (res: any) => {
            this.loading[0] = false;
            if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: res.meta.error_message || AppMessageResponse.CreatedSuccess });

              setTimeout(() => {this.onReturnPage('/category/position/list')}, 1500);
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

  getListProject() {
    this.lstProject = [];
    this.projectService.getListByPaging(this.filterProject).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstProject = res.data;
      }
      else {
        this.lstProject = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })  
  }

  onBack(event: Event) {
    let isShow = true;//this.layoutService.getIsShow();

    if (isShow) {
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: !(this.posID > 0 ) ?  "Chưa hoàn tất thêm mới chức vụ,Bạn có muốn Hủy?" : "Chưa hoàn tất sửa chức vụ,Bạn có muốn Hủy?",
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Xác nhận',
        rejectLabel: 'Hủy bỏ',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
        accept: () => {
          this.router.navigate(['/category/position/list']);
        },
        reject: () => {
            return;
        }
      });
    } else {
      this.router.navigate(['/position/list']);
    }
  }

}
