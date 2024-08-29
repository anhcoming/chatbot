import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { time } from 'console';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NotebookCategoryService } from 'src/app/services/notebook-category';
import { ProjectService } from 'src/app/services/project.service';
import { TowerService } from 'src/app/services/tower.service';
import { ZoneService } from 'src/app/services/zone.service';
import { AppMessageResponse, AppStatusCode, StorageData } from 'src/app/shared/constants/app.constants';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ListProjectMaps, ListTowerMaps, ListZoneMaps } from 'src/app/viewModels/notebook-category/notebook-category';
import { Paging } from 'src/app/viewModels/paging';
import { Project } from 'src/app/viewModels/project/project';
import { ResApi } from 'src/app/viewModels/res-api';
import { DbTower } from 'src/app/viewModels/tower/db-tower';


@Component({
  selector: 'app-add-notebook-category',
  templateUrl: './add-notebook-category.component.html',
  styleUrls: ['./add-notebook-category.component.scss']
})
export class AddNotebookCategoryComponent {
  public itemNotebookcate !: any[]
  public fNotebookCate : any;
  public loading  = [false];
  public currentDate = new Date();
  public id : any;
  public lstProject:  any[];
  public lstTower : any[];
  public lstZone : any[];
  public listTowerMaps : Array<ListTowerMaps>;
  public listZoneMaps : Array<ListZoneMaps>;
  public listProjectMaps : Array<ListProjectMaps>;
  public Id : any;
  public filterProject: Paging;
  public allChecked: boolean = false;
  public allChecked2 : boolean = false;
  public filterParrams : Paging;
  dataNotecate: any;
  userId: any;
  Idc: any;
  Tower: any;
  constructor(  
    private readonly notebookcategoryService : NotebookCategoryService,
    private readonly projectService : ProjectService,
    private readonly towerService : TowerService,
    private readonly zoneService : ZoneService,
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private messageService : MessageService,
    private router: Router,
    private readonly storeService : StorageService,
  ){
    this.dataNotecate = {};
    this.lstProject = [],
    this.lstProject = new Array<Project>();
    this.filterProject =  new Object as Paging;
    this.filterParrams = new Object as Paging;
    this.listTowerMaps = new Array<ListTowerMaps>();
    this.listProjectMaps = new Array<ListProjectMaps>();
    this.listZoneMaps = new Array<ListZoneMaps>();
    this.lstProject = [];
    this.lstTower = new Array<DbTower>();
    this.lstZone = new Array<Zone>();
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 100;
    this.fNotebookCate = fb.group({
      CategoryId: [0],
      listProjectMaps :this.fb.array([], Validators.required),
      listTowerMaps : this.fb.array([], Validators.required),
      listZoneMaps: this.fb.array([], Validators.required),
      Name: [''],
      Type: [1],
      CreatedById : this.userId,
      UpdatedById : this.userId,
      CompanyId: this.Idc,
      Location: [0],
      Description: [''],
      listNews: [],
      Status: [1],
      CreatedAt: [''],
      UserId: [0],
      StartDate: [''],
      Contents: ['',Validators.required],
      URL: [''],
      Image : [''],
    })
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
    });
   
    this.getListProject();
    this.getCompanyId();
    this.getUserId();
    this.getListProject();
    this.getListTower();
    this.getListZone();
    if(this.id)
      this.getNotebookcategoryByID(this.id)

    this.fNotebookCate = this.fb.group({
      Id: [0],
      CreatedById : this.userId,
      listProjectMaps :this.fb.array([], Validators.required),
      listTowerMaps : this.fb.array([], Validators.required),
      listZoneMaps: this.fb.array([], Validators.required),
      UpdatedById : this.userId,
      Type : [1],
      Name: ['',Validators.compose([Validators.required, Validators.minLength(7), Validators.maxLength(150)])],
      CompanyId: this.Idc,
      Location: ['',Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(6)])],
      Description: [''],
      CreatedBy: [''],
      UpdatedBy: [''],
      Url : [''],
      Image : [''],
      Contents: [''],
      Status: [1],
      CreatedAt: this.currentDate,
      UpdatedAt: this.currentDate,
      CategoryParentId: [],
    })
  }
  getUserId() {
    this.userId = this.storeService.get(StorageData.userId); 
  }
  getCompanyId() {
    this.Idc = this.storeService.get(StorageData.companyId); 
  }
  getNotebookcategoryByID(id: number) {

    this.notebookcategoryService.getNotebookCategoryById(id).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {

        this.dataNotecate = res.data;
        this.listProjectMaps = res.data.listProjectMaps;
        this.listTowerMaps = res.data.listTowerMaps;
        this.listZoneMaps = res.data.listZoneMaps;
        
        if (this.listProjectMaps) {
          this.lstProject.forEach((item:any) => {
            const projectMap = this.listProjectMaps.find(p => p.ProjectId == item.Id);
            if (projectMap) {
              item.check = true;
              if(!this.id){
              this.onSelectTower(item.Id);}
              else{
                this.onselectTowerByIdProject(item.Id);
              }
            }
          });
        }
  
        if (this.listZoneMaps) {
          this.lstZone.forEach(item => {
            const zoneMap = this.listZoneMaps.find(z => z.ZoneId == item.Id);
            if (zoneMap) {
              item.checked = true;
            }
          });
        }
        this.formGroup();
 
      }
      else {
        this.dataNotecate = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
      
    }) 
  }
  formGroup() {
    this.fNotebookCate = this.fb.group({
      Id: this.dataNotecate.Id,
      Type : this.dataNotecate.Type,
      CreatedById : this.userId,
      listProjectMaps: this.listProjectMaps,
      listTowerMaps : this.listTowerMaps,
      listZoneMaps : this.listZoneMaps,
      Name: this.dataNotecate.Name,
      CompanyId : this.dataNotecate.CompanyId,
      UpdatedById : this.userId,
      Url : this.dataNotecate.Url,
      Image : this.dataNotecate.Image,
      Contents: this.dataNotecate.Contents,
      Location: this.dataNotecate.Location,
      Description: this.dataNotecate.Description,
      CreatedAt: this.dataNotecate.CreatedAt,
      UpdatedAt: this.currentDate,
      CategoryParentId: this.dataNotecate.CategoryParentId,
    })
  }
  onSubmit() {
    if(!this.fNotebookCate.get('Name').value) {
      this.messageService.add({severity: 'error', summary:'Error', detail: 'Tên hiển thị không được để trống!'});
      return;
    }
    if(this.fNotebookCate.get('Name').value.length < 6){
      this.messageService.add({severity: 'error',summary: 'Error',detail:'Tên sổ tay phải từ 6 ký tự trở lên!'});
      return;
    }
    if(this.fNotebookCate.get('Location').value < 0 ){
      this.messageService.add({severity: 'error',summary: 'Error',detail:'Vị trí sắp xếp phải lớn >= 0!'});
      return;
      
    }
    const selectedProjects = this.lstProject.filter((project:any) => project.check).map(project => project.Id);
    if (selectedProjects.length === 0) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Vui lòng chọn ít nhất một khu đô thị!' });
      return;
    }
    const selectedTowers = this.lstTower.filter(tower => tower.checked).map(tower => tower.Id);
    if (selectedTowers.length === 0) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Vui lòng chọn ít nhất một tòa nhà!' });
      return;
    }
    const selectedZone = this.lstZone.filter(zone => zone.checked).map(zone => zone.Id);
    if (selectedZone.length === 0) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Vui lòng chọn ít nhất một vị trí!' });
      return;
    }
    if(this.id == null) {
      const projectList = selectedProjects.map(projectId => ({ProjectId: projectId,CreatedById: this.userId,UpdatedById: this.userId, check : true }));
      const towerList = selectedTowers.map(towerId => ({TowerId: towerId,ProjectId : selectedProjects[0],CreatedById: this.userId,UpdatedById: this.userId,checked : true }));
      const zoneList = selectedZone.map(zoneId => ({ZoneId: zoneId,CreatedById: this.userId,UpdatedById: this.userId,checked : true }));
      this.fNotebookCate.controls['Id'].setValue(0);
      
      const reqData = Object.assign({}, this.fNotebookCate.value);
      reqData.listProjectMaps = projectList;
      reqData.listTowerMaps = towerList;
      reqData.listZoneMaps = zoneList;
      this.loading[0] = true;
      this.notebookcategoryService.createNotebookCategory(reqData).subscribe(
        (res: any) => {
          this.loading[0] = false;
          if (res?.meta?.error_code == AppStatusCode.StatusCode200) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.CreatedSuccess });
            
            setTimeout(() => {this.onReturnPage('/manager-category/notebook-category/list')}, 1000);
          } 
          else { 
        
            this.messageService.add({ severity: 'warn', summary: 'Warn', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
          }
        },
        () => {
          this.loading[0] = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest });
        },
        () => {
          this.loading[0] = false;
        }
      );
    }else{
      const projectList = selectedProjects.map(projectId => ({ProjectId: projectId,CreatedById: this.userId,UpdatedById: this.userId, check : true }));
      const towerList = selectedTowers.map(towerId => ({TowerId: towerId,ProjectId : selectedProjects[0],CreatedById: this.userId,UpdatedById: this.userId,checked : true }));
      const zoneList = selectedZone.map(zoneId => ({ZoneId: zoneId,CreatedById: this.userId,UpdatedById: this.userId,checked : true }));

      const reqData = Object.assign({}, this.fNotebookCate.value);
      reqData.listProjectMaps = projectList;
      reqData.listTowerMaps = towerList;
      reqData.listZoneMaps = zoneList;
      this.loading[0] = true;
      this.notebookcategoryService.updateNotebookCategory(this.id, reqData).subscribe(
        (res: any) => {
          this.loading[0] = false;
          if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: res.meta.error_message || AppMessageResponse.CreatedSuccess });

            setTimeout(() => {this.onReturnPage('/manager-category/notebook-category/list')}, 1500);
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
          }
        },
        () => {
          this.loading[0] = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest });
        },
        () => {
          this.loading[0] = false;
        }
      );
    }
  }
  onReturnPage(url: string) : void {
    this.router.navigate([url]);
  }
  onBack(event: Event){
    let isShow = true;//this.layoutService.getIsShow();
  
    if (isShow) {
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: !(this.id > 0) ? "Chưa hoàn tất thêm mới sổ tay cư dân,Bạn có muốn Hủy?" : "Chưa hoàn tất sửa sổ tay cư dân,Bạn có muốn Hủy?",
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Xác nhận',
        rejectLabel: 'Hủy bỏ',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
        accept: () => {
          this.router.navigate(['/manager-category/notebook-category/list']);
        },
        reject: () => {
            return;
        }
      });
    } else {
      this.router.navigate(['/manager-category/notebook-category/list']);
    }
  }
  getListProject() {
    this.lstProject = [];
    this.projectService.getListByPaging(this.filterProject).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstProject = res.data;
        for(let i=0; i< this.lstProject.length; i++) {
          this.lstProject[i].check = false;
        }
        if(this.id){
          this.getNotebookcategoryByID(this.id);
        }
      }
      else {
        this.lstProject  = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })  
  }
  onSelectTower(item: any) {
    this.lstTower = [];
    console.log(this.lstProject.some((item:any) => item.check === true));
    
    if(this.lstProject.some((item:any) => item.check === true))
    for (let i=0;i<this.lstProject.length;i++)
    {
      if(this.lstProject[i].check)
      {
        let Id=this.lstProject[i].Id;
        this.lstTower.push(...this.Tower.filter((i: any) => i.ProjectId == Id))
        console.log(this.lstTower)
        this.lstTower.forEach(item => {
          item.checked = true;
          this.allChecked = true;
        });
      }
    }
  }

  onselectTowerByIdProject(item: any) {
    this.lstTower = [];
    for (let i=0;i<this.lstProject.length;i++)
    {
      if(this.lstProject[i].check)
      {
        let Id=this.lstProject[i].Id;
        this.lstTower.push(...this.Tower.filter((i: any) => i.ProjectId == Id))
        if(this.dataNotecate.listTowerMaps){
          this.dataNotecate.listTowerMaps.map((items: any) => {
            this.lstTower.forEach((item) => {
              if (item.Id == items.TowerId) {
                item.checked = true;
              }
            });
          })
        }
      }
    }
  }

  getListTower() {
    this.towerService.getListTowerByPaging(this.filterParrams).subscribe((res: ResApi) => {
      if(res.meta.error_code = AppStatusCode.StatusCode200) {
        this.Tower = res.data;
      } else {
        this.Tower = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })
  }
  getListZone() {
    this.zoneService.getListZoneByPaging(this.filterParrams).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstZone = res.data;
        console.log(this.lstZone);
        
        for(let i=0; i<this.lstZone.length; i++){
          this.lstZone[i].checked = false;
        }
        if(this.dataNotecate.ListZoneMaps){
          this.dataNotecate.ListZoneMaps.map((items: any) => {
            this.lstZone.forEach((item) => {
              if (item.Id == items.ZoneId) {
                item.checked = true;
                this.allChecked2 = true;
              }
            });
          })
          this.allChecked = this.lstZone.every(item => item.checked);
          console.log(this.dataNotecate.ListZoneMaps);
        }
      }
      else {
        this.lstZone = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })
  }

  checkAll() {
    this.allChecked = this.lstTower.every(item => item.checked);
  }
  toggleAll() {
    this.lstTower.forEach(item => item.checked = this.allChecked);
  }
  checkAll2() {
    this.allChecked2 = this.lstZone.every(item => item.checked);
  }
  toggleAll2() {
    this.lstZone.forEach(item => item.checked = this.allChecked2);
  }

}
