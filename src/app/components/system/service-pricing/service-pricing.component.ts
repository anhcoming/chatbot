import { Component } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { AppMessageResponse, AppStatusCode, StorageData } from 'src/app/shared/constants/app.constants';
import { ServicePricingService } from 'src/app/services/service-pricing.service';
import { Paging } from 'src/app/viewModels/paging';
import { ResApi } from 'src/app/viewModels/res-api';
import { FunctionRoleService } from 'src/app/services/function-role.service';
import { ServicePricing } from 'src/app/viewModels/service-pricing/service-pricing';
import { StorageService } from 'src/app/shared/services/storage.service';

@Component({
  selector: 'app-service-pricing',
  templateUrl: './service-pricing.component.html',
  styleUrls: ['./service-pricing.component.scss']
})
export class ServicePricingComponent {
  public filterParrams : Paging ;
  public lstServicePricing: Array<ServicePricing>;
  public first = 0;
  public rows = 10;
  search: string = '';
  isInputEmpty: boolean = true;
  public loading = [false];
  public isLoadingTable: boolean = false;
  public Idc: any;
  public data: any;
  constructor(
    private readonly servicepricingService: ServicePricingService,
    private readonly storeService: StorageService,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private readonly functionroleService: FunctionRoleService,
  ) {
    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 100;
    this.lstServicePricing = new Array<ServicePricing>;
  }
  ngOnInit() {
    this.filterParrams.query = `CompanyId=0`
    this.getCompanyId();
    this.getListServicePricing();
  }
  getCompanyId() {
    this.Idc = this.storeService.get(StorageData.companyId);
  }
  getListServicePricing() {
    this.isLoadingTable =true;
    this.servicepricingService.getListServicePricingByPaging(this.filterParrams).subscribe((res: ResApi) => {
      this.isLoadingTable = false;
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.data = res.data;
      }
      else {
        this.data = [];
        this.messageService.add({severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest});
      }
      this.lstServicePricing = [...this.data];
    },
    () => {
      this.isLoadingTable = false;
      this.data = [];
      this.messageService.add({severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest})
    })
  }
  onDelete(id: number, index: number) {
    this.confirmationService.confirm({
      message: 'Bạn có muốn xóa gói dịch vụ <b>"'+ this.lstServicePricing.filter((i: any) => i.Id == id)[0].Name +'"</b> này không?',
      header: 'XÓA GÓI DỊCH VỤ',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xác nhận',
      rejectLabel: 'Hủy bỏ',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.servicepricingService.deleteServicePricingById(id).subscribe(
          (res: any) => {
            this.loading[0] = false;
            if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
              this.lstServicePricing = this.lstServicePricing.filter((id, i) => i !== index);
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
  onSearch(event: any) {
    const searchValue = event.target.value.toLowerCase().trim();
    const filteredArray = this.data.filter((item: any) => {
      return item.Name.toLowerCase().includes(searchValue) || item.Code.toLowerCase().includes(searchValue)
    });
    this.lstServicePricing = filteredArray
  }
  onClearInput() {
    this.search = '';
    this.isInputEmpty = true;
    this.lstServicePricing = this.data
  }
}
