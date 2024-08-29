import { Component, EventEmitter, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApartmentService } from 'src/app/services/apartment.service';
import { TowerService } from 'src/app/services/tower.service';
import { Apartment } from 'src/app/viewModels/apartment/apartment';
import { Floor } from 'src/app/viewModels/floor/floor';
import { DbTower } from 'src/app/viewModels/tower/db-tower';
import { CancelTransferGoodComponent } from '../cancel-order-transport/cancel-transfer-good.component';
import { PaymentTransferComponent } from '../payment-transfer/payment-transfer.component';
import { AppMessageResponse, AppStatusCode, OrderStatus, StorageData, TypeTransfer } from 'src/app/shared/constants/app.constants';
import { Paging } from 'src/app/viewModels/paging';
import { ResApi } from 'src/app/viewModels/res-api';
import { CompanyService } from 'src/app/services/company.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ListAttactmentBqls, ListAttactmentCds, ListAttactments, ListOrderProducts} from 'src/app/viewModels/order-transport/order-transport';
import { HttpClient } from '@angular/common/http';
import { OrderTransportService } from 'src/app/services/order-transport.service';
import { OrderCancelService } from 'src/app/services/order-cancel.service';
import { OrderCancel } from 'src/app/viewModels/order-cancel/order-cancel';
import { ResidentService } from 'src/app/services/resident.service';
import { ChatHistoryComponent } from '../chat-history/chat-history.component';
import { RatingModule } from 'primeng/rating';

@Component({
  selector: 'app-add-transfer-good',
  templateUrl: './add-transfer-good.component.html',
  styleUrls: ['./add-transfer-good.component.scss']
})
export class AddTransferGoodComponent {
  fTransfer : any;
  id : any;
  public filterCancel : Paging;
  public dataOrderTransport : any;
  public lstTypeTransport : any[] = [];
  public lstOrderStatus = OrderStatus;
  lstTower !: Array<DbTower>;
  lstApartment !: Array<Apartment>;
  lstRegister : any;
  public Resident : any;
  public currentDate = new Date();
  lstFloor !: Array<Floor>;
  lstCancel : Array<OrderCancel>;
  lstReview : any;
  projectid :any;
  floorid :any;
  residentid :any; 
  apartmentname: any;
  registername : any;
  public Star : number = 0;
  public isInputDisabled : boolean = false;
  public CancelDate = new Date();
  public ReviewDate = new Date();
  public NoteCancel : string = '';
  public NoteReview : string = '';
  public loading = [false];
  lstOrderProducts : any[] = [];
  public listOrderProducts: any;
  lstPayment: any[];
  public filterTower : Paging;
  public filterApartment : Paging;
  public OrderStatus : number = 0;
  public isLoadingTable: boolean = false;
  public listAttactments : any[] = []
  public listAttactmentCds : Array<ListAttactmentCds>
  public listAttactmentBqls : Array<ListAttactmentBqls>
  Idc: any;
  userId: any;
  idapartment: any;

