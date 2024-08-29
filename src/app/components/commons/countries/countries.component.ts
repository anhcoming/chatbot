import { Component, OnInit } from '@angular/core';
import { DbTower } from 'src/app/viewModels/tower/db-tower';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Paging } from 'src/app/viewModels/paging';
import { TowerService } from 'src/app/services/tower.service';
import { ResApi } from 'src/app/viewModels/res-api';
import { MessageService, ConfirmationService, MenuItem } from 'primeng/api';
import { AppMessageResponse, AppStatusCode, StorageData } from 'src/app/shared/constants/app.constants';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FunctionService } from 'src/app/services/function.service';
import { Countries } from 'src/app/viewModels/countries/countries';
import { CommonService } from 'src/app/services/common.service';
import { CountriesService } from 'src/app/services/countries.service';
import { StorageService } from 'src/app/shared/services/storage.service';




@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.scss']
})
export class CountriesComponent implements OnInit {
  public filterParrams : Paging ;
  public lstCountries!: Array<Countries>;
  public first = 0;
  menuItems: MenuItem[] = [];
  public rows = 10;
  search: string = '';
  isInputEmpty: boolean = true;
  public selectedCountry: any;
  data = [];
  public loading = [false];
  public isLoadingTable: boolean = false;
  positions = [];
  departments = [];
  Idc: any;

  constructor(
    private readonly commonService: CommonService,
    private readonly messageService: MessageService,
    private readonly countrieService: CountriesService,
    private readonly confirmationService: ConfirmationService,
    private modalService: NgbModal,
    private readonly storeService: StorageService,
    private readonly fb: FormBuilder,
    //private readonly customerService: CustomerService
  ) {
    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 100;

    this.lstCountries = new Array<Countries>();
    this.menuItems = [{
      label: 'Xóa mục đã chọn', 
      icon: 'pi pi-fw pi-trash',
      command: () => {
        this.onDeletes();
    }}];
  }

  ngOnInit() {
    this.getCompanyId();
    this.getListCountriesByPaging();
}
getListCountriesByPaging() {
  this.isLoadingTable = true;

  this.commonService.getListCountrieByPaging(this.filterParrams).subscribe((res: ResApi) => {
    this.isLoadingTable = false;

    if(res.meta.error_code == AppStatusCode.StatusCode200) {
      this.lstCountries = res.data;
      
    }
    else {
      this.lstCountries = [];
      this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
    }
    
  },
  () => {
    this.isLoadingTable = false;

    this.lstCountries = [];
    this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest });
  })
}
onDelete(id: number) {
  this.confirmationService.confirm({
    message: 'Bạn có muốn xóa quốc gia <b>"'+ this.lstCountries.filter((i: any) => i.Id == id)[0].Name +'"</b> không?',
    header: 'XÓA QUỐC GIA',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Xác nhận',
    rejectLabel: 'Hủy bỏ',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
    accept: () => {
      this.countrieService.deleteCountrieById(id).subscribe(
        (res: any) => {
          this.loading[0] = false;
          if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
            this.lstCountries = this.lstCountries.filter(s => s.Id !== id);
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
    this.getListCountriesByPaging();
  }
  onClearInput() {
    this.search = '';
    this.isInputEmpty = true;
    this.filterParrams.query = `Name.ToLower().Contains("${this.search}") OR Code.ToLower().Contains("${this.search}")`;
    this.getListCountriesByPaging();
  }
  getCompanyId() {
    this.Idc = this.storeService.get(StorageData.companyId); 
  }
  onDeletes() {
    this.confirmationService.confirm({
      message: 'Bạn có muốn phường/xã này không?',
      header: 'XÓA PHƯỜNG/XÃ',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if(!this.selectedCountry) {
          this.messageService.add({severity: 'warn', summary: 'Warn', detail: 'Không có mục nào được chọn!'})
        }
        this.countrieService.deletesListCountries(this.Idc,this.selectedCountry).subscribe(
          (res: any) => {
            this.loading[0] = false;
            if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
              this.selectedCountry.map((item: any) => {
                this.lstCountries = this.lstCountries.filter((s: { Id: number; }) => s.Id !== item.Id);
              })
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

