import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UserRoleService } from 'src/app/services/user-role.service';
import { AppMessageResponse, AppStatusCode, StorageData } from 'src/app/shared/constants/app.constants';
import { StorageService } from 'src/app/shared/services/storage.service';
import { Paging } from 'src/app/viewModels/paging';
import { ResApi } from 'src/app/viewModels/res-api';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { EmployeeUnitService } from 'src/app/services/employee-unit.service';
import { ApiConstant } from 'src/app/shared/constants/api.constants';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmModalComponent } from '../../commons/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-user-role',
  templateUrl: './user-role.component.html',
  styleUrls: ['./user-role.component.scss']
})
export class UserRoleComponent {
  public Idc: any;
  public lstUser: any[] = [];
  public filterParrams: Paging;
  search: string = '';
  isInputEmpty: boolean = true;
  public loading = [false];
  public isLoadingTable: boolean = false;
  dateFrom: string = '';
  dateTo: string = '';
  isVisible: boolean = false;
  formPassGroup!: FormGroup;
  idUser: number = 0;
  totalElements: number = 0;
  dialogRef: DynamicDialogRef | undefined;
  constructor(
    private readonly userroleService: UserRoleService,
    private readonly storeService: StorageService,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private _employeeUnitService: EmployeeUnitService,
    private dialogService: DialogService,
  ) {
    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 10;
  }
  ngOnInit() {
    this.getCompanyId();
    this.getListUserRole();
    this.formPassGroup = this.fb.group({
      newPass: ['', Validators.compose([Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d]{6,}$')])],
      confirmPass: ['', Validators.compose([Validators.required])],
    })
  }
  getCompanyId() {
    this.Idc = this.storeService.get(StorageData.companyId);
  }
  getListUserRole() {
    this.isLoadingTable = true;
    this.userroleService.getListUserRoleByPaging(this.filterParrams).subscribe((res: any) => {
      this.isLoadingTable = false;
      if (res.meta.status_code == AppStatusCode.StatusCode200) {
        this.lstUser = res.data;
        this.totalElements = res.metadata || 0;
      }
      else {
        this.lstUser = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res.meta.status_message || AppMessageResponse.BadRequest })
      }
    },
      () => {
        this.isLoadingTable = false;
        this.lstUser = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest })
      })
  }
  onDelete(id: number) {
    var target = this.lstUser.find((i: any) => i.id === id);
    this.dialogRef = this.dialogService.open(ConfirmModalComponent, {
      header: 'Xóa người dùng hệ thống',
      data: {
        content: "Bạn có muốn xóa người dùng hệ thống",
        nameRemove: target.userName,
        isModalRemove: true
      },
      width: '35%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000
    });
    this.dialogRef.onClose.subscribe(result => {
      if (result) {
        if (result.confirm) {
          this.userroleService.deleteUserRoleById(id).subscribe(
            (res: any) => {
              this.loading[0] = false;
              if (res && res.meta && res.meta.status_code == AppStatusCode.StatusCode200) {
                this.getListUserRole();
                this.messageService.add({ severity: 'success', summary: 'Success', detail: res.meta.status_message || AppMessageResponse.CreatedSuccess });
              } else {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.status_message || AppMessageResponse.BadRequest });
                return;
              }
            }
          );
        } else {
          return;
        }
      }
    });

  }
  onSearch(event: any) {
    const searchValue = event.target.value.toLowerCase().trim();
    this.filterParrams.query = `FullName.ToLower().Contains("${searchValue}") OR Phone.ToLower().Contains("${searchValue}")`;
    this.getListUserRole();
  }
  onClearInput() {
    this.search = '';
    this.isInputEmpty = true;
    this.filterParrams.query = `1=1`
    this.getListUserRole();
  }

  changePass(id: number) {
    this.isVisible = true;
    this.idUser = id
  }

  hideDialog() {
    this.formPassGroup.get('newPass')?.setValue('');
    this.formPassGroup.get('confirmPass')?.setValue('');
    this.isVisible = false;
    this.markAllAsPristine();
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
        this.hideDialog();
        this.messageService.add({ severity: 'success', summary: 'Thành công', detail: res.meta.status_message });
        this.getListUserRole();
      } else {
        this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: res.meta.status_message });
        this.hideDialog();
      }
    });
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

  markAllAsPristine() {
    if (this.formPassGroup != null) {
      Object.keys(this.formPassGroup?.controls).forEach(key => {
        const control = this.formPassGroup?.get(key);
        if (control?.enabled && control?.invalid) {
          control.markAsPristine();
        }
      });
    }
  }

  onPageChange(e: any) {
    this.filterParrams.page = e.page + 1;
    this.filterParrams.page_size = e.rows;
    this.getListUserRole();
  }
}
