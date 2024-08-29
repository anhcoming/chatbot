import { Component} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonService } from 'src/app/services/common.service';
import { AppMessageResponse, AppStatusCode, ChangeCardRequestProcessStatus, Gender, IsStatus, RelationshipOption, StatusPayment, StatusReceive, StorageData, TypePayment } from 'src/app/shared/constants/app.constants';
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
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { listYardSettings } from 'src/app/viewModels/yard-config/yard-config';
import { ResidentInformationComponent } from './dialogs/resident-information/resident-information.component';
import { ApartmentService } from 'src/app/services/apartment.service';
import { ResidentCardInformationComponent } from './dialogs/resident-card-information/resident-card-information.component';
import { VehicleCardInformationComponent } from './dialogs/vehicle-card-information/vehicle-card-information.component';
import { CompanyService } from 'src/app/services/company.service';
import { CarCards, ResidentCards, ResidentMoveIns } from 'src/app/viewModels/change-card-request/change-card-request';
import { CardRequestService } from 'src/app/services/card-request.service';
import { CardManagersService } from 'src/app/services/card-managers.service';
import { VehicleService } from 'src/app/services/vehicle.service';
import { CancelChangeComponent } from './dialogs/cancel/cancel.component';
import { ResidentService } from 'src/app/services/resident.service';
import  ObjectId from 'bson-objectid';

@Component({
  selector: 'app-change-information',
  templateUrl: './change-information.component.html',
  styleUrls: ['./change-information.component.scss']
})
export class ChangeInformationComponent {

  public id: any;
  fInfo: any ;
  public Idc: any;
  public userID: any;
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
  public lstResidentCards: Array<ResidentCards>;
  public lstCarCards: Array<CarCards>;
  public Residents: Array<ResidentMoveIns>;
  public ResidentCards: Array<ResidentCards>;
  public CarCards: Array<CarCards>;
  public lstCustomer : any;
  public lstResidentService: any
  public lstCardActive: any;
  public lstInfoChange: any;
  public Resident : Array<ResidentMoveIns>;
  public CardResident : Array<ResidentCards>;
  public CarCard: Array<CarCards>;
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
  public lstCarCard: any;
  public lstRegisterApartment: any;
  public lstVehicle: any[] = [];
  public loading = [false];
  public loadingSelect : boolean = true;
  public isLoading : boolean = true;
  public isCard : boolean = true;
  public isSubmit : boolean = true;
  public Card : boolean = true;
  public ProcessStatus = ChangeCardRequestProcessStatus;
  public relationshipOption = RelationshipOption;
  public Gender = Gender;

  constructor(
    private readonly messageService : MessageService,
    private readonly cardrequestService : CardRequestService,
    private readonly cardmanagerService : CardManagersService,
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
  ) {
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
    this.Resident = [];
    this.CardResident = [];
    this.lstResidentCards = [];
    this.lstCarCards = [];
    this.Residents = [];
    this.ResidentCards = [];
    this.CarCards = [];
    this.CarCard = [];
    this.fInfo = this.fb.group({
      ProjectId: [null, Validators.required],//
      TowerId: [null, Validators.required],//
      FloorId:[null, Validators.required],//
      ApartmentId: [null, Validators.required],//
      Fee: [0],//
      ProcessStatus: [null],//
      DateAppointmentResponse: [null],//
      DateActualResponse: [null],//
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
      messageResponse: this.fb.group({
        userId: [null],
        FullName: [null],
        Message: [null],
        DateResponse: [null],
        isAdmin: true
      }),
    });
    this.fInfo.get('infoApartmentOwner.Phone').disable();

    // Disable editing the 'FullName' field
    this.fInfo.get('infoApartmentOwner.FullName').disable();
  }

