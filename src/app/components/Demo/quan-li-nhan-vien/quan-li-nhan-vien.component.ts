import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EmployeeUnitService } from 'src/app/services/employee-unit.service';
import { FunctionRoleService } from 'src/app/services/function-role.service';
import { AppStatusCode } from 'src/app/shared/constants/app.constants';
import { Paging } from 'src/app/viewModels/paging';
import { UserRoleService } from 'src/app/services/user-role.service';
import { ApiConstant } from 'src/app/shared/constants/api.constants';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmModalComponent } from '../../commons/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-quan-li-nhan-vien',
  templateUrl: './quan-li-nhan-vien.component.html',
  styleUrls: ['./quan-li-nhan-vien.component.scss']
})
export class QuanLiNhanVienComponent {
  isLoadingTable: any;
  listDatas: any;
  search: any;
  isInputEmpty: boolean = true;
  TopicDialog: any;
  configDialog: any;
  fixedPassword: string = ApiConstant.PasswordDefault;
  fGroup!: FormGroup;
  formPassGroup!: FormGroup;
  selectedIndex: number = -1;

  functionRoles: any;
  lockUserVisible: boolean = false;
  unLockUserVisible: boolean = false;
  setItem: any;
  modalChangePass: boolean = false;
  idUser: number = 0;
  dialogRef: DynamicDialogRef | undefined;
  totalElements: number = 0;
  pageIndex: number = 1;
  pageSize: number = 10;

  constructor(
    private readonly _employeeUnitService: EmployeeUnitService,
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService,
    private readonly fb: FormBuilder,
    private readonly functionroleService: FunctionRoleService,
    private readonly UserRoleService: UserRoleService,
    private dialogService: DialogService,
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.initFormGroup();
    // this.getFunctionRoles();
    this.getListEmployeeByPaging();
  }

  initFormGroup() {
    this.fGroup = this.fb.group({
      Id: [''],
      UserName: ['', Validators.required],
      Password: [this.fixedPassword, Validators.required],
      ConfirmPassWord: [this.fixedPassword, Validators.required],
      UserRoles: [''],
      Email: [''],
      FullName: ['']
    });

    this.formPassGroup = this.fb.group({
      newPass: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(150), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).{6,}$')])],
      confirmPass: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(150)])]
    });
  }

  onDelete(id: number) {
    const target: any = this.listDatas.find((i: any) => i.id == id);
    this.dialogRef = this.dialogService.open(ConfirmModalComponent, {
      header: 'XÓA NHÂN VIÊN',
      data: {
        content: 'Bạn có muốn xóa nhân viên',
        nameRemove: target?.name,
        isModalRemove: true,
      },
      width: '18%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000
    });
    this.dialogRef.onClose.subscribe(result => {
      if (result) {
        if (result.confirm) {
          this._employeeUnitService.deleteEmployee(id).subscribe((res: any) => {
            if (res.meta.status_code === 200) {
              this.messageService.add({ severity: 'success', summary: 'Xóa thành công', detail: '' });
              this.getListEmployeeByPaging();
            } else {
              this.messageService.add({ severity: 'error', summary: 'Có lỗi', detail: '' });
              console.log(res.meta.status_message);
            }
          });
        } else {
          return;
        }
      }
    })
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
    this.functionroleService.getDropdown().subscribe((res: any) => {
      if (res.meta.status_code == AppStatusCode.StatusCode200) {
        this.functionRoles = res.data;
      } else {
        this.functionRoles = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.status_message });
      }
    });
  }

  openTopicDialog(topic: any, index: number): void {
    this.selectedIndex = index;
    this.fGroup.controls['Id'].patchValue(topic.id);
    this.fGroup.controls['FullName'].patchValue(topic.name);
    this.fGroup.controls['FullName'].patchValue(topic.name);
    this.fGroup.controls['Email'].patchValue(topic.email);
    this.fGroup.controls['UserName'].patchValue(topic.code);
    this.TopicDialog = true;
  }

  openConfigDialog() {
    this.configDialog = true;
  }

  markAllAsDirty() {
    if (this.formPassGroup != null) {
      Object.keys(this.formPassGroup?.controls).forEach(key => {
        const control = this.formPassGroup?.get(key);
        if (control?.enabled && control?.invalid) {
          control.markAsDirty();
        }
      });
    }
  }

  getListEmployeeByPaging() {
    const request = {
      page: this.pageIndex,
      page_size: this.pageSize,
      search: this.search
    };

    this._employeeUnitService.getListEmployee(request).subscribe(res => {
      if (res.meta.status_code === 200) {
        this.listDatas = res.data;
        this.isLoadingTable = false;
        this.totalElements = res.metadata || 0;
      } else {
        this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: res.meta.status_message });
      }
    });
  }

  onLockOrganization(item: any) {
    this.lockUserVisible = true;
    this.setItem = item;
  }

  onUnLockOrganization(item: any) {
    this.unLockUserVisible = true;
    this.setItem = item;
  }

  hideDialog() {
    this.lockUserVisible = false;
    this.modalChangePass = false;
    this.unLockUserVisible = false;
  }

  handleLockOrganization() {
    this._employeeUnitService.lockUserAccount(this.setItem.id).subscribe(
      res => {
        if (res.meta.status_code === 200) {
          this.lockUserVisible = false;
          this.messageService.add({ severity: 'success', summary: 'Thành công', detail: res.meta.status_message });
          this.getListEmployeeByPaging();
        } else {
          this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: res.meta.status_message });
          this.lockUserVisible = false;
        }
      },
      error => {
        this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Lỗi không gọi được đến server' });
      }
    );
  }

  handleUnLockOrganization() {
    this._employeeUnitService.unLockUserAccount(this.setItem.id).subscribe(
      res => {
        if (res.meta.status_code === 200) {
          this.unLockUserVisible = false;
          this.messageService.add({ severity: 'success', summary: 'Thành công', detail: res.meta.status_message });
          this.getListEmployeeByPaging();
        } else {
          this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: res.meta.status_message });
          this.unLockUserVisible = false;
        }
      },
      error => {
        this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Lỗi không gọi được đến server' });
      }
    );
  }

  onpenModalResetPass(idUser: number) {
    this.modalChangePass = true;
    this.idUser = idUser;
  }

  matchingPasswords() {
    const password = this.formPassGroup.get('newPass')?.value;
    let confirmPassword = this.formPassGroup.get('confirmPass')?.value;
    if (password !== confirmPassword) {
      this.formPassGroup.get('confirmPass')?.setErrors({ mismatchedPasswords: true });
    } else {
      this.formPassGroup.get('confirmPass')?.setErrors(null);
    }
  }

  handleChangePass() {
    if (this.formPassGroup.invalid) {
      this.markAllAsDirty();
      return;
    }
    const param = {
      currentPassword: ApiConstant.PasswordDefault,
      newPassword: this.formPassGroup.controls['newPass'].value
    };
    this._employeeUnitService.changePassword(this.idUser, param).subscribe(res => {
      if (res.meta.status_code === 200) {
        this.modalChangePass = false;
        this.messageService.add({ severity: 'success', summary: 'Thành công', detail: res.meta.status_message });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: res.meta.status_message });
        this.modalChangePass = false;
      }
    });
  }

  onSearch(event: any) {
    this.getListEmployeeByPaging();
  }

  onClearInput() {
    this.search = '';
    this.getListEmployeeByPaging();
  }
  onPageChange(e: any) {
    this.pageIndex = e.page + 1;
    this.pageSize = e.rows;
    this.getListEmployeeByPaging();
  }
}
