import { Component, ElementRef } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { ReqLoginModel } from 'src/app/view-models/auth/req-login-model';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AppMessageResponse, AppStatusCode } from 'src/app/shared/constants/app.constants';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
    valCheck: string[] = ['remember'];

    password!: string;

    loginFormSubmitted = false;
    isLoginFailed = false;
    resMessageLogin = '';
    returnUrl = '/';
    isLogging = false;
    public fResetPass: FormGroup;
    isShowPass = false;
    isShowConfirmPass = false;
    step1 = true;
    step2 = false;
    step3 = false;
    isCheckEmail = false;
    isCheckOTP = false;
    time: number = 60;
    countdown: number = 60;
    iconEye = 'ic-eyes';
    iconEyeConfirm = 'ic-eyes';


    constructor(
        public layoutService: LayoutService,
        private activeRoute: ActivatedRoute,
        private authService: AuthService,
        private readonly fb: FormBuilder,
        private route: Router) {
        this.fResetPass = fb.group({
            email: ['', Validators.required],
            otp: ['', Validators.required],
            password: ['', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d]{6,}$')]],
            confirmPassword: [''],
        });
    }

    ngOnInit(): void {
        this.returnUrl = this.activeRoute.snapshot.queryParams['returnUrl'] || '/';
        setInterval(() => {
            if (this.step2) {
                this.countdown = --this.countdown <= 0 ? 0 : this.countdown;
                this.time = this.countdown;
            }
        }, 1000);
    }

    onSubmit() {
        if (this.fResetPass.invalid) {
            this.markAllAsDirty();
            return;
        }
        this.loginFormSubmitted = true;
        this.isLoginFailed = false;
        const redirectUrl = '/';

        if (!this.fResetPass.value.password) {
            this.isLoginFailed = true;
            return;
        }

        const reqLogin = new ReqLoginModel();
        reqLogin.username = this.fResetPass.value.email;
        // reqLogin.password = Md5.hashStr(this.fLogin.value.password);
        reqLogin.password = this.fResetPass.value.password;
        this.isLogging = true;


    }

    markAllAsDirty() {
        if (this.fResetPass != null) {
            Object.keys(this.fResetPass?.controls).forEach(key => {
                const control = this.fResetPass?.get(key);
                if (control?.enabled && control?.invalid) {
                    control.markAsDirty();
                }
            });
        }
    }

    matchingPasswords() {
        const password = this.fResetPass.get('password')?.value;
        let confirmPassword = this.fResetPass.get('confirmPassword')?.value;
        if (password !== confirmPassword) {
            this.fResetPass.get('confirmPassword')?.setErrors({ mismatchedPasswords: true });
        } else {
            this.fResetPass.get('confirmPassword')?.setErrors(null);
        }
    }

    nexStep(step: number) {
        if (step === 1) {
            if (!this.fResetPass.value.email) {
                this.isCheckEmail = true;
                return;
            }
            this.step1 = false;
            this.step2 = true;
            this.step3 = false;
        }
        if (step === 2) {
            if (!this.fResetPass.value.otp) {
                this.isCheckOTP = true;
                return;
            }
            this.step1 = false;
            this.step2 = false;
            this.step3 = true;
        }
    }

    showPass() {
        this.isShowPass = !this.isShowPass;
        if (this.isShowPass) {
            this.iconEye = 'ic-eyes-close';
        } else {
            this.iconEye = 'ic-eyes';
        }
    }
    showConfirmPass() {
        this.isShowConfirmPass = !this.isShowConfirmPass
        if (this.isShowConfirmPass) {
            this.iconEyeConfirm = 'ic-eyes-close';
        } else {
            this.iconEyeConfirm = 'ic-eyes';
        }
    }

    returnLogin() {
        this.route.navigate(['/auth/login']);
    }

    resendOTP() {
        if (this.countdown > 0) {
            return;
        }
        this.countdown = 60;
        this.time = 60;
    }
}
