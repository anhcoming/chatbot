import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmModalComponent } from 'src/app/components/commons/confirm-modal/confirm-modal.component';
import { DepartmentsServices } from 'src/app/services/departments.service';

@Component({
  selector: 'app-add-phong-ban',
  templateUrl: './add-phong-ban.component.html',
  styleUrls: ['../quan-li-phong-ban.component.scss']
})
export class AddPhongBanComponent {
  fFunction!: FormGroup;
  funcId: any;
  loading: any;
  karma: any;
  dropdownDepartments: any;
  dialogRef: DynamicDialogRef | undefined;

  constructor(
    private readonly fb: FormBuilder,
    private readonly _departmentService: DepartmentsServices,
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService,
    private readonly activeRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly dialogService: DialogService
  ) {
    this.setUpFormGroup();
    this.getDropdownDepartment();
  }

  ngOnInit(): void {
    this.funcId = parseInt(this.activeRoute.snapshot.params['id']);
    if (this.funcId > 0) {
      this.getDepartmentById();
    }
  }

  setUpFormGroup() {
    this.fFunction = this.fb.group({
      Code: [this.karma?.code || '', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]],
      Name: [this.karma?.name || '', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]],
      Note: [this.karma?.note || ''],
      ParentId: [this.karma?.parentId || null]
    });
  }

  onBack(event: any) {
    this.dialogRef = this.dialogService.open(ConfirmModalComponent, {
      header: 'Xác nhận huỷ',
      data: {
        content: !(this.funcId > 0) ? 'Hủy thêm mới phòng ban' : 'Hủy sửa phòng ban: ',
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
          this.router.navigate(['/demo/department']);
        } else {
          return;
        }
      }
    });
  }

  getDepartmentById() {
    this._departmentService.getDepartmentById(this.funcId).subscribe(res => {
      if (res.meta.status_code === 200) {
        this.karma = res.data;
        const indexOfDropDown = this.dropdownDepartments?.findIndex((item: any) => item.id == this.karma.id);
        if (indexOfDropDown > -1) {
          this.dropdownDepartments.splice(indexOfDropDown, 1);
        }
        this.setUpFormGroup();
      } else {
        this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: res.meta.status_message });
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

  getDropdownDepartment() {
    this._departmentService.getDropDown().subscribe(res => {
      if (res.meta.status_code === 200) {
        this.dropdownDepartments = res.data;
      } else {
        this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: res.meta.status_message });
      }
    });
  }

  onSubmit() {
    if (this.fFunction.invalid) {
      this.markAllAsDirty();
      return;
    }

    const reqData = this.fFunction.getRawValue();
    if (this.funcId > 0) {
      this.loading = true;
      reqData.Id = this.funcId;
      this._departmentService.updateDepartment(this.funcId, reqData).subscribe((res: any) => {
        this.loading = false;
        if (res.meta.status_code === 200) {
          this.router.navigate(['/demo/department']);
          setTimeout(() => {
            this.messageService.add({ severity: 'success', summary: 'Cập nhật thành công', detail: '' });
          }, 600);
        } else {
          this.messageService.add({ severity: 'error', summary: 'Có lỗi', detail: res.meta.status_message });
        }
      });
    } else {
      this.loading = true;
      this._departmentService.createDepartment(reqData).subscribe((res: any) => {
        this.loading = false;
        if (res.meta.status_code === 200) {
          this.router.navigate(['/demo/department']);
          setTimeout(() => {
            this.messageService.add({ severity: 'success', summary: 'Thêm mới thành công', detail: '' });
          }, 600);
        } else {
          this.messageService.add({ severity: 'error', summary: 'Có lỗi', detail: res.meta.status_message });
        }
      });
    }
  }
}
