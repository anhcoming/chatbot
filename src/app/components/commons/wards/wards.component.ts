import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService, ConfirmationService, MenuItem } from 'primeng/api';
import { CommonService } from 'src/app/services/common.service';
import { WardsService } from 'src/app/services/wards.service';
import { AppStatusCode, AppMessageResponse, StorageData } from 'src/app/shared/constants/app.constants';
import { StorageService } from 'src/app/shared/services/storage.service';
import { Paging } from 'src/app/viewModels/paging';
import { ResApi } from 'src/app/viewModels/res-api';
import { Wards } from 'src/app/viewModels/wards/wards';

@Component({
  selector: 'app-wards',
  templateUrl: './wards.component.html',
  styleUrls: ['./wards.component.scss']
})
export class WardsComponent implements OnInit {
  public filterParrams : Paging ;
  public lstWards!: Array<Wards>;
  public first = 0;
  public rows = 10;
  search: string = '';
  isInputEmpty: boolean = true;
  data = [];
  public loading = [false];
  public isLoadingTable: boolean = false;
  public selectedWard: any;
  Idc: any;
  positions = [];
  departments = [];

  constructor(
    private readonly commonService: CommonService,
    private readonly messageService: MessageService,
    private readonly wardService: WardsService,
    private readonly confirmationService: ConfirmationService,
    private modalService: NgbModal,
    private readonly storeService: StorageService,
    private readonly fb: FormBuilder,
    //private readonly customerService: CustomerService
  ) {
    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 100;

    this.lstWards = new Array<Wards>();

  }

  ngOnInit() {
    this.getCompanyId();
    this.getListWardsByPaging();
}

getListWardsByPaging() {
  this.isLoadingTable = true;

  this.commonService.getListWardByPaging(this.filterParrams).subscribe((res: ResApi) => {
    this.isLoadingTable = false;

    if(res.meta.error_code == AppStatusCode.StatusCode200) {
      this.lstWards = res.data; 
    }
    else {
      this.lstWards = [];
      this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
    }
    
  },
  () => {
    this.isLoadingTable = false;

    this.lstWards = [];
    this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest });
  })
}
onDelete(idc:number ,id: number) {
  this.confirmationService.confirm({
    message: 'Bạn có muốn xóa Phường/Xã <b>"'+ this.lstWards.filter((i: any) => i.Id ==id )[0].Name +'"</b> không?',
    header: 'XÓA PHƯỜNG/XÃ',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Xác nhận',
    rejectLabel: 'Hủy bỏ',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
    accept: () => {
      this.wardService.deleteWardById(idc, id).subscribe(
        (res: any) => {
          this.loading[0] = false;
          if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
            this.lstWards = this.lstWards.filter(s => s.Id !== id);
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
    this.filterParrams.query = `Name.ToLower().Contains("${searchValue}") OR Code.ToLower().Contains("${searchValue}")`;
    this.getListWardsByPaging();
  }
  onClearInput() {
    this.search = '';
    this.isInputEmpty = true;
    this.filterParrams.query = `Name.ToLower().Contains("${this.search}") OR Code.ToLower().Contains("${this.search}")`;
    this.getListWardsByPaging();
  }
  getCompanyId() {
    this.Idc = this.storeService.get(StorageData.companyId); 
  }
 
}