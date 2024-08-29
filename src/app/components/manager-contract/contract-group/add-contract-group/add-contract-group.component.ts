import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InvoiceContractGroup } from 'src/app/services/inv-contract-group.service';
import { AppMessageResponse, AppStatusCode } from 'src/app/shared/constants/app.constants';
import { ResApi } from 'src/app/viewModels/res-api';

@Component({
  selector: 'app-add-contract-group',
  templateUrl: './add-contract-group.component.html',
  styleUrls: ['./add-contract-group.component.scss']
})
export class AddContractGroupComponent {
  public id: any;
  ContractGroupCheck: boolean = false;
  public ContractGroup: FormGroup;
  public dataContractGroup: any;
  public loading = [false];
  constructor(
    private readonly invoiceContractGroup : InvoiceContractGroup,
    private readonly confirmationService: ConfirmationService,
    private router: Router,
    private readonly route: ActivatedRoute,
    private readonly fb: FormBuilder,
    private readonly messageService: MessageService,
  ) {
    this.ContractGroup = fb.group({
      Id: 0,
      Code: undefined,
      Name: undefined,
      State: false
    })
    this.dataContractGroup = {};
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
    });
    if (this.id === null) this.id = 0;
    else {
      this.invoiceContractGroup.getInvoiceByID(this.id).subscribe((res: ResApi) => {
        if (res.meta.error_code == AppStatusCode.StatusCode200) {
          this.dataContractGroup = res.data;
          this.ContractGroup = this.fb.group({
            Id: this.dataContractGroup.Id,
            Code: this.dataContractGroup.Code,
            Name: this.dataContractGroup.Name,
            State: this.dataContractGroup.State
          })
        }
        else {
          this.dataContractGroup = [];
          this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
        }

      })
    }
  }
  onReturnPage(url: string) : void {
    this.router.navigate([url]);
  }
  onSubmit() {
      const reqData = this.ContractGroup.value;
      reqData.State=this.ContractGroupCheck;
      this.loading[0] = true;
      this.invoiceContractGroup.createInvoice(reqData).subscribe(
        (res: any) => {
          this.loading[0] = false;
          if (res?.meta?.error_code == AppStatusCode.StatusCode200) {
            this.id==0?this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.CreatedSuccess }):this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.UpdatedSuccess });
            setTimeout(() => {this.onReturnPage('/manager-contract/contract-group/list')}, 1000);
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
  }
  onBack(event: any) {
    let isShow = true;
    // this.layoutService.getIsShow();

    if (isShow) {
      this.confirmationService.confirm({
        header:"Thông báo",
        target: event.target as EventTarget,
        message:!this.id ? "Chưa hoàn tất thêm mới nhóm hợp đồng, Bạn có muốn Hủy?" :"Chưa hoàn tất sửa nhóm hợp đồng "+ this.id+", Bạn có muốn Hủy?",
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Xác nhận',
        rejectLabel: 'Hủy bỏ',
        acceptButtonStyleClass: 'p-button-success',
        rejectButtonStyleClass: 'p-button-danger',
        accept: () => {
          this.router.navigate(['/manager-contract/contract-group/list']);
        },
        reject: () => {
          return;
        }
      });
    } else {
      this.router.navigate(['/manager-contract/contract-group/list']);
    }
  }
}
