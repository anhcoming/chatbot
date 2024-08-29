import { Component, ElementRef, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { MenuItem, MessageService } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { Router } from '@angular/router';
import { AppMessageResponse, AppStatusCode, StorageData } from '../shared/constants/app.constants';
import { StorageService } from '../shared/services/storage.service';
import { ResApi } from '../viewModels/res-api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UserService } from '../services/user.service';
import { UserInfoComponent } from '../components/user/user-info/user-info.component';
import { User } from '../viewModels/user/user';
import { UserChangepassComponent } from '../components/user/user-changepass/user-changepass.component';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {

    items!: MenuItem[];
    menuItems: MenuItem[] = [];
    public currentDate = new Date();
    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;
    @ViewChild('topbarmenutime') topbarmenutime!: ElementRef;
    Idc: any;
    userId: any;
    dataUser: any;
    public Fullname = '';
    UserName: any;
    getDate: any;
    getDay: any;
    getMonth: any;
    getFullYear: any;
    nameDay: string = '';
    Avata: any;
    userInfo: any;

    constructor(
        private location: Location,
        private readonly cookieService: CookieService,
        private readonly userService : UserService,
        private readonly storeService : StorageService,
        private readonly messageService : MessageService,
        public layoutService: LayoutService,
        public dialogService: DialogService,
        private ref: DynamicDialogRef,
        private router : Router,
        private authService: AuthService,
        ) {



        // setInterval(() => {
        //   this.currentDate = new Date();
        // }, 1000);

        this.getDate = new Date().getDate();
        this.getDay = new Date().getDay();
        this.getMonth = new Date().getUTCMonth() + 1;
        this.getFullYear = new Date().getFullYear();
        if (this.getDay == 0) {
          this.nameDay = 'Chủ nhật';
        } else if (this.getDay == 1) {
          this.nameDay = 'Thứ hai';
        } else if (this.getDay == 2) {
          this.nameDay = 'Thứ ba';
        } else if (this.getDay == 3) {
          this.nameDay = 'Thứ tư';
        } else if (this.getDay == 4) {
          this.nameDay = 'Thứ năm';
        } else if (this.getDay == 5) {
          this.nameDay = 'Thứ sáu';
        } else if (this.getDay == 6) {
          this.nameDay = 'Thứ bảy';
        }
     }
     ngOnInit(): void {
        this.getCompanyId();
        this.getUserId();
        this.getUserById(this.Idc,this.userId);
        this.getUserInfo();
        setInterval(() => {
          this.currentDate = new Date();
        }, 1000);
        this.menuItems = [
          {
          label: 'Thông tin tài khoản',
          icon: 'pi pi-fw pi-user',
          command: () => {
              this.router.navigate([`/user/user-info/${this.userId}`]);
              // this.onOpenDialogInfoUser()
        }},
        {
          label: 'Đổi mật khẩu',
          icon: 'pi pi-fw pi-key',
          command: () => {
              // this.router.navigate([`/user/user-changepass/${this.userId}`]);
              this.onOpenDialogChangePass()
        }
        },
        {
          label: 'Đăng xuất',
          icon: 'pi pi-fw pi-refresh',
          command: () => {
              this.logout();
              this.router.navigate(['/auth/login']);
        }
        }
      ];
      }


     getCompanyId() {
        this.Idc = this.storeService.get(StorageData.companyId);
      }
      getUserId() {
        this.userId = this.storeService.get(StorageData.userId);
      }
      getUserById(idc: number, id: number) {

        //   this.userService.getUserById(this.Idc, this.userId).subscribe((res: ResApi) => {
        //     if(res.meta.error_code == AppStatusCode.StatusCode200) {
        //       this.dataUser = res.data;
        //       this.UserName = this.dataUser.UserName;
        //       this.Avata = this.dataUser.Avata;
        //     }
        //     else {
        //       this.dataUser = [];
        //       this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
        //     }
        //   })
        //   this.dataUser={...this.dataUser}
    }

    getUserInfo() {
      this.authService.getUrlUserInfo(this.userId).subscribe(res => {
        if (res.meta.status_code === AppStatusCode.StatusCode200) {
          this.userInfo = res.data;
        }
      })
    }

    onOpenDialogInfoUser() {
      this.ref = this.dialogService.open(UserInfoComponent, {
        header: 'Thay đổi thông tin tài khoản',
        width: '60%',
        height: '80%',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
        maximizable: true,
        data: {
          Id	: this.userId,

          FullName	: this.dataUser.FullName,
          UserName	: this.dataUser.UserName,
          Email	: this.dataUser.Email,

          Avata	: this.dataUser.Avata,
          Address	: this.dataUser.Address,
          Phone	: this.dataUser.Phone
        }
      });

      this.ref.onClose.subscribe((data: User) => {
        if(!this.userId) {
          if (data) {

            this.dataUser =  [...this.dataUser, data];
          }
        }else{
          if (data) {

            this.dataUser = this.dataUser.map((item: any) => {
              if (item.Id === this.userId) {
                return data;
              } else {
                return item;
              }
            });
          }
        }
      });

    }
    onOpenDialogChangePass() {

      this.ref = this.dialogService.open(UserChangepassComponent, {
        header: 'Đổi mật khẩu',
        width: '35%',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
        maximizable: true,
      });
    }

    logout(){
      this.cookieService.delete('access_token');
      this.storeService.clear();
    }
}
