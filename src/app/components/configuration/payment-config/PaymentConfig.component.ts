import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfigPaymentService } from 'src/app/services/config-payment.service';
import { ProjectService } from 'src/app/services/project.service';
import { TowerService } from 'src/app/services/tower.service';
import { docmainImage } from 'src/app/shared/constants/api.constants';
import { AppMessageResponse, AppStatusCode, StorageData } from 'src/app/shared/constants/app.constants';
import { StorageService } from 'src/app/shared/services/storage.service';
import { Paging } from 'src/app/viewModels/paging';
import { ResApi } from 'src/app/viewModels/res-api';



@Component({
  selector: 'app-payment-config',
  templateUrl: './payment-config.component.html',
  styleUrls: ['./payment-config.component.scss']
})
export class PaymentConfigComponent implements OnInit {
  public filterParrams: Paging;
  public lstPayment: any[] = [];
  public first = 0;
  public rows = 10;
  public Idc: any;
  public selectedItems: any;
  public lstDelete: any[] = [];
  data = [];
  public selectedProjectId: number | undefined;
  public itemFloor: any;
  menuItems: any;
  public fSearch: FormGroup;
  public lstZone: any[];
  public lstTower: [];
  public lstProject: any;
  public isLoadingTable: boolean = false;
  public loading = [false];
  search: string = '';
  isInputEmpty: boolean = true;
  public docmainImage = docmainImage;
  constructor(
    private readonly storeService: StorageService,
    private readonly paymentService: ConfigPaymentService,
    private readonly projectService: ProjectService,
    private readonly towerService: TowerService,
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService,
    private readonly fb: FormBuilder
  ) {
    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 1000;

    this.lstTower = [];
    this.lstZone = [];
    this.lstProject = [];
    this.fSearch = fb.group({
      ProjectId: [''],
      TowerId: [''],
      ZoneId: [''],
    });
  }

  ngOnInit() {
    this.getListConfigPayment();
    this.getListProject();
    this.getCompanyId();
    this.getTower();
  }

  getListProject() {
    this.lstProject = [];
    this.projectService.getListByPaging(this.filterParrams).subscribe((res: ResApi) => {
      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstProject = res.data;
      }
      else {
        this.lstProject = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    });
  }
  getTower() {
    this.towerService.getListTowerByPaging(this.filterParrams).subscribe((res: ResApi) => {
      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstTower = res.data;
      }
      else {
        this.lstTower = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    });
  }

  onDelete(id: number) {
    this.confirmationService.confirm({
      message: 'Bạn có muốn xóa cấu hình thanh toán "<b>'+ this.lstPayment.filter(item => item.Id == id)[0].Name +'</b>" này không?',
      header: 'XÓA CẤU HÌNH THANH TOÁN',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xác nhận',
      rejectLabel: 'Hủy bỏ',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.paymentService.deleteConfigPaymentById(id).subscribe(
          (res: any) => {
            this.loading[0] = false;
            if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
              this.lstPayment = this.lstPayment.filter(s => s.Id !== id);
              this.messageService.add({ severity: 'success', summary: 'Success', detail: res.meta.error_message || AppMessageResponse.CreatedSuccess });
              //return;
            } else {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: res.meta?.error_message || AppMessageResponse.BadRequest });
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

  onSelect(event: any) {
    if (event.value == null) {
      this.lstPayment = [...this.data];
      this.filterParrams.query = '1=1';
    } else {
      this.lstPayment = this.data.filter((i: any) => i.ProjectId == event.value);
      this.filterParrams.query = `ProjectId=${event.value}`
    }
    this.getTower();
  }
  onSelectTower(event: any) {
    if (event.value == null) {
      if(this.fSearch.get('ProjectId')?.value){
        this.lstPayment = this.data.filter((i: any) => i.ProjectId == this.fSearch.get('ProjectId')?.value);
      }else{
        this.lstPayment = [...this.data]
      }
    } else {
      this.lstPayment = this.data.filter((item: any) => {
        return item.listTowerMaps.some((i: any) => i.TowerId === event.value);
      });
      
    }
  }

  onSearch(event: any) {
    const searchValue = event.target.value.toLowerCase().trim();
    this.filterParrams.query = `Name.ToLower().Contains("${searchValue}") OR CardList.ToLower().Contains("${searchValue}")`;
    this.getListConfigPayment();
  }
  onClearInput() {
    this.search = '';
    this.isInputEmpty = true;
    this.filterParrams.query = `Name.ToLower().Contains("${this.search}") OR CardList.ToLower().Contains("${this.search}")`;
    this.getListConfigPayment();
  }
  getCompanyId() {
    this.Idc = this.storeService.get(StorageData.companyId);
  }
  getListConfigPayment() {
    this.isLoadingTable = true;
    this.paymentService.getListConfigPaymentByPaging(this.filterParrams).subscribe((res: ResApi) => {
      if(res.meta.error_code = AppStatusCode.StatusCode200) {
        this.isLoadingTable = false;
        this.data = res.data;
        this.lstPayment = [...this.data]
      }
    })
  }
}
