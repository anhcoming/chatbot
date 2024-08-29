import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ResidentMoveInComponent } from '../dialogs/resident-move-in/resident-move-in.component';
import { ResidentCardComponent } from '../dialogs/resident-card/resident-card.component';
import { CarCardComponent } from '../dialogs/car-card/car-card.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProjectService } from 'src/app/services/project.service';
import { Paging } from 'src/app/viewModels/paging';
import { AppMessageResponse, AppStatusCode, CardRequestProcessStatus, Gender, RelationshipOption, StatusPayment, StatusReceive, StorageData, TypePayment } from 'src/app/shared/constants/app.constants';
import { ResApi } from 'src/app/viewModels/res-api';
import { TowerService } from 'src/app/services/tower.service';
import { FloorService } from 'src/app/services/floor.service';
import { ApartmentService } from 'src/app/services/apartment.service';
import { CarCards, ResidentCards, ResidentMoveIns } from 'src/app/viewModels/new-request-card/new-request-card';
import { Subject, debounceTime, distinctUntilChanged, filter, fromEvent, map, switchMap, throttleTime } from 'rxjs';
import { VehicleService } from 'src/app/services/vehicle.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { CardRequestService } from 'src/app/services/card-request.service';
import { CancelComponent } from '../dialogs/cancel/cancel.component';
import { CardManagersService } from 'src/app/services/card-managers.service';
import { ResidentService } from 'src/app/services/resident.service';

