import { filter } from 'rxjs';
import { Component } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ProjectService } from 'src/app/services/project.service';
import { TypeCardService } from 'src/app/services/type-card.service';
import { VehicleService } from 'src/app/services/vehicle.service';
import { GroupCard, AppStatusCode, AppMessageResponse, StatusActive, GroupCardEnum } from 'src/app/shared/constants/app.constants';
import { StorageService } from 'src/app/shared/services/storage.service';
import { Paging } from 'src/app/viewModels/paging';
import { Project } from 'src/app/viewModels/project/project';
import { ResApi } from 'src/app/viewModels/res-api';
import { TypeCard } from 'src/app/viewModels/type-card/type-card';
import { Vehicle } from 'src/app/viewModels/vehicle/vehicle';

@Component({
  selector: 'app-add-type-card',
  templateUrl: './add-type-card.component.html',
  styleUrls: ['./add-type-card.component.scss']
})

export class AddTypeCardComponent {
  public fTypeCard: any;
  public itemTypeCard: TypeCard;
  public lstProject: Array<Project>;
  public lstVehicle: Array<Vehicle>;
  public lstGroupCard = GroupCard;
  public lstStatus = StatusActive;
  public filterParrams : Paging;
  public isLoadingTable: boolean = false;
  public loading = [false];
  public cardGroupEnum = GroupCardEnum;
  

  constructor(
    private readonly projectService: ProjectService,
    private readonly typeCardService: TypeCardService,
    private readonly vehicleService: VehicleService,
    private readonly messageService: MessageService,
    private readonly storeService: StorageService,
    private readonly confirmationService: ConfirmationService,
    private readonly fb: FormBuilder,
    private route: ActivatedRoute, 
    private router: Router
  ) {
    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 50;
    this.filterParrams.select = 'Id, Name';

    this.lstVehicle = new Array<Vehicle>();
    this.itemTypeCard = new TypeCard();
    this.lstProject = new Array<Project>();

    this.initForm();
  }

  ngOnInit() {
    
    this.getListProjectByPaging();
    this.getVehicleActive();

    this.route.paramMap.subscribe(params => {
      const id =  params.get('id');
      
      if(id) {
        this.itemTypeCard.Id = Number(id) ?? 0;
        this.getTypeCardById(this.itemTypeCard.Id);
      }
    });
  }

  initForm() {
    this.fTypeCard = this.fb.group({
      Name: ['' , Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(150)])],
      Description: ['' ],
      GroupCard: [1 , Validators.required],
      VehicleId: [0,],
      IsActive: [true ],
      ListProject: this.fb.array([], Validators.required)
    })
  }

  get ListProject(): FormArray  {
    return this.fTypeCard.get("ListProject") as FormArray;
  }

  onSubmit() {
    if (this.fTypeCard.invalid) {
      return;
    }

    let reqData = Object.assign({}, this.fTypeCard.value);
    
    let lstProject = reqData.ListProject.filter((s: any) => s > 0);

    if (reqData.GroupCard == this.cardGroupEnum.card_car && !reqData.VehicleId) {
      this.messageService.add({ severity: 'warn', summary: 'Waning', detail: AppMessageResponse.vehicleId_empty });
      return;
    }
    else if (!lstProject.length) {
      this.messageService.add({ severity: 'warn', summary: 'Waning', detail: AppMessageResponse.lstProject_empty });
      return;
    }

    reqData.ListProject = [];

    for(let i = 0; i < lstProject.length; i ++) {
      const itemProject = this.lstProject.find(s => s.Id == lstProject[i][0]);

      if (itemProject) {
        reqData.ListProject.push({
          ProjectId: itemProject.Id,
          Name: itemProject.Name
        });
      }
    }

    this.loading[0] = true;

    if (!this.itemTypeCard.Id) {
      this.typeCardService.createTypeCard(reqData).subscribe((res: ResApi) => {
        this.loading[0] = false;
        if(res.meta.error_code == AppStatusCode.StatusCode200) {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.CreatedSuccess });

          setTimeout(() => {this.onReturnPage('/config-utilities/type-card/list')}, 500);
        }
        else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
        }
      },
      () => {this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest }) },
      () => {this.loading[0] = false} 
      ) 
    }
    else {
      this.typeCardService.updateTypeCardById(this.itemTypeCard.Id, reqData).subscribe((res: ResApi) => {
        this.loading[0] = false;
        if(res.meta.error_code == AppStatusCode.StatusCode200) {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.UpdatedSuccess });

          setTimeout(() => {this.onReturnPage('/config-utilities/type-card/list')}, 500);
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

  getVehicleActive() {
    this.vehicleService.getVehicleActive().subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstVehicle = res.data;
      }
      else {
        this.lstVehicle = new Array<TypeCard>();
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    },
    () => {
      this.lstVehicle = [];
      this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest });
    })
  }

  getListProjectByPaging() {
    this.projectService.getListByPaging(this.filterParrams).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstProject = res.data;
        
        this.lstProject.forEach(() => {
          const control = this.fb.control(null);
          (this.fTypeCard.controls['ListProject'] as FormArray).push(control);
        });

        let list_project = this.fTypeCard.controls['ListProject'].value;
        if (this.itemTypeCard.Id) {
          for(let i = 0; i < this.lstProject.length; i ++) {
            if (this.itemTypeCard.ListProject.find(s => s.ProjectId == this.lstProject[i].Id) != null) {
              list_project[i] = [this.lstProject[i].Id]
            }
          }
  
          this.fTypeCard.controls['ListProject'].setValue(list_project);
        }
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

  getTypeCardById(id: number) {
    this.typeCardService.getTypeCardById(0, id).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.itemTypeCard = res.data;
        this.fTypeCard.patchValue({
          Name: this.itemTypeCard.Name,
          Description: this.itemTypeCard.Description,
          GroupCard: this.itemTypeCard.GroupCard,
          VehicleId: this.itemTypeCard.VehicleId,
          IsActive: this.itemTypeCard.IsActive
        });

        let list_project = this.fTypeCard.controls['ListProject'].value;

        if (list_project.length!) {
          this.getListProjectByPaging();
        } 
        else {
          for(let i = 0; i < this.lstProject.length; i ++) {
            if (this.itemTypeCard.ListProject.find(s => s.ProjectId == this.lstProject[i].Id) != null) {
              list_project[i] = [this.lstProject[i].Id]
            }
          }
  
          this.fTypeCard.controls['ListProject'].setValue(list_project);
        }
      }
      else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
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
          this.router.navigate(['config-utilities/type-card/list']);
        },
        reject: () => {
            return;
        }
      });
    } else {
      this.router.navigate(['config-utilities/type-card/list']);
    }
  }

  onReturnPage(url: string) : void {
    this.router.navigate([url]);
  }
}
