import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService, PrimeNGConfig } from 'primeng/api';
import { NotebookService } from 'src/app/services/notebook';
import { NotebookCategoryService } from 'src/app/services/notebook-category';
import { ProjectService } from 'src/app/services/project.service';
import { TowerService } from 'src/app/services/tower.service';
import { ZoneService } from 'src/app/services/zone.service';
import { AppMessageResponse, AppStatusCode, StorageData, TypeNews } from 'src/app/shared/constants/app.constants';
import { StorageService } from 'src/app/shared/services/storage.service';
import { NoteBookCategory } from 'src/app/viewModels/notebook-category/notebook-category';
import { NoteBook } from 'src/app/viewModels/notebook/notebook';
import { Paging } from 'src/app/viewModels/paging';
import { Project } from 'src/app/viewModels/project/project';
import { ResApi } from 'src/app/viewModels/res-api';
import { DbTower } from 'src/app/viewModels/tower/db-tower';
import { Zone } from 'src/app/viewModels/zone/zone';

@Component({
  selector: 'app-notebook',
  templateUrl: './notebook.component.html',
  styleUrls: ['./notebook.component.scss']
})
export class NotebookComponent {
  fSearch : any;
  public filterParrams: Paging;
  public lstNoteBook!: any[];
  public Id : any
  idFrozen : boolean = true;
  public filterText!: string;
  menuItems: MenuItem[] = [];
  isInputEmpty: boolean = true;
  selectedNotebook : any;
  public filterTower : Paging;
  public filterZone : Paging;
  public lstNoteBookCate : Array<NoteBookCategory>
  public loading = [false];
  public lstDoc : any;
  Idc: any;
  lstCategory: any;
  search : string = '';
  public isLoadingTable : boolean = false;
  public lstProject: Array<Project>;
  public lstTower : Array<DbTower>;
  public lstZone : Array<Zone>;
  public type = TypeNews;
  constructor(
    private readonly notebookcategoryService : NotebookCategoryService,
    private readonly storeService: StorageService,
    private confirmationService : ConfirmationService,
    private readonly projectService : ProjectService,
    private readonly towerService : TowerService,
    private readonly zoneService : ZoneService,
    private primengConfig: PrimeNGConfig,
    private readonly notebookService : NotebookService,
    private readonly router : Router,
    private readonly messageService: MessageService,
    private readonly fb : FormBuilder,
    private datePipe : DatePipe,
  ){
    this.lstDoc = {};
    this.type = TypeNews;
    this.filterParrams = new Object as Paging;
    this.filterTower = new Object as Paging;
    this.filterTower.page = 1;
    this.filterTower.page_size = 100;
    this.filterZone = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 100;
    this.lstNoteBookCate = new Array<NoteBookCategory>;
    this.filterText = '';
    this.lstTower = [];
    this.lstZone = [];
    this.lstProject = new Array<Project>();

    this.menuItems = [{
      label: 'Xóa mục đã chọn', 
      icon: 'pi pi-fw pi-trash',
      command: () => {
        this.onDeletes();
    }},
    {
      label: 'Làm mới', 
      icon: 'pi pi-fw pi-refesh',
      command: () => {
        this.btnReset();
    }}];
    this.fSearch = this.fb.group({
      ProjectId : [-1],
      TowerId: [-1],
      ZoneId : [-1],
      DateStart : [''],
      DateEnd : [''],
      CategoryId : [null]
    })
  }
  ngOnInit() {
   this.getLstNotebookByPaging();
   this.getCompanyId();
   this.getListProject();
  //  this.fetchMoreTower();
   this.getListTower();
   this.fetchMoreZone();
   this.getLstNotebookCategoryByPaging();
  }
  getCompanyId() {
    this.Idc = this.storeService.get(StorageData.companyId); 
  }
  getLstNotebookByPaging() {
    this.isLoadingTable = true;
    (this.fSearch.get('CategoryId')?.value == null) ? this.filterParrams.query = `Type=1` : this.filterParrams.query = `Type=1 AND CategoryId=${this.fSearch.get('CategoryId')?.value}`;
    this.notebookService.getListNotebookByPaging(this.filterParrams).subscribe((res: ResApi) => {
      // let array : any[] = [];
      //   const arr = res.data;
      //   for(let i=0;i<arr.length;i++){
      //     if(arr[i].Type < 6){
      //       array.push(arr[i]);
      //     }
      //   }

      this.isLoadingTable = false;

      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstNoteBook = res.data;
      }
      else {
        this.lstNoteBook = new Array<NoteBook>();
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    },
    () => {
      this.isLoadingTable = false;
  
      this.lstNoteBook = [];
      this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest });
    })
  } 

  btnReset() {
    this.router.navigateByUrl('/manager-category/notebook/list').then(() => {
      window.location.reload();
    });
  }
  searchNotebookByPaging() {
    this.isLoadingTable = true;
    this.filterParrams.query = `Title.ToLower().Contains("${this.filterText}") AND Type=1`;
    this.notebookService.getListNotebookByPaging(this.filterParrams).subscribe((res: ResApi) => {
      this.isLoadingTable = false;

      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstNoteBook = res.data;
      }
      else {
        this.lstNoteBook = new Array<NoteBook>();
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    },
    () => {
      this.isLoadingTable = false;
  
      this.lstNoteBook = [];
      this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest });
    })
  } 
 
 
  onSearch(){
    this.searchNotebookByPaging()
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
    this.filterZone.page_size = 100;
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

  getLstNotebookCategoryByPaging() {
    this.isLoadingTable = true;
    let filterCategory = new Object as Paging;
    this.notebookcategoryService.getListNotebookCategoryByPaging(filterCategory).subscribe((res: ResApi) => {
      this.isLoadingTable = false;

      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstNoteBookCate = res.data;
      }
      else {
        this.lstNoteBookCate = new Array<NoteBookCategory>();
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    },
      () => {
        this.isLoadingTable = false;

        this.lstNoteBookCate = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest });
      })
  }

  onDelete(item : NoteBook) {
  
    this.confirmationService.confirm({
      
      message: 'Bạn có muốn xóa bài viết <b> ' +item.Title+ ' </b> này không?',
      header: 'XÓA BÀI VIẾT SỔ TAY CƯ DÂN',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xác nhận',
      rejectLabel: 'Hủy bỏ',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.notebookService.deleteNotebookById(this.Idc,item.Id).subscribe(
          (res: any) => {
            this.loading[0] = false;
            if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
              this.lstNoteBook = this.lstNoteBook.filter(s => s.Id !== item.Id);
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
    this.search = '';
    this.isInputEmpty = true;
    // this.filterParrams.query = `Title.ToLower().Contains("${this.filterText}")`;
    this.getLstNotebookByPaging();
  }
  onDeletes() {
    this.confirmationService.confirm({
      message: 'Bạn có muốn xóa sổ tay cư dân này không?',
      header: 'XÓA SỔ TAY CƯ DÂN',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if(!this.selectedNotebook) {
          this.messageService.add({severity: 'warn', summary: 'Warn', detail: 'Không có mục nào được chọn!'})
        }
        this.notebookService.deletesListNotebook(this.Idc,1,this.selectedNotebook).subscribe(
          (res: any) => {
            this.loading[0] = false;
            if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
              this.selectedNotebook.map((item: any) => {
                this.lstNoteBook = this.lstNoteBook.filter((s: { Id: number; }) => s.Id !== item.Id);
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
