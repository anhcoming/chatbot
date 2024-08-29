import { filter } from 'rxjs';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ConfigCardService } from 'src/app/services/config-card.service';
import { ProjectService } from 'src/app/services/project.service';
import { TowerService } from 'src/app/services/tower.service';
import { TypeCardService } from 'src/app/services/type-card.service';
import { VehicleService } from 'src/app/services/vehicle.service';
import { AppStatusCode, AppMessageResponse, StatusActive } from 'src/app/shared/constants/app.constants';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ConfigCard } from 'src/app/viewModels/config-card/config-card';
import { ConfigCardDetail } from 'src/app/viewModels/config-card/config-card-detail';
import { Paging } from 'src/app/viewModels/paging';
import { Project } from 'src/app/viewModels/project/project';
import { ResApi } from 'src/app/viewModels/res-api';
import { DbTower } from 'src/app/viewModels/tower/db-tower';
import { TypeCard } from 'src/app/viewModels/type-card/type-card';

@Component({
  selector: 'app-add-config-card',
  templateUrl: './add-config-card.component.html',
  styleUrls: ['./add-config-card.component.scss']
})
export class AddConfigCardComponent {
  public itemConfigCard: ConfigCard;
  public fConfCard: any;
  public lstTypeCard: Array<TypeCard>;
  public lstProject: Array<Project>;
  public lstTower: Array<DbTower>;
  public lstConfigCardDetail: Array<ConfigCardDetail>;
  public lstStatus = StatusActive;
  public isLoadingTable: boolean = false;
  public loading = [false];


  

  constructor(
    private readonly configCardService: ConfigCardService,
    private readonly projectService: ProjectService,
    private readonly towerService: TowerService,
    private readonly typeCardService: TypeCardService,
    private readonly vehicleService: VehicleService,
    private readonly messageService: MessageService,
    private readonly storeService: StorageService,
    private readonly confirmationService: ConfirmationService,
    private readonly fb: FormBuilder,
    
    private active_route: ActivatedRoute, 
    private router: Router
  ) {
    this.initForm();

    this.lstTypeCard = new Array<TypeCard>();
    this.lstProject = new Array<Project>();
    this.itemConfigCard = new ConfigCard();
    this.lstTower = new Array<DbTower>();
    this.lstConfigCardDetail = new Array<ConfigCardDetail>();
  }

  ngOnInit() {
    this.getListProjectByPaging();

    this.active_route.paramMap.subscribe(params => {
      const idIndex =  params.get('id');
      
      if(idIndex) {
        this.itemConfigCard.IdIndex = idIndex;
        this.getConfigCardByIdIndex();
      }
    });
  }

  selectAll(event:any)
  {
    if(event.checked.length===1)
    {
      //(this.fConfCard.controls['ListTower'] as FormArray).clear();
      this.lstTower.forEach((item : DbTower, index: number) => {
        let array= new Array<number>();
        array.push(item.Id);
        //const control = this.fb.array(array);
        this.ListTower.controls[index].setValue(array);
      });
    }
    else {
      this.lstTower.forEach((item : DbTower, index: number) => {
        let array= new Array<any>();
        array.push(null);
        //const control = this.fb.array(array);
        this.ListTower.controls[index].setValue(array);
      });
    }
    console.log((this.fConfCard.controls['ListTower'] as FormArray).value);
  }
  
