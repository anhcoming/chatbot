import { Component, OnInit } from '@angular/core';
import { DbTower } from 'src/app/viewModels/tower/db-tower';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Paging } from 'src/app/viewModels/paging';
import { TowerService } from 'src/app/services/tower.service';
import { ResApi } from 'src/app/viewModels/res-api';
import { MessageService, ConfirmationService, MenuItem } from 'primeng/api';
import { AppMessageResponse, AppStatusCode, StorageData } from 'src/app/shared/constants/app.constants';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import { ProvincesService } from 'src/app/services/provinces.service';
import { Provinces } from 'src/app/viewModels/provinces/provinces';
import { Menu } from 'primeng/menu';
import { StorageService } from 'src/app/shared/services/storage.service';

@Component({
  selector: 'app-provincwes',
  templateUrl: './provinces.component.html',
  styleUrls: ['./provinces.component.scss']
})
export class ProvincesComponent implements OnInit {
  public filterParrams : Paging ;
  public lstProvinces!: Array<Provinces>;
  public first = 0;
  public rows = 10;
  search: string = '';
  isInputEmpty: boolean = true;
  selectedProvinces: any;
  data = [];
  public loading = [false];
  public isLoadingTable: boolean = false;

  positions = [];
  departments = [];
  Idc: any;

  constructor(
    private readonly commonService: CommonService,
    private readonly messageService: MessageService,
    private readonly provincesService: ProvincesService,
    private readonly confirmationService: ConfirmationService,
    private modalService: NgbModal,
    private readonly storeService : StorageService,
    private readonly fb: FormBuilder,
    //private readonly customerService: CustomerService
  ) {
    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 100;

    this.lstProvinces = new Array<Provinces>();

  }

  ngOnInit() {
    this.getCompanyId();
    this.getListProvincesByPaging();
}

getListProvincesByPaging() {
  this.isLoadingTable = true;

  this.commonService.getListProvinceByPaging(this.filterParrams).subscribe((res: ResApi) => {
    this.isLoadingTable = false;

    if(res.meta.error_code == AppStatusCode.StatusCode200) {
      this.lstProvinces = res.data;
    }
    else {
      this.lstProvinces = [];
      this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
    }
    
  },
  () => {
    this.isLoadingTable = false;

    this.lstProvinces = [];
    this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest });
  })
}
onDelete(id: number) {
  this.confirmationService.confirm({
    message: 'Bạn có muốn xóa Tỉnh/Thành phố <b>"'+this.lstProvinces.filter((i: any) => i.Id == id)[0].Name +'"</b> không?',
    header: 'XÓA TỈNH/THÀNH PHỐ',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Xác nhận',
    rejectLabel: 'Hủy bỏ',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
    accept: () => {
      this.provincesService.deleteProvincesById(id).subscribe(
        (res: any) => {
          this.loading[0] = false;
          if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
            this.lstProvinces = this.lstProvinces.filter(s => s.Id !== id);
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
    this.getListProvincesByPaging();
  }
  onClearInput() {
    this.search = '';
    this.isInputEmpty = true;
    this.filterParrams.query = `Name.ToLower().Contains("${this.search}") OR Code.ToLower().Contains("${this.search}")`;
    this.getListProvincesByPaging();
  }
  getCompanyId() {
    this.Idc = this.storeService.get(StorageData.companyId); 
  }
  
}