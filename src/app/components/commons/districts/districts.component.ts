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
import { DistrictsService } from 'src/app/services/districts.service';
import { Districts } from 'src/app/viewModels/districts/districts';
import { StorageService } from 'src/app/shared/services/storage.service';


@Component({
  selector: 'app-districts',
  templateUrl: './districts.component.html',
  styleUrls: ['./districts.component.scss']
})
export class DistrictsComponent  implements OnInit {
  public filterParrams : Paging ;
  public lstDistricts!: Array<Districts>;
  public first = 0;
  public rows = 10;
  selectedDistrict: any;
  
  menuItems: MenuItem[] = [];
  search: string = '';
  isInputEmpty: boolean = true;
  data = [];
  Idc : any;
  public loading = [false];
  public isLoadingTable: boolean = false;
  positions = [];
  departments = [];

  constructor(
    private readonly commonService: CommonService,
    private readonly messageService: MessageService,
    private readonly districtservice: DistrictsService,
    private readonly confirmationService: ConfirmationService,
    private readonly storeService : StorageService,
    private modalService: NgbModal,
    private readonly fb: FormBuilder,
    //private readonly customerService: CustomerService
  ) {
    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 100;

    this.lstDistricts = new Array<Districts>();
    this.menuItems = [{
      label: 'Xóa mục đã chọn', 
      icon: 'pi pi-fw pi-trash',
      command: () => {
        this.onDeletes();
    }}];
  }

  ngOnInit() {
    this.getCompanyId();
    this.getListDistrictsByPaging();
}

getListDistrictsByPaging() {
  this.isLoadingTable = true;

  this.commonService.getListDistrictByPaging(this.filterParrams).subscribe((res: ResApi) => {
    this.isLoadingTable = false;

    if(res.meta.error_code == AppStatusCode.StatusCode200) {
      this.lstDistricts = res.data;
      
    }
    else {
      this.lstDistricts = [];
      this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
    }
    
  },
  () => {
    this.isLoadingTable = false;

    this.lstDistricts = [];
    this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest });
  })
}
onDelete(id: number) {
  this.confirmationService.confirm({
    message: 'Bạn có muốn xóa Quận/Huyện <b>"'+this.lstDistricts.filter((i:any) => i.Id == id)[0].Name+'"</b> không?',
    header: 'XÓA QUẬN/HUYỆN',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Xác nhận',
    rejectLabel: 'Hủy bỏ',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
    accept: () => {
      this.districtservice.deleteDistrictById(id).subscribe(
        (res: any) => {
          this.loading[0] = false;
          if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
            this.lstDistricts = this.lstDistricts.filter(s => s.Id !== id);
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
    this.getListDistrictsByPaging();
  }
  onClearInput() {
    this.search = '';
    this.isInputEmpty = true;
    this.filterParrams.query = `Name.ToLower().Contains("${this.search}") OR Code.ToLower().Contains("${this.search}")`;
    this.getListDistrictsByPaging();
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
        if(!this.selectedDistrict) {
          this.messageService.add({severity: 'warn', summary: 'Warn', detail: 'Không có mục nào được chọn!'})
        }
        this.districtservice.deletesListDistricts(this.Idc,this.selectedDistrict).subscribe(
          (res: any) => {
            this.loading[0] = false;
            if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
              this.selectedDistrict.map((item: any) => {
                this.lstDistricts = this.lstDistricts.filter((s: { Id: number; }) => s.Id !== item.Id);
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
