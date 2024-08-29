import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { CardService } from 'src/app/services/card.service';
import { ConfigCardService } from 'src/app/services/config-card.service';
import { ProjectService } from 'src/app/services/project.service';
import { TypeCardService } from 'src/app/services/type-card.service';
import { GroupCard, StatusActive, GroupCardEnum, AppStatusCode, AppMessageResponse, CardStatus } from 'src/app/shared/constants/app.constants';
import { StorageService } from 'src/app/shared/services/storage.service';
import { Card } from 'src/app/viewModels/card/card';
import { ConfigCard } from 'src/app/viewModels/config-card/config-card';
import { Paging } from 'src/app/viewModels/paging';
import { Project } from 'src/app/viewModels/project/project';
import { ResApi } from 'src/app/viewModels/res-api';
import { TypeCard } from 'src/app/viewModels/type-card/type-card';
import { Vehicle } from 'src/app/viewModels/vehicle/vehicle';

@Component({
  selector: 'app-add-card-empty',
  templateUrl: './add-card-empty.component.html',
  styleUrls: ['./add-card-empty.component.scss']
})
export class AddCardEmptyComponent {
  public fCard: FormGroup;
  public itemCard: Card;
  public lstProject: Array<Project>;
  public lstVehicle: Array<Vehicle>;
  public lstStatus = CardStatus;
  public lstConfigCard: Array<ConfigCard>;
  public filterParrams : Paging;
  public isLoadingTable: boolean = false;
  public loading = [false];
  public cardGroupEnum = GroupCardEnum;

  constructor(
    private readonly projectService: ProjectService,
    private readonly configCardService: ConfigCardService,
    private readonly cardService: CardService,
    private readonly messageService: MessageService,
    private readonly storeService: StorageService,
    private readonly confirmationService: ConfirmationService,
    private readonly fb: FormBuilder,
    private route: ActivatedRoute, 
    private router: Router
  ) {
    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 100;
    this.filterParrams.select = 'Id, Name';

    this.lstVehicle = new Array<Vehicle>();
    this.itemCard = new Card();
    this.lstProject = new Array<Project>();
    this.lstConfigCard = new Array<ConfigCard>();

    this.initForm();
  }

  ngOnInit() {
    this.getListProjectByPaging();

    this.route.paramMap.subscribe(params => {
      const id =  params.get('id');
      
      if(id) {
        this.itemCard.Id = id;
        this.getCardById(this.itemCard.Id);
      }
    });
  }

  initForm() {
    this.fCard = this.fb.group({
      projectId: ['' , Validators.required],
      configCardId: ['', Validators.required],
      cardNumber: ['' , Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(100)])],
      cardSeri: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(100)])],
      cardNote: ['' ],
      cardStatus: ['EMPTY' ],
      userName: ['' ]
    })
  }

  onSubmit() {
    console.log(this.fCard.value)
    if (this.fCard.invalid) {
      return;
    }

    let reqData = Object.assign({}, this.fCard.value);

    this.loading[0] = true;

    if (!this.itemCard.Id) {
      this.cardService.createCard(reqData).subscribe((res: ResApi) => {
        this.loading[0] = false;
        if(res.meta.error_code == AppStatusCode.StatusCode200) {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.CreatedSuccess });

          setTimeout(() => {this.onReturnPage('/utilities/card/list')}, 500);
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
      this.cardService.updateCardById(this.itemCard.Id, reqData).subscribe((res: ResApi) => {
        this.loading[0] = false;
        if(res.meta.error_code == AppStatusCode.StatusCode200) {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.UpdatedSuccess });

          setTimeout(() => {this.onReturnPage('/utilities/card/list')}, 500);
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

  getListProjectByPaging() {
    this.projectService.getListByPaging(this.filterParrams).subscribe((res: ResApi) => {
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

  getListConfigCardByProjectId(event: any) {
    this.lstConfigCard = [];

    if (event?.value) {
      this.configCardService.getListConfigCardByProjectId(event?.value || 0).subscribe((res: ResApi) => {
        if(res.meta.error_code == AppStatusCode.StatusCode200) {
          this.lstConfigCard = res.data;
        }
        else {
          this.lstConfigCard = new Array<ConfigCard>();
          this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
        }
      },
      () => {
        this.lstConfigCard = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest });
      })
    }
  }

  getListConfigCardByProjectId2(projectId: number, cfCardId: number) {
    this.lstConfigCard = [];

    if (projectId) {
      this.configCardService.getListConfigCardByProjectId(projectId).subscribe((res: ResApi) => {
        if(res.meta.error_code == AppStatusCode.StatusCode200) {
          this.lstConfigCard = res.data;

          this.fCard.controls['configCardId'].setValue(cfCardId);
        }
        else {
          this.lstConfigCard = new Array<ConfigCard>();
          this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
        }
      },
      () => {
        this.lstConfigCard = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest });
      })
    }
  }

  getCardById(id: string) {
    this.cardService.getCardById(0, id).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.itemCard = res.data;

        this.getListConfigCardByProjectId2(this.itemCard.ProjectId, this.itemCard.ConfigCardId);

        this.fCard.patchValue({
          projectId: this.itemCard.ProjectId,
          configCardId: this.itemCard.ConfigCardId,
          cardNumber: this.itemCard.CardNumber,
          cardSeri: this.itemCard.CardSeri,
          cardNote: this.itemCard.CardNote,
          cardStatus: this.itemCard.CardStatus
        });
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
        message: "Chưa hoàn tất thêm mới thẻ trống, Bạn có muốn quay lại?",
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.router.navigate(['utilities/card/list']);
        },
        reject: () => {
            return;
        }
      });
    } else {
      this.router.navigate(['utilities/card/list']);
    }
  }

  onReturnPage(url: string) : void {
    this.router.navigate([url]);
  }
}
