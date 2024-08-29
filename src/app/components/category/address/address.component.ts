import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Paging } from 'src/app/viewModels/paging';
import { ResApi } from 'src/app/viewModels/res-api';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { AppMessageResponse, AppStatusCode, StorageData } from 'src/app/shared/constants/app.constants';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Zone } from 'src/app/viewModels/zone/zone';
import { ActivatedRoute, Router } from '@angular/router';
import { AddressService } from 'src/app/services/address.service';
import { ZoneService } from 'src/app/services/zone.service';
import { StorageService } from 'src/app/shared/services/storage.service';



@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit {
  public filterParrams: Paging;
  public first = 0;
  public rows = 10;
  menuItems: MenuItem[] = [];
  public lstZone : Array<Zone>;
  public filterText : string;
  public loading = [false];
  selectedZone : any;
  Idc : any;
  public zoneId : any;
  public isLoadingTable: boolean = false;
  constructor(
    private readonly zoneService: ZoneService,
    private readonly messageService: MessageService,
    private readonly storeService: StorageService,
    private router: Router,
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly confirmationService: ConfirmationService,
  ) {
    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 1000;
    this.filterText = '';
    this.lstZone = new Array<Zone>();
    this.menuItems = [{
      label: 'Xóa mục đã chọn', 
      icon: 'pi pi-fw pi-trash',
      command: () => {
        this.onDeletes();
    }}];
  }

  ngOnInit() {
    this.getLstZoneByPaging();
    this.getCompanyId();
  }

  next() {
    this.first = this.first + this.rows;
  }

  prev() {
    this.first = this.first - this.rows;
  }

  reset() {
    this.first = 0;
  }
  getCompanyId() {
    this.Idc = this.storeService.get(StorageData.companyId); 
  }

  isLastPage(): boolean {
    return true;//this.customers ? this.first === this.customers.length - this.rows : true;
  }

  isFirstPage(): boolean {
    return true;//this.customers ? this.first === 0 : true;
  }

  // deleteZone(id : number , index : number) {
  //   this.zoneService.deleteZoneById(id).subscribe((res:any)=>{
  //     this.loading[0] = false;
  //     if(res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
  //       this.lstZone = this.lstZone.filter((id,i)=> i !== index);
  //       this.messageService.add({severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.CreatedSuccess})
  //     } else {
  //       this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
  //       return;
  //     }
  //   })
  // }
  deleteZone(id: number) {
  
    this.confirmationService.confirm({
      message: 'Bạn có muốn xóa vị trí <b>' +this.lstZone.filter((i: any) => i.Id == id)[0].Name+' </b> này không?',
      header: 'XÓA VỊ TRÍ',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xác nhận',
      rejectLabel: 'Hủy bỏ',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.zoneService.deleteZoneById(this.Idc, id).subscribe(
          (res: any) => {
            this.loading[0] = false;
            if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
              this.lstZone = this.lstZone.filter(s => s.Id !== id);
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
  getLstZoneByPaging() {
    this.isLoadingTable = true;

    this.zoneService.getListZoneByPaging(this.filterParrams).subscribe((res: ResApi) => {
      this.isLoadingTable = false;

      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstZone = res.data;
      }
      else {
        this.lstZone = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    },
    () => {
      this.isLoadingTable = false;
      this.lstZone = [];
      this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest });
    })
  }
  onSearch() {
    this.filterParrams.query = `Name.ToLower().Contains("${this.filterText}") OR Code.ToLower().Contains("${this.filterText}")`;

    this.getLstZoneByPaging();
  }
  onDeletes() {
    this.confirmationService.confirm({
      message: 'Bạn có muốn xóa vị trí này không?',
      header: 'XÓA VỊ TRÍ',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if(!this.selectedZone) {
          this.messageService.add({severity: 'warn', summary: 'Warn', detail: 'Không có mục nào được chọn!'})
        }
        this.zoneService.deletesZone(this.Idc,this.selectedZone).subscribe(
          (res: any) => {
            this.loading[0] = false;
            if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
              this.selectedZone.map((item: any) => {
                this.lstZone = this.lstZone.filter((s: { Id: number; }) => s.Id !== item.Id);
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
  