  constructor(
    private readonly residentService : ResidentService,
    private readonly cancelService : OrderCancelService,
    private readonly orderTransferService : OrderTransportService,
    private readonly http : HttpClient,
    private readonly companyService: CompanyService,
    private readonly storeService : StorageService,
    public ref: DynamicDialogRef,
    public dialogService : DialogService,
    private readonly apartmentService: ApartmentService,
    private readonly towerService: TowerService,
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService,
    private readonly route: ActivatedRoute,
    private router: Router,
    private readonly fb: FormBuilder,
  ){
    this.filterCancel = new Object as Paging;
    this.filterApartment = new Object as Paging;
    this.filterTower = new Object as Paging;
    this.lstPayment = [];
    this.lstCancel = new Array<OrderCancel>();
    this.listAttactments = [];
    this.listAttactmentCds = new Array<ListAttactmentCds>();
    this.listAttactmentBqls = new Array<ListAttactmentBqls>();
    this.listOrderProducts = new Array<ListOrderProducts>();
   
    this.fTransfer = this.fb.group({
      TownId: [null, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(150)])],
      ApartmentId: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(150)])],
      Id: [0],
      CreatedById: Number(this.userId),
      UpdatedById: Number(this.userId),
      CompanyId: Number(this.Idc),
      UserSecurity : [null],
      Code: [this.generateRandomString(5)],
      RegisterName: [''],
      RegisterPhone: ['',Validators.compose([Validators.required,Validators.minLength(10),Validators.maxLength(12),Validators.pattern('^[0-9]{10,12}$')])],
      TimeStart: ['',Validators.required],
      TimeEnd: ['',Validators.required],
      ProjectId : [null],
      FloorId : [null], 
      ResidentId: [null],
      RegisterId: ['',Validators.required],
      ApartmentName : [''],
      IsConfirm : [''],
      DateTransportRead: ['',Validators.compose([Validators.required,Validators.minLength(1)])],
      PriceDebit  : ['',Validators.compose([Validators.required,Validators.minLength(1)])],
      Note: [''],
      PricePay : [null],
      NoteConfirm : [''],
      PaymentStatus: [null],
      Phone : ['',Validators.compose([Validators.required,Validators.minLength(10),Validators.maxLength(12),Validators.pattern('^[0-9]{10,12}$')])],
      NoteSecurity: [''],
      ResidentName: ['',Validators.compose([Validators.required,Validators.minLength(6),Validators.maxLength(150)])],
      DateTransport: ['',Validators.compose([Validators.required,Validators.minLength(1)])],
      listOrderProducts: this.fb.array([]),
      listOrderNotes: this.fb.array([]),
      listAttactmentCds: [],
      listAttactmentBqls: [],
      CreatedAt: this.currentDate,
      UpdatedAt: this.currentDate,
      Type: [1,Validators.compose([Validators.required,Validators.minLength(1)])],
      TypeLadder: [1,Validators.compose([Validators.required,Validators.minLength(1)])],
      Vehicle: [''],
      LicensePlates: ['',Validators.compose([Validators.required,Validators.minLength(6),Validators.maxLength(12)])],
      Status: [1],
      OrderStatus: [1,Validators.compose([Validators.required,Validators.minLength(1)])],
    });
    
   
  }


  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
    });

    
    this.getCompanyId();
    this.getUserId();
    console.log(this.id);
    if(this.id){
      this.getOrderTransportById(this.Idc,this.id);
      // this.getCancelById(this.Idc,this.id,1)
    }  
    
     
    this.setData();
    this.getListTower();
    this.getListApartment();

    this.fTransfer = this.fb.group({
      TownId: [null, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(150)])],
      ApartmentId: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(150)])],
      Id: [0],
      CreatedById: Number(this.userId),
      UpdatedById: Number(this.userId),
      CompanyId: Number(this.Idc),
      UserSecurity : [null],
      Code: [this.generateRandomString(5)],
      RegisterName: [''],
      RegisterPhone: ['',Validators.compose([Validators.required,Validators.minLength(10),Validators.maxLength(12),Validators.pattern('^[0-9]{10,12}$')])],
      TimeStart: ['',Validators.required],
      TimeEnd: ['',Validators.required],
      ProjectId : [null],
      FloorId : [null], 
      ResidentId: [null],
      RegisterId: ['',Validators.required],
      ApartmentName : [''],
      IsConfirm : [''],
      DateTransportRead: ['',Validators.compose([Validators.required,Validators.minLength(1)])],
      PriceDebit  : ['',Validators.compose([Validators.required,Validators.minLength(1)])],
      Note: [''],
      PricePay : [null],
      NoteConfirm : [''],
      PaymentStatus: [null],
      Phone : ['',Validators.compose([Validators.required,Validators.minLength(10),Validators.maxLength(12),Validators.pattern('^[0-9]{10,12}$')])],
      NoteSecurity: [''],
      ResidentName: ['',Validators.compose([Validators.required,Validators.minLength(6),Validators.maxLength(150)])],
      DateTransport: ['',Validators.compose([Validators.required,Validators.minLength(1)])],
      listOrderProducts: this.fb.array([]),
      listOrderNotes: this.fb.array([]),
      listAttactmentCds: [],
      listAttactmentBqls: [],
      CreatedAt: this.currentDate,
      UpdatedAt: this.currentDate,
      Type: [1,Validators.compose([Validators.required,Validators.minLength(1)])],
      TypeLadder: [1,Validators.compose([Validators.required,Validators.minLength(1)])],
      Vehicle: [''],
      LicensePlates: ['',Validators.compose([Validators.required,Validators.minLength(6),Validators.maxLength(12)])],
      Status: [1],
      OrderStatus: [1,Validators.compose([Validators.required,Validators.minLength(1)])],
    });
    this.fTransfer.get('OrderStatus').disable();
  }


  selectStatus(event : any){
    if(event.value == 4 || event.value == 3 || event.value == 6){
      this. disableInput();
      this.fTransfer.get('PriceDebit').disable();
      this.fTransfer.get('NoteConfirm').disable();
      this.fTransfer.get('NoteSecurity').disable();
      this.fTransfer.get('ApartmentId').disable();
      this.fTransfer.get('TownId').disable();
      this.fTransfer.get('Type').disable();
      this.fTransfer.get('TypeLadder').disable();
      this.fTransfer.get('LicensePlates').disable();
      this.fTransfer.get('DateTransport').disable();
      this.fTransfer.get('DateTransportRead').disable();
      this.fTransfer.get('TimeStart').disable();
      this.fTransfer.get('TimeEnd').disable();
      this.fTransfer.get('RegisterId').disable();
      this.fTransfer.get('RegisterPhone').disable();
  
    } else{
      this.enableInput();
      this.fTransfer.get('OrderStatus').enable();
      this.fTransfer.get('PriceDebit').enable();
      this.fTransfer.get('NoteConfirm').enable();
      this.fTransfer.get('NoteSecurity').enable();
      this.fTransfer.get('ApartmentId').enable();
      this.fTransfer.get('TownId').enable();
      this.fTransfer.get('Type').enable();
      this.fTransfer.get('TypeLadder').enable();
      this.fTransfer.get('LicensePlates').enable();
      this.fTransfer.get('DateTransport').enable();
      this.fTransfer.get('DateTransportRead').enable();
      this.fTransfer.get('TimeStart').enable();
      this.fTransfer.get('TimeEnd').enable();
      this.fTransfer.get('RegisterId').enable();
      this.fTransfer.get('RegisterPhone').enable();
    }
  }

  disableInput() {
    this.isInputDisabled = true;
}

  enableInput() {
    this.isInputDisabled = false;
}


  onReceiverData(e: any) {
    this.listOrderProducts = [...e];
    console.log(this.listOrderProducts);
    
  }

 

  getUserId() {
    this.userId = this.storeService.get(StorageData.userId); 
  }
  getCompanyId() {
    this.Idc = this.storeService.get(StorageData.companyId); 
  }

  markAllAsDirty() {
    Object.keys(this.fTransfer.controls).forEach(key => {
      const control = this.fTransfer.get(key);
      if (control.enabled && control.invalid) {
        control.markAsDirty();
      }
    });
  }

  getListTower() {  
    this.towerService.getListTowerByPaging(this.filterTower).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstTower = res.data;
      }
      else {
        this.lstTower = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })  
  }
  getListApartment() {
    this.apartmentService.getListApartmentByPaging(this.filterApartment).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstApartment = res.data;
      }
      else {
        this.lstApartment = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })  
  }
  selectedApartment(event:any){
    console.log(event.value)
    if(event.value !== null) {
      this.filterApartment.query = `TowerId=${event.value}`;
      this.getListApartment();
    }else{
    }  
  }

  onSelectTower(event:any){
    this.fTransfer.get('TownId').setValue(this.lstApartment.filter((i: any) => i.Id === event.value)[0]?.TowerId) ;
    let items = [{TowerId: this.fTransfer.get('TownId').value}];
    this.getApartmentbyId(this.Idc,event.value);
    this.getResidentApartment(event.value);
    this.getRegister(event.value);
  }

  getApartmentbyId(idc: number, ida: number) {
    this.apartmentService.getApartmentById(this.Idc, ida).subscribe((res: ResApi ) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.projectid = res.data.ProjectId;
        this.floorid = res.data.FloorId;
        this.residentid = res.data.ResidentId;
        this.apartmentname = res.data.Name;
      }
    })
  }


  generateRandomString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
  
    return result;
  }
 

  getOrderTransportById(idc: number, id: string) {    
    if( this.id !== null) {
      this.orderTransferService.getOrderTransportById(idc, id).subscribe((res: ResApi) => {
        if(res.meta.error_code == AppStatusCode.StatusCode200) {
          this.dataOrderTransport = res.data;  
          this.listAttactmentBqls = res.data.listAttactmentBqls;
          this.listAttactmentCds = res.data.listAttactmentCds;
          this.idapartment = res.data.ApartmentId;
          this.listOrderProducts = res.data.listOrderProducts;
          // for(let i=0;i<res.data.listOrderProducts.length;i++)
          // {
          //   let itemGoods = {
          //     IndexRow:i,
          //     Name:res.data.listOrderProducts[i].Name,
          //     Quatity:res.data.listOrderProducts[i].Quatity,
          //     Note:res.data.listOrderProducts[i].Note,
          //     listAttactments:res.data.listOrderProducts[i].listAttactments,
          //   };
          //   this.listOrderProducts.push(itemGoods);
          // }
          this.setFormGroup();
          const disabledMoreStatuses = [4,6];
          if (disabledMoreStatuses.includes(this.dataOrderTransport.OrderStatus)) {
            this.disableInput();
            this.fTransfer.get('OrderStatus').disable();
            this.fTransfer.get('PriceDebit').disable();
            this.fTransfer.get('NoteConfirm').disable();
            this.fTransfer.get('NoteSecurity').disable();
            this.fTransfer.get('ApartmentId').disable();
            this.fTransfer.get('TownId').disable();
            this.fTransfer.get('Type').disable();
            this.fTransfer.get('TypeLadder').disable();
            this.fTransfer.get('LicensePlates').disable();
            this.fTransfer.get('DateTransport').disable();
            this.fTransfer.get('DateTransportRead').disable();
            this.fTransfer.get('TimeStart').disable();
            this.fTransfer.get('TimeEnd').disable();
            this.fTransfer.get('RegisterId').disable();
            this.fTransfer.get('RegisterPhone').disable();
            this.fTransfer.get('Vehicle').disable();
            this.fTransfer.get('Note').disable();
            this.fTransfer.get('listAttactmentCds').disable();
            this.fTransfer.get('listAttactmentBqls').disable();
          }
          const disableStatuses = [3];
          if (disableStatuses.includes(this.dataOrderTransport.OrderStatus)) {
            this.disableInput();
            this.fTransfer.get('PriceDebit').disable();
            // this.fTransfer.get('NoteConfirm').disable();
            this.fTransfer.get('NoteSecurity').disable();
            this.fTransfer.get('ApartmentId').disable();
            this.fTransfer.get('TownId').disable();
            this.fTransfer.get('Type').disable();
            this.fTransfer.get('TypeLadder').disable();
            this.fTransfer.get('LicensePlates').disable();
            this.fTransfer.get('DateTransport').disable();
            this.fTransfer.get('DateTransportRead').disable();
            this.fTransfer.get('TimeStart').disable();
            this.fTransfer.get('TimeEnd').disable();
            this.fTransfer.get('RegisterId').disable();
            this.fTransfer.get('RegisterPhone').disable();
            this.fTransfer.get('Vehicle').enable();
            // this.fTransfer.get('Note').enable()
            this.fTransfer.get('listAttactmentCds').enable();
            this.fTransfer.get('listAttactmentBqls').enable();

          }
          for (let x = 0; x < this.lstOrderStatus.length; x++) {
            if (this.lstOrderStatus[x].value < this.dataOrderTransport.OrderStatus) {
              this.lstOrderStatus[x].disabled = true;
            }else {
              this.lstOrderStatus[x].disabled = false;
            }
          }  
          this.setData();
          if(res.data.OrderStatus==4){
            this.getCancelById(this.Idc,this.id,1);
          }
          if(res.data.OrderStatus==6){
            this.getReviewById(this.Idc,this.id,1);
          }
          // this.getResidentApartment(this.idapartment);
          this.getApartmentbyId(this.Idc,this.idapartment);
          this.getRegister(this.idapartment);
        }
        else {
          this.dataOrderTransport = [];
          this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
        }
      }) 
      this.dataOrderTransport={...this.dataOrderTransport}
    }else{
      this.dataOrderTransport = [];
    }
  }


  setData() {
    this.lstTypeTransport = TypeTransfer.map(item => ({ Name : item.label, Id: item.value }));
  }

  setFormGroup(){
    this.fTransfer = this.fb.group({
      Id : this.id,
      Code : this.dataOrderTransport.Code,
      CreatedAt: this.dataOrderTransport.CreatedAt,
      UpdatedAt : this.currentDate,
      CompanyId : this.dataOrderTransport.CompanyId,
      ProjectId : this.dataOrderTransport.ProjectId,
      FloorId : this.dataOrderTransport.FloorId,
      CreatedById : this.dataOrderTransport.CreatedById,
      UpdatedById : this.dataOrderTransport.UpdatedById,
      TownId : this.dataOrderTransport.TownId,
      ApartmentId : this.dataOrderTransport.ApartmentId,
      ResidentName: this.dataOrderTransport.ResidentName,
      RegisterId : this.dataOrderTransport.RegisterId,
      Phone : this.dataOrderTransport.Phone,
      ResidentId : this.dataOrderTransport.ResidentId,
      RegisterName : this.dataOrderTransport.RegisterName,
      RegisterPhone : this.dataOrderTransport.RegisterPhone,
      DateTransport: new Date(this.dataOrderTransport.DateTransport),
      Note: this.dataOrderTransport.Note,
      TimeStart : this.dataOrderTransport.TimeStart,
      TimeEnd : this.dataOrderTransport.TimeEnd,
      Type : this.dataOrderTransport.Type,
      PricePay : this.dataOrderTransport.PricePay,
      LicensePlates: this.dataOrderTransport.LicensePlates,
      TypeLadder: this.dataOrderTransport.TypeLadder,
      Vehicle : this.dataOrderTransport.Vehicle,
      OrderStatus : this.dataOrderTransport.OrderStatus,
      DateTransportRead: new Date(this.dataOrderTransport.DateTransportRead),
      PriceDebit  : this.dataOrderTransport.PriceDebit,
      PaymentStatus: this.dataOrderTransport.PaymentStatus,
      NoteConfirm: this.dataOrderTransport.NoteConfirm,
      NoteSecurity: this.dataOrderTransport.NoteSecurity,
      UserSecurity : this.dataOrderTransport.UserSecurity,
      IsConfirm: this.dataOrderTransport.IsConfirm,
      listOrderProducts : [],
      listAttactmentCds : '',
      listAttactmentBqls: '',
      listOrderNotes : [],
    })
    console.log(this.dataOrderTransport.RegisterId);
    
  }
  
  onSubmit() {
    if(this.fTransfer.invalid){
      this.markAllAsDirty()
    }else{
      this.enableInput();
      this.fTransfer.get('OrderStatus').enable();
      this.fTransfer.get('PriceDebit').enable();
      this.fTransfer.get('NoteConfirm').enable();
      this.fTransfer.get('NoteSecurity').enable();
      this.fTransfer.get('ApartmentId').enable();
      this.fTransfer.get('TownId').enable();
      this.fTransfer.get('Type').enable();
      this.fTransfer.get('TypeLadder').enable();
      this.fTransfer.get('LicensePlates').enable();
      this.fTransfer.get('DateTransport').enable();
      this.fTransfer.get('DateTransportRead').enable();
      this.fTransfer.get('TimeStart').enable();
      this.fTransfer.get('TimeEnd').enable();
      this.fTransfer.get('RegisterId').enable();
      this.fTransfer.get('RegisterPhone').enable();
      this.fTransfer.get('Vehicle').enable();
      this.fTransfer.get('Note').enable();
      this.fTransfer.get('listAttactmentCds').enable();
      this.fTransfer.get('listAttactmentBqls').enable();
      if(this.id == null) {
        const reqData = Object.assign({}, this.fTransfer.value);
        reqData.listOrderProducts = this.listOrderProducts;
        reqData.listAttactmentBqls = this.listAttactmentBqls;
        reqData.listAttactmentCds = this.listAttactmentCds;
        reqData.ProjectId =  this.projectid;
        reqData.FloorId = this.floorid;
        reqData.ApartmentName = this.apartmentname;
        reqData.ResidentId = this.residentid;
        for(let i =0;i<this.lstRegister.length;i++){
          if(this.fTransfer.get('RegisterId').value == this.lstRegister[i].ResidentId){
            reqData.RegisterName = this.lstRegister[i].ResidentName
          }
        }
        this.loading[0] = true;
        
        this.orderTransferService.createOrderTransport(reqData).subscribe(
          (res: any) => {
            this.loading[0] = false;
            if (res?.meta?.error_code == AppStatusCode.StatusCode200) {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.CreatedSuccess });
              
              setTimeout(() => {this.onReturnPage('/utilities/order-transport/list')}, 1000);
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
       
        const reqData = Object.assign({}, this.fTransfer.value);
        reqData.listOrderProducts = this.listOrderProducts;
        reqData.listAttactmentBqls = this.listAttactmentBqls;
        reqData.listAttactmentCds = this.listAttactmentCds;
        reqData.ProjectId =  this.projectid;
        reqData.FloorId = this.floorid;
        reqData.ApartmentName = this.apartmentname;
        reqData.ResidentId = this.residentid;
        for(let i =0;i<this.lstRegister.length;i++){
          if(this.fTransfer.get('RegisterId').value == this.lstRegister[i].ResidentId){
            reqData.RegisterName = this.lstRegister[i].ResidentName
          }
        }
        this.loading[0] = true;

        this.orderTransferService.updateOrderTransport(this.id, reqData).subscribe(
          (res: any) => {
            this.loading[0] = false;
            if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: res.meta.error_message || AppMessageResponse.UpdatedSuccess});

              setTimeout(() => {this.onReturnPage('/utilities/order-transport/list')}, 1000);
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

  getResidentApartment(id: any) {
    this.residentService.GetRegisterApartment(id).subscribe((res: ResApi) => {
      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.Resident = res.data;
        if(res.data !== undefined && res.data.length > 0){
        this.fTransfer.get('ResidentName').setValue(this.Resident[0].ResidentName);
        this.fTransfer.get('Phone').setValue(this.Resident[0].Phone);}
        else{
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Căn hộ chưa có chủ hộ,vui lòng xem lại !' });
        }
      }
    });
  }


  getCancelById(idc: number, id: string,type:number) {   
      if( this.id !== null) {
        this.cancelService.getOrderCancelById(this.Idc, this.id,1).subscribe((res: ResApi) => {
          if(res.meta.error_code == AppStatusCode.StatusCode200) {
            this.lstCancel = res.data;    
            this.CancelDate = res.data.DateCancel;
            this.NoteCancel = res.data.Note;
          }
          else {
            this.lstCancel = [];
            this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
          }
        }) 
        this.lstCancel={...this.lstCancel}
      }else{
        this.lstCancel = [];
      }
  }


  getReviewById(idc: number, id: string,type:number) {   
    if( this.id !== null) {
      this.cancelService.getOrderReviewById(this.Idc, this.id,1).subscribe((res: ResApi) => {
        if(res.meta.error_code == AppStatusCode.StatusCode200) {
          this.lstReview = res.data;    
          this.ReviewDate = res.data.CreatedAt;
          this.NoteReview = res.data.Note;
          this.Star = res.data.Star;
        }
        else {
          this.lstCancel = [];
          this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
        }
      }) 
      this.lstCancel={...this.lstCancel}
    }else{
      this.lstCancel = [];
    }
}

getRegister(id: any) {
  this.residentService.GetRegisterApartment(id).subscribe((res: ResApi) => {
    if (res.meta.error_code == AppStatusCode.StatusCode200) {
      this.lstRegister = res.data;
    }
  });
}


selectedRegister(event:any){
  if(event.value){
    for(let i=0;i<this.lstRegister.length;i++){
      this.fTransfer.get('RegisterPhone').setValue(this.lstRegister[i].Phone);
    }
  }
} 


  onReturnPage(url: string) : void {
    this.router.navigate([url]);
  }
  
  onFileCdsSelected(event: any) {
    const file: File = event.target.files[0]; // Lấy file từ sự kiện event
    if (file) {
      const formData: FormData = new FormData();
      formData.append('file', file, file.name); // Gắn file vào FormData
  
      // Gửi yêu cầu POST tới API endpoint hỗ trợ việc upload file
      this.http.post('https://i-apigw.cnttvietnam.com.vn/api/upload/uploadMultifile', formData)
        .subscribe(
          (response: any) => {
            
            // Lấy đường dẫn đã upload từ phản hồi của server
            const uploadedFileName = response.data;

            for(let i = 0; i < uploadedFileName.length; i++) {
              const fileName = uploadedFileName[i];

              let itemFile = new ListAttactmentCds();
              itemFile.Name = fileName;
              itemFile.Url = fileName;

              this.listAttactmentCds.push(itemFile);
            }
            console.log('Upload thành công:', response);
          
          },
          (error) => {
            // Xử lý lỗi nếu có
            console.error('Lỗi upload:', error); 
          }
        );
    }
  }
  onFileBqlSelected(event: any) {
    const file: File = event.target.files[0]; // Lấy file từ sự kiện event
    if (file) {
      const formData: FormData = new FormData();
      formData.append('file', file, file.name); // Gắn file vào FormData
  
      // Gửi yêu cầu POST tới API endpoint hỗ trợ việc upload file
      this.http.post('https://i-apigw.cnttvietnam.com.vn/api/upload/uploadMultifile', formData)
        .subscribe(
          (response: any) => {
            
            // Lấy đường dẫn đã upload từ phản hồi của server
            const uploadedFileName = response.data;

            for(let i = 0; i < uploadedFileName.length; i++) {
              const fileName = uploadedFileName[i];

              let itemFile = new ListAttactmentCds();
              itemFile.Name = fileName;
              itemFile.Url = fileName;

              this.listAttactmentBqls.push(itemFile);
            }
            console.log('Upload thành công:', response);
          
          },
          (error) => {
            // Xử lý lỗi nếu có
            console.error('Lỗi upload:', error); 
          }
        );
    }
  }


  onOpenGoodsDialog(id: number) {
    let itemGoods = {
      IndexRow:this.listOrderProducts.length+1,
      Name: [""],
      Quatity:0,
      Note:"",
      listAttactments:[],
    };
    this.listOrderProducts.push(itemGoods)
  }
  check()
  {
    console.log(this.listOrderProducts);
    
  }
//   onFileSelecte(id:any,event: any) {
//     const file: File = event.target.files[0]; // Lấy file từ sự kiện event
//     if (file) {
//       const formData: FormData = new FormData();
//       formData.append('file', file, file.name); // Gắn file vào FormData
  
//       // Gửi yêu cầu POST tới API endpoint hỗ trợ việc upload file
//       this.http.post('https://i-apigw.cnttvietnam.com.vn/api/upload/uploadMultifile', formData)
//         .subscribe(
//           (response: any) => {
            
//             // Lấy đường dẫn đã upload từ phản hồi của server
//             const uploadedFileName = response.data;

//             for(let i = 0; i < uploadedFileName.length; i++) {
//               const fileName = uploadedFileName[i];

//               let itemFile = new ListAttactments();
//               itemFile.Name = fileName;
//               itemFile.Url = fileName;

//               this.listAttactments.push(itemFile);
//               this.listOrderProducts.map((item:any)=>{
//                 if(item.IndexRow == id)
//                 {
//                   item.listAttactments = this.listAttactments;
//                 }
//               })
              
//               console.log(this.listAttactments);
//             }
//             console.log('Upload thành công:', response);
          
//           },
//           (error) => {
//             // Xử lý lỗi nếu có
//             console.error('Lỗi upload:', error); 
//           }
//         );
//     }
// }

// onFileSelected(id:any,event: any) {
//     const file: File = event.target.files[0]; // Lấy file từ sự kiện event
//     if (file) {
//       const formData: FormData = new FormData();
//       formData.append('file', file, file.name); // Gắn file vào FormData
      
//       // Gửi yêu cầu POST tới API endpoint hỗ trợ việc upload file
//       this.http.post('https://i-apigw.cnttvietnam.com.vn/api/upload/uploadMultifile', formData)
//         .subscribe(
//           (response: any) => {
            
//             // Lấy đường dẫn đã upload từ phản hồi của server
//             const uploadedFileName = response.data;

//             for(let i = 0; i < uploadedFileName.length; i++) {
//               const fileName = uploadedFileName[i];

//               let itemFiles = {
//                 Name:fileName,
//                 Url:fileName,
//                 Thumb: fileName
//               }
//               // new ListAttactments();
//               console.log(itemFiles);
              
//               this.listAttactments.push(itemFiles);
//               this.listOrderProducts.map((item:any)=>{
//                 if(item.IndexRow == id)
//                 {
//                   item.listAttactments = this.listAttactments;
//                 }
//               console.log(this.listOrderProducts);
//               })
//             }
//             console.log('Upload thành công:', response);
          
//           },
//           (error) => {
//             // Xử lý lỗi nếu có
//             console.error('Lỗi upload:', error); 
//           }
//         );
//     }
// }





// onFileSelected(id: any, event: any) {
//   const files: File[] = event.target.files; // Lấy danh sách file từ sự kiện event
//   if (files && files.length > 0) {
//     const formData: FormData = new FormData();
//     for (let i = 0; i < files.length; i++) {
//       const file: File = files[i];
//       formData.append('files', file, file.name); // Gắn các file vào FormData
//     }

//     // Gửi yêu cầu POST tới API endpoint hỗ trợ việc upload file
//     this.http.post('https://i-apigw.cnttvietnam.com.vn/api/upload/uploadMultifile', formData)
//       .subscribe(
//         (response: any) => {
//           // Lấy danh sách đường dẫn đã upload từ phản hồi của server
//           const uploadedFileNames = response.data;
//           const itemFiles = uploadedFileNames.map((fileName: string) => {
//             return {
//               Name: fileName,
//               Url: fileName,
//               Thumb: fileName
//             };
//           });

//           this.listOrderProducts.map((item: any) => {
//             if (item.IndexRow == id) {
//               if (!Array.isArray(item.listAttactments)) {
//                 item.listAttactments = [];
//               }
//               item.listAttactments.push(...itemFiles);
//               this.listAttactments = item.listAttactments;
//             }
//           });
//           console.log('Upload thành công:', response);
//         },
//         (error) => {
//           // Xử lý lỗi nếu có
//           console.error('Lỗi upload:', error);
//         }
//       );
//   }
// }


// onFileSelected(id: any, event: any) {
//   const files: File[] = event.target.files;
//   if (files && files.length > 0) {
//     const formData: FormData = new FormData();
//     for (let i = 0; i < files.length; i++) {
//       formData.append('files', files[i], files[i].name);
//     }

//     this.http.post('https://i-apigw.cnttvietnam.com.vn/api/upload/uploadMultifile', formData)
//       .subscribe(
//         (response: any) => {
//           const uploadedFileNames = response.data;
//           const itemFiles = uploadedFileNames.map((fileName: string) => {
//             return {
//               Name: fileName,
//               Url: fileName,
//               Thumb: fileName
//             };
//           });

//           this.listOrderProducts.map((item: any) => {
//             if (item.IndexRow == id) {
//               if (!Array.isArray(item.listAttactments)) {
//                 item.listAttactments = [];
//               }
//               item.listAttactments.push(...itemFiles);
//             }
//           });

//           console.log('Upload thành công:', response);
//         },
//         (error) => {
//           console.error('Lỗi upload:', error);
//         }
//       );
//   }
// }

onFileSelected(id: any, event: any) {
  const files: File[] = event.target.files;
  if (files && files.length > 0) {
    const formData: FormData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i], files[i].name);
    }

    this.http.post('https://i-apigw.cnttvietnam.com.vn/api/upload/uploadMultifile', formData)
      .subscribe(
        (response: any) => {
          const uploadedFileNames = response.data;
          const itemFiles = uploadedFileNames.map((fileName: string) => {
            return {
              Name: fileName,
              Url: fileName,
              Thumb: fileName
            };
          });

          this.listOrderProducts.map((item: any) => {
            if (item.IndexRow == id) {
              if (!Array.isArray(item.listAttactments)) {
                item.listAttactments = [];
              }
              item.listAttactments.push(...itemFiles);
            }
          });

          console.log('Upload thành công:', response);
        },
        (error) => {
          console.error('Lỗi upload:', error);
        }
      );
  }
}







