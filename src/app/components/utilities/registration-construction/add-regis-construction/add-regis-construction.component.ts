import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AppMessageResponse, AppStatusCode, CardRequestProcessStatus, ConstructionStatus, DocumentFileType, DocumentStatus, OrderStatus, StatusPayment,UserConfirm, StorageData, UserCancel } from 'src/app/shared/constants/app.constants';
import { DepositPaymentComponent } from './deposit-payment/deposit-payment.component';
import { ResApi } from 'src/app/viewModels/res-api';
import { Paging } from 'src/app/viewModels/paging';
import { DbTower } from 'src/app/viewModels/tower/db-tower';
import { Apartment } from 'src/app/viewModels/apartment/apartment';
import { TowerService } from 'src/app/services/tower.service';
import { ApartmentService } from 'src/app/services/apartment.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ConstructionDocumentsComponent } from './construction-documents/construction-documents.component';
import { ConstructionExtendComponent } from './construction-extend/construction-extend.component';
import { ConstructionUnitComponent } from './construction-unit/construction-unit.component';
import { HttpClient } from '@angular/common/http';
import { ListAttactments, ListOrderAttactments, ListOrderPlans, ListOrderUnits, OrderConstruction, listOrderDocuments } from 'src/app/viewModels/orderconstruction/orderconstruction';
import { OrderconstructionService } from 'src/app/services/orderconstruction.service';
import { OrderCancelService } from 'src/app/services/order-cancel.service';
import { OrderTransportService } from 'src/app/services/order-transport.service';
import { OrderCancel } from 'src/app/viewModels/order-cancel/order-cancel';
import { ResidentService } from 'src/app/services/resident.service';
import { Resident } from 'src/app/viewModels/resident/resident';
import { CancelDocumentComponent } from './cancel-document/cancel-document.component';

@Component({
  selector: 'app-add-regis-construction',
  templateUrl: './add-regis-construction.component.html',
  styleUrls: ['./add-regis-construction.component.scss']
})
export class AddRegisConstructionComponent {
  public item : OrderConstruction;
  public ProcessStatus = OrderStatus;
  public currentDate = new Date();
  public statusPayment = StatusPayment;
  public userConfirm = UserConfirm;
  idapartment : any;
  public ConstructionStatus = ConstructionStatus;
  fConstruction : any;
  public filterTower : Paging;
  public filterApartment : Paging;
  dataOrderContruction : any;
  idr : any;
  lst : any;
  public isLoading : boolean = true;
  idc : any;
  projectid : any;
  floorid : any;
  residentid : any;
  apartmentname :any;
  registername : any;
  lstRegister : any;
  @Output() eventEmitter = new EventEmitter<any>;
  // @Input() listAttactments : Array<ListAttactments>;
  public listOrderUnits : any;
  public listOrderAttactments : Array<ListOrderAttactments>
  uploadedImageUrl : string = '';
  nameFile : string = '';
  lstCancel : any;
  lstReview : any;
  Resident: any;
  lstResident : Array<Resident>;
  public Star : number = 0;
  public CancelDate = new Date();
  public ReviewDate = new Date();
  public NoteCancel : string = '';
  public NoteReview : string = '';
  public UserCancel : number = 0;
  isImageSelected : boolean = false;
  isLoadingTable : boolean = false;
  isContentVisible : boolean = true;
  isContentVisible2 : boolean = true;
  isContentVisible3 : boolean = true;
  isContentVisible4 : boolean = true;
  isContentVisible5 : boolean = true;
  isContentVisible6 : boolean = true;

  isInputDisabled: boolean = false;
  public lstDocument : any;
  public lstExtend : any;

  public lstTower : Array<DbTower>;
  public lstApartment : Array<Apartment>;
  loading  = [false];
  id : any;
  lstPayment: any;
  Idc: any;
  userID: any;
  Idcancel: any;

