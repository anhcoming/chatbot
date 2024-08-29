import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { DepartmentsServices } from 'src/app/services/departments.service';
import { EmployeeUnitService } from 'src/app/services/employee-unit.service';
import { FunctionRoleService } from 'src/app/services/function-role.service';
import { Paging } from 'src/app/viewModels/paging';
import { AppStatusCode } from 'src/app/shared/constants/app.constants';
import { UserRoleService } from 'src/app/services/user-role.service';
import { GroupTopicService } from 'src/app/services/groupTopic.service';
import { ApiConstant } from 'src/app/shared/constants/api.constants';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmModalComponent } from 'src/app/components/commons/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-create-account-staff',
  templateUrl: './create-account-staff.component.html',
  styleUrls: ['./create-account-staff.component.scss']
})
export class CreateAccountStaffComponent {
  fGroup: any;
  functionRoles: any;
  public isLoadingTable: boolean = false;
  selectedRole: any = [];
  fixedPassword: string = ApiConstant.PasswordDefault;
  listDatas: any;
  codeEmployee: number = 0;
  selectedIndex: any;
  listGroupTopics = [];
  dialogRef: DynamicDialogRef | undefined;
  totalElements: number = 0;
  pageIndex: number = 1;
  pageSize: number = 10;

  constructor(
    private readonly fb: FormBuilder,
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService,
    private readonly activeRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly _departmentService: DepartmentsServices,
    private readonly _employeeUnitService: EmployeeUnitService,
    private readonly functionroleService: FunctionRoleService,
    private readonly UserRoleService: UserRoleService,
    private readonly route: ActivatedRoute,
    private readonly _groupTopicService: GroupTopicService,
    private readonly dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.setupFormGroup();
    // this.getFunctionRoles();
    this.getListEmployeeByPaging();
    this.getGroupTopicByPaging();

    this.route.paramMap.subscribe(params => {
      this.codeEmployee = Number(params.get('id'));
    });
  }

  getGroupTopicByPaging() {
    const request = {
      page: this.pageIndex,
      page_size: this.pageSize,
      search: ''
    };

    this.isLoadingTable = true;
    this._groupTopicService.getListGroupTopicByPaging(request).subscribe(res => {
      if (res.meta.status_code === 200) {
        this.listGroupTopics = res.data;
        this.isLoadingTable = false;
        this.totalElements = res.metadata || 0;
      } else {
        this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: res.meta.status_message });
      }
    });
  }

  setupFormGroup() {
    this.fGroup = this.fb.group({
      UserName: ['', Validators.required],
      Password: [this.fixedPassword, [Validators.required]],
      ConfirmPassword: [this.fixedPassword, [Validators.required]]
    });
  }

  matchingPasswords() {
    const password = this.fGroup.get('Password').value;
    const confirmPassword = this.fGroup.get('ConfirmPassword').value;
    console.log(this.fGroup.get('ConfirmPassword'));
    if (password !== confirmPassword) {
      this.fGroup.get('ConfirmPassword').setErrors({ mismatchedPasswords: true });
    } else {
      this.fGroup.get('ConfirmPassword').setErrors(null);
    }
  }

  getFunctionRoles() {
    this.isLoadingTable = true;
    const request: Paging = {
      page: 0,
      page_size: 0,
      order_by: '',
      query: '',
      groupCard: 0,
      vehicleId: 0,
      select: '',
      ProjectId: '',
      TowerId: '',
      FloorId: '',
      ApartmentId: '',
      ResidentId: '',
      type: '',
      dateStart: '',
      dateEnd: '',
      ZoneId: '',
      id: '',
      residentStatus: '',
      status: '',
      DateStart: '',
      DateEnd: ''
    };
    this.functionroleService.getDropdown().subscribe((res: any) => {
      if (res.meta.status_code == AppStatusCode.StatusCode200) {
        this.functionRoles = res.data;
        this.isLoadingTable = false;
      } else {
        this.functionRoles = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.status_message });
        this.isLoadingTable = true;
      }
    });
  }

  onBack(event: Event) {
    let isShow = true;

    if (isShow) {
      this.dialogRef = this.dialogService.open(ConfirmModalComponent, {
        header: 'Xác nhận dừng thêm mới',
        data: {
          content: 'Dừng thêm mới tài khoản nhân viên',
          name: '',
          isModalRemove: false
        },
        width: '18%',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000
      });
      this.dialogRef.onClose.subscribe(result => {
        if (result) {
          if (result.confirm) {
            this.router.navigate(['/demo/employee']);
          } else {
            return;
          }
        }
      });
    } else {
      this.router.navigate(['/demo/employee']);
    }
  }

  markAllAsDirty() {
    if (this.fGroup != null) {
      Object.keys(this.fGroup?.controls).forEach(key => {
        const control = this.fGroup?.get(key);
        if (control?.enabled && control?.invalid) {
          control.markAsDirty();
        }
      });
    }
  }

  onSubmit() {
    if (this.fGroup.invalid) {
      this.markAllAsDirty();
      return;
    }
    const reqData = this.fGroup.getRawValue();
    const role: any = [];
    this.selectedRole.map((item: any) => {
      role.push({
        UserId: 0,
        RoleId: item.id
      });
    });
    reqData.UserRoles = role;
    reqData.Id = 0;
    this._employeeUnitService.createUser(reqData).subscribe((res: any) => {
      if (res.meta.status_code == AppStatusCode.StatusCode200) {
        const orgRequest = {
          Id: this.codeEmployee,
          UserId: res.data.id
        };
        this._employeeUnitService.accountCreatedUpdate(this.codeEmployee, orgRequest).subscribe((res: any) => {
          if (res.meta.status_code == AppStatusCode.StatusCode200) {
            this.router.navigate(['/demo/employee']);
            setTimeout(() => {
              this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Tạo tài khoản thành công.' });
            }, 600);
          } else {
            this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: res?.meta?.status_message });
          }
        });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: res?.meta?.status_message });
      }
    });
  }

  getListEmployeeByPaging() {
    const request = {
      page: this.pageIndex,
      pageSize: this.pageSize,
      search: ''
    };

    this._employeeUnitService.getListEmployee(request).subscribe(res => {
      if (res.meta.status_code === 200) {
        this.listDatas = res.data;
        this.isLoadingTable = false;
      } else {
        this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: res.meta.status_message });
      }
    });
  }
  onPageChange(e: any) {
    this.pageIndex = e.page + 1;
    this.pageSize = e.rows;
    this.getGroupTopicByPaging();
  }
}
