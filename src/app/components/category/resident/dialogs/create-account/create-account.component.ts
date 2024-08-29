import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ResidentService } from 'src/app/services/resident.service';
import { AppStatusCode, AppMessageResponse, StorageData, TypeEmployee } from 'src/app/shared/constants/app.constants';
import { StorageService } from 'src/app/shared/services/storage.service';
import { Paging } from 'src/app/viewModels/paging';
import { ResApi } from 'src/app/viewModels/res-api';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss']
})
export class CreateAccountComponent {
  public loading = [false]
  public lstResident: any
  fAccount: any
  fIsAccount: any
  public id : any
  public phone : any
  public Idc : any;
  public typeEmployee = TypeEmployee;
  public filterParrams: Paging
  // public loading = [false];
  public isLoadingTable: boolean = false;
  userId: any;
  
  constructor(
    private readonly residentService: ResidentService,
    private readonly storeService: StorageService,
    private readonly route: ActivatedRoute,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private readonly fb: FormBuilder,
  ){
    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 1000;
    this.id = this.config.data.Id;
    this.phone = this.config.data.Phone;
  }
  ngOnInit(): void {
    if(this.id)
      this.getListResident(this.id)

    this.getCompanyId();
    this.getUserId();
    this.fAccount = this.fb.group({
      Id:  this.id,
      UserName: [this.phone ,  Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(15), Validators.pattern('[0-9\s]*')])],
      Password: ['' ,  Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(15)])],
      ConfirmPassword: ['', Validators.compose([Validators.required])],
      CreatedById: this.userId,
      CompanyId: this.Idc,
    });  
  }
  matchingPasswords() {
    const password = this.fAccount.get('Password').value;
    const confirmPassword = this.fAccount.get('ConfirmPassword').value;
    if (password !== confirmPassword) {
      this.fAccount.get('ConfirmPassword').setErrors({mismatchedPasswords: true});
    } else {
      this.fAccount.get('ConfirmPassword').setErrors(null);
    }
  }

  getUserId() {
    this.userId = this.storeService.get(StorageData.userId); 
  }

  markAllAsDirty() {
    Object.keys(this.fAccount.controls).forEach(key => {
      const control = this.fAccount.get(key);
      if (control.enabled && control.invalid) {
        control.markAsDirty();
      }
    });
  }
  onSubmit() {
    if(this.fAccount.invalid){
      this.markAllAsDirty();
    }
    else{
      const reqData = Object.assign({}, this.fAccount.value);
      this.loading[0] = true;
      
      this.residentService.createAccountResident(this.id, reqData).subscribe(
        (res: any) => {
          this.loading[0] = false;
          if (res?.meta?.error_code == AppStatusCode.StatusCode200) {
            this.ref.close();
            
            this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.CreatedSuccess });
          } 
          else { 
            this.messageService.add({ severity: 'warn', summary: 'Warn', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
          }
        },
        () => {
          this.loading[0] = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest });
        },
        () => {
          this.loading[0] = false;
        }
      )
    }
  }
  getListResident(id: number) {
    this.residentService.getResident(id).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstResident = res.data;
      }
    })
  }
  getCompanyId() {
    this.Idc = this.storeService.get(StorageData.companyId); 
  }
  Submit() {
    this.confirmationService.confirm({
      message: 'Bạn có muốn tạo tài khoản '+ this.fAccount.get('UserName').value + ' không?',
      header: 'THÊM TÀI KHOẢN',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xác nhận',
      rejectLabel: 'Hủy bỏ',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.onSubmit();
      },
      reject: (type: any) => {
          return;
      }
    });
  }
  onBack(event: Event) {
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: 'Bạn có muốn dừng tạo tài khoản cho cư dân <b>"'+ this.lstResident?.FullName +'"</b>?',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Xác nhận',
        rejectLabel: 'Hủy bỏ',
        acceptButtonStyleClass: 'p-button-success',
        rejectButtonStyleClass: 'p-button-danger',
        accept: () => {
          this.ref.close();
        },
        reject: () => {
            return;
        }
      });
  }
}
