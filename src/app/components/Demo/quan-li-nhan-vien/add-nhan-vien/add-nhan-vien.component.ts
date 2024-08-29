import { Gender } from './../../../../shared/constants/app.constants';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmModalComponent } from 'src/app/components/commons/confirm-modal/confirm-modal.component';
import { DepartmentService } from 'src/app/services/department.service';
import { DepartmentsServices } from 'src/app/services/departments.service';
import { EmployeeUnitService } from 'src/app/services/employee-unit.service';

@Component({
  selector: 'app-add-nhan-vien',
  templateUrl: './add-nhan-vien.component.html',
  styleUrls: ['./add-nhan-vien.component.scss']
})
export class AddNhanVienComponent {
  funcId: any;
  fFunction!: FormGroup;
  loading: any;
  karma: any;
  dropdownDepartment: any;

  genders = Gender;
  dialogRef: DynamicDialogRef | undefined;

  constructor(
    private readonly fb: FormBuilder,
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService,
    private readonly activeRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly _departmentService: DepartmentsServices,
    private readonly _employeeUnitService: EmployeeUnitService,
    private dialogService: DialogService,
  ) { }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.karma = null;
    this.setupFormGroup();
    this.getDropdownDepartments();

    this.funcId = parseInt(this.activeRoute.snapshot.params["id"]);
    if (this.funcId > 0) {
      this.getEmployeeById();
    }
  }

  getEmployeeById() {
    this._employeeUnitService.getEmployeeByID(this.funcId).subscribe(res => {
      if (res.meta.status_code === 200) {
        this.karma = res.data;
        this.setupFormGroup();
      } else {
        this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: res.meta.status_message });
      }
    })
  }

  getDropdownDepartments() {
    this._departmentService.getDropDown().subscribe(res => {
      if (res.meta.status_code === 200) {
        this.dropdownDepartment = res.data;
      } else {
        this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: res.meta.status_message });
      }
    });
  }

  setupFormGroup() {
    this.fFunction = this.fb.group({
      Id: [this.karma?.id || 0],
      Code: [this.karma?.code || '', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(150)])],
      Name: [this.karma?.name || '', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(150)])],
      Email: [this.karma?.email || '', Validators.required],
      DepartmentId: [this.karma?.departmentId || '', Validators.required],
      PhoneNumber: [this.karma?.phoneNumber || '', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(11)])],
      Gender: [this.karma?.gender || ''],
      DateOfBirth: [this.karma?.dateOfBirth ? new Date(this.karma?.dateOfBirth) : ''],
      CitizenId: [this.karma?.citizenId || ''],
      Note: [this.karma?.note || '']
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
      header: 'Xác nhận huỷ',
      data: {
        content: !(this.funcId > 0) ? 'Hủy thêm mới nhân viên' : 'Hủy sửa nhân viên: ',
        name: this.fFunction?.controls["Name"].value,
        isModalRemove: false,
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
    })

  }
  onSubmit() {
    if (this.fFunction.invalid) {
      this.markAllAsDirty();
      return;
    }

    const reqData = this.fFunction.getRawValue();
    if (this.funcId > 0) {
      this.loading = true;
      this._employeeUnitService.updateEmployee(this.funcId, reqData).subscribe((res: any) => {
        this.loading = false;
        if (res.meta.status_code === 200) {
          this.messageService.add({ severity: 'success', summary: 'Cập nhật thành công', detail: '' });
          this.router.navigate(['/demo/employee']);
        } else {
          this.messageService.add({ severity: 'error', summary: 'Có lỗi', detail: res.meta.status_message });
        }
      });
    } else {
      this.loading = true;
      this._employeeUnitService.createEmployee(reqData).subscribe((res: any) => {
        this.loading = false;
        if (res.meta.status_code === 200) {
          this.router.navigate(['/demo/employee']);
          setTimeout(() => {
            this.messageService.add({ severity: 'success', summary: 'Thêm mới thành công', detail: '' });
          }, 600);
        } else {
          setTimeout(() => {
            this.messageService.add({ severity: 'error', summary: 'Có lỗi', detail: res.meta.status_message });
          }, 600);
        }
      });
    }
  }


}
