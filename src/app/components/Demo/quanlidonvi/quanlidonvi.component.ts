import { messageResponse } from './../../../viewModels/change-card-request/change-card-request';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FunctionRoleService } from 'src/app/services/function-role.service';
import { OrganizationService } from 'src/app/services/organization.service';
import { AppMessageResponse, AppStatusCode } from 'src/app/shared/constants/app.constants';
import { Paging } from 'src/app/viewModels/paging';
import { UserRoleService } from 'src/app/services/user-role.service';
import { ApiConstant } from 'src/app/shared/constants/api.constants';
import { EmployeeUnitService } from 'src/app/services/employee-unit.service';

@Component({
  selector: 'app-quanlidonvi',
  templateUrl: './quanlidonvi.component.html',
  styleUrls: ['./quanlidonvi.component.scss']
})
export class QuanlidonviComponent {
  search: any;

  isInputEmpty: boolean = true;
  isLoadingTable: any;
  listDatas: any;
  TopicDialog: boolean = false;
  lockUserVisible: boolean = false;
  unlockUserVisible: boolean = false;
  removeUserVisible: boolean = false;
  fGroup!: FormGroup;
  topicSelected: any;
  fixedPassword: string = ApiConstant.PasswordDefault;
  fixedUsername: string = '';
  TopicAccount: any;
  functionRoles: any[] = [];
  selectedIndex: number = -1;
  setItem: any;
  idUser: number = 0;
  totalElement: number = 0;
  pageIndex: number = 1;
  pageSize: number = 10;

  constructor(
    private readonly _organizationService: OrganizationService,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private readonly functionroleService: FunctionRoleService,
    private readonly fb: FormBuilder,
    private UserRoleService: UserRoleService,
    private _employeeUnitService: EmployeeUnitService
  ) {
    this.initFormGroup();
  }

  ngOnInit(): void {
    // this.getFunctionRoles();
    this.getOrganization();
  }

  hideDialog() {
    this.TopicDialog = false;
    this.lockUserVisible = false;
    this.unlockUserVisible = false;
    this.removeUserVisible = false;
  }

  initFormGroup() {
    this.fGroup = this.fb.group({
      Password: ['', Validators.compose([Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).{6,}$')])],
      ConfirmPassWord: ['', [Validators.required]]
    });
  }

  comparePassword() {
    this.fGroup.controls['ConfirmPassWord'].valueChanges.subscribe(data => {
      if (this.fGroup.controls['ConfirmPassWord'].value === this.fGroup.controls['Password'].value) {
        this.fGroup.controls['ConfirmPassWord'].setErrors(null);
      } else {
        this.fGroup.controls['ConfirmPassWord'].setErrors({ notSame: true });
      }
    });
  }
  getFunctionRoles() {
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
    this.functionroleService.getListFunctionRoleByPaging(request).subscribe((res: any) => {
      if (res.meta.status_code == AppStatusCode.StatusCode200) {
        this.functionRoles = res.data;
      } else {
        this.functionRoles = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.status_message });
      }
    });
  }

  openTopicDialog(topic: any, index: number): void {
    this.idUser = topic.userId;
    this.TopicDialog = true;
    this.fGroup.get('Password')?.setValue('');
    this.fGroup.get('ConfirmPassWord')?.setValue('');
  }

  getOrganization() {
    const request = {
      page: this.pageIndex,
      page_size: this.pageSize,
      KeyWord: this.search
    };
    this._organizationService.getOrganizationsByPaging(request).subscribe(
      (res: any) => {
        if (res.meta.status_code === 200) {
          this.listDatas = res.data;
          this.totalElement = res.metadata;
        } else {
          this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: res.meta.status_message });
          console.log(res.meta.status_message);
        }
      },
      error => {
        this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: AppMessageResponse.InternalServer });
        console.error(error);
      }
    );
  }

  onSearch($event: any) {
    this.getOrganization();
  }

  onUnLockOrganization(item: any) {
    this.unlockUserVisible = true;
    this.setItem = item;
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
    reqData.UserRoles = [
      {
        UserId: 0,
        RoleId: reqData.UserRoles
      }
    ];
    const seletecdId = reqData.Id;
    reqData.Id = 0;
    this.UserRoleService.createUserRole(reqData).subscribe((res: any) => {
      if (res.meta.status_code == AppStatusCode.StatusCode200) {
        const orgRequest = {
          Id: seletecdId,
          UserId: res.data.id
        };
        this._organizationService.accountCreatedUpdate(seletecdId, orgRequest).subscribe((res: any) => {
          if (res.meta.status_code == AppStatusCode.StatusCode200) {
            this.TopicDialog = false;
            this.listDatas[this.selectedIndex].accountCreated = true;
            this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Tạo tài khoản thành công.' });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: res?.meta?.status_message });
          }
        });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: res?.meta?.status_message });
      }
    });
  }

  onLockOrganization(item: any) {
    this.lockUserVisible = true;
    this.setItem = item;
  }

  onDelete(item: any) {
    this.removeUserVisible = true;
    this.setItem = item;
  }

  onClearInput() {
    this.search = '';
    this.isInputEmpty = true;
    this.getOrganization();
  }

  handleLockOrganization() {
    this._organizationService.lockOrganization(this.setItem.id).subscribe((res: any) => {
      if (res.meta.status_code === 200) {
        this.messageService.add({ severity: 'success', summary: 'Khóa thành công', detail: '' });
        this.lockUserVisible = false;
        this.getOrganization();
      } else {
        this.messageService.add({ severity: 'error', summary: 'Thất bại', detail: res.meta.status_message });
        console.log(res.meta.status_message);
        this.lockUserVisible = false;
      }
    });
  }

  handleUnLockOrganization() {
    this._organizationService.unLockOrganization(this.setItem.id).subscribe((res: any) => {
      if (res.meta.status_code === 200) {
        this.messageService.add({ severity: 'success', summary: 'Mở khóa thành công', detail: '' });
        this.unlockUserVisible = false;
        this.getOrganization();
      } else {
        this.messageService.add({ severity: 'error', summary: 'Thất bại', detail: res.meta.status_message });
        console.log(res.meta.status_message);
        this.unlockUserVisible = false;
      }
    });
  }

  handleRemoveOrganization() {
    this._organizationService.deleteOrganization(this.setItem.id).subscribe((res: any) => {
      if (res.meta.status_code === 200) {
        this.messageService.add({ severity: 'success', summary: 'Xóa thành công', detail: '' });
        this.removeUserVisible = false;
        this.getOrganization();
      } else {
        this.messageService.add({ severity: 'error', summary: 'Thất bại', detail: res.meta.status_message });
        console.log(res.meta.status_message);
        this.removeUserVisible = false;
      }
    });
  }

  handleChangePass() {
    if (this.fGroup.invalid) {
      this.markAllAsDirty();
      return;
    }
    const param = {
      CurrentPassword: ApiConstant.PasswordDefault,
      NewPassword: this.fGroup.controls['Password'].value
    };
    this._employeeUnitService.changePassword(this.idUser, param).subscribe(res => {
      if (res.meta.status_code === 200) {
        this.TopicDialog = false;
        this.messageService.add({ severity: 'success', summary: 'Thành công', detail: res.meta.status_message });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: res.meta.status_message });
        this.TopicDialog = false;
      }
    });
  }

  onPageChange(e: any) {
    this.pageIndex = e.page + 1;
    this.pageSize = e.rows;
    this.getOrganization();
  }
}
