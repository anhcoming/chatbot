import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { OrderAcceptanceService } from 'src/app/services/order-acceptance.service';
import { AppMessageResponse, AppStatusCode, StorageData } from 'src/app/shared/constants/app.constants';
import { StorageService } from 'src/app/shared/services/storage.service';
import { Paging } from 'src/app/viewModels/paging';
import { ResApi } from 'src/app/viewModels/res-api';

@Component({
  selector: 'app-order-acceptance',
  templateUrl: './order-acceptance.component.html',
  styleUrls: ['./order-acceptance.component.scss']
})
export class OrderAcceptanceComponent {
  lstOrderAcceptance : any;
  isLoadingTable :  boolean = false;
  id : any;
  public filterParrams : Paging;
  Idc: any;
  loading = [false];
  userID: any;
  constructor(
    private readonly orderAcceptanceService : OrderAcceptanceService,
    private readonly storeService : StorageService,
    private readonly messageService : MessageService,
    private readonly confirmationService : ConfirmationService,
    private router: Router,
    private route: ActivatedRoute,
  ){
    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1 ;
    this.filterParrams.page_size = 100;
  }
  
  ngOnInit(){
    this.id = localStorage.getItem('id-order-orderconstruction');
    this.getCompanyId();
    this.getUserId();
    this.getLstOrderConstructionByPaging();
  }

  getCompanyId() {
    this.Idc = this.storeService.get(StorageData.companyId);
  }
  getUserId() {
    this.userID = this.storeService.get(StorageData.userId);
  }

  getLstOrderConstructionByPaging() {
    this.isLoadingTable = true;

    this.orderAcceptanceService.getOrderConstructionByPaging(this.filterParrams).subscribe((res: ResApi) => {
      this.isLoadingTable = false;

      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstOrderAcceptance = res.data;
      }
      else {
        this.lstOrderAcceptance = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    },
    () => {
      this.isLoadingTable = false;
      this.lstOrderAcceptance = [];
      this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest });
    })
  }

  deleteAcceptance(id : string){
      this.confirmationService.confirm({
        message: 'Bạn có muốn xóa đơn nghiệm thu <b>' +this.lstOrderAcceptance.filter((i: any) => i.Id == id)[0].Name+' </b> này không?',
        header: 'XÓA ĐƠN NGHIỆM THU',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Xác nhận',
        rejectLabel: 'Hủy bỏ',
        acceptButtonStyleClass: 'p-button-success',
        rejectButtonStyleClass: 'p-button-danger',
        accept: () => {
          this.orderAcceptanceService.deleteOrderConstructionById(this.Idc, id).subscribe(
            (res: any) => {
              this.loading[0] = false;
              if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
                this.lstOrderAcceptance = this.lstOrderAcceptance.filter((s:any) => s.Id !== id);
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