  ngOnInit(){
    this.route.paramMap.subscribe(params => {
      this.id =  params.get('id');
    });
    this.getListCardManager();
    this.getListProject();
    this.getListTower();
    this.getListFloor();
    this.getListApartment();
    this.getVehicle();
    this.getCompanyId()
    this.getUserId();
    if(this.id) {
      this.getResidentService()
    }
  }
  getResidentApartment(id: any) {
    this.filterParrams.ApartmentId = id;
    this.cardmanagerService.GetCardRegisterApartment(this.filterParrams).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstInfoChange = res.data;
        this.lstResident = this.lstInfoChange.ResidentMoveIns;
        this.lstResidentCards = this.lstInfoChange.ResidentCards;
        this.lstCarCards = this.lstInfoChange.CarCards;
        this.setItemResident()
      }
    })
  }
  onSetProcessStatus(event: any) {
    const idList = [4, 5];
    if (idList.includes(event.value)) {
      this.isLoading = false;
      this.fInfo.get('ProjectId').disable();
      this.fInfo.get('TowerId').disable();
      this.fInfo.get('FloorId').disable();
      this.fInfo.get('ApartmentId').disable();
      this.fInfo.controls.InfoResidentRegistration.get('FullName').disable();
      this.fInfo.controls.InfoResidentRegistration.get('Phone').disable();
      this.isCard = false;
      this.Card = false;
      
    }else{
      this.Card = true;
      this.isCard = true;
      this.isLoading = true;
      this.fInfo.get('ProjectId').enable();
      this.fInfo.get('TowerId').enable();
      this.fInfo.get('FloorId').enable();
      this.fInfo.get('ApartmentId').enable();
      this.fInfo.controls.InfoResidentRegistration.get('FullName').enable();
      this.fInfo.controls.InfoResidentRegistration.get('Phone').enable();
    }
  }
  getResidentService(){
    this.filterParrams.id = this.id
    this.cardrequestService.getCardRequestId(this.filterParrams).subscribe((res: ResApi) => {
      if(res.meta.error_code = AppStatusCode.StatusCode200) {
        this.lstResidentService = res.data;
        this.Residents = res.data.ResidentMoveIns;
        this.ResidentCards = res.data.ResidentCards;
        this.CarCards= res.data.CarCards;
        this.getResidentApartment(this.lstResidentService.ApartmentId);
        this.MessageResponse = res.data.MessageResponse;
        this.setIdResponse()
      }
    })
  }
  setItemResident() {
    this.lstResident.forEach((items: any) => {
      items.genderName = this.Gender.filter(item => item.Code == items.Gender)[0]?.Name;
    })
    this.lstResident.forEach((items: any) => {
      items.statusOptionName = this.relationshipOption.filter(item => item.value == items.RelationId)[0]?.label;
    })
    this.lstResidentCards.forEach((items: any) => {
      items.statusOptionName = this.relationshipOption.filter(item => item.value == items.RelationId)[0]?.label;
    })
    this.lstResidentCards.forEach((items: any) => {
      items.genderName = this.Gender.filter(item => item.Code == items.Gender)[0]?.Name;
    })
    this.lstCarCards.forEach((items: any) => {
      items.VehicleType = this.lstVehicle.filter(item => item.Id == items.VehicleId)[0]?.Name;
    });
    this.lstResident.map((item: any) => {
      this.Residents.map((items: any) => {
        if(item.ResidentId == items.ResidentId) {
          item.change = true;
        }
      })
    })
    this.lstResidentCards.map((item: any) => {
      this.ResidentCards.map((items: any) => {
        if(item.CardId == items.CardId) {
          item.change = true;
        }
      })
    })
    this.lstCarCards.map((item: any) => {
      this.CarCards.map((items: any) => {
        if(item.CardId == items.CardId) {
          item.change = true;
        }
      })
      
    })
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
    this.ref = this.dialogService.open(ResidentInformationComponent, {
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
      if (data) {
        if(this.Resident.length){
          this.Resident = this.Resident.map((item: any) => {
            if (item.ResidentId == idr) {
              return data;
            } else {
              return item;
            }
          });
        }else{
          this.Resident = [...this.Resident, data]
        }
        this.lstResident =  this.lstResident.map((item: any) => {
          if (item.ResidentId == idr) {
            return data;
          } else {
            return item;
          }
        });
        this.setData()
      }
    })
  }
  setData() {
    this.lstResident.forEach((items: any) => {
      items.statusOptionName = this.relationshipOption.filter(item => item.value === items.RelationId)[0]?.label;
    })
  }
  onOpenConfigDialogCard(id: number, idc: number, item: any) {
    this.ref = this.dialogService.open(ResidentCardInformationComponent, {
      header: !id ?  'Thêm mới thẻ cư dân' : 'Cập nhật thẻ cư dân',
      width: '80%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
      data: {
        Id: id,
        Idc: idc,
        lstResident: this.lstResident,
        ResidentCard: item,
        lstCardManager: this.lstCardManager,
        towerId: this.fInfo.get('TowerId').value,
        apartmentId: this.fInfo.get('ApartmentId').value,
        isLoading: this.isLoading,
        isCard: this.isCard,
      }
    });
  
    this.ref.onClose.subscribe((data: ResidentCards) => {
      if (data) {
        if(this.CardResident.length) {
          this.CardResident = this.CardResident.map((item: any) => {
            if (item.CardId === idc) {
              return data;
            } else {
              return item;
            }
          });
        }else{
          this.CardResident = [...this.CardResident, data]
        }
        this.lstResidentCards = this.lstResidentCards.map((item: any) => {
          if (item.CardId === idc) {
            return data;
          } else {
            return item;
          }
        });
        this.lstResidentCards.forEach((items: any) => {
          items.statusOptionName = this.relationshipOption.filter(item => item.value === items.RelationId)[0]?.label;
        })
        this.lstResidentCards.forEach((items: any) => {
          this.filterActive.ApartmentId = this.fInfo.get('ApartmentId').value;
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
    })
  }
  onOpenConfigDialogCar(id:number, CarId: number, item: any, ){
    this.ref = this.dialogService.open(VehicleCardInformationComponent, {
      header: !id ?  'Đăng ký thẻ xe' : 'Cập nhật thẻ xe',
      width: '80%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
      data: {
        Id: id,
        CarId: CarId,
        lstResidentCards: this.lstResident,
        lstVehicle: this.lstVehicle,
        CarCard: item,
        lstCardManager: this.lstCardManager,
        towerId: this.fInfo.get('TowerId').value,
        apartmentId: this.fInfo.get('ApartmentId').value,
        isLoading: this.isLoading,
        isCard: this.isCard,
      }
    });
  
    this.ref.onClose.subscribe((data: CarCards) => {
      console.log(CarId);
      
      if (data) {
        if(this.CarCard.length){
          this.CarCard = this.CarCard.map((item: any) => {
            if (item.CardId == CarId) {
              return data;
            } else {
              return item;
            }
          });
        }else{
          this.CarCard = [...this.CarCard, data]
        }
        this.lstCarCards = this.lstCarCards.map((item: any) => {
          if (item.CardId == CarId) {
            return data;
          } else {
            return item;
          }
        });
        this.lstCarCards.forEach((items: any) => {
          items.VehicleType = this.lstVehicle.filter(item => item.Id === items.VehicleId)[0]?.Name;
        })
        this.lstCarCards.forEach((items: any) => {
          this.filterActive.ApartmentId = this.fInfo.get('ApartmentId').value;
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
      this.fInfo.get('TowerId').setValue() 
      this.fInfo.get('FloorId').setValue() 
      this.fInfo.get('ApartmentId').setValue() 
      const control = this.fInfo.get('ProjectId');
      if (control.enabled && control.invalid) {
        control.markAsDirty();
      }
      const TowerId = this.fInfo.get('TowerId');
      if (TowerId.enabled && TowerId.invalid) {
        TowerId.markAsDirty();
      }
      const FloorId = this.fInfo.get('FloorId');
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
      this.fInfo.get('FloorId').setValue()
      this.fInfo.get('ApartmentId').setValue()
    }else{
      this.lstFloor = this.Floor.filter((i: any) => i.TowerId == event.Id);
      this.onSetSelectFloor(event)
    }
  }
  onSetSelectFloor(item: any) {
    this.fInfo.get('ProjectId').setValue(item?.ProjectId) 
    const projectControl = this.fInfo.get('ProjectId');
    if (projectControl.enabled && projectControl.invalid) {
      projectControl.markAsDirty();
    }
    if(this.fInfo.controls['ApartmentId'].dirty) {
      const floorControl = this.fInfo.get('FloorId');
      if (floorControl.enabled && floorControl.invalid) {
        floorControl.markAsDirty();
      }
    }
  }
  onSelectApartment(event: any) {
    if(event == null) {
      this.lstFloor = [...this.Floor];
      this.lstApartment = [...this.Apartment];
      this.fInfo.get('ApartmentId').setValue()
    }else{
      this.lstApartment = this.Apartment.filter((i: any) => i.FloorId == event.Id);
      this.onSetSelectApartment(event);
    }
  }
  onSetSelectApartment(item: any) {
    this.fInfo.get('ProjectId').setValue(item?.ProjectId);
    this.fInfo.get('TowerId').setValue(item?.TowerId);
  }
  onSelect(event: any) {
    if(event == null) {
      this.lstTower = [...this.Tower];
      this.lstFloor = [...this.Floor];
      this.lstApartment = [...this.Apartment];
    }else{
      this.lstTower = this.Tower.filter((i: any) => i.ProjectId == event?.ProjectId);
      this.lstFloor = this.Floor.filter((i: any) => i.TowerId == event?.TowerId);
      this.setSelect(event);
      this.getResidentApartment(event?.Id);
    }
  }
  setSelect(item: any) {
    this.fInfo.get('infoApartmentOwner.Phone').setValue('9999999999');
    this.fInfo.get('infoApartmentOwner.FullName').setValue('Quang');
    this.fInfo.get('ProjectId').setValue(item?.ProjectId) 
    this.fInfo.get('TowerId').setValue(item?.TowerId) 
    this.fInfo.get('FloorId').setValue(item?.FloorId) 
    const ProjectControl = this.fInfo.get('ProjectId');
    if (ProjectControl.enabled && ProjectControl.invalid) {
      ProjectControl.markAsDirty();
    }
    const TowerControl = this.fInfo.get('TowerId');
    if (TowerControl.enabled && TowerControl.invalid) {
      TowerControl.markAsDirty();
    }
    const FloorControl = this.fInfo.get('FloorId');
    if (FloorControl.enabled && FloorControl.invalid) {
      FloorControl.markAsDirty();
    }
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
    Object.keys(this.fInfo.controls).forEach(key => {
      const control = this.fInfo.get(key);
      if (control.enabled && control.invalid) {
        control.markAsDirty();
      }
    });
  }
  markAsDirtyInfoResidentRegistration() {
    Object.keys(this.fInfo.controls.InfoResidentRegistration.controls).forEach(key => {
      const control = this.fInfo.controls.InfoResidentRegistration.get(key);
      if (control.enabled && control.invalid) {
        control.markAsDirty();
      }
    });
  }
  markAsDirtyinfoApartmentOwner() {
    Object.keys(this.fInfo.controls.infoApartmentOwner.controls).forEach(key => {
      const control = this.fInfo.controls.infoApartmentOwner.get(key);
      if (control.enabled && control.invalid) {
        control.markAsDirty();
      }
    });
  }
  onSubmit() {
    this.setCodeResponse()
    if(this.fInfo.invalid){
      this.markAllAsDirty();
      this.markAsDirtyInfoResidentRegistration();
      this.markAsDirtyinfoApartmentOwner();
    }
    else{
      const reqData = Object.assign({}, this.fInfo.getRawValue());
      reqData.UserId = this.userID;
      reqData.ZoneId = 51;
      reqData.ProcessStatus = this.processStatus;
      reqData.messageResponse.userId = this.userID;
      if(this.id == null) {
        reqData.residentMoveIns = this.Resident;
        reqData.residentCards = this.CardResident;
        reqData.carCards = this.CarCard;
        this.loading[0] = true;
        this.cardrequestService.ChangeCardRequest(reqData).subscribe(
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
        reqData.residentMoveIns = this.lstResident.filter((item: any) => item.change == true).map((item: any) => {
          const items = this.Residents.find((card: any) => card.CardId === item.CardId);
          if (items) {
            return items;
          }else{
            const objectId = new ObjectId();
            item.Id = objectId.toHexString();
            return item;
          }
        });
        reqData.residentCards = this.lstResidentCards.filter((item: any) => item.change == true).map((item: any) => {
          const items = this.ResidentCards.find((card: any) => card.CardId === item.CardId);
          if (items) {
            return items;
          }else{
            const objectId = new ObjectId();
            item.Id = objectId.toHexString();
            return item;
          }
        });
        reqData.carCards = this.lstCarCards.filter((item: any) => item.change == true).map((item: any) => {
          const items = this.CarCards.find((card: any) => card.CardId === item.CardId);
          if (items) {
            return items;
          }else{
            const objectId = new ObjectId();
            item.Id = objectId.toHexString();
            return item;
          }
        });
        this.loading[0] = true;
        this.cardrequestService.updateChangeCardRequest(this.id, reqData).subscribe(
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
    this.processStatus = this.ProcessStatus.filter((item: any) => item.id == this.fInfo.get('ProcessStatus').value)[0]?.code;
  }
  setIdResponse() {
    this.IdProcessStatus = this.ProcessStatus.filter((item: any) => item.code == this.lstResidentService?.ProcessStatus)[0]?.id;
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
          this.lstResident.map((item: any) =>{
            if( item.Id == id) {
              item.change = false;
            }  
          })
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
          this.lstResidentCards.map((item: any) =>{
            if( item.Id == id) {
              item.change = false;
            }
          })
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
          this.lstCarCards.map((item: any) =>{
            if( item.Id == id) {
              item.change = false;
            }
          })
        },
        reject: () => {
            return;
        }
      });
    } 
  }
  setFormGroup(){
    this.fInfo = this.fb.group({
      TypeCardRequest: [this.lstResidentService.TypeCardRequest],
      ProjectId: [this.lstResidentService.ProjectId],
      TowerId: [this.lstResidentService.TowerId],
      FloorId:[this.lstResidentService.FloorId],
      ApartmentId: [this.lstResidentService.ApartmentId],
      ProcessStatus: [this.IdProcessStatus ? this.IdProcessStatus : ''],
      DateAppointmentResponse: [this.lstResidentService.DateAppointmentResponse ? new Date(this.lstResidentService.DateAppointmentResponse) : ''],
      DateActualResponse: [this.lstResidentService.DateActualResponse ? new Date(this.lstResidentService.DateActualResponse) : ''],
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
      messageResponse: this.fb.group({
        UserId: [this.MessageResponse.UserId ? this.MessageResponse.UserId : ''],
        FullName: [this.MessageResponse.FullName ? this.MessageResponse.FullName : ''],
        Message: [this.MessageResponse.Message ? this.MessageResponse?.Message : ''],
        DateResponse: [this.MessageResponse.DateResponse ? this.MessageResponse?.DateResponse : ''],
        isAdmin: true
      }),
      residentMoveIns: [],
    })
    this.ProcessStatus.forEach((items: any) => {
      if(items.id >= this.fInfo.get('ProcessStatus').value){
        items.disable = false;
      }else{
        items.disable = true
      }
    })
    const idList = [3, 4, 5];
    if (idList.includes(this.fInfo.get('ProcessStatus').value)) {
      this.isLoading = false;
      this.fInfo.get('ProjectId').disable();
      this.fInfo.get('TowerId').disable();
      this.fInfo.get('FloorId').disable();
      this.fInfo.get('ApartmentId').disable();
      this.fInfo.controls.InfoResidentRegistration.get('FullName').disable();
      this.fInfo.controls.InfoResidentRegistration.get('Phone').disable();
      this.isCard = false;
      this.Card = false;
      if(this.fInfo.get('ProcessStatus').value == 3){
        this.fInfo.get('ProcessStatus').disable();
        this.isLoading = false;
        this.isCard = false;
        this.Card = false;
        this.isSubmit = false;
      }
      if (this.fInfo.get('ProcessStatus').value == 4) {
        this.isLoading = false;
        this.fInfo.get('ProjectId').disable();
        this.fInfo.get('TowerId').disable();
        this.fInfo.get('FloorId').disable();
        this.fInfo.get('ApartmentId').disable();
        this.isCard = false;
        this.Card = false;
      }
      if(this.fInfo.get('ProcessStatus').value == 5){
        this.fInfo.get('ProcessStatus').disable();
        this.isSubmit = false;
      }
    }else{
      this.isCard = true;
      this.Card = true;
      this.isLoading = true;
      this.fInfo.get('ProjectId').enable();
      this.fInfo.get('TowerId').enable();
      this.fInfo.get('FloorId').enable();
      this.fInfo.get('ApartmentId').enable();
      this.fInfo.controls.InfoResidentRegistration.get('FullName').enable();
      this.fInfo.controls.InfoResidentRegistration.get('Phone').enable();
    }
  }
  onCancel() {
    this.ref = this.dialogService.open(CancelChangeComponent, {
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
    this.fInfo.get('Fee').setValue(null)
  }
}