@Component({
  selector: 'app-add-resident-service-manager',
  templateUrl: './add-resident-service-manager.component.html',
  styleUrls: ['./add-resident-service-manager.component.scss']
})
export class AddResidentServiceManagerComponent {
  fResidentService : any;
  public Idc: any;
  public userID: any;
  id : any;
  lst: any;
  idr: any;
  idc: any;
  carId: any;
  currentDate  = new Date();
  public filterParrams : Paging;
  public filterTower : Paging;
  public filterFloor : Paging;
  public filterApartment : Paging;
  public filterActive : Paging;
  public lstProject : any;
  public lstTower : any;
  public lstFloor : any;
  public typePayment = TypePayment;
  public statusPayment = StatusPayment;
  public statusReceive = StatusReceive;
  public TypePayment : any;
  public StatusPayment : any;
  public StatusReceive : any;
  public processStatus : any;
  public IdTypePayment : any;
  public IdStatusPayment : any;
  public IdStatusReceive : any;
  public IdProcessStatus : any;
  public lstApartment : any;
  public lstResident: Array<ResidentMoveIns>;
  public lstResidents: Array<ResidentMoveIns>;
  public Resident: Array<ResidentMoveIns>;
  public lstResidentCards: Array<ResidentCards>;
  public lstCarCards: Array<CarCards>;
  public lstCustomer : any;
  public lstResidentService: any
  public lstCardActive: any
  public Project : any;
  public Tower : any;
  public Floor : any;
  public Apartment : any;
  public text : string = '';
  isLoadingTable : boolean = false;
  public lstCardManager : any
  public MessageResponse: any;
  public InfoPayment: any;
  public carCard : any;
  public lstCarCard:any;
  public lstVehicle: any[] = [];
  public loading = [false];
  public loadingSelect : boolean = true;
  public isLoading : boolean = true;
  public isCard : boolean = true;
  public isCancel : boolean = true;
  public Card : boolean = true;
  public ProcessStatus = CardRequestProcessStatus;
  public relationshipOption = RelationshipOption;
  public Gender = Gender;
  constructor(
    private readonly messageService : MessageService,
    private readonly cardrequestService : CardRequestService,
    private readonly cardmanagerService : CardManagersService,
    private readonly residentService : ResidentService,
    private readonly storeService : StorageService,
    private readonly vehicleService : VehicleService,
    private readonly projectService: ProjectService,
    private readonly towerService : TowerService,
    private readonly floorService : FloorService,
    private readonly apartmentService : ApartmentService,
    private readonly route: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService,
    private readonly fb : FormBuilder,
    private ref: DynamicDialogRef,
    public dialogService: DialogService,
  ){
    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 100;
    this.filterTower = new Object as Paging;
    this.filterTower.page = 1;
    this.filterTower.page_size = 10;
    this.filterApartment = new Object as Paging;
    this.filterApartment.page = 1;
    this.filterApartment.page_size = 10;
    this.filterFloor = new Object as Paging;
    this.filterFloor.page = 1;
    this.filterFloor.page_size = 10;
    this.filterActive = new Object as Paging;
    this.filterActive.page = 1;
    this.filterActive.page_size = 1000;
    this.filterActive.groupCard = 1;
    this.lstResident = [];
    this.lstResidents = [];
    this.Resident = [];
    this.lstResidentCards = [];
    this.lstCarCards = [];

    this.fResidentService = this.fb.group({
      CompanyId: this.Idc,
      ProjectId: [null, Validators.required],
      TowerId: [null, Validators.required],
      FloorId:[null, Validators.required],
      ApartmentId: [null, Validators.required],
      StatusResident: [{value: null, disabled: true}],
      Fee: [0],
      ProcessStatus: [null],
      DateAppointmentResponse: [null],
      DateActualResponse: [null],
      Evaluate: [null],
      infoApartmentOwner: this.fb.group({
        ResidentId: [12],
        Phone: ['0975874657', Validators.compose([ Validators.required, Validators.pattern('[0-9\s]*')])],
        FullName: ['Quang', Validators.required],
      }),
      InfoResidentRegistration: this.fb.group({
        ResidentId: [78],
        Phone: [null, Validators.compose([ Validators.required, Validators.pattern('[0-9\s]*')])],
        FullName: [null, Validators.required],
      }),
      infoPayment: this.fb.group({
        TypePayment: new FormControl({value: 2,  disabled: true }),
        Money: null,
        StatusPayment: new FormControl(1),
        StatusReceive: new FormControl(1)
      }),
      messageResponse: this.fb.group({
        userId: [null],
        FullName: [null],
        Message: [null],
        DateResponse: [null],
        isAdmin: true
      }),
      residentMoveIns: [],
    }),
    // Disable editing the 'Phone' field
    this.fResidentService.get('infoApartmentOwner.Phone').disable();

    // Disable editing the 'FullName' field
    this.fResidentService.get('infoApartmentOwner.FullName').disable();

  }
  ngOnInit(){
    this.getListProject();
    this.getListTower();
    this.getListFloor();
    this.getListApartment();
    this.getVehicle();
    this.getCompanyId()
    this.getUserId();
    this.setStatusReceive();
    this.getListCardManager();
    this.route.paramMap.subscribe(params => {
      this.id =  params.get('id');
    });
    if(this.id) {
      this.getResidentService()
    }else{
      const listIdProcessStatus = [1, 2, 3, 4, 5];
      this.ProcessStatus = this.ProcessStatus.filter(item => listIdProcessStatus.includes(item.id));
    }
  }
  onSetProcessStatus(event: any) {
    if(event.value == 4){
      this.fResidentService.get('ProcessStatus').disable();
      this.isLoading = false;
      this.fResidentService.get('ProjectId').disable();
      this.fResidentService.get('TowerId').disable();
      this.fResidentService.get('FloorId').disable();
      this.fResidentService.get('ApartmentId').disable();
      this.fResidentService.get('Fee').disable();
      this.fResidentService.get('DateAppointmentResponse').disable();
      this.fResidentService.get('DateActualResponse').disable();
      this.fResidentService.controls.infoPayment.get('StatusPayment').disable();
      this.fResidentService.controls.InfoResidentRegistration.get('Phone').disable();
      this.fResidentService.controls.InfoResidentRegistration.get('FullName').disable();
      this.fResidentService.controls.messageResponse.get('Message').disable();
      this.isCard = false;
      this.Card = false;
    }
    const idList = [3, 4, 5, 6, 7, 8, 9];
    if (idList.includes(event.value)) {
      this.isLoading = false;
      this.fResidentService.get('ProjectId').disable();
      this.fResidentService.get('TowerId').disable();
      this.fResidentService.get('FloorId').disable();
      this.fResidentService.get('ApartmentId').disable();

      const idList = [7, 8, 9];
      if (idList.includes(event.value)) {
        this.isCard = false;
        const idList = [8, 9];
        if (idList.includes(event.value)) {
          this.Card = false;
        }else{
          this.Card = true;
        }
      }else{
        this.isCard = true;
      }
    }else{
      this.isLoading = true;
      this.fResidentService.get('ProjectId').enable();
      this.fResidentService.get('TowerId').enable();
      this.fResidentService.get('FloorId').enable();
      this.fResidentService.get('ApartmentId').enable();
    }
  }
  getResidentService(){
    this.filterParrams.id = this.id
    this.cardrequestService.getCardRequestId(this.filterParrams).subscribe((res: ResApi) => {
      if(res.meta.error_code = AppStatusCode.StatusCode200) {
        this.lstResidentService = res.data;
        this.lstResident = res.data.ResidentMoveIns;
        this.lstResidents = this.lstResidents.concat(this.lstResident)
        this.lstResident.forEach((items: any) => {
          items.genderName = this.Gender.filter(item => item.Code == items.Gender)[0]?.Name;
        })
        this.lstResident.forEach((items: any) => {
          items.statusOptionName = this.relationshipOption.filter(item => item.value == items.RelationId)[0]?.label;
        })
        this.lstResidentCards = res.data.ResidentCards;
        this.lstResidentCards.forEach((items: any) => {
          items.statusOptionName = this.relationshipOption.filter(item => item.value == items.RelationId)[0]?.label;
        })
        this.lstResidentCards.forEach((items: any) => {
          this.filterActive.ApartmentId = this.lstResidentService.ApartmentId;
          this.filterActive.ResidentId = items.ResidentId;
          this.cardmanagerService.getListCardActiveByPage(this.filterActive).subscribe((res: ResApi) => {
            if(res.meta.error_code = AppStatusCode.StatusCode200) {
              this.lstCardActive = res.data.Results;
              this.lstCardActive.map((item: any) => {
                if(items.ResidentCardIntegratedId == item.Id){
                  items.CardNumber = item.CardNumber;
                }
              })
            }
          })
          this.lstCardManager.map((item: any) => {
            if(items.CardId == item.Id ){
              items.CardNumber = item.CardNumber;
            }
          })
        })
        this.lstResidentCards.forEach((items: any) => {
          items.genderName = this.Gender.filter(item => item.Code == items.Gender)[0]?.Name;
        })
        this.lstCarCards= res.data.CarCards;
        this.lstCarCards.forEach((items: any) => {
          items.VehicleType = this.lstVehicle.filter(item => item.Id == items.VehicleId)[0]?.Name;
        });
        this.lstCarCards.forEach((items: any) => {
          this.filterActive.ApartmentId = this.lstResidentService.ApartmentId;
          this.filterActive.ResidentId = items.ResidentId;
          this.cardmanagerService.getListCardActiveByPage(this.filterActive).subscribe((res: ResApi) => {
            if(res.meta.error_code = AppStatusCode.StatusCode200) {
              this.lstCardActive = res.data.Results;
              this.lstCardActive.map((item: any) => {
                if(items.ResidentCardIntegratedId == item.Id){
                  items.CardNumber = item.CardNumber;
                }
              })
            }
          })
          this.lstCardManager.map((item: any) => {
            if(items.CardId == item.Id ){
              items.CardNumber = item.CardNumber;
            }
          })
        })
        this.MessageResponse = res.data.MessageResponse;
        this.InfoPayment = res.data.InfoPayment;
        this.setIdResponse()
      }
    })
  }
  setStatusReceive(){
    if(this.fResidentService.get('infoPayment.StatusPayment').value !== 2){
      this.fResidentService.get('infoPayment.StatusReceive').disable();
    }else{
      this.fResidentService.get('infoPayment.StatusReceive').enable();
    }
  }
  getListCardManager() {
    this.cardrequestService.getListCardManagerByPaging(this.filterApartment).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstCardManager = res.data.Results;
      }
    })
  }
  getCompanyId() {
    this.Idc = this.storeService.get(StorageData.companyId);
  }
  getUserId() {
    this.userID = this.storeService.get(StorageData.userId);
  }
  getListApartment(){
    this.apartmentService.getListApartmentByPaging(this.filterApartment).subscribe((res: ResApi) => {
      if(res.meta.error_code = AppStatusCode.StatusCode200){
        this.Apartment = res.data;
        this.lstApartment = [...this.Apartment];
      }
    })
  }
  onOpenConfigDialog(id: number, idr: number, lst: any) {
    this.ref = this.dialogService.open(ResidentMoveInComponent, {
      header: !id ?  'Đăng ký cư dân về ở' : 'Cập nhật cư dân về ở',
      width: '80%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
      data: {
        Id: id,
        Idr: idr,
        Lst: lst,
        isLoading: this.isLoading
      }
    });
    this.ref.onClose.subscribe((data: ResidentMoveIns) => {
      if(!idr) {
        if (data) {
          this.lstResidents = [...this.lstResidents, data]
          this.lstResident =  [...this.lstResident, data];
          this.setData()
        }
      }else{
        if (data) {
          this.lstResident = this.lstResident.map((item: any) => {
            if (item.Id == idr) {
              return data;
            } else {
              return item;
            }
          });
          this.lstResidents = this.lstResidents.map((item: any) => {
            if (item.Id == idr) {
              return data;
            } else {
              return item;
            }
          });
          this.setData()
        }
      }
    })
  }
  setData() {
    this.lstResident.forEach((items: any) => {
      items.statusOptionName = this.relationshipOption.filter(item => item.value === items.RelationId)[0]?.label;
    })
  }
  onOpenConfigDialogCard(id: number, idc: number, item: any) {
    this.ref = this.dialogService.open(ResidentCardComponent, {
      header: !id ?  'Thêm mới thẻ cư dân' : 'Cập nhật thẻ cư dân',
      width: '80%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
      data: {
        Id: id,
        Idc: idc,
        lstResident: this.lstResidents,
        ResidentCard: item,
        lstCardManager: this.lstCardManager,
        towerId: this.fResidentService.get('TowerId').value,
        apartmentId: this.fResidentService.get('ApartmentId').value,
        isLoading: this.isLoading,
        isCard: this.isCard,
      }
    });

    this.ref.onClose.subscribe((data: ResidentCards) => {
      if(!idc) {
        if (data) {
          this.lstResidentCards =  [...this.lstResidentCards, data];
          this.lstResidentCards.forEach((items: any) => {
            items.statusOptionName = this.relationshipOption.filter(item => item.value === items.RelationId)[0]?.label;
          })
        }
      }else{
        if (data) {
          this.lstResidentCards = this.lstResidentCards.map((item: any) => {
            if (item.Id === idc) {
              return data;
            } else {
              return item;
            }
          });
          this.lstResidentCards.forEach((items: any) => {
            items.statusOptionName = this.relationshipOption.filter(item => item.value === items.RelationId)[0]?.label;
          })
          this.lstResidentCards.forEach((items: any) => {
            this.filterActive.ApartmentId = this.fResidentService.get('ApartmentId').value;
            this.filterActive.ResidentId = items.ResidentId;
            this.cardmanagerService.getListCardActiveByPage(this.filterActive).subscribe((res: ResApi) => {
              if(res.meta.error_code = AppStatusCode.StatusCode200) {
                this.lstCardActive = res.data.Results;
                this.lstCardActive.map((item: any) => {
                  if(items.ResidentCardIntegratedId == item.Id){
                    items.CardNumber = item.CardNumber;
                  }
                })
              }
            })
            this.lstCardManager.map((item: any) => {
              if(items.CardId == item.Id ){
                items.CardNumber = item.CardNumber;
              }
            })

          })
        }
      }
    })
  }
  onOpenConfigDialogCar(id:number, CarId: number, item: any, ){
    this.ref = this.dialogService.open(CarCardComponent, {
      header: !id ?  'Đăng ký thẻ xe' : 'Cập nhật thẻ xe',
      width: '80%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
      data: {
        Id: id,
        CarId: CarId,
        lstResidentCards: this.lstResidents,
        lstVehicle: this.lstVehicle,
        CarCard: item,
        lstCardManager: this.lstCardManager,
        towerId: this.fResidentService.get('TowerId').value,
        apartmentId: this.fResidentService.get('ApartmentId').value,
        isLoading: this.isLoading,
        isCard: this.isCard,
      }
    });

    this.ref.onClose.subscribe((data: CarCards) => {
      if(!CarId) {
        if (data) {
          this.lstCarCards =  [...this.lstCarCards, data];
          this.lstCarCards.forEach((items: any) => {
            items.VehicleType = this.lstVehicle.filter(item => item.Id === items.VehicleId)[0]?.Name;
          })
        }
      }else{
        if (data) {
          this.lstCarCards = this.lstCarCards.map((item: any) => {
            if (item.Id == `${CarId}`) {
              return data;

            } else {
              return item;
            }
          });
          this.lstCarCards.forEach((items: any) => {
            items.VehicleType = this.lstVehicle.filter(item => item.Id === items.VehicleId)[0]?.Name;
          })
          this.lstCarCards.forEach((items: any) => {
            this.filterActive.ApartmentId = this.fResidentService.get('ApartmentId').value;
            this.filterActive.ResidentId = items.ResidentId;
            this.cardmanagerService.getListCardActiveByPage(this.filterActive).subscribe((res: ResApi) => {
              if(res.meta.error_code = AppStatusCode.StatusCode200) {
                this.lstCardActive = res.data.Results;
                this.lstCardActive.map((item: any) => {
                  if(items.ResidentCardIntegratedId == item.Id){
                    items.CardNumber = item.CardNumber;
                  }
                })
              }
            })
            this.lstCardManager.map((item: any) => {
              if(items.CardId == item.Id ){
                items.CardNumber = item.CardNumber;
              }
            })

          })
        }
      }
    })
  }
  getListProject() {
    this.loadingSelect = true;
    this.projectService.getListByPaging(this.filterParrams).subscribe((res: ResApi) => {
      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.loadingSelect = false;
        this.Project = res.data;
        this.lstProject = [...this.Project]
      }
      else {
        this.loadingSelect = false;
        this.lstProject = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })
  }
  getListTower() {
    this.towerService.getListTowerByPaging(this.filterTower).subscribe((res: ResApi) => {
      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.Tower = res.data;
        this.lstTower = [...this.Tower];
      }
      else {
        this.lstTower = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })
  }
  getListFloor() {
    this.floorService.getListFloorByPaging(this.filterTower).subscribe((res: ResApi) => {
      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.Floor = res.data;
        this.lstFloor = [...this.Floor]
      }
      else {
        this.lstFloor = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })
  }

  onSelectTower(event: any) {
    if(event == null) {
      this.lstTower = [...this.Tower];
      this.lstFloor = [...this.Floor];
      this.lstApartment = [...this.Apartment];
      this.fResidentService.get('TowerId').setValue()
      this.fResidentService.get('FloorId').setValue()
      this.fResidentService.get('ApartmentId').setValue()
      const control = this.fResidentService.get('ProjectId');
      if (control.enabled && control.invalid) {
        control.markAsDirty();
      }
      const TowerId = this.fResidentService.get('TowerId');
      if (TowerId.enabled && TowerId.invalid) {
        TowerId.markAsDirty();
      }
      const FloorId = this.fResidentService.get('FloorId');
      if (FloorId.enabled && FloorId.invalid) {
        FloorId.markAsDirty();
      }
    }else{
      this.lstTower = this.Tower.filter((i: any) => i.ProjectId == event?.Id)
    }
  }
  onSelectFloor(event:any){
    if(event == null) {
      this.lstFloor = [...this.Floor];
      this.lstTower = [...this.Tower];
      this.lstApartment = [...this.Apartment];
      this.fResidentService.get('FloorId').setValue()
      this.fResidentService.get('ApartmentId').setValue()
    }else{
      this.lstFloor = this.Floor.filter((i: any) => i.TowerId == event.Id);
      this.onSetSelectFloor(event)
    }
  }
  onSetSelectFloor(item: any) {
    this.fResidentService.get('ProjectId').setValue(item?.ProjectId)
    const projectControl = this.fResidentService.get('ProjectId');
    if (projectControl.enabled && projectControl.invalid) {
      projectControl.markAsDirty();
    }
    if(this.fResidentService.controls['ApartmentId'].dirty) {
      const floorControl = this.fResidentService.get('FloorId');
      if (floorControl.enabled && floorControl.invalid) {
        floorControl.markAsDirty();
      }
    }
  }
  onSelectApartment(event: any) {
    if(event == null) {
      this.lstFloor = [...this.Floor];
      this.lstApartment = [...this.Apartment];
      this.fResidentService.get('ApartmentId').setValue();
      this.lstResident = [];
    }else{
      this.lstApartment = this.Apartment.filter((i: any) => i.FloorId == event.Id);
      this.onSetSelectApartment(event);
    }
  }
  onSetSelectApartment(item: any) {
    this.fResidentService.get('ProjectId').setValue(item?.ProjectId);
    this.fResidentService.get('TowerId').setValue(item?.TowerId);
  }
  onSelect(event: any) {
    if(event == null) {
      this.lstTower = [...this.Tower];
      this.lstFloor = [...this.Floor];
      this.lstApartment = [...this.Apartment];
    }else{
      this.lstTower = this.Tower.filter((i: any) => i.ProjectId == event?.ProjectId);
      this.lstFloor = this.Floor.filter((i: any) => i.TowerId == event?.TowerId);
      this.setSelect(event)
      this.getResidentApartment(event?.Id)
    }
  }
  setSelect(item: any) {
    this.fResidentService.get('infoApartmentOwner.Phone').setValue('9999999999');
    this.fResidentService.get('infoApartmentOwner.FullName').setValue('Quang');
    this.fResidentService.get('ProjectId').setValue(item?.ProjectId)
    this.fResidentService.get('TowerId').setValue(item?.TowerId)
    this.fResidentService.get('FloorId').setValue(item?.FloorId)
    const ProjectControl = this.fResidentService.get('ProjectId');
    if (ProjectControl.enabled && ProjectControl.invalid) {
      ProjectControl.markAsDirty();
    }
    const TowerControl = this.fResidentService.get('TowerId');
    if (TowerControl.enabled && TowerControl.invalid) {
      TowerControl.markAsDirty();
    }
    const FloorControl = this.fResidentService.get('FloorId');
    if (FloorControl.enabled && FloorControl.invalid) {
      FloorControl.markAsDirty();
    }
  }
  getResidentApartment(id: any) {
    this.residentService.GetRegisterApartmentCard(id).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstResidents = res.data;
      }
    })
  }
  onBack(event: Event) {
    let isShow = true;//this.layoutService.getIsShow();

    if (isShow) {
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: !(this.id > 0 ) ?  "Chưa hoàn tất thêm mới đăng ký thẻ,Bạn có muốn quay lại?" : "Chưa hoàn tất sửa đăng ký thẻ,Bạn có muốn quay lại?",
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Xác nhận',
        rejectLabel: 'Hủy bỏ',
        acceptButtonStyleClass: 'p-button-success',
        rejectButtonStyleClass: 'p-button-danger',
        accept: () => {
          this.router.navigate(['/utilities/registration/list']);
        },
        reject: () => {
            return;
        }
      });
    } else {
      this.router.navigate(['/utilities/registration/list']);
    }
  }
  markAllAsDirty() {
    Object.keys(this.fResidentService.controls).forEach(key => {
      const control = this.fResidentService.get(key);
      if (control.enabled && control.invalid) {
        control.markAsDirty();
      }
    });
  }
  markAsDirtyInfoResidentRegistration() {
    Object.keys(this.fResidentService.controls.InfoResidentRegistration.controls).forEach(key => {
      const control = this.fResidentService.controls.InfoResidentRegistration.get(key);
      if (control.enabled && control.invalid) {
        control.markAsDirty();
      }
    });
  }
  markAsDirtyinfoApartmentOwner() {
    Object.keys(this.fResidentService.controls.infoApartmentOwner.controls).forEach(key => {
      const control = this.fResidentService.controls.infoApartmentOwner.get(key);
      if (control.enabled && control.invalid) {
        control.markAsDirty();
      }
    });
  }
  onSubmit() {
    this.setCodeResponse()
    if(this.fResidentService.invalid){
      this.markAllAsDirty();
      this.markAsDirtyInfoResidentRegistration();
      this.markAsDirtyinfoApartmentOwner();
    }
    else{
      const reqData = Object.assign({}, this.fResidentService.getRawValue());
      reqData.UserId = this.userID;
      reqData.ZoneId = 51;
      reqData.ProcessStatus = this.processStatus;
      reqData.residentMoveIns = this.lstResident;
      reqData.residentCards = this.lstResidentCards;
      reqData.carCards = this.lstCarCards;
      // reqData.residentMoveIns = this.lstResident.map(({ ResidentId, ...item }) => item);
      // reqData.residentCards = this.lstResidentCards.map(({ ResidentId, ...item }) => item);
      // reqData.carCards = this.lstCarCards.map(({ ResidentId, ...item }) => item);
      reqData.infoPayment.Money = this.fResidentService.get('Fee').value;
      reqData.messageResponse.userId = this.userID;
      reqData.infoPayment.TypePayment = this.TypePayment;
      reqData.infoPayment.StatusPayment = this.StatusPayment;
      reqData.infoPayment.StatusReceive = this.StatusReceive;
      if(this.id == null) {
        this.loading[0] = true;
        this.cardrequestService.CardRequest(reqData).subscribe(
          (res: any) => {
            this.loading[0] = false;
            if (res?.meta?.error_code == AppStatusCode.StatusCode200) {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.CreatedSuccess });

              setTimeout(() => {this.onReturnPage('/utilities/registration/list')}, 1000);
            }
            else {
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
        this.loading[0] = true;
        this.cardrequestService.updateCardRequest(this.id, reqData).subscribe(
          (res: any) => {
            this.loading[0] = false;
            if (res?.meta?.error_code == AppStatusCode.StatusCode200) {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.CreatedSuccess });

              setTimeout(() => {this.onReturnPage('/utilities/registration/list')}, 1000);
            }
            else {
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
      }
    }
  }
  setCodeResponse() {
    this.processStatus = this.ProcessStatus.filter((item: any) => item.id == this.fResidentService.get('ProcessStatus').value)[0]?.code;
    this.TypePayment = this.typePayment.filter((item: any) => item.Id == this.fResidentService.controls['infoPayment'].get('TypePayment').value)[0]?.Code;
    this.StatusPayment = this.statusPayment.filter((item: any) => item.Id == this.fResidentService.controls['infoPayment'].get('StatusPayment').value)[0]?.Code;
    this.StatusReceive =  this.statusReceive.filter((item: any) => item.Id == this.fResidentService.controls['infoPayment'].get('StatusReceive').value)[0]?.Code;
  }
  setIdResponse() {
    this.IdProcessStatus = this.ProcessStatus.filter((item: any) => item.code == this.lstResidentService?.ProcessStatus)[0]?.id;
    this.IdTypePayment = this.typePayment.filter((item: any) => item.Code == this.lstResidentService.InfoPayment?.TypePayment)[0]?.Id;
    this.IdStatusPayment = this.statusPayment.filter((item: any) => item.Code == this.lstResidentService.InfoPayment?.StatusPayment)[0]?.Id;
    this.IdStatusReceive =  this.statusReceive.filter((item: any) => item.Code == this.lstResidentService.InfoPayment?.StatusReceive)[0]?.Id;
    this.setFormGroup();
  }
  onReturnPage(url: string) : void {
    this.router.navigate([url]);
  }
  fetchMoreTower() {
    this.filterTower.page ++;

    this.towerService.getListTowerByPaging(this.filterTower).subscribe((res: ResApi) => {
      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.Tower = [...this.Tower.concat(res.data)];
        this.lstTower = [...this.Tower];
      }
      else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })
  }
  fetchMoreFloor() {

    this.filterFloor.page ++;
    this.floorService.getListFloorByPaging(this.filterFloor).subscribe((res: ResApi) => {
      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.Floor = [...this.Floor.concat(res.data)];
        this.lstFloor = [...this.Floor];
      }
      else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })
  }
  fetchMore() {
    this.filterApartment.page ++;

    this.loadingSelect = true;
    this.apartmentService.getListApartmentByPaging(this.filterApartment).subscribe((res: ResApi) => {
      this.loadingSelect = false;
      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.Apartment = [...this.Apartment.concat(res.data)];
        this.lstApartment = [...this.Apartment];
      }
      else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })
  }
  getVehicle() {
    this.vehicleService.getVehicleActive().subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstVehicle = res.data;
      }
    })
  }
  onDeleteResidentMoveIn(id: any) {
    let isShow = true;//this.layoutService.getIsShow();
    if (isShow) {
      this.confirmationService.confirm({
        message: `Bạn có muốn xóa bản đăng ký cư dân về ở của cư dân "<b>`+ this.lstResident.filter(item => item.Id == id)[0].FullName +`"</b>?`,
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Xác nhận',
        rejectLabel: 'Hủy bỏ',
        acceptButtonStyleClass: 'p-button-success',
        rejectButtonStyleClass: 'p-button-danger',
        accept: () => {
          this.lstResident = this.lstResident.filter(item => item.Id !== id)
        },
        reject: () => {
            return;
        }
      });
    }
  }
  onDeleteResidentCard(id: any) {
    let isShow = true;//this.layoutService.getIsShow();

    if (isShow) {
      this.confirmationService.confirm({
        message: `Bạn có muốn xóa bản đăng ký cấp mới thẻ cư dân có mã số thẻ "<b>`+ this.lstResidentCards.filter(item => item.Id == id)[0].ResidentId +`"</b>?`,
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Xác nhận',
        rejectLabel: 'Hủy bỏ',
        acceptButtonStyleClass: 'p-button-success',
        rejectButtonStyleClass: 'p-button-danger',
        accept: () => {
          this.lstResidentCards = this.lstResidentCards.filter(item => item.Id !== id)
        },
        reject: () => {
            return;
        }
      });
    }
  }
  onDeleteCarCard(id: any) {
    let isShow = true;//this.layoutService.getIsShow();

    if (isShow) {
      this.confirmationService.confirm({
        message: `Bạn có muốn xóa bản đăng ký cấp mới thẻ xe có mã số thẻ: "<b>`+ this.lstCarCards.filter(item => item.Id == id)[0].ResidentId +`"</b>?`,
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Xác nhận',
        rejectLabel: 'Hủy bỏ',
        acceptButtonStyleClass: 'p-button-success',
        rejectButtonStyleClass: 'p-button-danger',
        accept: () => {
          this.lstCarCards = this.lstCarCards.filter((item: any) => item.Id !== id)
        },
        reject: () => {
            return;
        }
      });
    }
  }
  setFormGroup(){
    this.fResidentService = this.fb.group({
      CompanyId: this.Idc,
      TypeCardRequest: [this.lstResidentService.TypeCardRequest],
      ProjectId: [this.lstResidentService.ProjectId],
      TowerId: [this.lstResidentService.TowerId],
      FloorId:[this.lstResidentService.FloorId],
      ApartmentId: [this.lstResidentService.ApartmentId],
      StatusResident: [{value: null, disabled: true}],
      Fee: [this.lstResidentService.Fee ? this.lstResidentService.Fee : ''],
      ProcessStatus: [this.IdProcessStatus ? this.IdProcessStatus : ''],
      DateAppointmentResponse: [this.lstResidentService.DateAppointmentResponse ? new Date(this.lstResidentService.DateAppointmentResponse) : ''],
      DateActualResponse: [this.lstResidentService.DateActualResponse ? new Date(this.lstResidentService.DateActualResponse) : ''],
      Evaluate: [this.lstResidentService.Evaluate ? this.lstResidentService.Evaluate : ''],
      infoApartmentOwner: this.fb.group({
        ResidentId: [{value: this.lstResidentService.InfoApartmentOwner.ResidentId ? this.lstResidentService.InfoApartmentOwner?.ResidentId : '', disabled: true}] ,
        Phone: [{value: this.lstResidentService.InfoApartmentOwner.Phone ? this.lstResidentService.InfoApartmentOwner?.Phone : '', disabled: true}] ,
        FullName: [{value: this.lstResidentService.InfoApartmentOwner.FullName ? this.lstResidentService.InfoApartmentOwner?.FullName : '', disabled: true}] ,
      }),
      InfoResidentRegistration: this.fb.group({
        ResidentId: [12] ,
        Phone: [this.lstResidentService?.InfoResidentRegistration?.Phone ? this.lstResidentService?.InfoResidentRegistration?.Phone : '', Validators.pattern('[0-9\s]*')],
        FullName: [this.lstResidentService?.InfoResidentRegistration?.FullName ? this.lstResidentService?.InfoResidentRegistration?.FullName : ''] ,
      }),
      infoPayment: this.fb.group({
        TypePayment: [{value: this.IdTypePayment ? this.IdTypePayment : '', disabled: true}],
        Money: [this.InfoPayment?.Money ? this.InfoPayment?.Money : ''],
        StatusPayment: [this.IdStatusPayment ? this.IdStatusPayment : ''],
        StatusReceive: [{value: this.IdStatusReceive ? this.IdStatusReceive : '', disabled: true}],
      }),
      messageResponse: this.fb.group({
        UserId: [this.MessageResponse.UserId ? this.MessageResponse.UserId : ''],
        FullName: [this.MessageResponse.FullName ? this.MessageResponse.FullName : ''],
        Message: [this.MessageResponse.Message ? this.MessageResponse?.Message : ''],
        DateResponse: [this.MessageResponse.DateResponse ? this.MessageResponse?.DateResponse : ''],
        isAdmin: true
      }),
      residentMoveIns: [],
    })
    const itemProcessStatus = this.ProcessStatus.filter(item => item.id === 5);
    const listIdProcessStatus = [1, 2, 3, 4, ];
    if(listIdProcessStatus.includes(this.fResidentService.get('ProcessStatus').value)){
      this.ProcessStatus = this.ProcessStatus.filter(item => listIdProcessStatus.includes(item.id));
      this.ProcessStatus = this.ProcessStatus.concat(itemProcessStatus);
      this.ProcessStatus.forEach((items: any) => {
        if(items.id >= this.fResidentService.get('ProcessStatus').value){
          items.disable = false;
        }else{
          items.disable = true
        }
      })
    }else{
      this.ProcessStatus = this.ProcessStatus.filter(item => !listIdProcessStatus.includes(item.id));
      this.ProcessStatus.forEach((items: any) => {
        if(items.id >= this.fResidentService.get('ProcessStatus').value){
          items.disable = false;
        }else{
          items.disable = true
        }
      })
    }
    if(this.fResidentService.get('ProcessStatus').value == 4){
      this.fResidentService.get('ProcessStatus').disable();
      this.isLoading = false;
      this.fResidentService.get('ProjectId').disable();
      this.fResidentService.get('TowerId').disable();
      this.fResidentService.get('FloorId').disable();
      this.fResidentService.get('ApartmentId').disable();
      this.fResidentService.controls.infoPayment.get('StatusPayment').disable();
      this.isCard = false;
      this.Card = false;
    }
    const idList = [3, 4, 5, 6, 7, 8, 9];
    if (idList.includes(this.fResidentService.get('ProcessStatus').value)) {
      this.isLoading = false;
      this.fResidentService.get('ProjectId').disable();
      this.fResidentService.get('TowerId').disable();
      this.fResidentService.get('FloorId').disable();
      this.fResidentService.get('ApartmentId').disable();

      const idListCancel = [4, 7, 8, 9];
      if (idListCancel.includes(this.fResidentService.get('ProcessStatus').value)) {
        this.isCancel = false;
        const idList = [7, 8, 9];
        if (idList.includes(this.fResidentService.get('ProcessStatus').value)) {
          this.fResidentService.controls.infoPayment.get('StatusPayment').disable();
          this.isCard = false;
          this.Card = false;
          if(this.fResidentService.get('ProcessStatus').value == 9){
            this.fResidentService.get('ProcessStatus').disable();
            this.fResidentService.get('DateActualResponse').disable();
            this.fResidentService.get('DateAppointmentResponse').disable();
          }
        }else{
          this.isCard = true;
          this.Card = true;
        }
      }
    }else{
      this.isLoading = true;
      this.fResidentService.get('ProjectId').enable();
      this.fResidentService.get('TowerId').enable();
      this.fResidentService.get('FloorId').enable();
      this.fResidentService.get('ApartmentId').enable();
    }

  }
  onCancel() {
    this.ref = this.dialogService.open(CancelComponent, {
      header: 'Hủy đơn đăng ký',
      width: '30%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
      data: {
      }
    });
    this.ref.onClose.subscribe()
  }
  onFee(event: any) {
    this.fResidentService.get('Fee').setValue(null)
  }
}