  constructor(
    private readonly cancelService : OrderCancelService,
    private readonly orderTransferService : OrderTransportService,
    private readonly orderconstructionService : OrderconstructionService,
    private readonly http : HttpClient,
    private readonly towerService : TowerService,
    private readonly residentService : ResidentService,
    private readonly route: ActivatedRoute,
    private readonly apartmentService : ApartmentService,
    private readonly dialogService : DialogService,
    private readonly messageService : MessageService,
    private readonly confirmationService : ConfirmationService,
    private readonly storeService : StorageService,
    private readonly fb : FormBuilder,
    private router : Router,
    public ref  : DynamicDialogRef
  ){
    this.item = new OrderConstruction;
    this.filterTower = new Object as Paging;
    this.filterTower.page = 1;
    this.filterTower.page_size = 100;
    this.filterApartment = new Object as Paging;
    this.filterApartment.page = 1;
    this.filterApartment.page_size = 100;
    this.lstTower = new Array<DbTower>();
    this.lstApartment = new Array<Apartment>();
    this.listOrderUnits = new Array<ListOrderUnits>();
    this.listOrderAttactments = new Array<ListOrderAttactments>();
    this.lstDocument = [];
    this.lstExtend = [];
    this.lstCancel = new Array<OrderCancel>();
    this.lstResident = new Array<Resident>();
    // this.listAttactments = new Array<ListAttactments>();
  }

