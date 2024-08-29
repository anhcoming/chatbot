import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AuthService } from 'src/app/services/auth.service';
import { AppMessageResponse, AppStatusCode, StorageData } from 'src/app/shared/constants/app.constants';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ReqLoginModel } from 'src/app/view-models/auth/req-login-model';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: [`./login.component.scss`],
})
export class LoginComponent {

    valCheck: string[] = ['remember'];

    password!: string;

    loginFormSubmitted = false;
    isLoginFailed = false;
    resMessageLogin = '';
    returnUrl = '/';
    isLogging = false;
    public fLogin: FormGroup;
    isShowPass = false;
    iconEye='ic-eyes';
    isEmptyValue: boolean = false;

    constructor(
        public layoutService: LayoutService,
        private activeRoute: ActivatedRoute,
        private authService: AuthService,
        private readonly fb: FormBuilder,
        private route: Router,
        private storeService: StorageService) {
        this.fLogin = fb.group({
            email: new FormControl('', Validators.compose([Validators.required, Validators.minLength(5)])),
            password: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(50)])],
            rememberMe: new FormControl(true)
        });
    }

    ngOnInit(): void {
        this.returnUrl = this.activeRoute.snapshot.queryParams['returnUrl'] || '/';
    }

    changeText() {
        this.isLoginFailed = false;
        this.isEmptyValue = false;
    }

    onSubmit() {
        this.loginFormSubmitted = true;
        this.isLoginFailed = false;
        const redirectUrl = '/';

        if (this.fLogin.invalid) {
            this.isEmptyValue = true;
            return;
        }

        const reqLogin = new ReqLoginModel();
        reqLogin.username = this.fLogin.value.email;
        // reqLogin.password = Md5.hashStr(this.fLogin.value.password);
        reqLogin.password = this.fLogin.value.password;

        this.isLogging = true;
        this.authService.login(reqLogin).subscribe((res: any) => {
            this.isLogging = false;
            if (res.meta.status_code == AppStatusCode.StatusCode200) {
                this.isLoginFailed = false;
                this.resMessageLogin = "Đăng nhập thành công!";
                this.authService.setStoreData(res.data);

                if (redirectUrl) {
                    this.route.navigate([redirectUrl]);
                    //this.redirectUrl = null;
                } else {
                    this.route.navigate(['/']);
                }
                this.getAccountInfo(res.data);
            }
            else {
                this.isLoginFailed = true;
                // this.resMessageLogin = res.meta.error_message;
            }
        },
            () => {
                this.isLogging = true;
                this.resMessageLogin = AppMessageResponse.BadRequest;
            },
            () => this.isLogging = false);
    }

    showPass() {
        this.isShowPass = !this.isShowPass;
        if (this.isShowPass) {
            this.iconEye = 'ic-eyes-close';
        } else {
            this.iconEye = 'ic-eyes';
        }
    }

    forgotPass() {
        this.route.navigate(['/auth/forgot-password']);
    }

    getAccountInfo(info: any) {
        const idUser = info.id;
        this.authService.getUrlUserInfo(idUser).subscribe(res => {
            if (res.meta.status_code === AppStatusCode.StatusCode200) {
                this.storeService.set(StorageData.userInfo, JSON.stringify(res.data));
            }
        })
    }
}
