import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, ConfirmationService, MenuItem, PrimeNGConfig } from 'primeng/api';
import { ProjectService } from 'src/app/services/project.service';
import { ApiConstant } from 'src/app/shared/constants/api.constants';
import { AppMessageResponse, AppStatusCode, StorageData } from 'src/app/shared/constants/app.constants';
import { StorageService } from 'src/app/shared/services/storage.service';
import { Paging } from 'src/app/viewModels/paging';
import { Project } from 'src/app/viewModels/project/project';
import { ResApi } from 'src/app/viewModels/res-api';
import { HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent {
  Idc: any;
  public lstDelete: any[] =[];
  public selectedRows: any;
  public selectedProjects: any;
  menuItems: MenuItem[] = [];
  public filterParrams : Paging;
  public lstProject: Array<Project>;
  public isLoadingTable: boolean = false;
  public loading = [false];
  public popup: boolean = true;
  search: string = '';
  isInputEmpty: boolean = true;
  

  constructor(
    private readonly projectService: ProjectService,
    private readonly messageService: MessageService,
    private readonly storeService: StorageService,
    private readonly confirmationService: ConfirmationService,
    private primengConfig: PrimeNGConfig,
    private readonly fb: FormBuilder,
    private route: ActivatedRoute, 
    private router: Router
  ) {
    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 1000;

    this.lstProject = new Array<Project>();
    this.menuItems = [{
      label: 'Delete', 
      icon: 'pi pi-fw pi-trash',
      command: () => {
        this.onDeletes();
    }}];
  }

  ngOnInit() {
      this.primengConfig.ripple = true;
      this.getListProjectByPaging();
      this.getCompanyId();
  }

  getListProjectByPaging() {
    this.isLoadingTable = true;

    this.projectService.getListByPaging(this.filterParrams).subscribe((res: ResApi) => {
      this.isLoadingTable = false;

      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstProject = res.data;
      }
      else {
        this.lstProject = new Array<Project>();
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    },
    () => {
      this.isLoadingTable = false;
  
      this.lstProject = [];
      this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest });
    })
  }
  
  onSearch(event: any) {
    const searchValue = event.target.value.toLowerCase().trim();
    this.filterParrams.query = `Name.ToLower().Contains("${searchValue}") OR Code.ToLower().Contains("${searchValue}")`;
    this.getListProjectByPaging();
  }

  onDelete(item: Project ) {
    
    this.confirmationService.confirm({
      message: 'Bạn có muốn xóa khu đô thị <b>"'+ item.Name +'"</b> không?',
      header: 'XÓA KHU ĐÔ THỊ',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xác nhận',
      rejectLabel: 'Hủy bỏ',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.projectService.deleteProjectById(this.Idc, item.Id).subscribe(
          (res: any) => {
            this.loading[0] = false;
            if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
              this.lstProject = this.lstProject.filter(s => s.Id !== item.Id);
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
  onClearInput() {
    this.search = '';
    this.isInputEmpty = true;
    this.filterParrams.query = `Name.ToLower().Contains("${this.search}") OR Code.ToLower().Contains("${this.search}")`;
    this.getListProjectByPaging();
  }
  getCompanyId() {
    this.Idc = this.storeService.get(StorageData.companyId); 
  }
  exportExcel() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    
    this.projectService.ExportExcel(this.Idc).subscribe((res: Blob) => {
      const url = window.URL.createObjectURL(res);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'project_data.xlsx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }
  toggle(event: any) {
    if(this.popup = true){
      this.popup = false;
    }else{
      this.popup = true
    }
  }
  onDeletes() {
    this.confirmationService.confirm({
      message: 'Bạn có muốn xóa các khu đô thị được chọn không?',
      header: 'XÓA KHU ĐÔ THỊ',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xác nhận',
      rejectLabel: 'Hủy bỏ',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
      accept: () => {
        if(!this.selectedProjects) {
          this.messageService.add({severity: 'warn', summary: 'Warn', detail: 'Không có mục nào được chọn!'})
        }
        this.projectService.deletesProject(this.Idc, this.selectedProjects).subscribe(
          (res: any) => {
            this.loading[0] = false;
            if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
              this.selectedProjects.map((item: any) => {
                this.lstProject = this.lstProject.filter(s => s.Id !== item.Id);
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
