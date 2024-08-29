import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfigBookingService } from 'src/app/services/config-booking.service';
import { ProjectService } from 'src/app/services/project.service';
import { TowerService } from 'src/app/services/tower.service';
import { AppMessageResponse, AppStatusCode, IsStatus, StorageData } from 'src/app/shared/constants/app.constants';
import { StorageService } from 'src/app/shared/services/storage.service';
import { Paging } from 'src/app/viewModels/paging';
import { ResApi } from 'src/app/viewModels/res-api';

@Component({
  selector: 'app-yard-config',
  templateUrl: './yard-config.component.html',
  styleUrls: ['./yard-config.component.scss']
})
export class YardConfigComponent  {
  public filterParrams: Paging;
  public lstYard: any;
  public first = 0;
  public rows = 10;
  public Idc: any;
  public fSearch: FormGroup;
  public lstTower: [];
  public lstProject: any;
  public isLoadingTable: boolean = false;
  public loading = [false];
  search: string = '';
  isInputEmpty: boolean = true;
  public isStatus = IsStatus;
  constructor(
    private readonly storeService: StorageService,
    private readonly bookingService: ConfigBookingService,
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
    this.lstProject = [];

    this.fSearch = fb.group({
      ProjectId: [''],
      TowerId: [''],
    });
  }

  ngOnInit() {
    this.getListProject();
    this.getListYard();
    this.getCompanyId();
    this.getTower();
  }
  getListYard() {
    this.isLoadingTable = true;
    this.bookingService.getListConfigBookingByPaging(this.filterParrams).subscribe((res: ResApi) => {
      this.isLoadingTable = false;
      if(res.meta.error_code = AppStatusCode.StatusCode200) {
        this.lstYard = res.data;
        this.lstYard.forEach((items: any) => {
          items.isStatus = this.isStatus.filter(item => item.value === items.Status)[0]?.label;
        })
      }
    })
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
      message: 'Bạn có muốn xóa tòa nhà này không?',
      header: 'XÓA TÒA NHÀ',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xác nhận',
      rejectLabel: 'Hủy bỏ',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
      accept: () => {
        // this.floorService.deleteFloorById(this.Idc, id).subscribe(
        //   (res: any) => {
        //     this.loading[0] = false;
        //     if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
        //       this.lstFloor = this.lstFloor.filter(s => s.Id !== id);
        //       this.messageService.add({ severity: 'success', summary: 'Success', detail: res.meta.error_message || AppMessageResponse.CreatedSuccess });
        //       //return;
        //     } else {
        //       this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
        //       return;
        //     }
        //   }
        // );
      },
      reject: (type: any) => {
        return;
      }
    });
  }

  onSelect(event: any) {
    // if (event.value == null) {
    //   this.filterParrams.query = '1=1';
    //   this.getListFloorByPaging();
    // } else {
    //   this.filterParrams.query = `ProjectId=${event.value}`;
    // }
    // this.getListFloorByPaging();
  }
  onSelectTower(event: any) {
    // if (event.value == null) {
    //   this.filterParrams.query = '1=1';
    //   this.getListFloorByPaging();
    // } else {
    //   this.filterParrams.query = `TowerId=${event.value}`;
    // }
    // this.getListFloorByPaging();
  }

  onSearch(event: any) {
    const searchValue = event.target.value.toLowerCase().trim();
    this.filterParrams.query = `Name.ToLower().Contains("${searchValue}") `;
    this.getListYard()
  }
  onClearInput() {
    this.search = '';
    this.isInputEmpty = true;
    this.filterParrams.query = `Name.ToLower().Contains("${this.search}") `;
    this.getListYard()
  }
  getCompanyId() {
    this.Idc = this.storeService.get(StorageData.companyId);
  }
  onDeletes() {
    this.confirmationService.confirm({
      message: 'Bạn có muốn xóa tòa nhà này không?',
      header: 'XÓA TÒA NHÀ',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // if (!this.selectedItems) {
        //   this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Không có mục nào được chọn!' });
        // }
        // this.floorService.deletesFloor(this.Idc, this.selectedItems).subscribe(
        //   (res: any) => {
        //     this.loading[0] = false;
        //     if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
        //       this.selectedItems.map((item: any) => {
        //         this.lstFloor = this.lstFloor.filter(s => s.Id !== item.Id);
        //       });
        //       this.messageService.add({ severity: 'success', summary: 'Success', detail: res.meta.error_message || AppMessageResponse.CreatedSuccess });
        //       //return;
        //     } else {
        //       this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
        //       return;
        //     }
        //   }
        // );
      },
      reject: (type: any) => {
        return;
      }
    });
  }
}