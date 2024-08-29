import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef, DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { CommonService } from 'src/app/services/common.service';
import { StorageData } from 'src/app/shared/constants/app.constants';
import { StorageService } from 'src/app/shared/services/storage.service';
import { Paging } from 'src/app/viewModels/paging';
import { ResApi } from 'src/app/viewModels/res-api';
import { Md5 } from 'ts-md5';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {
  public lstEmployee: any;
  public lstUser: any;
  id: any;
  public Idc: any;
  fPassword: any ;
  public data: any;
  public filterList: Paging;

  public filterParrams : Paging ;

  public loading = [false];

  constructor(
    private readonly commonService: CommonService,
    private readonly storeService: StorageService,
    private readonly messageService: MessageService,
    private readonly fb: FormBuilder,
    private router: Router,
    public dialogService: DialogService,
    private config: DynamicDialogConfig,
    public ref: DynamicDialogRef
  ) {
    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 100;

    this.filterList = new Object as Paging;
    this.data = [];
    this.lstEmployee = this.config.data.Employee;
  }
  ngOnInit() {
    this.id = this.lstEmployee.Id
    this.getCompanyId();
    this.fPassword = this.fb.group({
      UserId : this.id,
      PasswordNew: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(15)])],
      NewPassword: ['', Validators.required],
    });
    this.matchingPasswords()
  }
  getCompanyId() {
    this.Idc = this.storeService.get(StorageData.companyId);
  }
  matchingPasswords() {
    const password = this.fPassword.get('PasswordNew').value;
    let NewPassword = this.fPassword.get('NewPassword').value;
    if (password !== NewPassword) {
      this.fPassword.get('NewPassword').setErrors({mismatchedPasswords: true});
    } else {
      this.fPassword.get('NewPassword').setErrors(null);
    }
  }
  markAllAsDirty() {
    Object.keys(this.fPassword.controls).forEach(key => {
      const control = this.fPassword.get(key);
      if (control.enabled && control.invalid) {
        control.markAsDirty();
      }
    });
  }
  
  onSubmit() {
    if(this.fPassword.invalid){
      this.markAllAsDirty();
    }else{
      const reqData = Object.assign({}, this.fPassword.value);
      reqData.currentPassword = this.lstEmployee.Password;
      reqData.passwordOld = this.lstEmployee.Password;
      reqData.PasswordNew  = Md5.hashStr(this.fPassword.get('PasswordNew').value)
      reqData.NewPassword  = Md5.hashStr(this.fPassword.get('NewPassword').value)
      this.commonService.changePassword(this.Idc, this.id , 2,reqData).subscribe(
        (res: ResApi) => {
          this.messageService.add({severity: 'success', summary:'Success', detail: res.meta.error_message })
          this.ref.close(reqData.NewPassword)
      })
    }
  }
  onReturnPage(url: string) : void {
    this.router.navigate([url]);
  }
  onBack() {
    this.ref.close()
  }
}
