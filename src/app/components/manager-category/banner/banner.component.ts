import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { BannerService } from 'src/app/services/banner.service';
import { ProjectService } from 'src/app/services/project.service';
import { AppMessageResponse, AppStatusCode, StorageData } from 'src/app/shared/constants/app.constants';
import { Banner } from 'src/app/viewModels/banner/banner';
import { Paging } from 'src/app/viewModels/paging';
import { Project } from 'src/app/viewModels/project/project';
import { ResApi } from 'src/app/viewModels/res-api';
import { ApiConstant } from 'src/app/shared/constants/api.constants';
import { docmainImage } from '../../.././shared/constants/api.constants';
import { StorageService } from 'src/app/shared/services/storage.service';
import { DbTower } from 'src/app/viewModels/tower/db-tower';
import { Zone } from 'src/app/viewModels/zone/zone';
import { TowerService } from 'src/app/services/tower.service';
import { ZoneService } from 'src/app/services/zone.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent {
  public docmainImage = docmainImage;
  public filterParrams!: Paging;
  public lstBanner!: any[];
  idFrozen : boolean = true;
  public filterText!: string;
  public filterProject : Paging;
  isInputEmpty: boolean = true;
  public selectedBanner: any;
  public loading = [false];
  menuItems: MenuItem[] = [];
  public search : string  = '';
  public fBanner : any;
  public filterTower : Paging;
  Idc : any;
  public isLoadingTable : boolean = false;
  public lstProject: Array<Project>;
  public lstTower : Array<DbTower>;
  public lstZone : Array<Zone>;
  constructor(
    private http: HttpClient,
    private confirmationService : ConfirmationService,
    private readonly bannerService : BannerService,
    private readonly fb: FormBuilder,
    private readonly storeService: StorageService,
    private readonly projectService: ProjectService,
    private readonly towerService : TowerService,
    private readonly zoneService : ZoneService,
    private readonly router : Router,
    private readonly datePipe : DatePipe,
    private readonly messageService: MessageService,
  ){
    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 100;
    this.filterProject = new Object as Paging;
    this.filterTower = new Object as Paging;
    this.filterTower.page = 1;
    this.filterTower.page_size = 100;
    this.filterText = '';
    this.lstProject = new Array<Project>();
    this.lstTower = new Array<DbTower>();
    this.lstZone = new Array<Zone>();
    this.fBanner = this.fb.group({
      ProjectId: [-1],
      TowerId : [-1],
      ZoneId : [-1],
      DateStart : [''],
      DateEnd : [''],
    })
    this.menuItems = [{
      label: 'Xóa mục đã chọn', 
      icon: 'pi pi-fw pi-trash',
      command: () => {
        this.onDeletes();
    }},{
      label: 'Làm mới', 
      icon: 'pi pi-fw pi-refesh',
      command: () => {
        this.btnReset();
    }}
  ];
  }
  ngOnInit() {
    this.getLstBannerByPaging();
    this.getListProject();
    this.getCompanyId();
    this.getListZone();
  }
  btnReset() {
    this.router.navigateByUrl('/manager-category/banner/list').then(() => {
      window.location.reload();
    });
  }

  getListProject() {
    this.lstProject = [];
    this.projectService.getListByPaging(this.filterProject).subscribe((res: ResApi) => {
      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstProject = res.data;
      }
      else {
        this.lstProject = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })
  }
  getListTower() {
    this.lstTower = [];
    this.towerService.getListTowerByPaging(this.filterTower).subscribe((res: ResApi) => {
      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstTower = res.data;
      }
      else {
        this.lstTower = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })
  }
  onSelectProject(event: any) {
    if(event.value == null) {
      this.filterTower.query = '1=1';
      this.getListTower();
    }else{
      this.filterTower.query = `ProjectId=${event.value}`;
      this.getListTower();
    }  
  }

  onFilter(event: any) {
    this.fBanner.get('ProjectId').setValue(this.lstTower.filter((i: any) => i.Id == event.value)[0]?.ProjectId)
    let items = [{ProjectId: this.fBanner.get('ProjectId').value}];
    
    Object.keys(items[0]).forEach(key => {
      const control = this.fBanner.get(key);
      if (control.enabled && control.invalid) {
        control.markAsDirty();
      }
    });
  }
  

  getListZone() {
    this.lstZone = [];
    let filterZone = new Object as Paging;
    filterZone.page = 1;
    filterZone.page_size = 100;
    this.towerService.getListTowerByPaging(filterZone).subscribe((res: ResApi) => {
      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstZone = res.data;
      }
      else {
        this.lstZone = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })
  }
  getCompanyId() {
    this.Idc = this.storeService.get(StorageData.companyId); 
  }
  getLstBannerByPaging() {
    this.isLoadingTable = true;

    this.bannerService.getListBannerByPaging(this.filterParrams).subscribe((res: ResApi) => {
      this.isLoadingTable = false;

      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstBanner = res.data;
      }
      else {
        this.lstBanner = new Array<Banner>();
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    },
      () => {
        this.isLoadingTable = false;

        this.lstBanner = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest });
      })
  }
  
 

  onSelect() {
    if(this.fBanner.get('ProjectId')?.value){
      this.filterParrams.ProjectId = `${this.fBanner.get('ProjectId')?.value}`;
    }else{
      this.filterParrams.ProjectId = "";
    }
    if(this.fBanner.get('TowerId')?.value){
      this.filterParrams.TowerId = `${this.fBanner.get('TowerId')?.value}`
    }else{
      this.filterParrams.TowerId = ""
    }
    if(this.fBanner.get('ZoneId')?.value){
      this.filterParrams.ZoneId = `${this.fBanner.get('ZoneId')?.value}`
    }else{
      this.filterParrams.ZoneId = ""
    }
    if(this.fBanner.get('DateStart')?.value){
      const dateStart = this.fBanner.get('DateStart')?.value;
      const formattedDateStart = this.datePipe.transform(dateStart, 'yyyy/MM/dd');
      this.filterParrams.dateStart = `${formattedDateStart}`;
    }else{
      this.filterParrams.dateStart = ""
    }
    if(this.fBanner.get('DateEnd')?.value){
      const dateEnd = this.fBanner.get('DateEnd')?.value;
      const formattedDateEnd = this.datePipe.transform(dateEnd, 'yyyy/MM/dd');
      this.filterParrams.dateEnd = `${formattedDateEnd}`;
    }else{
      this.filterParrams.dateEnd = "";
    }
    this.getLstBannerByPaging();
  }

  onSearch() {
    this.filterParrams.query = `Title.ToLower().Contains("${this.filterText}")`;
    this.getLstBannerByPaging();
  }

  onClearInput() {
    this.filterText = '';
    this.isInputEmpty = true;
    this.filterParrams.query = `Title.ToLower().Contains("${this.filterText}")`;
    this.getLstBannerByPaging();
  }

  onDelete(item : Banner) {
  
    this.confirmationService.confirm({
      message: 'Bạn có muốn xóa quảng cáo  <b> ' + item.Title + ' </b> này không?',
      header: 'XÓA QUẢNG CÁO',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xác nhận',
      rejectLabel: 'Hủy bỏ',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.bannerService.deleteBannerById(item.Id).subscribe(
          (res: any) => {
            this.loading[0] = false;
            if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
              this.lstBanner = this.lstBanner.filter(s => s.Id !== item.Id);
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
  onDeletes() {
    this.confirmationService.confirm({
      message: 'Bạn có muốn sổ tay cư dân này không?',
      header: 'XÓA SỔ TAY CƯ DÂN',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if(!this.selectedBanner) {
          this.messageService.add({severity: 'warn', summary: 'Warn', detail: 'Không có mục nào được chọn!'})
        }
        this.bannerService.deletesListBanner(this.Idc,this.selectedBanner).subscribe(
          (res: any) => {
            this.loading[0] = false;
            if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
              this.selectedBanner.map((item: any) => {
                this.lstBanner = this.lstBanner.filter((s: { Id: number; }) => s.Id !== item.Id);
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
