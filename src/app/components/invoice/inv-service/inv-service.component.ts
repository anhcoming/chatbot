import { InvoiceService } from 'src/app/services/inv-service.service';
import { PagingInvoiceServices } from 'src/app/viewModels/paging';
import { ResApi } from 'src/app/viewModels/res-api';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { AppMessageResponse, AppStatusCode,InvService_Type } from 'src/app/shared/constants/app.constants';


@Component({
  selector: 'app-inv-service',
  templateUrl: './inv-service.component.html',
  styleUrls: ['./inv-service.component.scss']
})
export class InvServiceComponent implements OnInit{
  public filterParam : PagingInvoiceServices;
  public invServiceData: any;
  public loading = [false];
  public invService_Type = InvService_Type;
  public searchTxt='';

  constructor (private  readonly invService: InvoiceService,
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService,){
    this.filterParam = new Object as PagingInvoiceServices;
    this.filterParam.pageIndex=1;
    this.filterParam.pageSize=1000;
    this.filterParam.type=0;
    this.filterParam.InvServiceGroupId=0;
  }
  ngOnInit() {
    this.getListInvService()
  }
  getListInvService(){
    this.invService.getListInvoiceByPaging(this.filterParam).subscribe((res: ResApi) => {
      if(res.meta) {
        this.invServiceData=res.data.Items;
        for(let i=0;i<this.invServiceData.length;i++)
        {
          for(let j=0;j<this.invService_Type.length;j++)
          {
            if(this.invServiceData[i].Type===this.invService_Type[j].value)
            {
              this.invServiceData[i].TypeName=this.invService_Type[j].label;
              break;
            }
          }
          if(this.invServiceData[i].TypeName===undefined) this.invServiceData[i].TypeName="";
        }
      }
      else {
      }
    }) ;
  }
  onSearch()
  {
    this.filterParam.keyword=this.searchTxt;
    this.getListInvService()
  }
  onDelete(id: number) {
  
    this.confirmationService.confirm({
      message: 'Bạn có muốn xóa dịch vụ này không?',
      header: 'XÓA DỊCH VỤ',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xác nhận',
      rejectLabel: 'Hủy bỏ',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.invService.deleteInvoice(id).subscribe(
          (res: any) => {
            this.loading[0] = false;
            if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
              this.invServiceData = this.invServiceData.filter((i:any) => i.Id !== id);
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
