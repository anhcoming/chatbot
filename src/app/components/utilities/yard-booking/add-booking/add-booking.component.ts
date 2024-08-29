import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProjectService } from 'src/app/services/project.service';
import { Paging } from 'src/app/viewModels/paging';
import { AppMessageResponse, AppStatusCode, CardRequestProcessStatus, Gender, RelationshipOption, StatusBooking, StatusPayment, StatusReceive, StorageData, TypePayment } from 'src/app/shared/constants/app.constants';
import { ResApi } from 'src/app/viewModels/res-api';
import { TowerService } from 'src/app/services/tower.service';
import { FloorService } from 'src/app/services/floor.service';
import { ApartmentService } from 'src/app/services/apartment.service';
import { CarCards, ResidentCards, ResidentMoveIns } from 'src/app/viewModels/new-request-card/new-request-card';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ResidentService } from 'src/app/services/resident.service';
import { ConfigBookingService } from 'src/app/services/config-booking.service';
import { OrderYardService } from 'src/app/services/order-yard.service';
import { AddPayComponent } from '../dialogs/add-pay/add-pay.component';
import { CancelRegistrationComponent } from '../dialogs/cancel-registration/cancel-registration.component';
import { CancellationLogComponent } from '../dialogs/cancellation-log/cancellation-log.component';