  ngOnInit() : void {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
    });

    this.getListTower();
    this.getListApartment();
    this.getCompanyId();
    this.getUserId();

    if(this.id){
      this.getOrderContructionById(this.Idc,this.id);
    }


    this.fConstruction = this.fb.group({
      Id : [0],
      TownId : ['',Validators.required],
      ApartmentId: ['',Validators.required],
      ResidentName: ['',Validators.required],
      Phone : [''],
      CompanyId : Number(this.Idc),
      CreatedById : Number(this.userID),
      UpdatedById : Number(this.userID),
      CreatedAt : this.currentDate,
      UpdatedAt : this.currentDate,
      Code: [this.generateRandomString(5)],
      PaymentStatus : [null],
      Status : [1],
      ProjectId : [null],
      FloorId : [null],
      ApartmentName : [''],
      ResidentId : [null],
      RegisterId : [null,Validators.required],
      AuthorityCard : [''],
      AuthorityStart : [''],
      AuthorityEnd : [''],
      RegisterName : [undefined],
      RegisterPhone: [''],
      NoteSecurity: [''],
      AuthorityNote : [''],
      DatePause: [this.currentDate,Validators.required],
      DateContinue : [this.currentDate,Validators.required],
      DateStart : ['',Validators.required],
      DateEnd : ['',Validators.required],
      Contents : ['',Validators.required],
      Description : [''],
      Note : [''],
      NoteConfirm: [''],
      AuthorityName: [''],
      AuthorityPhone: [''],
      DateStartAuthority :[''],
      DateEndAuthority : [''],
      ConstructionStatus: ['',Validators.required],
      OrderStatus : [1,Validators.required],
      IsConfirm : [null],
      IsDeposit : ['false',Validators.required],
      UserConfirm: ['',Validators.required],
      PriceDeposit : [null],
      listOrderAttactments: [],
      listOrderPlans : [],
      listOrderDocuments : [],
      listOrderUnits: [],
    })
    this.fConstruction.get('OrderStatus').disable();
  }

  getCompanyId() {
    this.Idc = this.storeService.get(StorageData.companyId);
  }
  getUserId() {
    this.userID = this.storeService.get(StorageData.userId);
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

  disableInput() {
    this.isInputDisabled = true;
}

  enableInput() {
    this.isInputDisabled = false;
}


  onSubmit() {
    if(this.fConstruction.invalid){
      this.markAllAsDirty()
    }else{
      this.enableInput();
      this.fConstruction.get('OrderStatus').enable();
      this.fConstruction.get('DateStart').enable();
      this.fConstruction.get('DateEnd').enable();
      this.fConstruction.get('NoteSecurity').enable();
      this.fConstruction.get('ApartmentId').enable();
      this.fConstruction.get('TownId').enable();
      this.fConstruction.get('RegisterName').enable();
      this.fConstruction.get('IsDeposit').enable();
      this.fConstruction.get('ConstructionStatus').enable();
      this.fConstruction.get('DatePause').enable();
      this.fConstruction.get('DateContinue').enable();
      this.fConstruction.get('PriceDeposit').enable();
      this.fConstruction.get('Note').enable();
      this.fConstruction.get('RegisterId').enable();
      this.fConstruction.get('RegisterPhone').enable();
      this.fConstruction.get('NoteConfirm').enable();
      this.fConstruction.get('AuthorityNote').enable();
      this.fConstruction.get('listOrderAttactments').enable();
      if(this.id == null) {
        const reqData = Object.assign({}, this.fConstruction.value);
        reqData.CompanyId = this.Idc;
        reqData.CreatedById = this.userID;
        reqData.UpdatedById = this.userID;
        reqData.ProjectId =  this.projectid;
        reqData.FloorId = this.floorid;
        reqData.ApartmentName = this.apartmentname;
        reqData.ResidentId = this.residentid;
        for(let i =0;i<this.lstRegister.length;i++){
          if(this.fConstruction.get('RegisterId').value == this.lstRegister[i].ResidentId){
            reqData.RegisterName = this.lstRegister[i].ResidentName
          }
        }
        reqData.listOrderUnits = this.listOrderUnits.filter((item:any) => item.UnitName.trim() !== '');
        reqData.listOrderDocuments = this.lstDocument;
        reqData.listOrderPlans = this.lstExtend;
        // for(let i=0;i<reqData.data.listOrderDocuments.length;i++)
        // {
        //   let itemDocuments = {
        //     Name:reqData.data.listOrderDocuments[i].Name,
        //     Quatity:reqData.data.listOrderDocuments[i].Quatity,
        //     Note:reqData.data.listOrderDocuments[i].Note,
        //     listAttactments:reqData.data.listOrderDocuments[i].listAttactments,
        //     TargetType: reqData.data.listOrderDocuments[i].TargetType,
        //     Type: reqData.data.listOrderDocuments[i].Type,
        //     StatusProcess: reqData.data.listOrderDocuments[i].StatusProcess,
        //   };
        //   this.lstDocument.push(itemDocuments);
        // }
        reqData.listOrderAttactments = this.listOrderAttactments;
        this.loading[0] = true;

        this.orderconstructionService.createOrderConstruction(reqData).subscribe(
          (res: any) => {
            this.loading[0] = false;
            if (res?.meta?.error_code == AppStatusCode.StatusCode200) {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.CreatedSuccess });

              setTimeout(() => {this.onReturnPage('/utilities/construction/list')}, 1000);
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

        const reqData = Object.assign({}, this.fConstruction.value);
        reqData.CompanyId = this.Idc;
        reqData.CreatedById = this.userID;
        reqData.UpdatedById = this.userID;
        reqData.ProjectId =  this.projectid;
        reqData.FloorId = this.floorid;
        reqData.ResidentId = this.residentid;
        reqData.ApartmentName = this.apartmentname;
        for(let i =0;i<this.lstRegister.length;i++){
          if(this.fConstruction.get('RegisterId').value == this.lstRegister[i].ResidentId){
            reqData.RegisterName = this.lstRegister[i].ResidentName
          }
        }
        reqData.listOrderUnits = this.listOrderUnits.filter((item:any) => item.UnitName.trim() !== '');
        reqData.listOrderDocuments = this.lstDocument;
        reqData.listOrderPlans = this.lstExtend;
        // for(let i=0;i<reqData.data.listOrderDocuments.length;i++)
        // {
        //   let itemDocuments = {
        //     Name:reqData.data.listOrderDocuments[i].Name,
        //     Quatity:reqData.data.listOrderDocuments[i].Quatity,
        //     Note:reqData.data.listOrderDocuments[i].Note,
        //     listAttactments:reqData.data.listOrderDocuments[i].listAttactments,
        //     TargetType: reqData.data.listOrderDocuments[i].TargetType,
        //     Type: reqData.data.listOrderDocuments[i].Type,
        //     StatusProcess: reqData.data.listOrderDocuments[i].StatusProcess,
        //   };
        //   this.lstDocument.push(itemDocuments);
        // }
        reqData.listOrderAttactments = this.listOrderAttactments;
        this.loading[0] = true;

        this.orderconstructionService.updateOrderConstruction(this.id, reqData).subscribe(
          (res: any) => {
            this.loading[0] = false;
            if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: res.meta.error_message || AppMessageResponse.UpdatedSuccess});

              setTimeout(() => {this.onReturnPage('/utilities/construction/list')}, 1000);
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

  markAllAsDirty() {
    Object.keys(this.fConstruction.controls).forEach(key => {
      const control = this.fConstruction.get(key);
      if (control.enabled && control.invalid) {
        control.markAsDirty();
      }
    });
  }

  onReturnPage(url: string) : void {
    this.router.navigate([url]);
  }

  getOrderContructionById(idc: number, id: string) {
    if( this.id !== null) {
      this.orderconstructionService.getOrderConstructionById(idc, this.id).subscribe((res: ResApi) => {
        if(res.meta.error_code == AppStatusCode.StatusCode200) {
          this.dataOrderContruction = res.data;
          this.listOrderAttactments = res.data.listOrderAttactments;
          this.idapartment = res.data.ApartmentId;
          console.log(this.idapartment);

          // this.lstDocument = res.data.listOrderDocuments.filter((item:any) => item.Name !== '');
          this.listOrderUnits = res.data.listOrderUnits.filter((item:any) => item.UnitName !== '');
          this.lstExtend = res.data.listOrderPlans.filter((item:any) => item.ProcessStatus != '');
          for(let i=0;i<res.data.listOrderDocuments.length;i++)
          {
            let itemDocuments = {
              Name:res.data.listOrderDocuments[i].Name,
              Quatity:res.data.listOrderDocuments[i].Quatity,
              Note:res.data.listOrderDocuments[i].Note,
              listAttactments:res.data.listOrderDocuments[i].listAttactments,
              TargetType: res.data.listOrderDocuments[i].TargetType,
              Type: res.data.listOrderDocuments[i].Type,
              StatusProcess: res.data.listOrderDocuments[i].StatusProcess,
            };
            this.lstDocument.push(itemDocuments);
          }
          this.setFormGroup();
          const disabledStatuses = [3, 4, 6];
          if (disabledStatuses.includes(this.dataOrderContruction.OrderStatus)) {
            this. disableInput();
            this.fConstruction.get('DateEnd').disable();
            this.fConstruction.get('DateStart').disable();
            this.fConstruction.get('NoteSecurity').disable();
            this.fConstruction.get('ApartmentId').disable();
            this.fConstruction.get('TownId').disable();
            this.fConstruction.get('RegisterName').disable();
            this.fConstruction.get('IsDeposit').disable();
            this.fConstruction.get('ConstructionStatus').disable();
            this.fConstruction.get('DatePause').disable();
            this.fConstruction.get('DateContinue').disable();
            this.fConstruction.get('PriceDeposit').disable();
            this.fConstruction.get('Note').disable();
            this.fConstruction.get('RegisterId').disable();
            this.fConstruction.get('RegisterPhone').disable();
            this.fConstruction.get('NoteConfirm').disable();
            this.fConstruction.get('AuthorityNote').disable();
            this.fConstruction.get('listOrderAttactments').disable();
          }
          for (let x = 0; x < this.ProcessStatus.length; x++) {
            if (this.ProcessStatus[x].value < res.data.OrderStatus) {
              this.ProcessStatus[x].disabled = true;
            } else {
              this.ProcessStatus[x].disabled = false;
            }
          }
          if(res.data.OrderStatus==4){
            this.getCancelById(this.Idc,this.id,1);
          }
          if(res.data.OrderStatus==6){
            this.getReviewById(this.Idc,this.id,1);
          }
          this.getResidentApartment(this.idapartment);
          this.getApartmentbyId(this.Idc,this.idapartment);
          this.getRegister(this.idapartment);
        }
        else {
          this.dataOrderContruction = [];
          this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
        }
      })
      this.dataOrderContruction={...this.dataOrderContruction}
    }else{
      this.dataOrderContruction = [];
    }
  }
  setFormGroup(){
    this.fConstruction = this.fb.group({
      Id : this.dataOrderContruction.Id,
      CreatedById : this.userID,
      UpdatedById : this.userID,
      Code : this.dataOrderContruction.Code,
      CreatedAt : this.dataOrderContruction.CreatedAt,
      UpdatedAt : this.currentDate,
      ConpanyId : this.Idc,
      listOrderUnits : [],
      listOrderDocuments : [],
      listOrderAttactments : '',
      listOrderPlans: [],
      TownId : this.dataOrderContruction.TownId,
      IsConfirm : this.dataOrderContruction.IsConfirm,
      ProjectId : this.dataOrderContruction.ProjectId,
      FloorId : this.dataOrderContruction.FloorId,
      ResidentId : this.dataOrderContruction.ResidentId,
      ApartmentId : this.dataOrderContruction.ApartmentId,
      ResidentName : this.dataOrderContruction.ResidentName,
      Phone : this.dataOrderContruction.Phone,
      RegisterName : this.dataOrderContruction.RegisterName,
      RegisterPhone : this.dataOrderContruction.RegisterPhone,
      AuthorityName : this.dataOrderContruction.AuthorityName,
      RegisterId : this.dataOrderContruction.RegisterId,
      AuthorityPhone : this.dataOrderContruction.AuthorityPhone,
      AuthorityCard : this.dataOrderContruction.AuthorityCard,
      AuthorityStart : new Date(this.dataOrderContruction.AuthorityStart),
      AuthorityEnd : new Date(this.dataOrderContruction.AuthorityEnd),
      Contents : this.dataOrderContruction.Contents,
      Note : this.dataOrderContruction.Note,
      // IsConFirm : this.dataOrderContruction.IsConFirm,
      PaymentStatus: this.dataOrderContruction.PaymentStatus,
      OrderStatus : this.dataOrderContruction.OrderStatus,
      AuthorityNote: this.dataOrderContruction.AuthorityNote,
      UserConfirm : this.dataOrderContruction.UserConfirm,
      ConstructionStatus : this.dataOrderContruction.ConstructionStatus,
      DatePause : new Date(this.dataOrderContruction.DatePause),
      DateContinue : new Date(this.dataOrderContruction.DateContinue),
      DateStart: new Date(this.dataOrderContruction.DateStart),
      DateEnd: new Date(this.dataOrderContruction.DateEnd),
      NoteConfirm : this.dataOrderContruction.NoteConfirm,
      IsDeposit : (this.dataOrderContruction.IsDeposit).toString(),
      PriceDeposit: this.dataOrderContruction.PriceDeposit,
      UserSecurity: this.dataOrderContruction.UserSecurity,
      NoteSecurity: this.dataOrderContruction.NoteSecurity,
      Status : this.dataOrderContruction.Status,
    })
    console.log(this.dataOrderContruction.RegisterId);
  }

  selectStatus(event : any){
    if(event.value == 4 || event.value == 3 || event.value == 6){
      this.disableInput();
      this.fConstruction.get('DateStart').disable();
      this.fConstruction.get('DateEnd').disable();
      this.fConstruction.get('NoteSecurity').disable();
      this.fConstruction.get('ApartmentId').disable();
      this.fConstruction.get('TownId').disable();
      this.fConstruction.get('RegisterName').disable();
      this.fConstruction.get('IsDeposit').disable();
      this.fConstruction.get('ConstructionStatus').disable();
      this.fConstruction.get('DatePause').disable();
      this.fConstruction.get('DateContinue').disable();
      this.fConstruction.get('PriceDeposit').disable();
      this.fConstruction.get('Note').disable();
      this.fConstruction.get('RegisterId').disable();
      this.fConstruction.get('RegisterPhone').disable();
      this.fConstruction.get('NoteConfirm').disable();
      this.fConstruction.get('AuthorityNote').disable();
      this.fConstruction.get('listOrderAttactments').disable();

      for (let x = 0; x < this.ProcessStatus.length; x++) {
        if (this.ProcessStatus[x].value < event.value) {
          this.ProcessStatus[x].disabled = true;
        }
      }
    } else{
      this.enableInput();
      this.fConstruction.get('DateStart').enable();
      this.fConstruction.get('DateEnd').enable();
      this.fConstruction.get('NoteSecurity').enable();
      this.fConstruction.get('ApartmentId').enable();
      this.fConstruction.get('TownId').enable();
      this.fConstruction.get('RegisterName').enable();
      this.fConstruction.get('IsDeposit').enable();
      this.fConstruction.get('ConstructionStatus').enable();
      this.fConstruction.get('DatePause').enable();
      this.fConstruction.get('DateContinue').enable();
      this.fConstruction.get('PriceDeposit').enable();
      this.fConstruction.get('Note').enable();
      this.fConstruction.get('RegisterId').enable();
      this.fConstruction.get('RegisterPhone').enable();
      this.fConstruction.get('NoteConfirm').enable();
      this.fConstruction.get('AuthorityNote').enable();
      this.fConstruction.get('listOrderAttactments').enable();
    }
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


  getCancelById(idc: number, id: string,type:number) {
    if( this.id !== null) {
      this.cancelService.getOrderCancelById(this.Idc, this.id,1).subscribe((res: ResApi) => {
        if(res.meta.error_code == AppStatusCode.StatusCode200) {
          this.lstCancel = res.data;
          this.Idcancel = res.data.Id;
          this.CancelDate = res.data.DateCancel;
          this.NoteCancel = res.data.Note;
          this.UserCancel = res.data.UserCancel;
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
      this.filterApartment.query = `1=1`;
      this.getListApartment();
    }
  }

  onSelectTower(event:any){
    this.fConstruction.get('TownId').setValue(this.lstApartment.filter((i: any) => i.Id === event.value)[0]?.TowerId) ;
    let items = [{TowerId: this.fConstruction.get('TownId').value}];
    console.log(event.value);
    Object.keys(items[0]).forEach(key => {
      const control = this.fConstruction.get(key);
      if (control?.enabled && control?.invalid) {
        control.markAsDirty();
      }
    });
    this.getApartmentbyId(this.Idc,event.value);
    this.getResidentApartment(event.value);
    this.getRegister(event.value);

  }

  getResidentApartment(id: any) {
    this.residentService.GetRegisterApartment(id).subscribe((res: ResApi) => {
      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.Resident = res.data;
        this.registername = this.Resident.ResidentName;
        if(res.data !== undefined && res.data.length > 0){
        this.fConstruction.get('ResidentName').setValue(this.Resident[0].ResidentName);
        this.fConstruction.get('Phone').setValue(this.Resident[0].Phone);}
        else{
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Căn hộ chưa có chủ hộ,vui lòng xem lại !' });
        }
      }
    });
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
        this.fConstruction.get('RegisterPhone').setValue(this.lstRegister[i].Phone);
      }
    }
  }
  onOpenUnitsDialog(id: number) {
    let itemConstruct = {
      UnitName: "",
      ContactName:"",
      ContactPhone:"",
    };
    this.listOrderUnits.push(itemConstruct)
  }
  ShowStatusDocument(Type : any) {
		let data = DocumentStatus.filter(x => x.value == Type)[0];
		return data != undefined ? data.label : "";
	}
  ShowTypeDocument(Type : any) {
		let data = DocumentFileType.filter(x => x.value == Type)[0];
		return data != undefined ? data.label : "";
	}

  onOpenConfigDialogPayment(id: number){
    this.ref = this.dialogService.open(DepositPaymentComponent, {
      header: 'Thanh toán đặt cọc' ,
      width: '60%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true
    });

    this.ref.onClose.subscribe((data: DepositPaymentComponent) => {
      console.log(data);
      if (data) {
        this.lstPayment =  [...this.lstPayment, data];

        // this.listApartmentMaps.push(data);
      }
    });
  }
  onOpenDocumentDialog(id: string, idd: string, lst: any){
    this.ref = this.dialogService.open(ConstructionDocumentsComponent, {
      header: 'Thêm mới hồ sơ thi công' ,
      width: '60%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
      data : {
        Id: id,
        Idd: idd,
        Lst: lst,
        isLoading: this.isLoading
      }
    });

    this.ref.onClose.subscribe((data: listOrderDocuments) => {
      if(!idd) {
        if (data) {
          this.lstDocument =  [...this.lstDocument, data];
        }
      }
      else{
        if (data) {
          this.lstDocument = this.lstDocument.map((item: any) => {
            if (item.Id == idd) {
              return data;
            } else {

              return item;
            }
          });
        }
      }
    })
  }



  onOpenConfigDialogExtend(id : number,idc:number,lse:any){
    localStorage.setItem('id-order-orderconstruction',this.id);
    this.ref = this.dialogService.open(ConstructionExtendComponent, {
      header: 'Thêm mới hồ sơ gia hạn thi công' ,
      width: '60%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
      data : {
        Id: id,
        Idc: idc,
        Lse: lse,
        isLoading: this.isLoading
      }
    });

    this.ref.onClose.subscribe((data: ListOrderPlans) => {
      if(!idc) {
        if (data) {
          this.lstExtend =  [...this.lstExtend, data];
        }
      }
      else{
        if (data) {
          this.lstExtend = this.lstExtend.map((item: any) => {
            if (item.Id == idc) {
              return data;
            } else {
              return item;
            }
          });

        }
      }
    })
  }

  onOpenDepositAdditionDialog(id :any,idr : number,lst:any){
    this.ref = this.dialogService.open(ConstructionUnitComponent, {
      header: 'Thêm mới đặt cọc bổ sung' ,
      width: '60%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true
    });

    this.ref.onClose.subscribe((data: any) => {
      console.log(data);
      if (data) {
        this.lstPayment =  [...this.lstPayment, data];

        // this.listApartmentMaps.push(data);
      }
    });
  }
  onFileSelected(event: any) {
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

              let itemFile = new ListOrderAttactments();
              itemFile.Name = fileName;
              itemFile.Url = fileName;

              this.listOrderAttactments.push(itemFile);
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

  RoutertoOrderAccept(){
    localStorage.setItem('id-order-orderconstruction',this.id);
    this.router.navigate(['/utilities/order-acceptance/list']);
  }

  Imagenull(){
    this.isImageSelected = false;
    this.uploadedImageUrl = '';

  }

  ShowUserCancel(Id : any) {
		let data = UserCancel.filter(x => x.Id == Id)[0];
		return data != undefined ? data.Name : "";
	}

  onDeleteDocument(id : string,index:number){
    this.confirmationService.confirm({
      message: 'Bạn có muốn xóa tài liệu thi công <b> '+this.lstDocument.filter((i:any) => i.Id == id)[index].Name +' </b> này không?',
      header: 'XÓA TÀI LIỆU',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        let lst_updated = [];

        for (let i = 0; i < this.lstDocument.length; i++) {
          if (index != i) {
            lst_updated.push(this.lstDocument[i])
          }
        }
        this.lstDocument = [...lst_updated];
      },
      reject: (type: any) => {
          return;
      }
    });
  }


  onDeleteExtend(id : string,index:number){
    this.confirmationService.confirm({
      message: 'Bạn có muốn xóa đơn gia hạn thi công <b> '+this.lstExtend.filter((i:any) => i.Id == id)[0].Note +' </b> này không?',
      header: 'XÓA GIA HẠN THI CÔNG',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        let lst_updated = [];

        for (let i = 0; i < this.lstExtend.length; i++) {
          if (index != i) {
            lst_updated.push(this.lstExtend[i])
          }
        }
        this.lstExtend = [...lst_updated];
      },
      reject: (type: any) => {
          return;
      }
    });
  }


  onDeleteUnitConstruct(index: number,id : string) {
    this.confirmationService.confirm({
      message: 'Bạn có muốn xóa đơn vị thi công <b> '+this.listOrderUnits.filter((i:any) => i.Id == id)[0].UnitName +' </b> này không?',
      header: 'XÓA HÀNG HÓA',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        let lst_updated = [];

        for (let i = 0; i < this.listOrderUnits.length; i++) {
          if (index != i) {
            lst_updated.push(this.listOrderUnits[i])
          }
        }

        this.listOrderUnits = [...lst_updated];
        // this.eventEmitter.emit(this.listOrderProducts);
      },
      reject: (type: any) => {
          return;
      }
    });
  }

  onDialogCancel(){
    localStorage.setItem('id-order-construction',this.id);
    this.ref = this.dialogService.open(CancelDocumentComponent,{
      header: !(this.id > 0) ? 'Hủy đơn đăng ký thi công' : 'Hủy đơn đăng ký thi công',
      width: '60%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true
    });
  }


  onBack(event:any){
    this.router.navigate(['/utilities/construction/list']);
  }
}
