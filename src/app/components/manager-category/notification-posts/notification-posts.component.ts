import { Component } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService, PrimeNGConfig } from 'primeng/api';
import { NotificationService } from 'src/app/services/notification.service';
import { AppMessageResponse, AppStatusCode, StorageData, TypeNews } from 'src/app/shared/constants/app.constants';
import { StorageService } from 'src/app/shared/services/storage.service';
import { Notification } from 'src/app/viewModels/notification/notification';
import { Paging } from 'src/app/viewModels/paging';
import { Project } from 'src/app/viewModels/project/project';
import { ResApi } from 'src/app/viewModels/res-api';

@Component({
  selector: 'app-notification-posts',
  templateUrl: './notification-posts.component.html',
  styleUrls: ['./notification-posts.component.scss']
})
export class NotificationPostsComponent {
  public filterParrams!: Paging;
  public lstNotification!: any[];
  public Id : any;
  idFrozen: boolean = true;
  public filterText!: string;
  menuItems: MenuItem[] = [];
  isInputEmpty: boolean = true;
  selectedNotification : any;
  public loading = [false];
  public lstDoc : any;
  Idc: any;
  public isLoadingTable : boolean = false;
  public lstProject: Array<Project>;
  public type = TypeNews;
  constructor(
    private readonly storeService: StorageService,
    private confirmationService : ConfirmationService,
    private primengConfig: PrimeNGConfig,
    private readonly notificationService : NotificationService,

    private readonly messageService: MessageService,
  ){
    this.lstDoc = {};
    this.type = TypeNews;
    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 100;
    this.filterText = '';
    this.lstProject = new Array<Project>();

    this.menuItems = [{
      label: 'Xóa mục đã chọn', 
      icon: 'pi pi-fw pi-trash',
      command: () => {
        this.onDeletes();
    }}];
  }
  ngOnInit() {
   this.getLstNotebookByPaging();
   this.getCompanyId();
  }
  getCompanyId() {
    this.Idc = this.storeService.get(StorageData.companyId); 
  }
  getLstNotebookByPaging() {
    this.isLoadingTable = true;
    this.filterParrams.query = `Type=4`;
    this.notificationService.getListNotificationByPaging(this.filterParrams).subscribe((res: ResApi) => {
      // let array : any[] = [];
      //   const arr = res.data;
      //   for(let i=0;i<arr.length;i++){
      //     if(arr[i].Type < 6){
      //       array.push(arr[i]);
      //     }
      //   }

      this.isLoadingTable = false;

      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstNotification = res.data;
      }
      else {
        this.lstNotification = new Array<Notification>();
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    },
    () => {
      this.isLoadingTable = false;
  
      this.lstNotification = [];
      this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest });
    })
  } 
 
  searchNotiByPaging() {
    this.isLoadingTable = true;
    this.filterParrams.query = `Title.ToLower().Contains("${this.filterText}") AND Type=4`;
    this.notificationService.getListNotificationByPaging(this.filterParrams).subscribe((res: ResApi) => {

      this.isLoadingTable = false;

      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstNotification = res.data;
      }
      else {
        this.lstNotification = new Array<Notification>();
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    },
    () => {
      this.isLoadingTable = false;
  
      this.lstNotification = [];
      this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest });
    })
  } 
 
 
  onSearch(){
    this.searchNotiByPaging();
  }
  onDelete(item : Notification) {
  
    this.confirmationService.confirm({
      
      message: 'Bạn có muốn xóa thông báo ' +item.Title+ ' này không?',
      header: 'XÓA THÔNG BÁO CƯ DÂN',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xác nhận',
      rejectLabel: 'Hủy bỏ',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.notificationService.deleteNotificationById(item.Id).subscribe(
          (res: any) => {
            this.loading[0] = false;
            if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
              this.lstNotification = this.lstNotification.filter(s => s.Id !== item.Id);
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
        if(!this.selectedNotification) {
          this.messageService.add({severity: 'warn', summary: 'Warn', detail: 'Không có mục nào được chọn!'})
        }
        this.notificationService.deletesListNotification(this.Idc,this.selectedNotification).subscribe(
          (res: any) => {
            this.loading[0] = false;
            if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
              this.selectedNotification.map((item: any) => {
                this.lstNotification = this.lstNotification.filter((s: { Id: number; }) => s.Id !== item.Id);
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