@Component({
  selector: 'app-add-booking',
  templateUrl: './add-booking.component.html',
  styleUrls: ['./add-booking.component.scss']
})
export class AddBookingComponent {
  fBooking : any;
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
  public ConfigYard: any[] = [];
  public lstConfigYard: any[] = [];
  public listConfigYard: any[] = [];
  public listYardTypeSettings: any[] = [];
  public YardSettings: any[] = [];
  public loading = [false];
  public loadingSelect : boolean = true;
  public isLoading : boolean = true;
  public isCard : boolean = true;
  public Card : boolean = true;
  public ProcessStatus = CardRequestProcessStatus;
  public relationshipOption = RelationshipOption;
  public statusBooking = StatusBooking;
  public Gender = Gender;
  public TimeStart: any;
  public TimeEnd: any;
  public lstPay: any;
  public isDeposit: boolean = false;
  public TotalPrice: any;
  public NoTimeStart: any;
  public NoTimeEnd: any;
  public TotalPay: any;
  public isPayDeposit: any;
  public isPayYard: any;
  public isPayFee: any;
  public typeYard: any;
  public lstPrice: any;
  public formattedPrice: any;
  public PayPrice: any;
  public DepositName: any;
  public YardName: any;
  public FeeName: any;
  public code: any;
  public hourStart: any;
  public hourEnd: any;
  public OrderYard: any;
  public DepositId: any;
  public disable: boolean = false;
  public disableEvaluate: boolean = false;
  constructor(
    private readonly messageService : MessageService,
    private readonly residentService : ResidentService,
    private readonly bookingService : ConfigBookingService,
    private readonly orderYardService : OrderYardService,
    private readonly storeService : StorageService,
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
    this.Resident = [];
    this.lstResidentCards = [];
    this.lstCarCards = [];
    this.listYardTypeSettings = [];

    this.fBooking = this.fb.group({
      CompanyId: this.Idc,
      Code: null,
      ProjectId: [null, Validators.required],
      TownId: [null, Validators.required],
      FloorId:[null, Validators.required],
      ApartmentId: [null, Validators.required],
      YardSettingId: [null, Validators.required],
      YardTypeId: [{value: null, disabled: true}],
      PricePay: [null, Validators.required],
      PriceDeposit: [null, Validators.required],
      PriceFee: [null, Validators.required],
      DateStart: [undefined, Validators.required],
      NotePolicy: [undefined],
      ResidentId: [12],
      Phone: ['0975874657', Validators.compose([ Validators.required, Validators.pattern('[0-9\s]*')])],
      ResidentName: ['Quang', Validators.required],        
      RegisterId: [78],
      RegisterPhone: [null, Validators.compose([ Validators.required, Validators.pattern('[0-9\s]*')])],
      RegisterName: [null, Validators.required],
      Note: [null],
      isConfirm: [null],
      OrderStatus: [null, Validators.required],
      DateDeposit: [null],
      DepositStatus: [null],
      NoteConfirm: [null],
      PaymentType: [null],
      PaymentStatus: [null],
      PricePayment: [null],
      TotalPrice: [null],
    }),
    // Disable editing the 'Phone' field
    this.fBooking.get('Phone').disable();
    this.fBooking.get('Code').disable();
    this.fBooking.get('PriceDeposit').disable();
    this.fBooking.get('PricePay').disable();
    this.fBooking.get('PriceFee').disable();

    // Disable editing the 'FullName' field
    this.fBooking.get('ResidentName').disable();
    this.TotalPrice = 0;
    this.formattedPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(this.TotalPrice);
  }
  ngOnInit(){
    this.getListProject();
    this.getListTower();
    this.getListFloor();
    this.getListApartment();
    this.getCompanyId()
    this.getUserId();
    this.getListYard();
    this.route.paramMap.subscribe(params => {
      this.id =  params.get('id');
    });
    if(!this.id) {
      this.getOrderYardCode();
      const listIdProcessStatus = [1, 2, 3, 4, 5];
      this.ProcessStatus = this.ProcessStatus.filter(item => listIdProcessStatus.includes(item.id));
    }
  }
  getOrderYardById(id: any) {
    this.orderYardService.getOrderYardById(this.Idc, id).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.OrderYard = res.data;
        res.data.TotalPrice = this.TotalPrice;
        this.getConfigYard(this.OrderYard.ProjectId);
      } else{
        this.OrderYard = [];
      }
    })
  }
  getListYard() {
    this.isLoadingTable = true;
    this.bookingService.getListConfigBookingByPaging(this.filterParrams).subscribe((res: ResApi) => {
      this.isLoadingTable = false;
      if(res.meta.error_code = AppStatusCode.StatusCode200) {
        this.ConfigYard = res.data;
        if(this.id) {
          if(this.ConfigYard) {
            this.getOrderYardById(this.id);
          }
        }
      }
    })
  }
  getOrderYardCode() {
    this.bookingService.getOrderYardCode(this.Idc).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.fBooking.get('Code').setValue(res.data);
      }
    })
  }
  onSetOrderStatus(event: any) {
    if(event.value == 4){
      this.fBooking.get('OrderStatus').disable();
      this.isLoading = false;
      this.fBooking.get('ProjectId').disable();
      this.fBooking.get('TownId').disable();
      this.fBooking.get('FloorId').disable();
      this.fBooking.get('ApartmentId').disable();
      this.isCard = false;
      this.Card = false;
    }
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
      this.lstConfigYard = []
      this.lstTower = [...this.Tower];
      this.lstFloor = [...this.Floor];
      this.lstApartment = [...this.Apartment];
      this.fBooking.get('TownId').setValue() 
      this.fBooking.get('FloorId').setValue() 
      this.fBooking.get('ApartmentId').setValue() 
      const control = this.fBooking.get('ProjectId');
      if (control.enabled && control.invalid) {
        control.markAsDirty();
      }
      const TownId = this.fBooking.get('TownId');
      if (TownId.enabled && TownId.invalid) {
        TownId.markAsDirty();
      }
      const FloorId = this.fBooking.get('FloorId');
      if (FloorId.enabled && FloorId.invalid) {
        FloorId.markAsDirty();
      }
    }else{
      this.lstTower = this.Tower.filter((i: any) => i.ProjectId == event.Id)
      this.getConfigYard(event?.Id);
    }
  }
  onSelectFloor(event:any){
    if(event == null) {
      this.lstConfigYard = [];
      this.lstFloor = [...this.Floor];
      this.lstTower = [...this.Tower];
      this.lstApartment = [...this.Apartment];
      this.fBooking.get('FloorId').setValue()
      this.fBooking.get('ApartmentId').setValue()
    }else{
      this.lstFloor = this.Floor.filter((i: any) => i.TowerId == event.Id);
      this.getConfigYard(event?.ProjectId);
      this.onSetSelectFloor(event)
    }
  }
  onSetSelectFloor(item: any) {
    this.fBooking.get('ProjectId').setValue(item?.ProjectId) 
    const projectControl = this.fBooking.get('ProjectId');
    if (projectControl.enabled && projectControl.invalid) {
      projectControl.markAsDirty();
    }
    if(this.fBooking.controls['ApartmentId'].dirty) {
      const floorControl = this.fBooking.get('FloorId');
      if (floorControl.enabled && floorControl.invalid) {
        floorControl.markAsDirty();
      }
    }
  }
  onSelectApartment(event: any) {
    if(event == null) {
      this.lstConfigYard = [];
      this.lstFloor = [...this.Floor];
      this.lstApartment = [...this.Apartment];
      this.fBooking.get('ApartmentId').setValue();
      this.lstResident = [];
    }else{
      this.lstApartment = this.Apartment.filter((i: any) => i.FloorId == event.Id);
      this.getConfigYard(event?.ProjectId);
      this.onSetSelectApartment(event);
    }
  }
  onSetSelectApartment(item: any) {
    this.fBooking.get('ProjectId').setValue(item?.ProjectId);
    this.fBooking.get('TownId').setValue(item?.TowerId);
  }
  onSelect(event: any) {
    if(event == null) {
      this.lstConfigYard = [];
      this.lstTower = [...this.Tower];
      this.lstFloor = [...this.Floor];
      this.lstApartment = [...this.Apartment];
    }else{
      this.lstTower = this.Tower.filter((i: any) => i.ProjectId == event?.ProjectId);
      this.lstFloor = this.Floor.filter((i: any) => i.TowerId == event?.TowerId);
      this.getConfigYard(event.ProjectId);
      this.setSelect(event)
      this.getResidentApartment(event?.Id)
    }
  }
  setSelect(item: any) {
    this.fBooking.get('Phone').setValue('9999999999');
    this.fBooking.get('ResidentName').setValue('Quang');
    this.fBooking.get('ProjectId').setValue(item?.ProjectId) 
    this.fBooking.get('TownId').setValue(item?.TowerId) 
    this.fBooking.get('FloorId').setValue(item?.FloorId) 
    const ProjectControl = this.fBooking.get('ProjectId');
    if (ProjectControl.enabled && ProjectControl.invalid) {
      ProjectControl.markAsDirty();
    }
    const TowerControl = this.fBooking.get('TownId');
    if (TowerControl.enabled && TowerControl.invalid) {
      TowerControl.markAsDirty();
    }
    const FloorControl = this.fBooking.get('FloorId');
    if (FloorControl.enabled && FloorControl.invalid) {
      FloorControl.markAsDirty();
    }
  }
  onYardConfig(event: any) {
    this.TimeStart = undefined;
    this.TimeEnd = undefined;
    this.TotalPrice = 0;
    this.PayPrice = 0;
    this.fBooking.get('PriceDeposit').setValue();
    this.fBooking.get('PricePay').setValue();
    this.fBooking.get('PriceFee').setValue();
    this.formattedPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(this.TotalPrice);
    if(event.value == null) {
      this.listYardTypeSettings = [];
    }else{
      this.listYardTypeSettings = this.listConfigYard.filter(item => item.ConfigYardId == event.value)[0].listYardTypeSettings;
      this.YardSettings = this.listConfigYard.filter(item => item.ConfigYardId == event.value);
      this.typeYard = this.YardSettings[0].Type;
    }
    // TotalPrice
  }
  YardConfig(event: any) {
    this.TimeStart = undefined;
    this.TimeEnd = undefined;
    this.TotalPrice = 0;
    this.PayPrice = 0;
    this.fBooking.get('PriceDeposit').setValue();
    this.fBooking.get('PricePay').setValue();
    this.fBooking.get('PriceFee').setValue();
    this.formattedPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(this.TotalPrice);
    if(event == null) {
      this.listYardTypeSettings = [];
    }else{
      this.listYardTypeSettings = this.listConfigYard.filter(item => item.ConfigYardId == event)[0].listYardTypeSettings;
      this.YardSettings = this.listConfigYard.filter(item => item.ConfigYardId == event);
      this.typeYard = this.YardSettings[0].Type;
      this.setFormGroup();
    }
    // TotalPrice
  }
  getConfigYard(event: any){
    this.lstConfigYard = [];
    this.listConfigYard = [];
    this.lstConfigYard = this.ConfigYard.filter(item => item.ProjectId == event);
    this.lstConfigYard.map((item: any) => {
        item.listYardSettings.map((items: any)=> {
          this.listConfigYard.push({
            Id: item.Id,
            Name: items.Name,
            ConfigYardId: items.Id,
            listYardTypeSettings: items.listYardTypeSettings,
            Address : items.Address,
            BookEditing : items.BookEditing,
            ConfigBookingId : items.ConfigBookingId,
            ContentDeposit: items.ContentDeposit,
            ContentFee: items.ContentFee,
            DateEnd: items.DateEnd ? items.DateEnd : null,
            DateStart: items.DateStart ? items.DateStart : null,
            Image: items.Image,
            IsDeposit: items.IsDeposit,
            IsFee: items.IsFee,
            IsPayDeposit: items.IsPayDeposit,
            IsPayFee: items.IsPayFee,
            IsPayYard: items.IsPayYard,
            NoteDeposit: items.NoteDeposit,
            NoteFee: items.NoteFee,
            PriceDeposit: items.PriceDeposit,
            PriceFee: items.PriceFee,
            Regulations: items.Regulations,
            Status: items.Status,
            Type: items.Type,
            TypePay: items.TypePay,
            TotalPrice : items.TotalPrice,
          })
          if(this.listConfigYard.length == item.listYardSettings.length) {
            if(this.id){
              this.YardConfig(this.OrderYard.YardSettingId);
            }
          }
        }
      )
    })
  }
  onPrice(event: any) {
    if(event.value == null){
      this.lstPrice = [];
    }else{
      this.TotalPrice = 0;
      this.DepositName = undefined;
      this.YardName = undefined;
      this.FeeName = undefined;
      
      this.lstPrice = this.listYardTypeSettings.filter((item: any) => item.Id == event.value);
      
      this.TimeStart = this.lstPrice[0].TimeStart;
      this.TimeEnd = this.lstPrice[0].TimeEnd;
      this.NoTimeStart = this.lstPrice[0].NoTimeStart;
      this.NoTimeEnd = this.lstPrice[0].NoTimeEnd;
      this.hourStart = this.NoTimeStart;
      this.hourEnd = this.NoTimeEnd;

      this.fBooking.get('PriceDeposit').setValue(this.YardSettings[0].PriceDeposit)
      this.fBooking.get('PricePay').setValue(this.lstPrice[0].Price)
      this.fBooking.get('PriceFee').setValue(this.YardSettings[0].PriceFee)
      if(this.YardSettings[0].IsPayDeposit == true){
        this.TotalPrice = this.TotalPrice + this.YardSettings[0].PriceDeposit;
        this.DepositName = "Tiền cọc";
      }
      if(this.YardSettings[0].IsPayYard == true){
        this.TotalPrice = this.TotalPrice + this.lstPrice[0].Price;
        this.YardName = "Tiền sân";
      }
      if(this.YardSettings[0].IsPayFee == true){
        this.TotalPrice = this.TotalPrice + this.YardSettings[0].PriceFee;
        this.FeeName = "Tiền phụ phí";
      }
      if(this.TotalPrice !== 0){
        this.fBooking.get('TotalPrice').setValue(this.TotalPrice)
      }
      this.formattedPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(this.TotalPrice);
    }
    
  }
  getResidentApartment(id: any) {
    this.residentService.GetRegisterApartment(id).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.Resident = res.data;
        this.Resident = this.Resident.concat(this.lstResident);
      }
    })
  }
  onBack(event: Event) {
    let isShow = true;//this.layoutService.getIsShow();
    if (isShow) {
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: !this.id ?  "Chưa hoàn tất thêm mới đăng ký đặt sân, Bạn có muốn quay lại?" : "Chưa hoàn tất sửa đăng ký đặt sân, Bạn có muốn quay lại?",
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Xác nhận',
        rejectLabel: 'Hủy bỏ',
        acceptButtonStyleClass: 'p-button-success',
        rejectButtonStyleClass: 'p-button-danger',
        accept: () => {
          this.router.navigate(['/utilities/yard-booking/list']);
        },
        reject: () => {
            return;
        }
      });
    } else {
      this.router.navigate(['/utilities/yard-booking/list']);
    }
  }
  markAllAsDirty() {
    Object.keys(this.fBooking.controls).forEach(key => {
      const control = this.fBooking.get(key);
      if (control.enabled && control.invalid) {
        control.markAsDirty();
      }
    });
  }
  onSubmit() {
    if(this.fBooking.invalid){
      this.markAllAsDirty();
    }
    else{
      const reqData = Object.assign({}, this.fBooking.getRawValue());
      reqData.CompanyId = this.Idc;
      reqData.HourStartStr = this.TimeStart;
      reqData.HourEndStr = this.TimeEnd;

      reqData.HourStart = this.hourStart;
      reqData.HourEnd = this.hourEnd;
      reqData.isConfirm = this.isDeposit;
      reqData.YardTypeId = this.typeYard;
      reqData.ApartmentName = this.lstApartment.filter((item: any) => item.Id == this.fBooking.get('ApartmentId').value)[0].Name;
      
      if(this.id == null) {
        reqData.CreatedById = this.userID;
        this.loading[0] = true;
        this.orderYardService.createOrderYard(reqData).subscribe(
          (res: any) => {
            this.loading[0] = false;
            if (res?.meta?.error_code == AppStatusCode.StatusCode200) {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.CreatedSuccess });
              
              setTimeout(() => {this.onReturnPage('/utilities/yard-booking/list')}, 1000);
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
        reqData.UpdatedById = this.userID;
        this.loading[0] = true;
        this.orderYardService.updateOrderYard(this.id, reqData).subscribe(
          (res: any) => {
            this.loading[0] = false;
            if (res?.meta?.error_code == AppStatusCode.StatusCode200) {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.CreatedSuccess });
              
              setTimeout(() => {this.onReturnPage('/utilities/yard-booking/list')}, 1000);
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
    this.fBooking = this.fb.group({
      Id: this.id,
      CompanyId: this.OrderYard.CompanyId,
      Code: this.OrderYard.Code,
      ProjectId: [this.OrderYard.ProjectId , Validators.required],
      TownId: [this.OrderYard.TownId , Validators.required],
      FloorId:[this.OrderYard.FloorId , Validators.required],
      ApartmentId: [this.OrderYard.ApartmentId , Validators.required],
      YardSettingId: [this.OrderYard.YardSettingId , Validators.required],
      YardTypeId: [{value: this.OrderYard.YardTypeId, disabled: true}],
      PricePay: [this.OrderYard.PricePay],
      PriceDeposit: [this.OrderYard.PriceDeposit],
      PriceFee: [this.OrderYard.PriceFee],
      DateStart: [this.OrderYard.DateStart ? new Date(this.OrderYard.DateStart) : undefined , Validators.required],
      NotePolicy: [this.OrderYard.NotePolicy,],
      ResidentId: [this.OrderYard.ResidentId],
      Phone: [this.OrderYard.Phone, Validators.compose([ Validators.required, Validators.pattern('[0-9\s]*')])],
      ResidentName: [this.OrderYard.ResidentName,],        
      RegisterId: [this.OrderYard.RegisterPhone],
      RegisterPhone: [this.OrderYard.RegisterPhone, Validators.compose([ Validators.required, Validators.pattern('[0-9\s]*')])],
      RegisterName: [this.OrderYard.RegisterName],
      Note: [this.OrderYard.Note],
      isConfirm: [this.OrderYard.isConfirm],
      OrderStatus: [this.OrderYard.OrderStatus , Validators.required],
      DateDeposit: [this.OrderYard.DateDeposit],
      DepositStatus: [this.OrderYard.DepositStatus],
      NoteConfirm: [this.OrderYard.NoteConfirm],
      PaymentType: [this.OrderYard.PaymentType],
      PaymentStatus: [this.OrderYard.PaymentStatus],
      PricePayment: [this.OrderYard.PricePayment],
      TotalPrice: this.OrderYard.TotalPrice,
    }),
    
    // Disable editing the 'Phone' field
    this.fBooking.get('Phone').disable();
    this.fBooking.get('Code').disable();
    this.fBooking.get('PriceDeposit').disable();
    this.fBooking.get('PricePay').disable();
    this.fBooking.get('PriceFee').disable();

    this.TimeStart = this.OrderYard.HourStartStr;
    this.TimeEnd = this.OrderYard.HourEndStr;
    this.TotalPrice = this.OrderYard.TotalPrice;
    this.isDeposit = this.OrderYard.isConfirm;

    if( ( Number(this.OrderYard.HourStart)/10 )% 2 === 0 ) {
      this.NoTimeStart = ( Number(this.OrderYard.HourStart));
    } else{
      this.NoTimeStart = Number(this.OrderYard.HourStart) - 20;
    }
    if( ( Number(this.OrderYard.HourEnd)/10 ) % 2 === 0 ) {
      this.NoTimeEnd = Number(this.OrderYard.HourEnd);
    } else{
      this.NoTimeEnd = Number(this.OrderYard.HourEnd) -20 ;
    }
    this.listYardTypeSettings.map((item: any) => {
      if(item.TimeStart == this.OrderYard.HourStartStr && item.TimeEnd == this.OrderYard.HourEndStr ) {
        this.DepositId = item.Id;
        this.fBooking.get('PricePay').setValue(item.Price)
        this.fBooking.get('PriceFee').setValue(this.YardSettings[0].PriceFee)
      }
    })
    
    // Disable editing the 'FullName' field
    this.fBooking.get('ResidentName').disable();
    this.formattedPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(this.TotalPrice);
    const listIdProcessStatus = [ 1, 2, 3, 4, 5, 6 ];
    if(listIdProcessStatus.includes(this.fBooking.get('OrderStatus').value)){
      this.statusBooking.forEach((items: any) => {
        if(items.Id >= this.fBooking.get('OrderStatus').value){
          items.disable = false;
        }else{
          items.disable = true
        }
      })
      const ProcessStatusDisable = [ 3, 4, 5, 6 ];
      if( ProcessStatusDisable.includes(this.fBooking.get('OrderStatus').value) ) {
        
        this.fBooking.get('ProjectId').disable();
        this.fBooking.get('TownId').disable();
        this.fBooking.get('FloorId').disable();
        this.fBooking.get('ApartmentId').disable();
        this.fBooking.get('RegisterName').disable();
        this.fBooking.get('RegisterPhone').disable();
        this.fBooking.get('DateStart').disable();
        this.fBooking.get('YardSettingId').disable();
        this.fBooking.get('Note').disable();
        this.fBooking.get('NoteConfirm').disable();
        this.fBooking.get('NotePolicy').disable();
        this.disable = true;
        const ProcessDisable = [ 5, 6 ];
        if( ProcessDisable.includes(this.fBooking.get('OrderStatus').value) ) {
          this.fBooking.get('OrderStatus').disable();
          this.disableEvaluate = true;
        }
      }
    }
    this.setPriceYard();
  }
  onTimeStartChange(time: any) {
    const [hour, minute] = time.split(':');
    const firstChar = hour.charAt(0);
    const parsedHour = parseInt(hour);
    const parsedMinute = parseInt(minute);
    let isCompleteHour = false; // Biến kiểm tra giờ đã nhập đủ hay chưa
    let isCompleteMinute = false; // Biến kiểm tra phút đã nhập đủ hay chưa
    let paddedHour = hour;

    if (parsedHour > 23 ) {
      paddedHour = '00';
    } 
    if (firstChar > '2') {
      paddedHour = `0${hour.charAt(0)}`;
      hour == paddedHour
      isCompleteHour = true;
      isCompleteMinute = true;
    }else{ 
      if (hour == `${parsedHour}_`) {
        isCompleteHour = false; // Đánh dấu giờ đã nhập đủ
      }else{
        isCompleteHour = true
      }
      if (minute == `_0`) {
        isCompleteMinute = false; // Đánh dấu giờ đã nhập đủ
      }else{
        isCompleteMinute = true
      }
    }
    if(isCompleteHour) {
      if(isCompleteMinute) {
        const listMinute = [10, 20, 30, 40, 50, 60, 70, 80, 90];
        const updatedMinutes = listMinute.includes(parsedMinute) ? '30' : '00';
        if(`${paddedHour}:${updatedMinutes}` > this.TimeEnd && this.TimeEnd !== '') {
          this.TimeStart = this.TimeEnd;
          this.NoTimeStart = this.NoTimeEnd;
        }else{ 
          this.TimeStart = undefined;
          
          if( this.typeYard == 1 ) {
            this.TimeStart = undefined;
            if( `${paddedHour}:${updatedMinutes}` <  this.listYardTypeSettings[0].TimeStart ){
              this.TimeStart = `${this.listYardTypeSettings[0].TimeStart}`;
              this.NoTimeStart = this.listYardTypeSettings[0].NoTimeStart - 20;
            } else{
              this.TimeStart = `${paddedHour}:${updatedMinutes}`;
              this.NoTimeStart = `${paddedHour}${updatedMinutes}`;
            }
          } else{
            this.TimeStart = `${paddedHour}:${updatedMinutes}`;
            this.NoTimeStart = `${paddedHour}${updatedMinutes}`;
          }
        }
        this.setPriceYard();
      }
    }
  }
  onTimeEndChange(time: any) {
    const [hour, minute] = time.split(':');
    const firstChar = hour.charAt(0);
    const parsedHour = parseInt(hour);
    const parsedMinute = parseInt(minute);
    let isCompleteHour = false; // Biến kiểm tra giờ đã nhập đủ hay chưa
    let isCompleteMinute = false; // Biến kiểm tra phút đã nhập đủ hay chưa
    let paddedHour = hour;
    let paddedMinute = minute;

    if (firstChar > '2') {
      paddedHour = `0${hour.charAt(0)}`;
      isCompleteHour = true;
      isCompleteMinute = true;
    }else{ 
      if (paddedHour == `${parsedHour}_`) {
        isCompleteHour = false; // Đánh dấu giờ đã nhập đủ
      }else{
        isCompleteHour = true
      }
      if (paddedMinute == `_0`) {
        isCompleteMinute = false; // Đánh dấu phút đã nhập đủ
      }else{
        isCompleteMinute = true
      }
    }
    if (parsedHour > 23 ) {
      paddedHour = '00';
    }
    if(isCompleteHour) {
      if(isCompleteMinute) {
        const listMinute = [10, 20, 30, 40, 50, 60, 70, 80, 90];
        const updatedMinutes = listMinute.includes(parsedMinute) ? '30' : '00';
        if(this.TimeStart > `${paddedHour}:${updatedMinutes}` && this.TimeStart !== '') {
          this.TimeEnd = this.TimeStart;
          this.NoTimeEnd = this.NoTimeStart;
        }else{
          if( this.typeYard == 1 ) {
            if( `${paddedHour}:${updatedMinutes}` <  this.listYardTypeSettings[0].TimeStart ){
              this.TimeEnd = `${this.listYardTypeSettings[0].TimeStart}`;
              this.NoTimeEnd = this.listYardTypeSettings[0].NoTimeStart - 20;
            } else {
              this.TimeEnd = `${paddedHour}:${updatedMinutes}`;
              this.NoTimeEnd = `${paddedHour}${updatedMinutes}`;
            } 
          } else {
            this.TimeEnd = `${paddedHour}:${updatedMinutes}`;
            this.NoTimeEnd = `${paddedHour}${updatedMinutes}`;
          } 
        }
        this.setPriceYard();
      }
    }
  }
  setPriceYard() {
    if(this.typeYard == 1) {
      if(this.NoTimeStart) {
        if(this.NoTimeEnd){
          this.lstPrice = this.listYardTypeSettings;
          this.TotalPrice = 0;
          this.PayPrice = 0;
          this.DepositName = undefined;
          this.YardName = undefined;
          this.FeeName = undefined;
          let HourStart = null;
          let HourEnd = null;
  
          if( ( Number(this.NoTimeStart)/10 )% 2 === 0 ) {
            HourStart = ( Number(this.NoTimeStart));
          } else{
            HourStart = Number(this.NoTimeStart) + 20 ;
          }
          if( ( Number(this.NoTimeEnd)/10 ) % 2 === 0 ) {
            HourEnd = Number(this.NoTimeEnd);
          } else{
            HourEnd = Number(this.NoTimeEnd) + 20;
          }

          this.hourStart = HourStart;
          this.hourEnd = HourEnd;
          
          this.PayPrice = ( HourEnd - HourStart )*this.lstPrice[0].Price/100;

          this.fBooking.get('PriceDeposit').setValue(this.YardSettings[0].PriceDeposit)
          this.fBooking.get('PricePay').setValue(this.PayPrice)
          this.fBooking.get('PriceFee').setValue(this.YardSettings[0].PriceFee)
          
          if(this.YardSettings[0].IsPayDeposit == true){
            this.TotalPrice = this.TotalPrice + this.YardSettings[0].PriceDeposit;
            this.DepositName = "Tiền cọc";
          }
          if(this.YardSettings[0].IsPayYard == true){
            this.TotalPrice = this.TotalPrice + this.lstPrice[0].Price;
            this.YardName = "Tiền sân";
          }
          if(this.YardSettings[0].IsPayFee == true){
            this.TotalPrice = this.TotalPrice + this.YardSettings[0].PriceFee;
            this.FeeName = "Tiền phụ phí";
          }
          if(this.TotalPrice !== 0){
            this.fBooking.get('TotalPrice').setValue(this.TotalPrice)
          }
          this.formattedPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(this.TotalPrice);
        }
      }
    }
    if(this.typeYard == 3) {
      if(this.NoTimeStart) {
        if(this.NoTimeEnd){
          this.lstPrice = this.listYardTypeSettings;
          this.TotalPrice = 0;
          this.PayPrice = 0;
          this.DepositName = undefined;
          this.YardName = undefined;
          this.FeeName = undefined;
          let HourStart = null;
          let HourEnd = null;
  
          if( ( Number(this.NoTimeStart)/10 )% 2 === 0 ) {
            HourStart = ( Number(this.NoTimeStart));
          } else{
            HourStart = Number(this.NoTimeStart) + 20 ;
          }
          if( ( Number(this.NoTimeEnd)/10 ) % 2 === 0 ) {
            HourEnd = Number(this.NoTimeEnd);
          } else{
            HourEnd = Number(this.NoTimeEnd) + 20;
          }

          this.hourStart = HourStart;
          this.hourEnd = HourEnd;
          
          this.lstPrice.map((item: any) => {
            if (this.PayPrice === 0) {
              
              if (item.NoTimeEnd > 0 && item.NoTimeStart >= 0 && item.NoTimeStart <= (this.hourEnd - this.hourStart) / 100 && (this.hourEnd - this.hourStart) / 100 <= item.NoTimeEnd) {
                this.PayPrice = (this.hourEnd - this.hourStart) * item.Price / 100;
                return this.PayPrice;
              } else if (item.NoTimeEnd <= 0) {
                this.PayPrice = (this.hourEnd - this.hourStart) * item.Price / 100;
                return this.PayPrice;
              }
            }
          });

          this.fBooking.get('PriceDeposit').setValue(this.YardSettings[0].PriceDeposit)
          this.fBooking.get('PriceFee').setValue(this.YardSettings[0].PriceFee)
  
          this.fBooking.get('PricePay').setValue(this.PayPrice)
          if(this.YardSettings[0].IsPayDeposit == true){
            this.TotalPrice = this.TotalPrice + this.YardSettings[0].PriceDeposit;
            this.DepositName = "Tiền cọc";
          }
          if(this.YardSettings[0].IsPayYard == true){
            this.TotalPrice = this.TotalPrice + this.PayPrice;
            this.YardName = "Tiền sân";
          }
          if(this.YardSettings[0].IsPayFee == true){
            this.TotalPrice = this.TotalPrice + this.YardSettings[0].PriceFee;
            this.FeeName = "Tiền phụ phí";
          }
          if(this.TotalPrice !== 0){
            this.fBooking.get('TotalPrice').setValue(this.TotalPrice)
          }
          this.formattedPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(this.TotalPrice);
        }
      }
    }
  }
  onPayPrice() {
    this.ref = this.dialogService.open(AddPayComponent, {
      header: 'Thêm mới thông tin thanh toán' ,
      width: '80%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
      data: {
        totalPrice: this.TotalPrice,
        isLoading: this.isLoading
      }
    });
    this.ref.onClose.subscribe((data: any) => {})
  }
  onCancelRegistration() {
    this.ref = this.dialogService.open(CancelRegistrationComponent, {
      header: 'Hủy đơn đăng ký' ,
      width: '80%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
      data: {
        id: this.id,
      }
    });
    this.ref.onClose.subscribe((data: any) => {})
  }
  onCancellationLog() {
    this.ref = this.dialogService.open(CancellationLogComponent, {
      header: 'Nhật ký hủy đơn' ,
      width: '80%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
      data: {
        id: this.id,
      }
    });
    this.ref.onClose.subscribe((data: any) => {})
  }
  onCancel() {
    
  }
}

