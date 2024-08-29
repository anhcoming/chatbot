import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Password } from 'primeng/password';
import { DepartmentService } from 'src/app/services/department.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { FunctionRoleService } from 'src/app/services/function-role.service';
import { PositionService } from 'src/app/services/position.service';
import { ProjectService } from 'src/app/services/project.service';
import { TowerService } from 'src/app/services/tower.service';
import { ZoneService } from 'src/app/services/zone.service';
import { AppMessageResponse, AppStatusCode, Role, StorageData, TypeEmployee } from 'src/app/shared/constants/app.constants';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ListProjectMaps, ListTowerMaps, ListZoneMaps } from 'src/app/viewModels/employee/employeeaccount';
import { Paging } from 'src/app/viewModels/paging';
import { ResApi } from 'src/app/viewModels/res-api';
import { Md5 } from 'ts-md5';

@Component({
  selector: 'app-add-employee-account',
  templateUrl: './add-employee-account.component.html',
  styleUrls: ['./add-employee-account.component.scss']
})
export class AddEmployeeAccountComponent {
  public filterParrams: Paging;
  public filterProject: Paging;
  public filterTower : Paging;
  public filterZone : Paging;
  fEmployeeAccount: any;
  fIsAccount: any;
  public id: any;
  public listRole: any;
  public Idc: any;
  public Account: any;
  check:boolean=false;
  public lstTower: any;
  public lstProject: any;
  public typeEmployee : any;
  public listRoles: any[];
  public lstEmployee: any;
  public listEmployee: any;
  public lstZone :any[];
  public Tower: any;
  public lstPosition: any[];
  public lstDepartment: any=[];
  public DepartmentId : any;
  public PositionId : any;
  public listFuctionRole : any = [];
  public loading = [false];
  public allChecked: boolean = false;
  public allChecked2 : boolean = false;
  public listProjectMaps : Array<ListProjectMaps>;
  public listTowerMaps : Array<ListTowerMaps>;
  public listZoneMaps : Array<ListZoneMaps>;
  userId: any;
  constructor(
    private readonly departmentService: DepartmentService,
    private readonly functionroleService: FunctionRoleService,
    private readonly positionService : PositionService,
    private readonly projectService: ProjectService,
    private readonly towerService: TowerService,
    private readonly zoneService : ZoneService,
    private readonly employeeService: EmployeeService,
    private readonly storeService: StorageService,
    private readonly route: ActivatedRoute,
    private router: Router,
    private readonly fb: FormBuilder,
    private readonly confirmationService : ConfirmationService,
    private readonly messageService : MessageService,
  ){
    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 100;
    this.listProjectMaps = new Array<ListProjectMaps>();
    this.listTowerMaps = new Array<ListTowerMaps>();
    this.listZoneMaps = new Array<ListZoneMaps>();
    this.filterProject = new Object as Paging;
    this.filterTower = new Object as Paging;
    this.filterZone = new Object as Paging;
    this.lstPosition = [];
    this.lstZone = [];
    this.lstProject = [];
    this.lstTower = [];
    this.listRoles =[];
  }


