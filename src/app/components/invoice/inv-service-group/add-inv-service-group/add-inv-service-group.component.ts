import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup ,Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InvoiceServiceGroup } from 'src/app/services/inv-service-group.service';
import { AppMessageResponse,InvService_Type, AppStatusCode } from 'src/app/shared/constants/app.constants';
import { ResApi } from 'src/app/viewModels/res-api';
import { ConfirmationService, MessageService } from 'primeng/api';


@Component({
  selector: 'app-add-inv-service-group',
  templateUrl: './add-inv-service-group.component.html',
  styleUrls: ['./add-inv-service-group.component.scss']
})
export class AddInvServiceGroupComponent  implements OnInit  {
  public id: any;
  TypeServiceGroupCheck:boolean=false;
  public dataFormInvServiceGroup: FormGroup;
  public dataServiceGroup:any;
  public loading = [false];
  public invService_Type = InvService_Type;

    
    constructor (private readonly confirmationService:ConfirmationService, private router: Router,private readonly route: ActivatedRoute, private readonly fb: FormBuilder,private  readonly invServiceGroup: InvoiceServiceGroup,  private readonly messageService: MessageService,){
    this.dataFormInvServiceGroup = fb.group({
      Id: [0],
      Code: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(150)])],
      Name: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(150)])],
      Type: [0],
      TypeServiceGroup:[false]

    })
    this.dataServiceGroup={};
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
    });
    if(this.id==null) this.id=0;
    console.log(this.id)
    if(this.id)
      this.getLstInvServiceGroupById(this.id)

      this.dataFormInvServiceGroup = this.fb.group({
        Id: [0],
        Code: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(150)])],
        Name: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(150)])],
        Type: [0],
        TypeServiceGroup:[false]

      })
    
  }
  formGroup() {
    this.dataFormInvServiceGroup = this.fb.group({

      Id: this.id,
      Code: this.dataServiceGroup.Code,
      Name: this.dataServiceGroup.Name,
      Type: this.dataServiceGroup.Type,
      TypeServiceGroup:this.dataServiceGroup.TypeServiceGroup
    })
  }
  getLstInvServiceGroupById(id: number) {

    this.invServiceGroup.getInvoiceByID(id).subscribe((res: ResApi) => {
      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.dataServiceGroup = res.data;

        this.formGroup();
      }
      else {
        this.dataServiceGroup = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }

    })
    this.dataServiceGroup = { ...this.dataServiceGroup }
    console.log(this.dataServiceGroup);
  }

  onBack(event: any) {
    let isShow = true;
    // this.layoutService.getIsShow();

    if (isShow) {
      this.confirmationService.confirm({
        header:"Thông báo",
        target: event.target as EventTarget,
        message:!this.id ? "Chưa hoàn tất thêm mới nhóm dịch vụ, Bạn có muốn Hủy?" :"Chưa hoàn tất sửa nhóm dịch vụ "+ this.id+", Bạn có muốn Hủy?",
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Xác nhận',
        rejectLabel: 'Hủy bỏ',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
        accept: () => {
          this.router.navigate(['/invoice/inv-service-group/list']);
        },
        reject: () => {
          return;
        }
      });
    } else {
      this.router.navigate(['/invoice/inv-service-group/list']);
    }
  }
  onReturnPage(url: string) : void {
    this.router.navigate([url]);
  }
  onSubmit() {
    if(this.id == 0) {
      const reqData = Object.assign({}, this.dataFormInvServiceGroup.value);
      reqData.TypeServiceGroup=this.TypeServiceGroupCheck;
      reqData.Id=this.id;
      this.loading[0] = true;
      this.invServiceGroup.createInvoice(reqData).subscribe(
        (res: any) => {
          this.loading[0] = false;
          if (res?.meta?.error_code == AppStatusCode.StatusCode200) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.CreatedSuccess });
            
            setTimeout(() => {this.onReturnPage('/invoice/inv-service-group/list')}, 1000);
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
      const reqData = Object.assign({}, this.dataFormInvServiceGroup.value);
      reqData.TypeServiceGroup=this.TypeServiceGroupCheck;
      this.loading[0] = true;
      reqData.Id=this.id;
      this.invServiceGroup.updateInvoice(reqData).subscribe(
        (res: any) => {
          this.loading[0] = false;
          if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: res.meta.error_message || AppMessageResponse.CreatedSuccess });

            setTimeout(() => {this.onReturnPage('/invoice/inv-service-group/list')}, 1500);
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
