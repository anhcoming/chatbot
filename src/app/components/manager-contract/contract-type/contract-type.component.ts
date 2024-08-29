import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InvoiceContractTypeService } from 'src/app/services/inv-contract-type.service';
import { AppMessageResponse, AppStatusCode, StorageData } from 'src/app/shared/constants/app.constants';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ContractType } from 'src/app/viewModels/contract-type/contract-type';
import { PagingInvoice } from 'src/app/viewModels/paging';
import { ResApi } from 'src/app/viewModels/res-api';

@Component({
  selector: 'app-contract-type',
  templateUrl: './contract-type.component.html',
  styleUrls: ['./contract-type.component.scss']
})
export class ContractTypeComponent implements OnInit {
  public filterParrams: PagingInvoice;
  public first = 0;
  public rows = 10;
  public filterText: string;
  public loading = [false];
  public lstContractType: Array<ContractType>
  public isLoadingTable: boolean = false;
  constructor(
    private readonly invoiceContractType: InvoiceContractTypeService,
    private readonly messageService: MessageService,
    private readonly storeService: StorageService,
    private router: Router,
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly confirmationService: ConfirmationService,
  ) {
    this.lstContractType = new Array<ContractType>();
    this.filterParrams = new Object as PagingInvoice;
    this.filterParrams.keyword = "";
    this.filterParrams.pageIndex = 1;
    this.filterParrams.pageSize = 100;
    this.filterText = '';


  }
  ngOnInit() {
    this.getLstContractTypeByPaging();

  }
  getLstContractTypeByPaging() {
    this.isLoadingTable = true;

    this.invoiceContractType.getListInvoiceByPaging(this.filterParrams).subscribe((res: ResApi) => {
      this.isLoadingTable = false;

      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstContractType = res.data.Items;
      }
      else {
        this.lstContractType = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    },
      () => {
        this.isLoadingTable = false;
        this.lstContractType = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest });
      })
  }
  onSearch() {
    this.filterParrams.keyword = `Name.ToLower().Contains("${this.filterText}") OR Code.ToLower().Contains("${this.filterText}")`;

    this.getLstContractTypeByPaging();
  }
  onDelete(id: number) {

    this.confirmationService.confirm({
      message: 'Bạn có muốn xóa loại hợp đồng này không?',
      header: 'XÓA LOẠI HỢP ĐỒNG',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xác nhận',
      rejectLabel: 'Hủy bỏ',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.invoiceContractType.deleteInvoice(id).subscribe(
          (res: any) => {
            this.loading[0] = false;
            if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
              this.lstContractType = this.lstContractType.filter(s => s.Id !== id);
              this.messageService.add({ severity: 'success', summary: 'Success', detail: res.meta.error_message || AppMessageResponse.CreatedSuccess });


              //return;
            } else {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
              return;
            }
          }
        );

      },
      reject: (type: any) => {
        return;
      }
    });
  }

}
