import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonService } from 'src/app/services/common.service';
import { ConfigRegisterService } from 'src/app/services/config-utilities.service';
import { ProjectService } from 'src/app/services/project.service';
import { TowerService } from 'src/app/services/tower.service';
import { AppMessageResponse, AppStatusCode, Role, StorageData, Utilities } from 'src/app/shared/constants/app.constants';
import { StorageService } from 'src/app/shared/services/storage.service';
import { Paging } from 'src/app/viewModels/paging';
import { ResApi } from 'src/app/viewModels/res-api';


@Component({
  selector: 'app-utilities-config',
  templateUrl: './utilities-config.component.html',
  styleUrls: ['./utilities-config.component.scss']
})
export class UtilitiesConfigComponent  {
  public filterParrams: Paging;
  public filterUtilities: Paging;
  public Utilities: any;
  public lstUtilities: any;
  public Idc: any;
  public role = Role;
  public utilities = Utilities;
  public selectedItems: any;
  public fSearch: FormGroup;
  public lstTower: any;
  public lstProject: any;
  public Tower: any;
  public Project: any;
  public listUtilities: any;
  public isLoadingTable: boolean = false;
  public loading = [false];
  search: string = '';
  isInputEmpty: boolean = true;
  constructor(
    private readonly storeService: StorageService,
    private readonly commonService: CommonService,
    private readonly projectService: ProjectService,
    private readonly configRegisterService: ConfigRegisterService,
    private readonly towerService: TowerService,
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService,
    private readonly fb: FormBuilder
  ) {
    this.filterUtilities = new Object as Paging;
    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 1000;

    this.lstTower = [];
    this.lstProject = [];

    this.fSearch = fb.group({
      ServiceUtilities: [''],
      Register: [''],
      ProjectId: [''],
      TowerId: [''],
    });
  }

  ngOnInit() {
    this.getUtilities();
    this.getListProject();
    this.getCompanyId();
    this.getTower();
  }
  getListUtilities() {
    this.isLoadingTable = true;
    this.configRegisterService.getListConfigRegisterByPaging(this.filterParrams).subscribe((res: ResApi) => {
      this.isLoadingTable = false;
      if(res.meta.error_code = AppStatusCode.StatusCode200){
        this.Utilities = res.data.map((item: any) => {
          item.listRegisterMaps.forEach((items: any) => {
            items.TypeName = this.role.filter((item: any) => item.value === items.TypeRegister)[0]?.label;
          })
          return item
        });
        this.Utilities.forEach((items: any) => {
          items.ServiceUtilities = this.listUtilities.filter((item: any) => item.Id == items.ServiceUtilitiesId)[0]?.Name;
        })
        
        this.lstUtilities = [...this.Utilities]
      }
    })
  }
  getUtilities() {
    this.filterUtilities.query = 'type=3 OR type=4'
    this.commonService.getServiceUtilities(this.filterUtilities).subscribe((res: ResApi) => {
      if(res.meta.error_code = AppStatusCode.StatusCode200) {
        this.listUtilities = res.data;
        this.getListUtilities();
      }
    })
  }
  getListProject() {
    this.lstProject = [];
    this.projectService.getListByPaging(this.filterParrams).subscribe((res: ResApi) => {
      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.Project = res.data;
        this.lstProject = [...this.Project]
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
        this.Tower = res.data;
        this.lstTower = [...this.Tower]
      }
      else {
        this.lstTower = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    });
  }

  onDelete(id: number) {
    this.confirmationService.confirm({
      message: `Bạn có muốn xóa cấu hình người đăng ký tiện ích này không?`,
      header: 'XÓA CẤU HÌNH NGƯỜI ĐĂNG KÝ TIỆN ÍCH',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xác nhận',
      rejectLabel: 'Hủy bỏ',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.configRegisterService.deleteConfigRegisterById(id).subscribe(
          (res: any) => {
            this.loading[0] = false;
            if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
              this.lstUtilities = this.lstUtilities.filter((s: any) => s.Id !== id);
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

  onSelect(event: any) {
    if (event.value == null) {
      this.filterParrams.query = '1=1';
      this.lstTower = [...this.Tower];
      this.lstUtilities = [...this.Utilities];
      this.fSearch.get('TowerId')?.setValue('');
    } else {
      this.lstUtilities = this.Utilities.filter((item: any) => item.ProjectId == event.value);
      this.lstTower = this.Tower.filter((item: any) => item.ProjectId == event.value);
    }
  }
  onSelectTower(event: any) {
    if (event.value == null) {
      this.lstUtilities = [...this.Utilities]
      if(this.fSearch.get('ProjectId')?.value){
        this.lstUtilities = this.Utilities.filter((item: any) => item.ProjectId == this.fSearch.get('ProjectId')?.value);
      }
    } else {
      this.lstUtilities = this.Utilities.filter((item: any) => {
        const filterList = item.listTowerMaps.filter((items: any) => items.TowerId == event.value);
        return filterList.length > 0;
      });
    }
  }
  onSelectRegister(event: any) {
    if (event.value == null) {
      this.lstUtilities = [...this.Utilities]
      if(this.fSearch.get('ProjectId')?.value){
        this.lstUtilities = this.Utilities.filter((item: any) => item.ProjectId == this.fSearch.get('ProjectId')?.value);
      }
    } else {
      this.lstUtilities = this.Utilities.filter((item: any) => {
        const filterList = item.listRegisterMaps.filter((items: any) => items.TypeRegister == event.value);
        return filterList.length > 0;
      });
    }
  }
  onSelectServiceUtilities(event: any) {
    if (event.value == null) {
      this.lstUtilities = [...this.Utilities]
      if(this.fSearch.get('ServiceUtilities')?.value){
        this.lstUtilities = this.Utilities.filter((item: any) => item.ServiceUtilitiesId == this.fSearch.get('ServiceUtilities')?.value);
      }
    } else {
      this.lstUtilities = this.Utilities.filter((item: any) => item.ServiceUtilitiesId == event.value);
    }
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
