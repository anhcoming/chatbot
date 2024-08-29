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
import { ConfigAppService } from 'src/app/services/config-app.service';

@Component({
  selector: 'app-add-app-config',
  templateUrl: './add-app-config.component.html',
  styleUrls: ['./add-app-config.component.scss']
})
export class AddAppConfigComponent {

  public id: any;
  fApp: any ;
  public isStatus = IsStatus;
  public lstProject: any[];
  public lstTower: any[];
  public lstConfigApp: any;
  public listUtilities: any[] = [];
  public lstBlock: any[] = [];
  public lstUtilities: any[] = [];
  public lstFunction: any[] = [];
  public lstService: any[] = [];
  public itemsBlock: any[] = [];
  public itemsUtilities: any[] = [];
  public itemsFunction: any[] = [];
  public itemsService: any[] = [];
  public selectedService: any[] = [];
  public selectedUtilities: any[] = [];
  public selectedFunction: any[] = [];
  public selectedBlock: any[] = [];
  public Block: any[] = [];
  public Utilities: any[] = [];
  public Function: any[] = [];
  public Service: any[] = [];
  public Tower: any;
  public lstConfig : any;
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
    private readonly towerService: TowerService,
    private readonly configappService: ConfigAppService,
    private readonly commonService: CommonService,
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
    this.getCompanyId();
    this.getUserId();
    this.getListUtilities();
    this.getListProject();
    this.fApp = this.fb.group({
      ProjectId:  ['' , Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(150)])],
      Id:  [0],
      CreatedById: this.userId,
      UpdatedById: this.userId,
      CompanyId: this.Idc,
      Name: ['' , Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(150)])],
      Status: ['', Validators.required],
      Note: [''],
      listTowerMaps: [''],
    });
  }
  getUserId() {
    this.userId = this.storeService.get(StorageData.userId); 
  }
  getConfigAppById(id: number) {
    this.configappService.getConfigAppById(id).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstConfigApp = res.data;
        if(this.lstConfigApp.ProjectId) {
          this.getListTower(this.lstConfigApp.ProjectId)
        }
        this.setFormGroup();
      }
    })
  }
  onReturnPage(url: string) : void {
    this.router.navigate([url]);
  }
  markAllAsDirty() {
    Object.keys(this.fApp.controls).forEach(key => {
      const control = this.fApp.get(key);
      if (control.enabled && control.invalid) {
        control.markAsDirty();
      }
    });
  }
  onSubmit() {
    if(this.fApp.invalid){
      this.markAllAsDirty();
      this.checkTower()
    }else{
      this.checkTower();
      if(this.fApp.controls['listTowerMaps'].dirty == true) {
        return
      }else{
        this.setServiceUtilities()
        this.onCheck();
        
        const reqData = Object.assign({}, this.fApp.value);
        reqData.CreatedById = this.userId;
        reqData.CompanyId = this.Idc;
        reqData.listTowerMaps = this.Tower;
        reqData.listBlocks = this.Block;
        reqData.listFunctions = this.Function;
        reqData.listService = this.Service;
        reqData.listUtilities = this.Utilities;
        if(this.id == null) {
          reqData.Id = 0;
          this.loading[0] = true;
          this.configappService.createConfigApp(reqData).subscribe((res: ResApi) => {
            this.loading[0] = false;
            if(res.meta.error_code == AppStatusCode.StatusCode200) {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.CreatedSuccess });

              setTimeout(() => {this.onReturnPage('/configuration/app-config//list')}, 1500);
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
          reqData.Id = this.id
          this.loading[0] = true;
          this.configappService.updateConfigAppByIdIndex(this.id, reqData).subscribe((res: ResApi) => {
            this.loading[0] = false;
            if(res.meta.error_code == AppStatusCode.StatusCode200) {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.CreatedSuccess });

              setTimeout(() => {this.onReturnPage('/configuration/app-config//list')}, 1500);
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
  checkTower() {
    const isAnyChecked = this.lstTower.some((tower) => tower.checked === true);
    if(isAnyChecked == false) {
      const control = this.fApp.get('listTowerMaps');
      control.markAsDirty();
    }else{
      const control = this.fApp.get('listTowerMaps');
      control.markAsPristine();
    }
  }
  setServiceUtilities() {
    this.itemsBlock.map(item => {
      this.Block.push({
        ServiceUtilitiesId: item.Id,
        Name: item.Name,
        Location: item.Location,
        IsView: true,
        Type: item.Type,
        Code: item.Code,
      })
    }) 
    this.itemsFunction.map(item => {
      this.Function.push({
        ServiceUtilitiesId: item.Id,
        Name: item.Name,
        Location: item.Location,
        IsView: true,
        Type: item.Type,
        Code: item.Code,
      })
    }) 
    this.itemsService.map(item => {
      this.Service.push({
        ServiceUtilitiesId: item.Id,
        Name: item.Name,
        Location: item.Location,
        IsView: true,
        Type: item.Type,
        Code: item.Code,
      })
    }) 
    this.itemsUtilities.map(item => {
      this.Utilities.push({
        ServiceUtilitiesId: item.Id,
        Name: item.Name,
        Location: item.Location,
        IsView: true,
        Type: item.Type,
        Code: item.Code,
      })
    }) 
  }

  setFormGroup() {
    this.fApp = this.fb.group({
      ProjectId:  this.lstConfigApp.ProjectId,
      Id:  this.lstConfigApp.Id,
      CreatedById: this.userId,
      UpdatedById: this.userId,
      CompanyId: this.Idc,
      Name: this.lstConfigApp.Name,
      Status: this.lstConfigApp.Status,
      Note: this.lstConfigApp.Note,
      listTowerMaps: this.lstConfigApp.listTowerMaps,
    });
    if(this.lstConfigApp){
      this.setLstServiceUtilities()
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
    this.fApp.get('listTowerMaps').setValue('');
    this.towerService.getListTowerByPaging(this.filterParrams)
    .subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstTower = res.data;
        for(let i=0; i<this.lstTower.length; i++){
          this.lstTower[i].checked = false;
        }
        this.setTower()
      }
      else {
        this.lstTower = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })
  }
  setTower(){
    if(this.lstConfigApp?.listTowerMaps) {
      
      for(let i=0; i<this.lstConfigApp.listTowerMaps.length;i++){
        const towerId = this.lstConfigApp.listTowerMaps[i].TowerId;
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
        message:  !(this.id > 0) ? 'Bạn có muốn dừng thêm mới cấu hình App' : `Bạn có muốn dừng cập nhật cấu hình App <b>"`+ this.lstConfigApp.Name +`"</b>?`,
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Xác nhận',
        rejectLabel: 'Hủy bỏ',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
        accept: () => {
          this.router.navigate(['configuration/app-config//list']);
        },
        reject: () => {
            return;
        }
      });
    } else {
      this.router.navigate(['configuration/app-config//list']);
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
  getListUtilities() {
    this.commonService.getServiceUtilities(this.filterParrams).subscribe((res: ResApi) => {
      if(res.meta.error_code = AppStatusCode.StatusCode200) {
        this.listUtilities = res.data;
        this.lstBlock = this.listUtilities.filter(item => item.Type == 1);
        this.lstFunction = this.listUtilities.filter(item => item.Type == 2);
        this.lstUtilities = this.listUtilities.filter(item => item.Type == 3);
        this.lstService = this.listUtilities.filter(item => item.Type == 4);
        if(this.id){
          this.getConfigAppById(this.id);
        }
      }
    })
  }
  setLstServiceUtilities() {
    this.lstConfigApp.listBlocks.map((items: any) => {
      this.lstBlock.map((item: any) => {
        if(item.Id == items.ServiceUtilitiesId) {
          this.selectedBlock.push(item)
        }
      })
    }) 
    
    this.itemsBlock = this.selectedBlock
    

    this.lstConfigApp.listFunctions.map((items: any) => {
      this.lstFunction.map((item: any) => {
        if(item.Id == items.ServiceUtilitiesId) {
          this.selectedFunction.push(item)
        }
      })
    }) 
    this.itemsFunction = this.selectedFunction

    this.lstConfigApp.listUtilities.map((items: any) => {
      this.lstUtilities.map((item: any) => {
        if(item.Id == items.ServiceUtilitiesId) {
          this.selectedUtilities.push(item)
        }
      })
    }) 
    this.itemsUtilities = this.selectedUtilities

    this.lstConfigApp.listServices.map((items: any) => {
      this.lstService.map((item: any) => {
        if(item.Id == items.ServiceUtilitiesId) {
          this.selectedService.push(item)
        }
      })
    }) 
    this.itemsService = this.selectedService
  }
}

