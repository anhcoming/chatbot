import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup ,Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InvoiceService } from 'src/app/services/inv-service.service';
import { AppMessageResponse,InvService_Type, AppStatusCode } from 'src/app/shared/constants/app.constants';
import { ResApi } from 'src/app/viewModels/res-api';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InvoiceServiceGroup } from 'src/app/services/inv-service-group.service';
import { PagingInvoiceService } from 'src/app/viewModels/paging';

@Component({
  selector: 'app-add-inv-service',
  templateUrl: './add-inv-service.component.html',
  styleUrls: ['./add-inv-service.component.scss']
})
export class AddInvServiceComponent  implements OnInit  {
  public id: any;
  public filterParam: PagingInvoiceService;
  TypeServiceCheck:boolean=false;
  public dataFormInvService: FormGroup;
  public dataService:any;
  public dataServiceGroup:any;
  public loading = [false];
  public invService_Type = InvService_Type;

    
    constructor (private readonly confirmationService:ConfirmationService,
      
       private router: Router,private readonly route: ActivatedRoute, 
       private readonly fb: FormBuilder,
       private  readonly invService: InvoiceService,  
       private  readonly invServiceGroup: InvoiceServiceGroup,  
       private readonly messageService: MessageService,){
        this.filterParam = new Object as PagingInvoiceService;
    this.filterParam.pageIndex=1;
    this.filterParam.pageSize=10;
    this.filterParam.type=0;
    this.dataFormInvService = fb.group({
      Id: [0],
      Code: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(150)])],
      Name: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(150)])],
      Type: [0],
      TypeService:[false],
      InvServiceGroupId: [0]
    })
    this.dataService={};
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
    });
    if(this.id==null) this.id=0;
    if(this.id!=0)
      this.getLstInvServiceById(this.id)
      this.dataFormInvService = this.fb.group({
        Id: [0],
        Code: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(150)])],
        Name: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(150)])],
        Type: [0],
        TypeService:[false],
        InvServiceGroupId: [0]

      })
    
  }
  getInvServiceGroup(id:number){
    this.filterParam.type=id;
    this.invServiceGroup.getListInvoiceByPaging(this.filterParam).subscribe((res: ResApi) => {
      if(res.meta) {
        this.dataServiceGroup=res.data.Items;
      }
      else {
      }
    }) ;
  }
  formGroup() {
    this.dataFormInvService = this.fb.group({
      Id: this.id,
      Code: this.dataService.Code,
      Name: this.dataService.Name,
      Type: this.dataService.Type,
      TypeService:this.dataService.TypeService,
      InvServiceGroupId: this.dataService.InvServiceGroupId
    })
    if(this.dataFormInvService.value.Type>=0)
    this.getInvServiceGroup(this.dataFormInvService.value.Type)
  }
  getLstInvServiceById(id: number) {

    this.invService.getInvoiceByID(id).subscribe((res: ResApi) => {
      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.dataService = res.data;

        this.formGroup();
      }
      else {
        this.dataService = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }

    })
    this.dataService = { ...this.dataService }
    console.log(this.dataService);
  }
  getServiceGroup(event:any){
    this.getInvServiceGroup(event.value)
    this.dataFormInvService.get('Type')?.setValue(event.value);
  }
  setServiceGroupId(event:any)
  {
    this.dataFormInvService.get('InvServiceGroupId')?.setValue(event.value);
  }
  onBack(event: any) {
    let isShow = true;
    // this.layoutService.getIsShow();

    if (isShow) {
      this.confirmationService.confirm({
        header:"Thông báo",
        target: event.target as EventTarget,
        message:!this.id ? "Chưa hoàn tất thêm mới dịch vụ, Bạn có muốn Hủy?" :"Chưa hoàn tất sửa dịch vụ "+ this.id+", Bạn có muốn Hủy?",
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Xác nhận',
        rejectLabel: 'Hủy bỏ',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
        accept: () => {
          this.router.navigate(['/invoice/inv-service/list']);
        },
        reject: () => {
          return;
        }
      });
    } else {
      this.router.navigate(['/invoice/inv-service/list']);
    }
  }
  onReturnPage(url: string) : void {
    this.router.navigate([url]);
  }
  onSubmit() {
    if(this.id == 0) {
      console.log(this.TypeServiceCheck);
      
      const reqData = Object.assign({}, this.dataFormInvService.value);
      reqData.TypeService=this.TypeServiceCheck;
      
      this.loading[0] = true;
      this.invService.createInvoice(reqData).subscribe(
        (res: any) => {
          this.loading[0] = false;
          if (res?.meta?.error_code == AppStatusCode.StatusCode200) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.CreatedSuccess });
            
            setTimeout(() => {this.onReturnPage('/invoice/inv-service/list')}, 1000);
          } 
          else 
            this.messageService.add({ severity: 'warn', summary: 'Warn', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
          
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
      const reqData = Object.assign({}, this.dataFormInvService.value);
      reqData.TypeService=this.TypeServiceCheck;
      this.loading[0] = true;
      this.invService.updateInvoice(this.id, reqData).subscribe(
        (res: any) => {
          this.loading[0] = false;
          if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: res.meta.error_message || AppMessageResponse.CreatedSuccess });

            setTimeout(() => {this.onReturnPage('/invoice/inv-service/list')}, 1500);
          } else {
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
