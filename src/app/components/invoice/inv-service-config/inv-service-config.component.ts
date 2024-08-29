import { PagingInvoiceService,PagingInvoiceConfig } from 'src/app/viewModels/paging';
import { ResApi } from 'src/app/viewModels/res-api';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { AppMessageResponse, AppStatusCode,InvService_Type } from 'src/app/shared/constants/app.constants';
import { InvoiceServiceConfig } from 'src/app/services/inv-service-config.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-inv-service-config',
  templateUrl: './inv-service-config.component.html',
  styleUrls: ['./inv-service-config.component.scss']
})
export class InvServiceConfigComponent implements OnInit{
  public filterParam : PagingInvoiceConfig;
  public Projectdata:any=[
    {
      Id:1,
      Name:'item1'
    },
    {
      Id:2,
      Name:'item2'
    }
  ]
  public fPosition : FormGroup;

  public invServiceDataConfig: any;
  public loading = [false];
  public invService_Type = InvService_Type;

  constructor (private  readonly invServiceConfig: InvoiceServiceConfig,
    private readonly fb: FormBuilder,
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService,){
    this.filterParam = new Object as PagingInvoiceConfig;
    this.filterParam.pageIndex=1;
    this.filterParam.pageSize=1000;
    this.filterParam.type=0;
    this.filterParam.ProjectId=0;
    this.filterParam.TowerId=0;
    this.filterParam.ZoneId=0;
    this.filterParam.InvServiceGroupId=0;
    this.filterParam.InvServiceId=0;

    this.fPosition = this.fb.group({
      ProjectId: ['']
    })
  }
  ngOnInit() {
    this.getListInvService()
  }
  getListInvService(){
    this.invServiceConfig.getListInvoiceByPaging(this.filterParam).subscribe((res: ResApi) => {
      if(res.meta) {
        this.invServiceDataConfig=res.data.Items;
        for(let i=0;i<this.invServiceDataConfig.length;i++)
        {
          for(let j=0;j<this.invService_Type.length;j++)
          {
            if(this.invServiceDataConfig[i].Type===this.invService_Type[j].value)
            {
              this.invServiceDataConfig[i].TypeName=this.invService_Type[j].label;
              break;
            }
          }
          if(this.invServiceDataConfig[i].TypeName===undefined) this.invServiceDataConfig[i].TypeName="";
        }
      }
      else {
      }
    }) ;
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
        this.invServiceConfig.deleteInvoice(id).subscribe(
          (res: any) => {
            this.loading[0] = false;
            if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
              this.invServiceDataConfig = this.invServiceDataConfig.filter((i:any) => i.Id !== id);
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
