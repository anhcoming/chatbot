import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AppMessageResponse, AppStatusCode } from 'src/app/shared/constants/app.constants';
import { ResApi } from 'src/app/viewModels/res-api';
import { InvoiceContractTypeService } from 'src/app/services/inv-contract-type.service';

@Component({
  selector: 'app-add-contract-type',
  templateUrl: './add-contract-type.component.html',
  styleUrls: ['./add-contract-type.component.scss']
})
export class AddContractTypeComponent {
  public id: any;
  ContractTypeCheck: boolean = false;
  public ContractType: FormGroup;
  public dataContractType: any;
  public loading = [false];
  constructor(
    private readonly invoiceContractType: InvoiceContractTypeService,
    private readonly confirmationService: ConfirmationService,
    private router: Router,
    private readonly route: ActivatedRoute,
    private readonly fb: FormBuilder,
    private readonly messageService: MessageService,
  ) {
    this.ContractType = fb.group({
      Id: 0,
      Code: undefined,
      Name: undefined,
      State: false

    })
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
    });
    if (this.id === null) this.id = 0;
    else {
      this.invoiceContractType.getInvoiceByID(this.id).subscribe((res: ResApi) => {
        if (res.meta.error_code == AppStatusCode.StatusCode200) {
          this.dataContractType = res.data;
          this.ContractType = this.fb.group({
            Id: this.dataContractType.Id,
            Code: this.dataContractType.Code,
            Name: this.dataContractType.Name,
            State: this.dataContractType.State

          })
        }
        else {
          this.dataContractType = [];
          this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
        }

      })
    }

  }
  onSubmit() {
    const reqData = this.ContractType.value
    reqData.State = this.ContractTypeCheck;
    reqData.Id = this.id;
    this.loading[0] = true;
    this.invoiceContractType.createInvoice(reqData).subscribe(
      (res: any) => {
        this.loading[0] = false;
        if (res?.meta?.error_code == AppStatusCode.StatusCode200) {
          this.id==0?this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.CreatedSuccess }):this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.UpdatedSuccess });

          setTimeout(() => { this.onReturnPage('/manager-contract/contract-type/list') }, 1000);
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

  onReturnPage(url: string): void {
    this.router.navigate([url]);
  }

  onBack(event: any) {
    let isShow = true;
    // this.layoutService.getIsShow();

    if (isShow) {
      this.confirmationService.confirm({
        header: "Thông báo",
        target: event.target as EventTarget,
        message: !this.id ? "Chưa hoàn tất thêm mới loại hợp đồng, Bạn có muốn Hủy?" : "Chưa hoàn tất sửa loại hợp đồng " + this.id + ", Bạn có muốn Hủy?",
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Xác nhận',
        rejectLabel: 'Hủy bỏ',
        acceptButtonStyleClass: 'p-button-success',
        rejectButtonStyleClass: 'p-button-danger',
        accept: () => {
          this.router.navigate(['/manager-contract/contract-type/list']);
        },
        reject: () => {
          return;
        }
      });
    } else {
      this.router.navigate(['/manager-contract/contract-type/list']);
    }
  }
}
