import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { CompanyService } from 'src/app/services/company.service';
import { UserService } from 'src/app/services/user.service';
import { AppMessageResponse, AppStatusCode, StorageData } from 'src/app/shared/constants/app.constants';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ResApi } from 'src/app/viewModels/res-api';
import { Md5 } from 'ts-md5';

@Component({
  selector: 'app-user-changepass',
  templateUrl: './user-changepass.component.html',
  styleUrls: ['./user-changepass.component.scss']
})
export class UserChangepassComponent {
  fPassword : any
  loading = [false];
  Idc: any;
  userId: any;
  Id: any;
  id: any;
  public password : any;
  listCompany: any;
  constructor(
    private readonly companyService : CompanyService,
    private readonly userService : UserService,
    private readonly fb : FormBuilder,
    private readonly route: ActivatedRoute,
    private router: Router,
    private readonly messageService : MessageService,
    private readonly ref : DynamicDialogRef,

    private confirmationService: ConfirmationService,
    private readonly storeService : StorageService,
  ){
    this.fPassword = this.fb.group({
      UserId : this.userId,
      passwordOld : ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(150)])],
      PasswordNew : ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(150)])],
      NewPassword : ['', Validators.compose([Validators.required])],
    })
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('id');
    });

  
    this.getCompanyId();
    this.getUserId();
    // this.getCompanyById(this.Idc);
  }
  getCompanyId() {
    this.Idc = this.storeService.get(StorageData.companyId); 
  }
  getUserId() {
    this.userId = this.storeService.get(StorageData.userId); 
  }
  markAllAsDirty() {
    Object.keys(this.fPassword.controls).forEach(key => {
      const control = this.fPassword.get(key);
      if (control.enabled && control.invalid) {
        control.markAsDirty();
      }
    });
  }
  onSubmit(){
    if(this.fPassword.invalid){
      this.markAllAsDirty()
    }else{
      const reqData = Object.assign({}, this.fPassword.value);
          reqData.UserId = this.userId,
          reqData.passwordOld = Md5.hashStr(this.fPassword.get('passwordOld').value)
          reqData.PasswordNew  = Md5.hashStr(this.fPassword.get('PasswordNew').value)
          reqData.NewPassword  = Md5.hashStr(this.fPassword.get('NewPassword').value)
          this.userService.newPassword(this.userId,reqData).subscribe(
            (res: ResApi) => {
                  if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) 
                  {
                     this.messageService.add({ severity: 'success', summary: 'Success', detail: res.meta.error_message || AppMessageResponse.CreatedSuccess });
     
                     setTimeout(() => {this.ref.close()}, 1500);
                   }
                else {
                    this.messageService.add({ severity:'error', summary:'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest})
                  }
          })
      }
  }

  onReturnPage(url: string) : void {
    this.router.navigate([url]);
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
 
  onBack(){
    setTimeout(() => {this.ref.close()}, 500);
  }

}
