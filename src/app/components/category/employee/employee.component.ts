import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DepartmentService } from 'src/app/services/department.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { PositionService } from 'src/app/services/position.service';
import { ProjectService } from 'src/app/services/project.service';
import { AppMessageResponse, AppStatusCode, IsAccounts, StorageData } from 'src/app/shared/constants/app.constants';
import { StorageService } from 'src/app/shared/services/storage.service';
import { Department } from 'src/app/viewModels/department/department';
import { Employee } from 'src/app/viewModels/employee/employee';
import { Paging } from 'src/app/viewModels/paging';
import { DbPosition } from 'src/app/viewModels/position/position';
import { Project } from 'src/app/viewModels/project/project';
import { ResApi } from 'src/app/viewModels/res-api';
import { Md5 } from 'ts-md5';
import { ChangePasswordComponent } from './dialogs/change-password/change-password.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent {
  public Idc: any;
  public user: any;
  public status: any;
  public filterParrams: Paging;
  public lstProject!: Array<Project>;
  public lstDepartment!: Array<Department>;
  public lstPosition!: Array<DbPosition>;
  public lstEmployee!: Array<Employee>;
  public Employee: any; 
  public lstAccount: any; 
  public fSearch: FormGroup;
  public fPassword: any;
  public filterText: string;
  public loading = [false];
  public IsAccounts = IsAccounts;
  public isLoadingTable: boolean = false;
  public isLock: boolean = false;
  public filterProject: Paging;
  search: string = '';
  public idFrozen: boolean = true;
  isInputEmpty: boolean = true;
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly commonService: CommonService,
    private readonly projectService: ProjectService,
    private readonly departmentService: DepartmentService,
    private readonly positionService: PositionService,
    private readonly storeService: StorageService,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    public dialogService: DialogService,
    public ref: DynamicDialogRef,
    private readonly fb: FormBuilder,
  ){
    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 1000;
    this.filterProject = new Object as Paging;
    this.lstEmployee = new Array<Employee>();
    this.filterText = '';
    this.fSearch = fb.group({
      ProjectId: [''],
      DepartmentId: [''],
      PositionId: [''],
      IsAccount: [''],
    });
  }
  onSelect(event: any) {

    if (event.value == null) {
      this.filterParrams.query = '1=1';
    } else {
      this.filterParrams.ProjectId = `${event.value}`;
    }
    this.getLstEmployeeByPaging();
  }
  onSelectDepartment(event: any) {

    if (event.value == null) {
      this.filterParrams.query = '1=1';
    } else {
      this.filterParrams.query = `DepartmentId=${event.value}`;
    }
    this.getLstEmployeeByPaging();
  }
  onSelectPosition(event: any) {

    if (event.value == null) {
      this.filterParrams.query = '1=1';
    } else {
      this.filterParrams.query = `PositionId=${event.value}`;
    }
    this.getLstEmployeeByPaging();
  }
  onSelectAccount(event: any) {

    if (event.value == null) {
      this.filterParrams.query = '1=1';
    } else {
      this.filterParrams.query = `IsAccount=${event.value}`;
    }
    this.getLstEmployeeByPaging();
  }
  ngOnInit() {
    this.getLstEmployeeByPaging();
    this.getCompanyId();
    this.getListProject();
    this.getListDepartment();
    this.getListPosition();
  }
  getListProject() {
    this.lstProject = [];
    this.projectService.getListByPaging(this.filterProject).subscribe((res: ResApi) => {
      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstProject = res.data;
      }
      else {
        this.lstProject = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })
  }
  getLstEmployeeByPaging() {
    this.isLoadingTable = true;
    this.lstEmployee = [];
    this.employeeService.getListEmployeeByPaging(this.filterParrams).subscribe((res: ResApi) => {
      this.isLoadingTable = false;
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstEmployee = res.data;
      }
      else {
        this.lstEmployee = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    },
    () => {
      this.isLoadingTable = false;
      this.lstEmployee = [];
      this.messageService.add({severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest})
    })
  }
  onLocks() {
    this.confirmationService.confirm({
      message: this.isLock? 'Bạn có muốn khóa nhân viên không?' :  'Bạn có muốn mở nhân viên không?' ,
      header: 'XÓA NHÂN VIÊN',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xác nhận',
      rejectLabel: 'Hủy bỏ',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.isLock = !this.isLock;
      },
      reject: (type: any) => {
          return;
      }
    });
  }
  onDelete(id: number, index: number) {
    this.confirmationService.confirm({
      message: 'Bạn có muốn xóa nhân viên <b> '+ this.lstEmployee.filter((i: any) => i.Id == id)[0].FullName +' </b> không?',
      header: 'XÓA NHÂN VIÊN',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xác nhận',
      rejectLabel: 'Hủy bỏ',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.employeeService.deleteEmployee(id).subscribe(
          (res: any) => {
            this.loading[0] = false;
            if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
              this.lstEmployee = this.lstEmployee.filter((id, i) => i !== index);
              this.messageService.add({ severity: 'success', summary: 'Success', detail: res.meta.error_message || AppMessageResponse.CreatedSuccess });
  
              
              //return;
            } else {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
              return;
            }
          }
        );
        
      },
      reject: (type: any) => {
          return;
      }
    });
  }
  lockEmployee(){}
  onSearch(event: any) {
    const searchValue = event.target.value.toLowerCase().trim();
    this.filterParrams.query = `FullName.ToLower().Contains("${searchValue}") OR Code.ToLower().Contains("${searchValue}")`;
    this.getLstEmployeeByPaging();
  }
  onClearInput() {
    this.search = '';
    this.isInputEmpty = true;
    this.filterParrams.query = `FullName.ToLower().Contains("${this.search}") OR Code.ToLower().Contains("${this.search}")`;
    this.getLstEmployeeByPaging();
  }
  onReset(id: number) {
    this.employeeService.getEmployee(id).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.Employee = res.data
        this.lstAccount = this.Employee.user; 
        this.setChangePassword();
        this.onChangePassword();
      }
    })
    
  }
  onChangePassword() {
    this.confirmationService.confirm({
      message: 'Bạn có muốn đặt lại mật khẩu tài khoản '+ this.lstAccount.UserName +' không?</br>Mật khẩu mới là: 111111',
      header: 'RESET PASSWORD',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xác nhận',
      rejectLabel: 'Hủy bỏ',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
      accept: () => {
          const reqData = Object.assign({}, this.fPassword.value);
          reqData.passwordNew  = Md5.hashStr('111111')
          reqData.newPassword  = Md5.hashStr('111111')
          
          this.employeeService.newPassword(this.lstAccount.Id ,reqData).subscribe(
            (res: ResApi) => {
              this.messageService.add({severity: 'success', summary:'Success', detail: res.meta.error_message })
          })
      },
      reject: (type: any) => {
          return;
      }
    });
  }
  setChangePassword() {
    this.fPassword = this.fb.group({
      UserId : this.lstAccount.Id,
      PasswordOld: this.lstAccount.Password,
      UserName: this.lstAccount.UserName,
      currentPassword: this.lstAccount.Password,
    })
  }
  getCompanyId() {
    this.Idc = this.storeService.get(StorageData.companyId); 
  }
  getListDepartment() {
    this.departmentService.getListDepartmentByPaging(this.filterParrams).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstDepartment = res.data;
      }
    })
  }
  getListPosition() {
    this.positionService.getListPositionByPaging(this.filterParrams).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstPosition = res.data
      }
    })
  }
  onOpenDialogResetPassword(item: any) {
    
    this.ref = this.dialogService.open(ChangePasswordComponent, {
      header: `Đổi mật khẩu tài khoản nhân viên: `+ item.FullName,
      width: '40%',
      height: '55%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
      data: {
        Employee: item,
      }
    });
  
    this.ref.onClose.subscribe();
  }
  onLockAccount(Resident: any) {
    this.confirmationService.confirm({
      message: 'Bạn có muốn khóa tài khoản cư dân '+ Resident.FullName +' không?',
      header: 'XÓA CƯ DÂN',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xác nhận',
      rejectLabel: 'Hủy bỏ',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.user = Resident.user;
        if(this.user.Status == 98){
          this.status = 1;
        }else{
          this.status = 98
        }
        this.commonService.LockUser(this.Idc, this.user.UserId, this.status).subscribe(
          (res: any) => {
            this.loading[0] = false;
              if (res.meta.error_code == AppStatusCode.StatusCode200) {
                this.user = Resident.user;
              if(this.user.Status == 98){
                this.user.Status = 1;
              }else{
                this.user.Status = 98;
              }
                this.messageService.add({ severity: 'success', summary: 'Success', detail: res.meta.error_message || AppMessageResponse.CreatedSuccess });
            } else {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
              return;
            }
          }
        );

      },
      reject: (type: any) => {
        return;
      }
    });
  }
}
