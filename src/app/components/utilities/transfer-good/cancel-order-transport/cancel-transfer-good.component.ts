import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Console } from 'console';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { OrderCancelService } from 'src/app/services/order-cancel.service';
import { OrderTransportService } from 'src/app/services/order-transport.service';
import { AppMessageResponse, AppStatusCode, StorageData } from 'src/app/shared/constants/app.constants';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ResApi } from 'src/app/viewModels/res-api';

@Component({
  selector: 'app-cancel-transfer-good',
  templateUrl: './cancel-transfer-good.component.html',
  styleUrls: ['./cancel-transfer-good.component.scss']
})
export class CancelTransferGoodComponent {
  itemGood : any;
  fCancel: any;
  fTransfer : any;
  currentDate = new Date()
  public lstUnit : any;
  goodId : any;
  public loading = [false];
  userId: any;
  dataOrderTransport : any;
  dataCancel : any;
  Idc: any;
  id: any;
  constructor(
    private readonly orderTransferService : OrderTransportService,
    private readonly cancelService : OrderCancelService,
    public ref: DynamicDialogRef,
    public dialogService : DialogService,
    private readonly messageService: MessageService,
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private router: Router,
    private readonly storeService : StorageService,

    private confirmationService: ConfirmationService,
  ){
    this.dataCancel = {};
   

  }

  ngOnInit(){
      this.id = localStorage.getItem('id-order-transport')
    console.log(this.id);


    this.getUserId();
    this.getCompanyId();
    

    this.fCancel = this.fb.group({
      Id : 0,
      TargetType :[1],
      UserCancel : [''],
      TargetId : this.id,
      CreatedById : Number(this.userId),
      UpdatedById :Number(this.userId),
      CompanyId : Number(this.Idc),
      Status: 1,
      Type : 1,
      DateCancel : [new Date(),Validators.required],
      Note: '',
    })
  }

  getUserId() {
    this.userId = this.storeService.get(StorageData.userId); 
  }
  getCompanyId() {
    this.Idc = this.storeService.get(StorageData.companyId); 
  }



  onSubmit() {
      if(this.id) {

        this.fCancel.controls['Id'].setValue(0);
        
        const reqData = Object.assign({}, this.fCancel.value);
        
        this.loading[0] = true;
        this.cancelService.createOrderCancel(reqData).subscribe(
          (res: any) => {
            this.loading[0] = false;
            if (res?.meta?.error_code == AppStatusCode.StatusCode200) {
              // this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.CreatedSuccess });
              
              setTimeout(() => {this.ref.close()}, 1000);
            } 
            else { 
              this.loading[0] = false
              
              // this.messageService.add({ severity: 'warn', summary: 'Warn', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
            }
          },
          () => {
            this.loading[0] = false;
            // this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest });
          },
          () => {
            this.loading[0] = false;
          }
        );
      }
  }

  getCancelById(idc: number, id: string,type:number) {    
    if( this.id !== null) {
      this.cancelService.getOrderCancelById(this.Idc, this.id,1).subscribe((res: ResApi) => {
        if(res.meta.error_code == AppStatusCode.StatusCode200) {
          this.dataCancel = res.data;    
          this.formGroup();
        }
        else {
          this.dataCancel = [];
          this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
        }
      }) 
      this.dataCancel={...this.dataCancel}
    }else{
      this.dataCancel = [];
    }
  }
  formGroup(){
    this.fCancel = this.fb.group({
      Id : this.dataCancel.Id,
      CreatedById : this.userId,
      UpdatedById : this.userId,
      CompanyId : this.Idc,
      Status: this.dataCancel.Status,
      Type : this.dataCancel.Type,
      DateCancel : new Date(this.dataCancel.DateCancel),
      Note: this.dataCancel.Note,
    })
  }

  onReturnPage(url: string) : void {
    this.router.navigate([url]);
  }
  onBack(){
    this.ref.close();
  }
}
