import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService, PrimeNGConfig } from 'primeng/api';
import { HotlineService } from 'src/app/services/hotline.service';
import { ProjectService } from 'src/app/services/project.service';
import { TowerService } from 'src/app/services/tower.service';
import { ZoneService } from 'src/app/services/zone.service';
import { AppMessageResponse, AppStatusCode, StorageData } from 'src/app/shared/constants/app.constants';
import { StorageService } from 'src/app/shared/services/storage.service';
import { Hotline } from 'src/app/viewModels/hotline/hotline';
import { Paging } from 'src/app/viewModels/paging';
import { Project } from 'src/app/viewModels/project/project';
import { ResApi } from 'src/app/viewModels/res-api';
import { DbTower } from 'src/app/viewModels/tower/db-tower';
import { Zone } from 'src/app/viewModels/zone/zone';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent {
  fSearch : any;
  
  public filterParrams!: Paging;
  public filterText: string;
  public selectedHotline: any;
  public isLoadingTable: boolean = false;
  public lstHotline : any;
  isInputEmpty: boolean = true;

  public filterProject: Paging;
  public filterTower : Paging;
  public filterZone : Paging;
  menuItems: MenuItem[] = [];
  Idc : any;
  public search : string = '';
  public loading = [false]
  public lstProject: Array<Project>;
  public lstTower : Array<DbTower>;
  public lstZone : Array<Zone>;
  constructor(
    private readonly router : Router,
    private primengConfig: PrimeNGConfig,
    private readonly confirmationService: ConfirmationService,
    private readonly contactService : HotlineService,
    private readonly fb: FormBuilder,
    private readonly storeService: StorageService,
    private readonly projectService: ProjectService,
    private readonly towerService : TowerService,
    private readonly zoneService : ZoneService,
    private readonly messageService: MessageService,
  ){
    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 1000;
    this.filterProject = new Object as Paging;
    this.filterTower = new Object as Paging;
    this.filterTower.page = 1;
    this.filterTower.page_size = 100;
    this.filterZone = new Object as Paging;
    this.filterTower.page = 1;
    this.filterTower.page_size = 100;
    this.filterText = '';
    this.lstProject = new Array<Project>();
    this.lstTower = new Array<DbTower>();
    this.lstZone = new Array<Zone>();
    this.fSearch = this.fb.group({
      ProjectId: [''],
      TowerId : [''],
      ZoneId : [''],
    })
    this.menuItems = [{
      label: 'Xóa mục đã chọn',
      icon : 'pi pi-fw pi-trash',
      command: () => {
        this.onDeletes();
      }
    },
    {
      label: 'Làm mới',
      icon : 'pi pi-fw pi-refesh',
      command: () => {
        this.btnReset();
      }
    }
  ]
  }
  ngOnInit() {
    this.primengConfig.ripple = true;
    this.getListProject();
    this.getLstHotlineByPaging();
    this.getCompanyId();
    this.getListTower();
    this.getListZone();
  }
  getCompanyId() {
    this.Idc = this.storeService.get(StorageData.companyId); 
  }
  onSelect() {
    if(this.fSearch.get('ProjectId')?.value){
      this.filterParrams.ProjectId = `${this.fSearch.get('ProjectId')?.value}`;
    }else{
      this.filterParrams.ProjectId = "";
    }
    if(this.fSearch.get('TowerId')?.value){
      this.filterParrams.TowerId = `${this.fSearch.get('TowerId')?.value}`
    }else{
      this.filterParrams.TowerId = ""
    }
    if(this.fSearch.get('ZoneId')?.value){
      this.filterParrams.ZoneId = `${this.fSearch.get('ZoneId')?.value}`
    }else{
      this.filterParrams.ZoneId = ""
    }
    this.getLstHotlineByPaging();
  }

  onClearInput() {
    this.filterText = '';
    this.isInputEmpty = true;
    this.filterParrams.query = `Name.ToLower().Contains("${this.filterText}")`;
    this.getLstHotlineByPaging();
  }
  onSearch(){
    this.filterParrams.query = `Name.ToLower().Contains("${this.filterText}") OR Phone.ToLower().Contains("${this.filterText}")`;
    this.getLstHotlineByPaging();
  }
  onDelete(item : Hotline) {
  
    this.confirmationService.confirm({
      message: 'Bạn có muốn xóa danh bạ <b> '+ item.Name +' </b> này không?',
      header: 'XÓA DANH BẠ CƯ DÂN',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xác nhận',
      rejectLabel: 'Hủy bỏ',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.contactService.deleteHotlineById(item.Id).subscribe(
          (res: any) => {
            this.loading[0] = false;
            if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
              this.lstHotline = this.lstHotline.filter((s: { Id: number; }) => s.Id !== item.Id);
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
  getLstHotlineByPaging() {
    this.isLoadingTable = true;

    this.contactService.getListHotlineByPaging(this.filterParrams).subscribe((res: ResApi) => {
      this.isLoadingTable = false;

      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstHotline = res.data;
      }
      else {
        this.lstHotline = new Array<Hotline>();
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    },
      () => {
        this.isLoadingTable = false;

        this.lstHotline = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest });
      })
  }
  getListProject() {
    this.lstProject = [];
    this.projectService.getListByPaging(this.filterProject).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
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
    this.fSearch.get('ProjectId').setValue(this.lstTower.filter((i: any) => i.Id == event.value)[0]?.ProjectId)
  
    let items = [{ProjectId: this.fSearch.get('ProjectId').value}];
    
    Object.keys(items[0]).forEach(key => {
      const control = this.fSearch.get(key);
      if (control.enabled && control.invalid) {
        control.markAsDirty();
      }
    });
  }


  getListZone() {
    this.lstZone = [];
    let filterZone = new Object as Paging;
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
  btnReset() {
    this.router.navigateByUrl('/manager-category/contacts/list').then(() => {
      window.location.reload();
    });
  }
  fetchMoreTower() {
    this.filterTower.page = this.filterTower.page + 1;
    
    this.towerService.getListTowerByPaging(this.filterTower).subscribe((res: ResApi) => {
      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstTower = [...this.lstTower.concat(res.data)];
        this.lstTower = [...this.lstTower];
      }
      else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })
  }
  fetchMoreZone() {
    
    this.filterZone.page = this.filterZone.page + 1;
    console.log(this.filterZone.page);
    
    this.zoneService.getListZoneByPaging(this.filterZone).subscribe((res: ResApi) => {
      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstZone = [...this.lstZone.concat(res.data)];
        this.lstZone = [...this.lstZone];
      }
      else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })
  }
  onDeletes() {
    this.confirmationService.confirm({
      message: 'Bạn có muốn sổ tay cư dân này không?',
      header: 'XÓA SỔ TAY CƯ DÂN',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if(!this.selectedHotline) {
          this.messageService.add({severity: 'warn', summary: 'Warn', detail: 'Không có mục nào được chọn!'})
        }
        this.contactService.deletesListHotline(this.Idc,this.selectedHotline).subscribe(
          (res: any) => {
            this.loading[0] = false;
            if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
              this.selectedHotline.map((item: any) => {
                this.lstHotline = this.lstHotline.filter((s: { Id: number; }) => s.Id !== item.Id);
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