RemoveAttactment(ordergood: any, file: any) {
  const index = ordergood.listAttactments.indexOf(file);
  if (index !== -1) {
    ordergood.listAttactments.splice(index, 1);
  }
}

RemoveAttactmentCds(item: ListAttactments){
  this.listAttactmentCds = [...this.listAttactmentCds.filter((s:any) => s.Name != item.Name)];
}
RemoveAttactmentBql(item: ListAttactments){
  this.listAttactmentBqls = [...this.listAttactmentBqls.filter((s:any) => s.Name != item.Name)];
}

onDelete(index: number) {
  this.confirmationService.confirm({
    message: 'Bạn có muốn xóa hàng hóa này không?',
    header: 'XÓA HÀNG HÓA',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      let lst_updated = [];

      for (let i = 0; i < this.listOrderProducts.length; i++) {
        if (index != i) {
          lst_updated.push(this.listOrderProducts[i])
        }
      }

      this.listOrderProducts = [...lst_updated];
      // this.eventEmitter.emit(this.listOrderProducts);
    },
    reject: (type: any) => {
        return;
    }
  });
}

  onDialogCancel(){
    localStorage.setItem('id-order-transport',this.id);
    this.ref = this.dialogService.open(CancelTransferGoodComponent,{
      header: !(this.id > 0) ? 'Hủy đơn đăng ký chuyển hàng' : 'Hủy đơn đăng ký chuyển hàng',
      width: '60%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true
    });
  }
  onOpenConfigDialogPayment(id: number){
    this.ref = this.dialogService.open(PaymentTransferComponent, {
      header: !(id > 0) ? 'Thêm mới thuộc tính' : 'Cập nhật loại thuộc tính',
      width: '60%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true
    });
  
    this.ref.onClose.subscribe((data: PaymentTransferComponent) => {
      console.log(data);
      if (data) {
        this.lstPayment =  [...this.lstPayment, data];

        // this.listApartmentMaps.push(data);
      }
    });
  }
  onOpenChatHistory(){
    this.ref = this.dialogService.open(ChatHistoryComponent, {
      header: 'Lịch sử trao đổi',
      width: '40%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true
    });
  }
  onTimeChange(){
    const timeStart = this.fTransfer.get('TimeStart')?.value;
    const timeEnd = this.fTransfer.get('TimeEnd')?.value;
  }
  onBack(event : any){
    this.router.navigate(['/utilities/order-transport/list']);
  }
}
