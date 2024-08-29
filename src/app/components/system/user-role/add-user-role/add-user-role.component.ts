import { Component, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmModalComponent } from 'src/app/components/commons/confirm-modal/confirm-modal.component';
import { CompanyService } from 'src/app/services/company.service';
import { DepartmentService } from 'src/app/services/department.service';
import { FunctionRoleService } from 'src/app/services/function-role.service';
import { FunctionService } from 'src/app/services/function.service';
import { PositionService } from 'src/app/services/position.service';
import { RoleService } from 'src/app/services/role.service';
import { UserRoleService } from 'src/app/services/user-role.service';
import { AppStatusCode, AppMessageResponse, StorageData } from 'src/app/shared/constants/app.constants';
import { StorageService } from 'src/app/shared/services/storage.service';
import { Paging } from 'src/app/viewModels/paging';
import { ResApi } from 'src/app/viewModels/res-api';
import { DbFunction, UserRole } from 'src/app/viewModels/user-role/user-role';

@Component({
  selector: 'app-add-user-role',
  templateUrl: './add-user-role.component.html',
  styleUrls: ['../user-role.component.scss']
})
export class AddUserRoleComponent {

  UserRole: UserRole;
  @Input() isView!: boolean;

  Action: any;
  submitted = false;
  

  listRole: any[] = [];
  lstRole: any[] = [];
  Role: any[] = [];
  selectedRole: any = [];
  selectedItems: any = [];
  public Id: any;
  public lstPosition: any;
  public lstDepartment: any;
  fUserRole: any ;
  public data: any;
  public filterParrams : Paging ;
  public loading = [false];
  public isLoadingTable: boolean = false
  public lstUserRole: any;
  userId: any;
  Idc: any;
  dialogRef: DynamicDialogRef | undefined;
  totalElements: number = 0;

