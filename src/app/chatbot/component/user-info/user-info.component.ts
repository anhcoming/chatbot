import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent {
    isEdit = false
    user = {
        username: "Lam",
        fullname: "Hoang Van Lam",
        email: "lam222@gmail.com",
    }
    personal = {
        birthday:new Date(),
        sex:"Nam",
        phone:"098943764782",
        address:"Ham Nam",
        position:"Ky thuat",
    }

    formGroup!: FormGroup;

    constructor(
        private readonly _userService: UserService,
        private readonly fb: FormBuilder,
        private readonly messageService: MessageService,
        private router: Router
    ){
        this.initFormGroup();
    }

    initFormGroup(){
        this.formGroup = this.fb.group({
            userName: [''],
            fullName: [''],
            email: [''],
            dob: [''],
            gender: [''],
            phone: [''],
            address: [''],
            department: ['']
        });

        this.formGroup.controls['userName'].disable();
        this.formGroup.controls['email'].disable();
        this.formGroup.controls['department'].disable();


    }

    ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        this.getUserInfo();
    }

    getUserInfo(){
        this._userService.getUserInfo().subscribe(
            (response) => {
                this.formGroup.patchValue({
                    userName: response.data.userName,
                    fullName: response.data.fullName,
                    email: response.data.email,
                    dob: response.data.dob,
                    gender: response.data.gender || null,
                    phone: response.data.phone,
                    address: response.data.address,
                    department: response.data.department || null
                })
            },
            (error) => {
                console.error(error);
            }
        );
    }

    onSubmit(){
        const reqData = this.formGroup.getRawValue();
        reqData.dob = new Date(reqData.dob);
        this._userService.updateUserInfo(reqData).subscribe(
            (response) => {
                if (response.meta.status_code === 200){
        this.isEdit = !this.isEdit
        this.messageService.add({ severity: 'success', summary: 'Success', detail: "Cập nhật thành công." });

                }
                
            
            },
            (error) => {
                console.error(error);
            }
        );

    }
    cancelEditInfo() {
        this.router.navigate(['/chat-bot']);
    }
}
