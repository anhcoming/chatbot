import { Component, OnInit } from '@angular/core';
import { DbTower } from 'src/app/viewModels/tower/db-tower';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Paging } from 'src/app/viewModels/paging';
import { TowerService } from 'src/app/services/tower.service';
import { ResApi } from 'src/app/viewModels/res-api';
import { MessageService, ConfirmationService } from 'primeng/api';
import { AppMessageResponse, AppStatusCode, StorageData } from 'src/app/shared/constants/app.constants';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FunctionService } from 'src/app/services/function.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ProjectService } from 'src/app/services/project.service';



@Component({
  selector: 'app-tower',
  templateUrl: './tower.component.html',
  styleUrls: ['./tower.component.scss']
})
export class TowerComponent implements OnInit {
  public filterParrams : Paging ;
  public Towers!: Array<DbTower>;
  public first = 0;
  public rows = 10;
  search: string = '';
  isInputEmpty: boolean = true;
  searchTower: string | undefined;
  Idc: any;
  menuItems: any;
  data = [];
  public itemTower: DbTower;
  public fTower: FormGroup ;
  public fProject: FormGroup ;
  public lstTower: any[];
  public lstDelete: any[] = [];
  public selectedItems: any;
  public lstProject: any
  public filterTower: Paging;
  public filterWard: Paging;
  public filterProjectName: Paging;
  public isLoadingTable: boolean = false;
  public loading = [false];
  positions = [];
  departments = [];

  constructor(
    private readonly towerService: TowerService,
    private readonly projectService: ProjectService,
    private readonly messageService: MessageService,
    private readonly storeService: StorageService,
    private readonly functionService: FunctionService,
    private readonly confirmationService: ConfirmationService,
    private modalService: NgbModal,
    private readonly fb: FormBuilder,
    //private readonly customerService: CustomerService
  ) {
    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 100;

    this.Towers = new Array<DbTower>();
    this.itemTower = new DbTower();

    this.filterTower = new Object as Paging;

    this.filterWard = new Object as Paging;

    this.filterProjectName = new Object as Paging;

    this.lstTower = [];

    this.fTower = fb.group({
      ProjectName: ['' , Validators.required],
      Code: ['' , Validators.required],
      Name: ['' , Validators.required],
      ContactPhone: ['' , Validators.required],
      ContactName: ['' , ],
      Note: ['' , ]
    })
    this.fProject = fb.group({
      ProjectId: ['' ],
    })
    this.menuItems = [{
      label: 'Delete', 
      icon: 'pi pi-fw pi-trash',
      command: () => {
        this.onDeletes();
    }}];
  }

  ngOnInit() {
    this.getListTowersByPaging();
    this.getCompanyId()
    this.getListProject()
}

getListTowersByPaging() {
  this.isLoadingTable = true;

  this.towerService.getListTowerByPaging(this.filterParrams).subscribe((res: ResApi) => {
    this.isLoadingTable = false;

    if(res.meta.error_code == AppStatusCode.StatusCode200) {
      this.Towers = res.data;
    }
    else {
      this.Towers = [];
      this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
    }
    
  },
  () => {
    this.isLoadingTable = false;

    this.Towers = [];
    this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest });
  })
}
getCompanyId() {
  this.Idc = this.storeService.get(StorageData.companyId); 
}
onDelete(id: number) {
  
  this.confirmationService.confirm({
    message: 'Bạn có muốn xóa tòa nhà '+ this.Towers.filter((i: any) => i.Id == id)[0].Name +' không?',
    header: 'XÓA TÒA NHÀ',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Xác nhận',
    rejectLabel: 'Hủy bỏ',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
    accept: () => {
      this.towerService.deleteTowerById(this.Idc, id).subscribe(
        (res: any) => {
          this.loading[0] = false;
          if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
            this.Towers = this.Towers.filter(s => s.Id !== id);
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

  onSearch(event: any) {
    const searchValue = event.target.value.toLowerCase().trim();
    this.filterParrams.query = `Name.ToLower().Contains("${searchValue}") OR Code.ToLower().Contains("${searchValue}")`;
    this.getListTowersByPaging();
  }
  onClearInput() {
    this.search = '';
    this.isInputEmpty = true;
    this.filterParrams.query = `Name.ToLower().Contains("${this.search}") OR Code.ToLower().Contains("${this.search}")`;
    this.getListTowersByPaging();
  }
  onSelect(event: any) {
    if(event.value == null) {
      this.filterParrams.query = '1=1';
    }else{
      this.filterParrams.query = `ProjectId=${event.value}`
    }
    this.getListTowersByPaging();
  }

  getListProject() {
    this.projectService.getListByPaging(this.filterParrams).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstProject = res.data;
      }
    })
  }
  onDeletes() {
    this.confirmationService.confirm({
      message: 'Bạn có muốn xóa danh sách tòa nhà được chọn không?',
      header: 'XÓA TÒA NHÀ',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xác nhận',
      rejectLabel: 'Hủy bỏ',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
      accept: () => {
        if(!this.selectedItems) {
          this.messageService.add({severity: 'warn', summary: 'Warn', detail: 'Không có mục nào được chọn!'})
        }
        this.towerService.deletesTower(this.Idc, this.selectedItems).subscribe(
          (res: any) => {
            this.loading[0] = false;
            if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
              this.selectedItems.map((item: any) => {
                this.Towers = this.Towers.filter(s => s.Id !== item.Id);
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

