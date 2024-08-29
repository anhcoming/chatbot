import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { forkJoin } from 'rxjs';
import { ConfirmModalComponent } from 'src/app/components/commons/confirm-modal/confirm-modal.component';
import { FunctionRoleService } from 'src/app/services/function-role.service';
import { OrganizationService } from 'src/app/services/organization.service';
import { UserRoleService } from 'src/app/services/user-role.service';
import { AppStatusCode } from 'src/app/shared/constants/app.constants';
import { Paging } from 'src/app/viewModels/paging';

@Component({
  selector: 'app-add-quan-li-don-vi',
  templateUrl: './add-quan-li-don-vi.component.html',
  styleUrls: ['./add-quan-li-don-vi.component.scss']
})
export class AddQuanLiDonViComponent {
  funcId: any;
  fFunction!: FormGroup;
  loading: any;
  listRole: any;
  selectedRole: any;
  isLoadingTable: boolean = true;
  Role: any = [];
  roleByUser = [];
  dialogRef: DynamicDialogRef | undefined;
  totalElement: number = 0;
  pageIndex: number = 1;
  pageSize: number = 10;

  constructor(
    private readonly fb: FormBuilder,
    private readonly _organizationService: OrganizationService,
    private readonly activeRoute: ActivatedRoute,
    private readonly route: Router,
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService,
    private functionroleService: FunctionRoleService,
    private userRoleService: UserRoleService,
    private dialogService: DialogService
  ) {
    this.initFromGroup();
  }

  ngOnInit(): void {
    const id = parseInt(this.activeRoute.snapshot.params['id']);
    this.getFunctionRoles();
    if (id > 0) {
      this.funcId = id;
      this.getOrganizationById();
      this.fFunction.get('UserName')?.disable();
      this.fFunction.get('Password')?.clearValidators();
      this.fFunction.get('Password')?.updateValueAndValidity();
      this.fFunction.get('UserName')?.updateValueAndValidity();
    }
  }

  getOrganizationById() {
    this._organizationService.getOrganizationById(this.funcId).subscribe((res: any) => {
      if (res.meta.status_code === 200) {
        const organization = res?.data?.organization;
        this.roleByUser = res?.data?.userRoles;
        this.fFunction.patchValue({
          Id: organization.id,
          Code: organization.code,
          Name: organization.name,
          Email: organization.email,
          Address: organization.address,
          UserName: res?.data?.accountName,
        });
        if (this.roleByUser) {
          const result = this.roleByUser.map((i: any) => this.listRole.find((ib: any) => ib.id === i.roleId)).filter(Boolean);
          this.selectedRole = result;
        }
      } else {
        this.messageService.add({ severity: 'error', summary: 'Có lỗi', detail: '' });
        console.error(res.meta.status_message);
      }
    });
  }

  initFromGroup() {
    this.fFunction = this.fb.group({
      Id: [],
      Code: [''],
      Name: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(150)])],
      Email: ['', Validators.required],
      Address: [''],
      PhoneNumber: [''],
      UserName: ['', Validators.compose([Validators.required])],
      Password: ['', Validators.compose([Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d]{6,}$')])],
      ConfirmPassword: ['', Validators.compose([Validators.required])]
    });
  }

  getFunctionRoles() {
    this.isLoadingTable = true;
    const request: Paging = {
      page: this.pageIndex,
      page_size: this.pageSize,
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
        this.listRole = res.data;
        this.isLoadingTable = false;
        this.totalElement = res.metadata;
      } else {
        this.listRole = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.status_message });
        this.isLoadingTable = false;
      }
    });
  }

  markAllAsDirty() {
    if (this.fFunction != null) {
      Object.keys(this.fFunction?.controls).forEach(key => {
        const control = this.fFunction?.get(key);
        if (control?.enabled && control?.invalid) {
          control.markAsDirty();
        }
      });
    }
  }

  onBack(event: any) {
    this.dialogRef = this.dialogService.open(ConfirmModalComponent, {
      header: !(this.funcId > 0) ? 'Hủy thêm mới' : 'Hủy cập nhật',
      data: {
        content: !(this.funcId > 0) ? 'Hủy thêm mới đơn vị' : 'Hủy sửa đơn vị: ',
        name: this.fFunction?.controls['Name'].value,
        isModalRemove: false
      },
      width: '18%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000
    });
    this.dialogRef.onClose.subscribe(result => {
      if (result) {
        if (result.confirm) {
          this.route.navigate(['/demo/quanlidonvi']);
        } else {
          return;
        }
      }
    });
  }

  matchingPasswords() {
    const password = this.fFunction.get('Password')?.value;
    const confirmPassword = this.fFunction.get('ConfirmPassword')?.value;

    if (password !== confirmPassword) {
      this.fFunction.get('ConfirmPassword')?.setErrors({ mismatchedPasswords: true });
    } else {
      this.fFunction.get('ConfirmPassword')?.setErrors(null);
    }
  }

  onSubmit() {
    if (this.fFunction.invalid) {
      this.markAllAsDirty();
      return;
    }
    if (!this.selectedRole) {
      this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng chọn quyền cho tài khoản!' });
      return;
    }
    this.selectedRole.map((item: any) => {
      this.Role.push({ RoleId: item.id, UserId: this.funcId || 0 });
    });

    const request = {
      Id: this.funcId || 0,
      Name: this.fFunction.get('Name')?.value,
      Code: '',
      Email: this.fFunction.get('Email')?.value,
      Address: this.fFunction.get('Address')?.value,
      UserName: this.fFunction.get('UserName')?.value,
      Password: this.fFunction.get('Password')?.value,
      PhoneNumber: '',
      userRoles: this.Role
    };

    if (this.funcId > 0) {
      this._organizationService.updateOrganizationAccount(request, this.funcId).subscribe(res => {
        if (res.meta.status_code === 200) {
          this.route.navigate(['/demo/quanlidonvi']);
          setTimeout(() => {
            this.messageService.add({ severity: 'success', summary: 'Cập nhật thành công', detail: '' });
          }, 600);
        } else {
          this.messageService.add({ severity: 'error', summary: 'Có lỗi', detail: '' });
          console.error(res.meta.status_message);
        }
      });
    } else {
      this._organizationService.creatNewOrganizationAccount(request).subscribe((res: any) => {
        if (res.meta.status_code === 200) {
          this.route.navigate(['/demo/quanlidonvi']);
          setTimeout(() => {
            this.messageService.add({ severity: 'success', summary: 'Cập nhật thành công', detail: '' });
          }, 600);
        } else {
          this.messageService.add({ severity: 'error', summary: 'Có lỗi', detail: '' });
          console.error(res.meta.status_message);
        }
      });
    }
  }

  onPageChange(e: any) {
    this.pageIndex = e.page + 1;
    this.pageSize = e.rows;
    this.getFunctionRoles();
  }
}
