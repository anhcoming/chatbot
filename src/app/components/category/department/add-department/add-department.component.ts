import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AppMessageResponse, AppStatusCode, StorageData, TypeDepartment } from 'src/app/shared/constants/app.constants';
import { Paging } from 'src/app/viewModels/paging';
import { ResApi } from 'src/app/viewModels/res-api';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from 'src/app/services/project.service';
import { DepartmentService } from 'src/app/services/department.service';
import { Department, ListProjectMaps, ListTowerMaps, ListZoneMaps } from 'src/app/viewModels/department/department';
import { StorageService } from 'src/app/shared/services/storage.service';
import { TowerService } from 'src/app/services/tower.service';
import { Project } from 'src/app/viewModels/project/project';
import { ZoneService } from 'src/app/services/zone.service';

@Component({
  selector: 'app-add-department',
  templateUrl: './add-department.component.html',
  styleUrls: ['./add-department.component.scss']
})
export class AddDepartmentComponent {
  Department: Department;
  public id: any;
  public Idc: any;
  fDepartment: any ;
  public itemDepartment : Department;
  public lstProject: any;
  selectedBuildings: string[] = [];
  public Tower : any[] = [];
  public lstTower : any[];
  public lstZone : any[];
  
  public listTowerMaps : Array<ListTowerMaps>;
  public listZoneMaps : Array<ListZoneMaps>;
  public listProjectMaps : Array<ListProjectMaps>;
  public lstDepartment: any;
  public Project: any;
  public projectItem: any;
  public allChecked: boolean = false;
  public allChecked2: boolean = false;
  public filterProject: Paging;
  public filterTower: Paging;
  public filterZone : Paging;
  public filterParrams : Paging ;
  public lstTypeDepartment : any;
  public loading = [false];
  selectedTowers: any[];
  userId: any;