  ngOnInit(): void {
    this.fEmployeeAccount = this.fb.group({
      listProjectMaps :this.fb.array([[], Validators.required]),
      listTowerMaps : this.fb.array([[], Validators.required]),
      listZoneMaps: this.fb.array([[], Validators.required]),
      listRoles : this.fb.array([]),
      listEmployeeMaps: this.fb.array([[], Validators.required]),
      PositionId: ['' , Validators.required],
      DepartmentId: ['' , Validators.required],
      UserName: ['' , Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(15)])],
      Type: [2 , Validators.required],
      Id:  this.id,
      CreatedById: this.userId,
      CompanyId: this.Idc,
      Password: ['' , Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(15)])],
      ConfirmPassword: ['', Validators.compose([Validators.required])],
    });

    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
    });
    this.getEmployee()
    this.markAllAsDirty();

    this.getListPositionByPaging();
    // this.getlstFunctionRoleByPaging();
    this.getlstFuncRoleByPaging();
    this.getListDepartmentByPaging();
    this.getListTower();
    this.getListZone();
    this.getCompanyId();
    this.getUserId();
    this.getListProject();
    this.setData();
    // this.getEmployee();
    
  }

  markAllAsDirty() {
    Object.keys(this.fEmployeeAccount.controls).forEach(key => {
      const control = this.fEmployeeAccount.get(key);
      if (control.enabled && control.invalid) {
        control.markAsDirty();
      }
    });
  }

  matchingPasswords() {
    const password = this.fEmployeeAccount.get('Password').value;
    const confirmPassword = this.fEmployeeAccount.get('ConfirmPassword').value;
    if (password !== confirmPassword) {
      this.fEmployeeAccount.get('ConfirmPassword').setErrors({mismatchedPasswords: true});
    } else {
      this.fEmployeeAccount.get('ConfirmPassword').setErrors(null);
    }
  }
  getCompanyId() {
    this.Idc = this.storeService.get(StorageData.companyId); 
  }
  getUserId() {
    this.userId = this.storeService.get(StorageData.userId); 
  }
  onSubmit() {
    const selectedProjects = this.lstProject.filter((project : any) => project.check).map((project:  any) => project.Id);
    if (selectedProjects.length === 0) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Vui lòng chọn ít nhất một khu đô thị!' });
      return;
    }
    const selectedTowers = this.lstTower.filter((tower:any) => tower.checked).map((tower:any) => tower.Id);
    if (selectedTowers.length === 0) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Vui lòng chọn ít nhất một tòa nhà!' });
      return;
    }
    const selectedZone = this.lstZone.filter(zone => zone.checked).map(zone => zone.Id);
    if (selectedZone.length === 0) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Vui lòng chọn ít nhất một vị trí!' });
      return;
    }
    const selectedRole = this.listFuctionRole.filter((item : any) => item.check).map((item : any) => item.Id);
    if (selectedRole.length === 0) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Vui lòng chọn ít nhất một nhóm quyền!' });
      return;
    }
 
    const projectList = selectedProjects.map((projectId: any) => ({ProjectId: projectId,CreatedById: this.userId,UpdatedById: this.userId }));
    const towerList = selectedTowers.map((towerId:any) => ({TowerId: towerId,ProjectId : selectedProjects[0],CreatedById: this.userId,UpdatedById: this.userId }));
    const zoneList = selectedZone.map(zoneId => ({ZoneId: zoneId,CreatedById: this.userId,UpdatedById: this.userId }));
    const reqData = Object.assign({}, this.fEmployeeAccount.value);
    reqData.listProjectMaps = projectList;
    reqData.listTowerMaps = towerList;
    reqData.listZoneMaps = zoneList;
    reqData.listEmployeeMaps = [];
    reqData.Id = this.id
    reqData.CreatedById = this.userId;
    reqData.CompanyId = this.Idc;
    reqData.listRoles = this.listRoles;
    reqData.Password = Md5.hashStr(reqData.Password);
    this.loading[0] = true;
    this.employeeService.createAccountEmployee(this.id ,reqData).subscribe(
      (res: any) => {
        this.loading[0] = false;
        if (res.meta.error_code == AppStatusCode.StatusCode200) {
          // this.onAccount();
          this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.CreatedSuccess });
          
          setTimeout(() => {this.onReturnPage('/category/employee/list')}, 1000);
        } 
        else { 
          this.loading[0] = false
          
          this.messageService.add({ severity: 'warn', summary: 'Warn', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
        }
      },
    );
  }

  getListDepartmentByPaging() {
    this.departmentService.getListDepartmentByPaging(this.filterParrams).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstDepartment = res.data;
        
      }
      else {
        this.lstDepartment = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })
  }

  getListPositionByPaging() {
    this.positionService.getListPositionByPaging(this.filterParrams).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstPosition = res.data;
        
      }
      else {
        this.lstPosition = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })
  }

  onReturnPage(url: string) : void {
    this.router.navigate([url]);
  }


  onCheck() {
    this.listRoles = this.listFuctionRole.filter((i: any) => i.check === true).map((item: any) => ({RoleId:item.Id, RoleName: item.Name }))
  }

  getlstFuncRoleByPaging() {
    this.functionroleService.getListFunctionRoleByPaging(this.filterParrams).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.listFuctionRole = res.data
        if(this.listEmployee?.IsAccount == true){
          this.listRole = this.Account.userRole;  
          for(let i = 0; i<this.listFuctionRole.length; i++) {
            let dataItem = this.listFuctionRole[i];
            let Item:any={
              Id:0,
              check:false,
              Name: '',
              Note: '',
            };
            // if (this.listRole) {
            //   this.listFuctionRole.forEach((item:any) => {
            //     const roleMap = this.listRole.find((p:any)=> p.RoleId == item.Id);
            //     if (roleMap) {
            //       item.check = true;
            //     }
            //   });
            // }
            if(this.listRole.find((x:any)=>x.RoleId==dataItem.Id))
              {
                this.listFuctionRole[i].check = true;
              }
            else 
            this.listFuctionRole[i].check = false;
          }
        }
        
      }
      else {
        this.listFuctionRole = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })
  }

  setData() {
    this.typeEmployee = TypeEmployee.map(item => ({ Name : item.label, Id: item.value }));
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
        this.lstTower.forEach((item:any) => {
          item.checked = true;
          this.allChecked = true;
        });
      }
    }
  }
  

  getListTower() {
    this.towerService.getListTowerByPaging(this.filterTower).subscribe((res: ResApi) => {
      if(res.meta.error_code = AppStatusCode.StatusCode200) {
        this.Tower = res.data;
      } else {
        this.Tower = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })
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


  getEmployee() {
    this.employeeService.getEmployee(this.id).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.listEmployee = res.data;
        this.formGroup();
        this.listProjectMaps = res.data.listProjectMaps;
        this.listTowerMaps = res.data.listTowerMaps;
        this.listZoneMaps = res.data.listZoneMaps;
        this.Account = this.listEmployee.user;
        // const selectedRole = this.listFuctionRole.filter((role:any) => role.check).map((role:any)=> role.Id);
        // const roleList = selectedRole.map((roleId:any)=> ({RoleId : roleId}))
        this.listRoles = res.data.user.userRole;
        this.setData();
        if(this.listEmployee.IsAccount == true) {
          this.setUser()
          // this.fEmployeeAccount.get('UserName').disable();
        }
        // this.getlstDepartmentByPaging()
        if (this.listProjectMaps) {
          this.lstProject.forEach((item:any) => {
            const projectMap = this.listProjectMaps.find(p => p.ProjectId == item.Id);
            if (projectMap) {
              item.check = true;
              this.onSelectTower(item.Id);
            }
          });
        }
        // this.getlstFuncRoleByPaging();
        if (this.listRoles) {
          this.listFuctionRole.forEach((item:any) => {
            const roleMap = this.listRoles.find(p => p.RoleId == item.Id);
            if (roleMap) {
              item.check = true;
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
      }
    })
  }
  // onAccount() {
  //   const reqData = Object.assign({},  this.listEmployee);
  //   reqData.IsAccount = true;
  //   reqData.Type = this.listEmployee.Type;
  //   reqData.DepartmentId = this.listEmployee.DepartmentId;
  //   reqData.PositionId = this.listEmployee.PositionId;
  //   this.employeeService.updateEmployee(this.id,reqData).subscribe(
  //     (res: any) => {
  //       this.loading[0] = false;
  //     }
  //   );
  // }
  setUser() {
    this.fEmployeeAccount = this.fb.group({
      Password: this.Account.Password,
      ConfirmPassword: this.Account.Password,
      UserName: this.Account.UserName,
      Type: this.listEmployee.Type,
      Id:  this.Account.Id,
      CreatedById: this.userId,
      PositionId: this.listEmployee.PositionId,
      DepartmentId: this.listEmployee.DepartmentId,
      CompanyId: this.Idc,
      // RePassword: this.Account.Password,
      listRoles: [this.Account.userRole],
      IsAccount: this.listEmployee.IsAccount,
      FullName: this.listEmployee.FullName,
      // PositionId:  this.listEmployee?.PositionId,
      // DepartmentId: this.listEmployee.DepartmentId,  
      listEmployeeMaps : this.listEmployee.employeeMaps,
    })
  }
  formGroup() {
    this.fIsAccount = this.fb.group({
      Id:  this.id,
      CreatedById: this.userId,
      UpdatedById: this.userId,
      CompanyId: this.Idc,
      FullName: this.listEmployee.FullName,
      PositionId:  this.listEmployee.PositionId,
      DepartmentId: this.listEmployee.DepartmentId,
      DistrictId: this.listEmployee.DistrictId,
      DateId: new Date(this.listEmployee.DateId),
      CardId: this.listEmployee.CardId,
      Code: this.listEmployee.Code,
      IsAccount: this.listEmployee.IsAccount,
      Note: this.listEmployee.Note,
      DateStartJob: new Date(this.listEmployee.DateStartJob),
      DateEndJob: new Date(this.listEmployee.DateEndJob),
      Address: this.listEmployee.Address,
      Email: this.listEmployee.Email,
      listAttactments: '',
      AddressId: this.listEmployee.AddressId,
      Birthday: new Date(this.listEmployee.Birthday),
      Phone: this.listEmployee.Phone,
      Sex: this.listEmployee.Sex,
    }); 
  }
  getListProject() {
    // this.lstProject = [];
    this.projectService.getListByPaging(this.filterProject).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstProject = res.data;
        console.log(this.lstProject);
        for(let i=0; i< this.lstProject.length; i++) {
          this.lstProject[i].check = false;
        }
        if(this.id){
          this.getEmployee();
        }
      }
      else {
        this.lstProject  = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })  
  }
  // onProject(event: any) {
  //   this.filterParrams.query = `ProjectId=${event.value}`
  //   this.getListTower();
  // }

  onSelectPostion(event: any) {
    console.log(event.value);
  }
  onSelectDepartment(event:any){
    console.log(event.value);
  }

  onBack(event: Event) {
    let isShow = true;

    if (isShow) {
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: "Bạn có muốn Hủy?",
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Xác nhận',
        rejectLabel: 'Hủy bỏ',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
        accept: () => {
          this.router.navigate(['/category/employee/list']);
        },
        reject: () => {
            return;
        }
      });
    } else {
      this.router.navigate(['/category/employee/list']);
    }
  }
  checkAll() {
    this.allChecked = this.lstTower.every((item:any) => item.checked);
  }
  checkAll2() {
    this.allChecked2 = this.lstZone.every(item => item.checked);
  }
  toggleAll() {
    this.lstTower.forEach((item:any) => item.checked = this.allChecked);
  }
  toggleAll2() {
    this.lstZone.forEach(item => item.checked = this.allChecked2);
  }
}