  constructor(
    private readonly companyService: CompanyService,
    private readonly storeService : StorageService,
    private readonly messageService: MessageService,
    private readonly positionService: PositionService,
    private readonly departmentService: DepartmentService,
    private readonly confirmationService: ConfirmationService,
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private router: Router,
    private UserRoleService: UserRoleService,
    private fRoleService: FunctionRoleService,
    private functionService: FunctionService,
    private dialogService: DialogService) {
    
    this.UserRole = new UserRole();
    this.UserRole.listFunction = new Array<DbFunction>();

    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 10;
    this.fUserRole = this.fb.group({
      Id: [0],
      CreatedById: this.userId,
      UpdatedById: this.userId,
      FullName: ['' , Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(150)])],
      UserName: ['' , Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(150)])],
      Password: ['' , Validators.compose([Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d]{6,}$')])],
      ConfirmPassword: ['' , Validators.compose([Validators.required])],
      Phone: [''],
      Email: ['', Validators.required],
      Address: [''],
      PositionId: [-1],
      DepartmentId:[-1],
      listRole: [],
      listFunction: [],
      listProject: [],
      listUnit: [],
    });
    this.data = {};
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.Id =  params.get('id');
    });
    this.GetlistRole()
    // this.getDepartment();
    // this.getPosition();
  }

  matchingPasswords() {
    const password = this.fUserRole.get('Password').value;
    let confirmPassword = this.fUserRole.get('ConfirmPassword').value;
    if (password !== confirmPassword) {
      this.fUserRole.get('ConfirmPassword').setErrors({mismatchedPasswords: true});
    } else {
      this.fUserRole.get('ConfirmPassword').setErrors(null);
    }
  }
  
  setFormGroup() {
    this.fUserRole = this.fb.group({
      Id: this.Id,
      CreatedById: this.userId,
      UpdatedById: this.userId,
      FullName: this.lstUserRole.fullName,
      listRole: this.lstUserRole.userRoles,
      UserName: this.lstUserRole.userName,
      Password: this.lstUserRole.password,
      ConfirmPassword: this.lstUserRole.password,
      Phone: this.lstUserRole.phone,
      Email: this.lstUserRole.email,
      Address: this.lstUserRole.address,
      PositionId: this.lstUserRole.positionId,
      DepartmentId:this.lstUserRole.departmentId,
      listFunction: this.lstUserRole.listFunction,
      listProject: this.lstUserRole.listProject,
      listUnit: this.lstUserRole.listUnit,
    })
    
    if(this.lstUserRole.userRoles){
      this.setLstRole()
    }

    if (this.Id > 0) {
      this.fUserRole.controls['UserName'].disable();
    }
  }
  getUserId() {
    this.userId = this.storeService.get(StorageData.userId); 
  }
  getCompanyId() {
    this.Idc = this.storeService.get(StorageData.companyId); 
  }

  getUserRoleById(id: number) {
    this.UserRoleService.getUserRoleById(id).subscribe((res: any) => {
      if(res.meta.status_code == AppStatusCode.StatusCode200) {
        this.lstUserRole = res.data;  
        this.setFormGroup();
      }
      else {
        this.lstUserRole = [];
        this.messageService.add({severity: 'error', summary: 'Error', detail: res?.meta?.status_message || AppMessageResponse.BadRequest})
      }
    })
  } 
  setLstRole() {
    this.lstUserRole.userRoles.map((items: any) => {
      this.listRole.map((item: any) => {
        if(item.id == items.roleId) {
          this.selectedItems.push(item)
        }
      })
    }) 
    this.selectedRole = this.selectedItems;
  }
  onReturnPage(url: string) : void {
    this.router.navigate([url]);
  }
  markAllAsDirty() {
    Object.keys(this.fUserRole.controls).forEach(key => {
      const control = this.fUserRole.get(key);
      if (control.enabled && control.invalid) {
        control.markAsDirty();
      }
    });
  }
  onSubmit() {
    if(this.fUserRole.invalid){
      this.markAllAsDirty()
    }else{

      this.selectedRole.map((item: any) => {
        this.Role.push({RoleId: item.id, RoleName: item.name})
      })

      let filteredItems = this.Role.filter((item: any, index: any, array: any) => {
        const firstIndex = array.findIndex((t: any) => t.RoleId === item.RoleId);
        return index === firstIndex;
      }).map((item: any) => ({ ...item }));
      
      console.log(filteredItems);

      this.submitted = true;
      const reqData = Object.assign({}, this.fUserRole.value);
      reqData.userRoles = filteredItems;
      reqData.listFunction = [];
      reqData.listUnit = [];
      reqData.listProject = [];
      reqData.UserName = this.fUserRole.get('UserName').value;
   
      if (this.Id > 0) {
        reqData.Id = parseInt(reqData.Id);
        this.UserRoleService.updateUserRoleById(this.Id, reqData).subscribe((res: any) => {
          this.loading[0] = false;
          if(res.meta.status_code == AppStatusCode.StatusCode200) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.status_message || AppMessageResponse.CreatedSuccess });

            setTimeout(() => {this.onReturnPage('/system/user-role/list')}, 1500);
          }
          else {
            this.loading[0] = false
            this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.status_message || AppMessageResponse.BadRequest });
          }
        },
        () => {
          this.loading[0] = false
          this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest }) },
        () => {this.loading[0] = false} 
        )
      }
      else {

        reqData.Id = 0;
        this.UserRoleService.createUserRole(reqData).subscribe((res: any) => {
          this.loading[0] = false;
          if(res.meta.status_code == AppStatusCode.StatusCode200) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.status_message || AppMessageResponse.CreatedSuccess });

            setTimeout(() => {this.onReturnPage('/system/user-role/list')}, 1500);
          }
          else {
            this.loading[0] = false
            this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.status_message || AppMessageResponse.BadRequest });
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

  GetlistRole() {
    this.fRoleService.getListFunctionRoleByPaging(this.filterParrams).subscribe(
      (res: any) => {
        this.loading[0] = false;
        if (res?.meta?.status_code == AppStatusCode.StatusCode200) {
          this.listRole = res["data"];
          this.totalElements = res.metadata;
          if(this.Id > 0){
            this.getUserRoleById(this.Id);
          }
        }
      },
    );
  }
  onBack(event: Event) {
    let isShow = true;
    if (isShow) {
      this.dialogRef = this.dialogService.open(ConfirmModalComponent, {
        header: '',
        data: {
          content: !(this.Id > 0) ? 'Dừng thêm mới người dùng hệ thống' : 'Dừng cập nhật người dùng: ',
          name: this.lstUserRole?.fullName,
          isModalRemove: false
        },
        width: '25%',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000
      });
      this.dialogRef.onClose.subscribe(result => {
        if (result) {
          if (result.confirm) {
            this.router.navigate(['/system/user-role/list']);
          } else {
            return;
          }
        }
      });
    } else {
      this.router.navigate(['/commons/user-role/list']);
    }
  }
  getPosition() {
    this.positionService.getListPositionByPaging(this.filterParrams).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstPosition =res.data;
      }
    })
  }
  getDepartment() {
    this.departmentService.getListDepartmentByPaging(this.filterParrams).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstDepartment = res.data;
      }
    })
  }

  onPageChange(e: any) {
    this.filterParrams.page = e.page + 1;
    this.filterParrams.page_size = e.rows;
    this.GetlistRole();
  }
}
