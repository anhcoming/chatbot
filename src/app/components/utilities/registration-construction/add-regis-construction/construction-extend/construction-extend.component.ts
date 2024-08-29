import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AppMessageResponse, AppStatusCode, DocumentStatus, StorageData } from 'src/app/shared/constants/app.constants';
import  ObjectId from 'bson-objectid';
import { StorageService } from 'src/app/shared/services/storage.service';
import { OrderconstructionService } from 'src/app/services/orderconstruction.service';
import { ResApi } from 'src/app/viewModels/res-api';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-construction-extend',
  templateUrl: './construction-extend.component.html',
  styleUrls: ['./construction-extend.component.scss']
})
export class ConstructionExtendComponent {
  fConstructionExtend: any;
  lstUnitContruction : any;
  loading = [false];
  id : any;
  idConstruction : any;
  public currentDate = new Date();
  data : any;
  dataExtend : any;
  itemExtend : any;
  lstExtend : any;
  Idc : any;
  idc: any;
  isLoading : boolean = false;
  DocumentStatus =  DocumentStatus;
  userID: any;
  constructor(
    private readonly orderconstructionService : OrderconstructionService,
    private readonly storeService : StorageService,
    private readonly messageService : MessageService,
    public ref  : DynamicDialogRef,
    private readonly fb : FormBuilder,
    private config: DynamicDialogConfig,
    public datePipe : DatePipe,

  ){
    this.fConstructionExtend = this.fb.group({
      CreatedAt: this.currentDate,
      CompanyId : this.idc,
      CreatedById : this.userID,
      UpdatedById : this.userID,
      Status : [1],
      UnitName : ['',Validators.required],
      StatusProcess: ['',Validators.required],
      ContactName : ['',Validators.required],
      ContactPhone : ['',Validators.required],
      DateStart : ['',Validators.required],
      DateEnd : ['',Validators.required],
      Name : [''],
      Note : [''],
    })
    this.dataExtend = [];
    this.lstUnitContruction = [];
    this.Idc = this.config.data.Idc;
    this.id = this.config.data.Id;
    this.lstExtend = this.config.data.Lse;
    this.isLoading = this.config.data.isLoading;
  }
  ngOnInit(){
    this.idConstruction = localStorage.getItem('id-order-orderconstruction');

    this.getCompanyId();
    this.getUserId();

    this.getlstOrderContructionById(this.idc,this.idConstruction);

    if(this.lstExtend){
      this.setFormGroup()
    }
  }

  getCompanyId() {
    this.idc = this.storeService.get(StorageData.companyId);
  }
  getUserId() {
    this.userID = this.storeService.get(StorageData.userId);
  }

 


  getlstOrderContructionById(idc: number, id: string) {    
    if( this.idConstruction !== null) {
      this.orderconstructionService.getOrderConstructionById(idc, this.id).subscribe((res: ResApi) => {
        if(res.meta.error_code == AppStatusCode.StatusCode200) {
          this.lstUnitContruction = res.data.listOrderUnits;
        }
      })
    }
  }

  onSelectUnitName(event:any){
    // this.getOrderContructionById(this.idc,this.idConstruction);
    for(let i=0;i<this.lstUnitContruction.length;i++){
      if(event.value == this.lstUnitContruction[i].UnitName){
        this.fConstructionExtend.get('ContactName').setValue(this.lstUnitContruction[i].ContactName);
        this.fConstructionExtend.get('ContactPhone').setValue(this.lstUnitContruction[i].ContactPhone);
        // if (this.lstUnitContruction[i].ContactName === "") {
        //   this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Đơn vị thi công chưa có người đại diện,vui lòng chọn đơn vị khác' });
        // }
        break;
      } 
    }
  }


  getOrderContructionById(idc: number, id: string) {    
    if( this.idConstruction !== null) {
      this.orderconstructionService.getOrderConstructionById(idc, this.id).subscribe((res: ResApi) => {
        if(res.meta.error_code == AppStatusCode.StatusCode200) {
          this.dataExtend = res.data.listOrderUnits;
          }
      })
    }
  }


  setFormGroup(){
    const Extend = this.lstExtend;

    this.fConstructionExtend = this.fb.group({
      UnitName : Extend.UnitName,
      CompanyId : this.Idc,
      CreatedById : this.userID,
      UpdatedById : this.userID,
      StatusProcess : Extend.StatusProcess,
      ContactName : Extend.ContactName,
      ContactPhone : Extend.ContactPhone,
      DateStart : new Date(Extend.DateStart),
      DateEnd: new Date(Extend.DateEnd),
      Name : Extend.Name,
      Note : Extend.Note,
      CreatedAt : Extend.CreatedAt,
    })
  }

  markAllAsDirty() {
    Object.keys(this.fConstructionExtend.controls).forEach(key => {
      const control = this.fConstructionExtend.get(key);
      if (control.enabled && control.invalid) {
        control.markAsDirty();
      }
    });
  }
  onSubmit() {
    if(this.fConstructionExtend.invalid){
      this.markAllAsDirty();
    }
    else{
      const Extend  = this.fConstructionExtend.value;
      if(this.Idc){
        Extend.Id = this.Idc;
      }else{
        const objectId = new ObjectId();
        Extend.Id = objectId.toHexString();
      }
   
  
      if(Extend.Id){
        this.itemExtend = { ...Extend };
        console.log(this.itemExtend)   
        this.ref.close(this.itemExtend);
      }
    }
  }

  onBack(){
    this.ref.close();
  }
}