  getConfigCardByIdIndex() {
    this.configCardService.getConfigCardByIdIndex(0, this.itemConfigCard.IdIndex).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.itemConfigCard = res.data;
        this.lstConfigCardDetail = [];
        this.lstConfigCardDetail = res.data.ConfigCardDetail;
        

        this.fConfCard.patchValue({
          ProjectId: this.itemConfigCard.ProjectId,
          IsActive: this.itemConfigCard.IsActive,
        });

        this.getListTowerByProjectId(this.itemConfigCard.ProjectId);
        this.getTypeCardByProjectId(this.itemConfigCard.ProjectId);

        let list_tower = this.fConfCard.controls['ListTower'].value;

        for(let i = 0; i < this.lstTower.length; i ++) {
          if (this.itemConfigCard.TowerIds.find(s => s.Id == this.lstTower[i].Id) != null) {
            list_tower[i] = [this.lstProject[i].Id]
          }
        }

        this.fConfCard.controls['ListTower'].setValue(list_tower);
      }
      else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })
  }
  
  get ListTower(): FormArray  {
    return this.fConfCard.get("ListTower") as FormArray;
  }

  get ConfigCardDetail(): FormArray  {
    return  this.fConfCard.get("ConfigCardDetail") as FormArray;
  }

  onReceiverData(e: any) {
    this.lstConfigCardDetail = [...e];
  }

  onSubmit(){
    console.log(this.lstConfigCardDetail);
    const lstTowerId = this.fConfCard.controls['ListTower'].value;

    if(lstTowerId.every(this.IsCheckTowerId)) {
      this.messageService.add({ severity: 'warn', summary: 'Warn', detail: "Vui lòng chọn ít nhất 1 tòa nhà" });
      return;
    }

    if(!this.lstConfigCardDetail.length) {
      this.messageService.add({ severity: 'warn', summary: 'Warn', detail: "Vui lòng thêm ít nhất 1 cấu hình kiểu thẻ" });
      return;
    }

    const fData = this.fConfCard.value;
    let reqData =  {
      id: 0,
      projectId : fData.ProjectId,
      isActive : fData.IsActive,
      towerIds : lstTowerId.filter((s: any) => s !== null).map((s: any) => s[0]),
      configCardDetail : new Array<ConfigCardDetail>()
    }

    for (let i = 0; i < this.lstConfigCardDetail.length; i++) {
      let itemDetail = this.lstConfigCardDetail[i];
      
      if(itemDetail.TypeCardIds.every(this.IsCheckTypeCard)) {
        this.messageService.add({ severity: 'warn', summary: 'Warn', detail: "Vui lòng chọn ít nhất 1 loại thẻ cho kiểu thẻ: " + itemDetail?.Name });
        return;
      }
      
      if (itemDetail.Name) {
        let item_detail = {...itemDetail};
        item_detail.TypeCardIds = [];
        
        for(let j = 0; j < itemDetail.TypeCardIds.length; j ++) {
          if (itemDetail.TypeCardIds[j]  && itemDetail.TypeCardIds[j] !== 0) {
            item_detail.TypeCardIds.push(itemDetail.TypeCardIds[j]);
          }
        }

        reqData.configCardDetail.push(item_detail);
      }
    }

    this.loading[0] = true;

    if (this.itemConfigCard.IdIndex) {
      this.configCardService.updateConfigCardByIdIndex(this.itemConfigCard.IdIndex, reqData).subscribe((res: ResApi) => {
        this.loading[0] = false;
        if(res.meta.error_code == AppStatusCode.StatusCode200) {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.UpdatedSuccess });
  
          setTimeout(() => {this.onReturnPage('config-utilities/config-card/list')}, 1500);
        }
        else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
        }
      },
      () => {this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest }) },
      () => {this.loading[0] = false} 
      )
    } else {
      this.configCardService.createConfigCard(reqData).subscribe((res: ResApi) => {
        this.loading[0] = false;
        if(res.meta.error_code == AppStatusCode.StatusCode200) {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.CreatedSuccess });
  
          setTimeout(() => {this.onReturnPage('config-utilities/config-card/list')}, 1500);
        }
        else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
        }
      },
      () => {this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest }) },
      () => {this.loading[0] = false} 
      )
    }
  }

  onAddDetail() {
    let itemDetailAdd = new ConfigCardDetail();
    itemDetailAdd.Name = "";
    itemDetailAdd.IsIntegratedAll = true;
    itemDetailAdd.Description = "";
    itemDetailAdd.TypeCardIds = this.lstTypeCard.map(s => s.Id).fill(0);
    
    this.lstConfigCardDetail.push(itemDetailAdd);
  }

  IsCheckTypeCard(typecard: number) {
    return typecard === 0;
  }

  IsCheckTowerId(towerId: number) {
    return towerId === null;
  }

  initForm() {
    this.fConfCard = this.fb.group({
      ProjectId: [null,],
      IsActive: [true ],
      ListTower: this.fb.array([], Validators.required),
      ConfigCardDetail: this.fb.array([
        //   this.fb.group({
        //   Name: new FormControl(''),
        //   Description: new FormControl(''),
        //   IsIntegratedAll: new FormControl(true),
        //   TypeCardIds: new FormControl([this.fb.array([])]),
        // })
      ])
    });
  }



  onChangeProjectId(event: any) {
    if (event && event?.value) {
      this.getListTowerByProjectId(event?.value);
      this.getTypeCardByProjectId(event?.value);
    }
    else {
      this.lstTower = [];
      this.lstTypeCard = [];
    }
  }

  getTypeCardByProjectId(projectId: number) {
    let parramsTypeCard =  new Object as Paging;
    parramsTypeCard.page = 1;
    parramsTypeCard.page_size = 100;
    parramsTypeCard.query = '';

    this.typeCardService.getListTypeCardByPaging(parramsTypeCard, projectId).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstTypeCard = res.data.Results;
        
        if (this.itemConfigCard.IdIndex) {
          for (let i = 0; i < this.lstConfigCardDetail.length; i++) {
            let lstTypeCard_new = this.lstTypeCard.map(s => s.Id).fill(0);
            let typeCard_exist = this.lstConfigCardDetail[i].TypeCardIds;

            for (let j = 0; j < typeCard_exist.length; j++) {
              const indexTypeCard = this.lstTypeCard.findIndex(s => s.Id === typeCard_exist[j]);

              if (indexTypeCard >= 0) {
                lstTypeCard_new[indexTypeCard] = typeCard_exist[j]//new Array(typeCard_exist[j]);
              }
            }

            this.lstConfigCardDetail[i].TypeCardIds = lstTypeCard_new;
          }
        }
      }
      else {
        this.lstTypeCard = new Array<TypeCard>();
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    },
    () => {
      this.lstTypeCard = [];
      this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest });
    })
  }

  getListProjectByPaging() {
    let parramsProject =  new Object as Paging;
    parramsProject.page = 1;
    parramsProject.page_size = 100;
    parramsProject.query = '';

    this.projectService.getListByPaging(parramsProject).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstProject = res.data;
      }
      else {
        this.lstProject = new Array<Project>();
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    },
    () => {
      this.lstProject = [];
      this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest });
    })
  }

  getListTowerByProjectId(projectId: number) {
    let parramsTower =  new Object as Paging;
    parramsTower.page = 1;
    parramsTower.page_size = 100;
    parramsTower.query = 'ProjectId=' + projectId;
    (this.fConfCard.controls['ListTower'] as FormArray).clear();

    this.towerService.getListTowerByPaging(parramsTower).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstTower = res.data;

        this.lstTower.forEach(() => {
          const control = this.fb.control(null);
          (this.fConfCard.controls['ListTower'] as FormArray).push(control);
        });

        let list_tower = this.fConfCard.controls['ListTower'].value;
        if (this.itemConfigCard.IdIndex) {
          for(let i = 0; i < this.lstTower.length; i ++) {
            if (this.itemConfigCard.TowerIds.find(s => s.Id == this.lstTower[i].Id) != null) {
              list_tower[i] = [this.lstTower[i].Id]
            }
          }
  
          this.fConfCard.controls['ListTower'].setValue(list_tower);
        }
      }
      else {
        this.lstTower = new Array<DbTower>();
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    },
    () => {
      this.lstTower = [];
      this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest });
    })
  }

  onBack(event: Event) {
    let isShow = false;//this.layoutService.getIsShow();

    if (isShow) {
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: "Chưa hoàn tất thêm mới dự án, Bạn có muốn quay lại?",
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.router.navigate(['config-utilities/config-card/list']);
        },
        reject: () => {
            return;
        }
      });
    } else {
      this.router.navigate(['config-utilities/config-card/list']);
    }
  }

  onReturnPage(url: string) : void {
    this.router.navigate([url]);
  }
}
