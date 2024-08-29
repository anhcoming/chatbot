import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { OrderCancelService } from 'src/app/services/order-cancel.service';
import { AppMessageResponse, AppStatusCode, StorageData, UserCancel } from 'src/app/shared/constants/app.constants';
import { StorageService } from 'src/app/shared/services/storage.service';

@Component({
  selector: 'app-cancel-document',
  templateUrl: './cancel-document.component.html',
  styleUrls: ['./cancel-document.component.scss']
})
export class CancelDocumentComponent  {
  fCancel : any;
  lstUserCancel = UserCancel;
  id : any;
  loading = [false];
  userId: any;
  idcancel : any;
  Idc: any;
  constructor(
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

  }
  ngOnInit(){
     this.route.paramMap.subscribe(params => {
      this.idcancel = params.get('id');
    });
    this.id = localStorage.getItem('id-order-construction');

    this.getCompanyId();
    this.getUserId();

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
    this.fCancel.get('DateCancel').disable();
  }

  getUserId() {
    this.userId = this.storeService.get(StorageData.userId); 
  }
  getCompanyId() {
    this.Idc = this.storeService.get(StorageData.companyId); 
  }


  onSubmit() {
    if(this.idcancel == null) {

      this.fCancel.controls['Id'].setValue(0);
      
      const reqData = Object.assign({}, this.fCancel.value);
      
      this.loading[0] = true;
      this.cancelService.createOrderCancel(reqData).subscribe(
        (res: any) => {
          this.loading[0] = false;
          if (res?.meta?.error_code == AppStatusCode.StatusCode200) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.CreatedSuccess });
            
            setTimeout(() => {this.ref.close()}, 1000);
          } 
          else { 
            this.loading[0] = false
            
            this.messageService.add({ severity: 'warn', summary: 'Warn', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
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

onReturnPage(url: string) : void {
  this.router.navigate([url]);
}
  onBack(){
    this.ref.close();
  }
}