  constructor(
    private readonly projectService: ProjectService,
    private readonly towerService : TowerService,
    private readonly zoneService : ZoneService,
    private readonly storeService: StorageService,
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService,
    private readonly fb: FormBuilder,
    private readonly departmentService: DepartmentService,
    private readonly route: ActivatedRoute,
    private router: Router,
    
  ) {
    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 50;
    this.filterParrams.select = 'Id, Name';
    this.Department = new Department();
    this.itemDepartment = new Department();
    this.filterParrams = new Object as Paging;
    this.filterTower = new Object as Paging;
    this.filterTower.page = 1;
    this.filterTower.page_size = 100;
    this.filterZone = new Object as Paging;
    this.filterZone.page = 1;
    this.filterZone.page_size = 100;
    this.listProjectMaps = new Array<ListProjectMaps>();
    this.listTowerMaps = new Array<ListTowerMaps>();
    this.listZoneMaps = new Array<ListZoneMaps>();
    this.lstDepartment = [];
    this.lstTower = [];
    this.filterProject = new Object as Paging;
    this.lstZone = [];
    this.selectedTowers = [];
    this.lstProject = [];
    this.Project = {
      Id: '',
      Code: '',
      Name: ''
    }

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id =  params.get('id');
    });
    if(this.id)
      this.getDepartmentById(this.id);
    this.getListProject();
    this.getListTower();
    // this.getLstTower();
    this.getCompanyId();
    this.getUserId();
    this.getListZone();
    this.setData();
    // this.getListProjectByPaging();
    this.fDepartment = this.fb.group({
      Id : 0,
      Code: ['' ,  Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(150)])],
      DepartmentId: ['' ],
      Name: ['' ,  Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(150)])],
      Type: [0],
      listProjectMaps :this.fb.array([[], Validators.required]),
      listTowerMaps : this.fb.array([[], Validators.required]),
      listZoneMaps: this.fb.array([[], Validators.required]),
      Email: ['', [Validators.email]],
      Phone: ['',Validators.compose([Validators.required,Validators.minLength(10),Validators.maxLength(12),Validators.pattern('^[0-9]{10,12}$')])],
      CreatedById: this.userId,
      UpdatedById: this.userId,
      CompanyId: this.Idc,
    })
  }
  getCompanyId() {
    this.Idc = this.storeService.get(StorageData.companyId); 
    
  }
  getUserId() {
    this.userId = this.storeService.get(StorageData.userId); 
  }

  onReturnPage(url: string) : void {
    this.router.navigate([url]);
  }
  markAllAsDirty() {
    Object.keys(this.fDepartment.controls).forEach(key => {
      const control = this.fDepartment.get(key);
      if (control.enabled && control.invalid) {
        control.markAsDirty();
      }
    });
  }
  onSubmit() {
    if(this.fDepartment.invalid){
      this.markAllAsDirty();
      this.checkTower()
      
    }else{
      this.checkTower()
      if(this.fDepartment.controls['listTowerMaps'].dirty == true) {
        return
      }
      const selectedProjects = this.lstProject.filter((project : any) => project.check).map((project:  any) => project.Id);
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
        const projectList = selectedProjects.map((projectId: any) => ({ProjectId: projectId,CreatedById: this.userId,UpdatedById: this.userId }));
        const towerList = selectedTowers.map(towerId => ({TowerId: towerId,ProjectId : selectedProjects[0],CreatedById: this.userId,UpdatedById: this.userId }));
        const zoneList = selectedZone.map(zoneId => ({ZoneId: zoneId,CreatedById: this.userId,UpdatedById: this.userId }));
        const reqData = Object.assign({}, this.fDepartment.value);
        reqData.listProjectMaps = projectList;
        reqData.listTowerMaps = towerList;
        reqData.listZoneMaps = zoneList;
        // reqData.ProjectId = this.lstProject.filter((i: any) => i.Id == this.fDepartment.get('ProjectId').value)[0].Id;

        this.loading[0] = true;
        this.departmentService.createDepartment(reqData).subscribe((res: ResApi) => {
          this.loading[0] = false;
          if(res.meta.error_code == AppStatusCode.StatusCode200) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.CreatedSuccess });

            setTimeout(() => {this.onReturnPage('/category/department/list')}, 1500);
          }
          else {
            
            this.loading[0] = false
            this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
          }
        },
        () => {
          this.loading[0] = false
          this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest }) },
        () => {this.loading[0] = false} 
        ) 
      }
      else{
        const selectedProjects = this.lstProject.filter((project : any) => project.check).map((project:  any) => project.Id);
        const selectedTowers = this.lstTower.filter(tower => tower.checked).map(tower => tower.Id);
        const selectedZone = this.lstZone.filter(zone => zone.checked).map(zone => zone.Id);
        const reqData = Object.assign({}, this.fDepartment.value);
        const projectList = selectedProjects.map((projectId: any) => ({ProjectId: projectId,CreatedById: this.userId,UpdatedById: this.userId}));
        const towerList = selectedTowers.map(towerId => ({TowerId: towerId,ProjectId : selectedProjects[0],CreatedById: this.userId,UpdatedById: this.userId }));
        const zoneList = selectedZone.map(zoneId => ({ZoneId: zoneId,CreatedById: this.userId,UpdatedById: this.userId}));
        reqData.listProjectMaps = projectList;
        reqData.listTowerMaps = towerList;
        reqData.listZoneMaps = zoneList;
        // reqData.ProjectId = this.lstProject.filter((i: any) => i.Id == this.fDepartment.get('ProjectId').value)[0].Id;

        this.loading[0] = true;
        this.departmentService.updateDepartment(this.id, reqData).subscribe((res: ResApi) => {
          this.loading[0] = false;
          if(res.meta.error_code == AppStatusCode.StatusCode200) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.CreatedSuccess });

            setTimeout(() => {this.onReturnPage('/category/department/list')}, 1500);
          }
          else {
            
            this.loading[0] = false
            this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
          }
        },
        () => {
          this.loading[0] = false
          this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest }) },
        () => {this.loading[0] = false} 
        )
      }
    }
  }

  formGroup() {
    this.fDepartment = this.fb.group({
      Id:  this.lstDepartment.Id,
      CreatedById: this.userId,
      UpdatedById: this.userId,
      CompanyId: this.Idc,
      Code: this.lstDepartment.Code,
      listProjectMaps: this.listProjectMaps,
      listTowerMaps : this.listTowerMaps,
      listZoneMaps : this.listZoneMaps,
      DepartmentId: this.lstDepartment.DepartmentId,
      Name: this.lstDepartment.Name,
      Email: this.lstDepartment.Email,
      Phone: this.lstDepartment.Phone,
      Type: this.lstDepartment.Type,
    })
  }

  setData() {
    this.lstTypeDepartment = TypeDepartment.map(item => ({ Name : item.label, Id: item.value }));
  }

  checkTower() {
    const isAnyChecked = this.lstTower.some((tower) => tower.checked === true);
    const isAnyCheck = this.lstProject.some((project:any) => project.check == true);
    if(isAnyCheck==false || isAnyChecked == false) {
      const control = this.fDepartment.get('listTowerMaps');
      const controls = this.fDepartment.get('listProjectMaps');
      control.markAsDirty();
      controls.markAsDirty();
    }else{
      const control = this.fDepartment.get('listTowerMaps');
      const controls = this.fDepartment.get('listProjectMaps');
      control.markAsPristine();
      controls.markAsPristine();
    }
  }
 
  getListZone() {
    this.zoneService.getListZoneByPaging(this.filterZone)
    .subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstZone = res.data;
      }
      else {
        this.lstZone = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })
  }
  onSelectTower(item: any) {
    this.lstTower = [];

    
    if(this.lstProject.some((item:any) => item.check === true))
    for (let i=0;i<this.lstProject.length;i++)
    {
      if(this.lstProject[i].check)
      {
        let Id=this.lstProject[i].Id;
        this.lstTower.push(...this.Tower.filter((i: any) => i.ProjectId == Id))
  
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
        if(this.lstDepartment.listTowerMaps){
          this.lstDepartment.listTowerMaps.map((items: any) => {
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
 
 
  getDepartmentById(id: number) {
   
      this.departmentService.getDepartmentById(id).subscribe((res: ResApi) => {
        if(res.meta.error_code == AppStatusCode.StatusCode200) {
          this.lstDepartment = res.data;
          this.listProjectMaps = res.data.listProjectMaps;
          this.listTowerMaps = res.data.listTowerMaps;
          this.listZoneMaps = res.data.listZoneMaps;
          this.formGroup();
          this.setData();
          if (this.listProjectMaps) {
            this.lstProject.forEach((item:any) => {
              const projectMap = this.listProjectMaps.find(p => p.ProjectId == item.Id);
              if (projectMap) {
                item.check = true;
                if(!this.id){
                  this.onSelectTower(item.Id);
                } else {
                   this.onselectTowerByIdProject(item.Id);
                }
              }
            });
          }

          if(this.listTowerMaps){
            this.lstTower.every(item => {
              const towerMap = this.listTowerMaps.find(p => p.ProjectId == item.Id);
              if (towerMap) {
                item.checked = true;
              }
            })
          }
    
          if (this.listZoneMaps) {
            this.lstZone.forEach(item => {
              const zoneMap = this.listZoneMaps.find(z => z.ZoneId == item.Id);
              if (zoneMap) {
                item.checked = true;
              }
            });
          }
        }
        else {
          this.lstDepartment = [];
          this.lstDepartment.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
        }  
    })
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
          this.getDepartmentById(this.id);
        }
      }
      else {
        this.lstProject  = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })  
  }
  onBack(event: Event) {
    let isShow = true;

    if (isShow) {
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: !(this.id > 0) ? 'Hủy thêm mới phòng ban' : 'Hủy cập nhật phòng ban',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Xác nhận',
        rejectLabel: 'Hủy bỏ',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
        accept: () => {
          this.router.navigate(['/category/department/list']);
        },
        reject: () => {
            return;
        }
      });
    } else {
      this.router.navigate(['/category/department/list']);
    }
  }
  checkAll() {
    this.allChecked = this.lstTower.every(item => item.checked);
  }
  checkAll2() {
    this.allChecked2 = this.lstZone.every(item => item.checked);
  }
  toggleAll() {
    this.lstTower.forEach(item => item.checked = this.allChecked);
  }
  toggleAll2() {
    this.lstZone.forEach(item => item.checked = this.allChecked2);
  }
}
