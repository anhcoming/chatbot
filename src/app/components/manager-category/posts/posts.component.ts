import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService, PrimeNGConfig } from 'primeng/api';
import { PostsService } from 'src/app/services/posts.service';
import { ProjectService } from 'src/app/services/project.service';
import { TowerService } from 'src/app/services/tower.service';
import { ZoneService } from 'src/app/services/zone.service';
import { AppMessageResponse, AppStatusCode, StorageData, TypeNews } from 'src/app/shared/constants/app.constants';
import { StorageService } from 'src/app/shared/services/storage.service';
import { Paging } from 'src/app/viewModels/paging';
import { Posts } from 'src/app/viewModels/posts/posts';
import { Project } from 'src/app/viewModels/project/project';
import { ResApi } from 'src/app/viewModels/res-api';
import { DbTower } from 'src/app/viewModels/tower/db-tower';
import { Zone } from 'src/app/viewModels/zone/zone';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent {
  fSearch : any;
  public filterParrams!: Paging;
  public filterProject : Paging;
  public filterTower : Paging ; 
  public filterZone : Paging;
  public lstPosts!: any[];
  public Id : any
  idFrozen: boolean = true;
  public filterText!: string;
  menuItems: MenuItem[] = [];
  isInputEmpty: boolean = true;
  selectedPosts : any;
  public loading = [false];
  public lstDoc : any;
  public lstTower : Array<DbTower>;
  public lstZone :Array<Zone>;
  Idc: any;
  public isLoadingTable : boolean = false;
  public lstProject: Array<Project>;
  public type = TypeNews;
  constructor(
    private readonly storeService: StorageService,
    private confirmationService : ConfirmationService,
    private readonly projectService : ProjectService,
    private readonly towerService : TowerService,
    private readonly zoneService : ZoneService,
    private primengConfig: PrimeNGConfig,
    private readonly postsService : PostsService,
    private readonly fb : FormBuilder,
    private readonly router : Router,
    private datePipe : DatePipe,

    private readonly messageService: MessageService,
  ){
    this.lstDoc = {};
    this.type = TypeNews;
    this.filterParrams = new Object as Paging;
    this.filterProject = new Object as Paging;
    this.filterTower = new Object as Paging;
    this.filterTower.page = 1;
    this.filterTower.page_size = 100;
    this.filterZone = new Object as Paging;
    this.filterZone.page = 1;
    this.filterZone.page_size = 100;
    this.lstProject = [];
    this.lstTower = [];
    this.lstZone = [];
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 100;
    this.filterText = '';
    this.lstProject = new Array<Project>();

    this.menuItems = [{
      label: 'Xóa mục đã chọn', 
      icon: 'pi pi-fw pi-trash',
      command: () => {
        this.onDeletes();
    }},
    {
      label : 'Làm mới',
      icon : 'pi pi-fw pi-refesh',
      command: () => {
        this.btnReset();
      }
    }
  ];

    this.fSearch = this.fb.group({
      ProjectId : [''],
      TowerId: [''],
      ZoneId: [''],
      DateStart : [''],
      DateEnd : [''],
    })
  }
  ngOnInit() {
   this.getLstNotebookByPaging();
   this.getCompanyId();
   this.getListProject();
   this.getListTower();
   this.getListZone();
  }
  getCompanyId() {
    this.Idc = this.storeService.get(StorageData.companyId); 
  }
  getLstNotebookByPaging() {
    this.isLoadingTable = true;
    this.filterParrams.query = `Type=3`;
    this.postsService.getListPostsByPaging(this.filterParrams).subscribe((res: ResApi) => {
      this.isLoadingTable = false;

      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstPosts = res.data;
      }
      else {
        this.lstPosts = new Array<Posts>();
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    },
    () => {
      this.isLoadingTable = false;
  
      this.lstPosts = [];
      this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest });
    })
  } 

    searchPostsByPaging() {
    this.isLoadingTable = true;
    this.filterParrams.query = `Title.ToLower().Contains("${this.filterText}") AND Type=3`;
    this.postsService.getListPostsByPaging(this.filterParrams).subscribe((res: ResApi) => {
      this.isLoadingTable = false;

      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstPosts = res.data;
      }
      else {
        this.lstPosts = new Array<Posts>();
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    },
    () => {
      this.isLoadingTable = false;
  
      this.lstPosts = [];
      this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest });
    })
  } 
  onSelect() {
    if(this.fSearch.get('ProjectId')?.value){
      this.filterParrams.ProjectId = `${this.fSearch.get('ProjectId')?.value}`;
    }else{
      this.lstTower
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
    if(this.fSearch.get('DateStart')?.value){
      const dateStart = this.fSearch.get('DateStart')?.value;
      const formattedDateStart = this.datePipe.transform(dateStart, 'yyyy/MM/dd');
      this.filterParrams.dateStart = `${formattedDateStart}`;
    }else{
      this.filterParrams.dateStart = ""
    }
    if(this.fSearch.get('DateEnd')?.value){
      const dateEnd = this.fSearch.get('DateEnd')?.value;
      const formattedDateEnd = this.datePipe.transform(dateEnd, 'yyyy/MM/dd');
      this.filterParrams.dateEnd = `${formattedDateEnd}`;
    }else{
      this.filterParrams.dateEnd = "";
    }
    this.getLstNotebookByPaging();
  }

  getListProject() {
    this.lstProject = [];
    let filterProject = new Object as Paging;
    this.projectService.getListByPaging(filterProject).subscribe((res: ResApi) => {
      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstProject = res.data;
      }
      else {
        this.lstProject = [];
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
  getListZone() {
    this.lstZone = [];
    let filterZone = new Object as Paging;
    filterZone.page = 1 ;
    filterZone.page_size = 100;
    this.zoneService.getListZoneByPaging(filterZone).subscribe((res: ResApi) => {
      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstZone = res.data;
      }
      else {
        this.lstZone = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })
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

  btnReset() {
    this.router.navigateByUrl('/manager-category/posts/list').then(() => {
      window.location.reload();
    });
  }
  onSearch(){
  this.searchPostsByPaging();
  }
  onDelete(item : Posts) {
  
    this.confirmationService.confirm({
      
      message: 'Bạn có muốn xóa tin tức ' +item.Title+ ' này không?',
      header: 'XÓA TIN TỨC CƯ DÂN',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xác nhận',
      rejectLabel: 'Hủy bỏ',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.postsService.deletePostsById(this.Idc,item.Id).subscribe(
          (res: any) => {
            this.loading[0] = false;
            if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
              this.lstPosts = this.lstPosts.filter(s => s.Id !== item.Id);
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
  ShowTypeNotebook(Type : any) {
		let data = TypeNews.filter(x => x.value == Type)[0];
		return data != undefined ? data.label : "";
	}
  onClearInput() {
    this.filterText = '';
    this.isInputEmpty = true;
    this.filterParrams.query = `Title.ToLower().Contains("${this.filterText}")`;
    this.getLstNotebookByPaging();
  }
  onDeletes() {
    this.confirmationService.confirm({
      message: 'Bạn có muốn sổ tay cư dân này không?',
      header: 'XÓA SỔ TAY CƯ DÂN',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if(!this.selectedPosts) {
          this.messageService.add({severity: 'warn', summary: 'Warn', detail: 'Không có mục nào được chọn!'})
        }
        this.postsService.deletesListPosts(this.Idc,3,this.selectedPosts).subscribe(
          (res: any) => {
            this.loading[0] = false;
            if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
              this.selectedPosts.map((item: any) => {
                this.lstPosts = this.lstPosts.filter((s: { Id: number; }) => s.Id !== item.Id);
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
