import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService, PrimeNGConfig } from 'primeng/api';
import { NotebookCategoryService } from 'src/app/services/notebook-category';
import { ProjectService } from 'src/app/services/project.service';
import { AppMessageResponse, AppStatusCode, StorageData } from 'src/app/shared/constants/app.constants';
import { StorageService } from 'src/app/shared/services/storage.service';
import { NoteBookCategory } from 'src/app/viewModels/notebook-category/notebook-category';
import { Paging } from 'src/app/viewModels/paging';
import { Project } from 'src/app/viewModels/project/project';
import { ResApi } from 'src/app/viewModels/res-api';

@Component({
  selector: 'app-notebook-category',
  templateUrl: './notebook-category.component.html',
  styleUrls: ['./notebook-category.component.scss']
})
export class NotebookCategoryComponent {
  public lstNotebookCate : Array<NoteBookCategory>;
  public filterProject: Paging;
  public filterParrams!: Paging;
  public filterText: string;
  public fNotebookCate: any;
  public Idc: any
  public selectedCategory: any;
  public isLoadingTable: boolean = false;
  public lstNoteBookCate: any;
  menuItems: MenuItem[] = [];
  public loading = [false];
  public lstProject: Array<Project>;

  constructor(
    public confirmationService : ConfirmationService,
    private readonly notebookcategoryService: NotebookCategoryService,
    private readonly fb: FormBuilder,
    private primengConfig: PrimeNGConfig,
    private readonly storeService: StorageService,
    private readonly projectService: ProjectService,
    private readonly messageService: MessageService,
  ) {
    this.lstNotebookCate = new Array<NoteBookCategory>();
    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 1000;
    this.filterProject = new Object as Paging;
    this.filterText = '';
    this.lstProject = new Array<Project>();
    this.fNotebookCate = this.fb.group({
  
    })
    this.menuItems = [{
      label: 'Xóa mục đã chọn', 
      icon: 'pi pi-fw pi-trash',
      command: () => {
        this.onDeletes();
    }}];
  }
  
  getLstNotebookByPaging() {
    this.isLoadingTable = true;

    this.notebookcategoryService.getListNotebookCategoryByPaging(this.filterParrams).subscribe((res: ResApi) => {
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
  // onSelect(event: any) {
    
  //   if(event == null){
  //     this.filterParrams.query = '1=1';
  //     this.getLstNotebookByPaging();
      
  //   } else{
  //     this.filterParrams.query = `ProjectId=${event.value}`;
  //     this.getLstNotebookByPaging();
  //   }
  // }
  getCompanyId() {
    this.Idc = this.storeService.get(StorageData.companyId); 
  }
  onSelect(event: any) {
    if(event.value > 0) {
      this.filterParrams.query = `ProjectId=${event.value}`
    }else{
      this.filterParrams.query = `1=1`;
    }
    this.getLstNotebookByPaging();
  }
  ngOnInit() {
    this.primengConfig.ripple = true;
    this.getLstNotebookByPaging();
    this.getListProject();
    this.getCompanyId();
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
  onSearch() {
    this.filterParrams.query = `Name.ToLower().Contains("${this.filterText}")`;
    this.getLstNotebookByPaging();
  }
  onDelete(item : NoteBookCategory) {
  
    this.confirmationService.confirm({
      message: 'Bạn có muốn xóa danh mục sổ tay '+item.Name+' này không?',
      header: 'XÓA DANH MỤC SỔ TAY',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xác nhận',
      rejectLabel: 'Hủy bỏ',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.notebookcategoryService.deleteNotebookCategoryById(item.Id).subscribe(
          (res: any) => {
            this.loading[0] = false;
            if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
              this.lstNoteBookCate = this.lstNoteBookCate.filter((s: { Id: number; }) => s.Id !== item.Id);
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
        if(!this.selectedCategory) {
          this.messageService.add({severity: 'warn', summary: 'Warn', detail: 'Không có mục nào được chọn!'})
        }
        this.notebookcategoryService.deletesListCate(this.Idc,this.selectedCategory).subscribe(
          (res: any) => {
            this.loading[0] = false;
            if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
              this.selectedCategory.map((item: any) => {
                this.lstNotebookCate = this.lstNoteBookCate.filter((s: { Id: number; }) => s.Id !== item.Id);
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
