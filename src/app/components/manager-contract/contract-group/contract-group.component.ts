import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InvoiceContractGroup } from 'src/app/services/inv-contract-group.service';
import { AppMessageResponse, AppStatusCode, StorageData } from 'src/app/shared/constants/app.constants';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ContractGroup } from 'src/app/viewModels/contract-group/contract-group';
import { PagingInvoice } from 'src/app/viewModels/paging';
import { ResApi } from 'src/app/viewModels/res-api';

@Component({
  selector: 'app-contract-group',
  templateUrl: './contract-group.component.html',
  styleUrls: ['./contract-group.component.scss']
})
export class ContractGroupComponent implements OnInit{
  public filterParrams: PagingInvoice;
  public filterText : string;
  public loading = [false];
  Idc : any;
  public lstContractGroup : Array<ContractGroup>;
  public isLoadingTable: boolean = false;
  constructor(
    private readonly invoiceContractGroup : InvoiceContractGroup,
    private readonly messageService: MessageService,
    private readonly storeService: StorageService,
    private router: Router,
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly confirmationService: ConfirmationService,
  ){
    this.lstContractGroup = new Array<ContractGroup>();
    this.filterParrams = new Object as PagingInvoice;
    this.filterParrams.keyword = "";
    this.filterParrams.pageIndex = 1;
    this.filterParrams.pageSize = 1000;
    this.filterText = '';
  }
  ngOnInit() {
    this.getCompanyId();
    this.getListContractGroupByPaging();
   }
   getCompanyId() {
     this.Idc = this.storeService.get(StorageData.companyId); 
   }
   getListContractGroupByPaging(){
    this.isLoadingTable = true;
    this.invoiceContractGroup.getListInvoiceByPaging(this.filterParrams).subscribe((res : ResApi) => {
      this.isLoadingTable = false;

      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstContractGroup = res.data.Items;
      }
      else {
        this.lstContractGroup = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
   },
    () => {
      this.isLoadingTable = false;
      this.lstContractGroup = [];
      this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest });
    })
  }
  onSearch() {
    this.filterParrams.keyword = `Name.ToLower().Contains("${this.filterText}") OR Code.ToLower().Contains("${this.filterText}")`;

    this.getListContractGroupByPaging();
  }
  onDelete(id: number) {

    this.confirmationService.confirm({
      message: 'Bạn có muốn xóa nhóm hợp đồng này không?',
      header: 'XÓA NHÓM HỢP ĐỒNG',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xác nhận',
      rejectLabel: 'Hủy bỏ',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.invoiceContractGroup.deleteInvoice(id).subscribe(
          (res: any) => {
            this.loading[0] = false;
            if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
              this.lstContractGroup = this.lstContractGroup.filter(s => s.Id !== id);
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

