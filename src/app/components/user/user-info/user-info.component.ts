import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { AppMessageResponse, AppStatusCode, StorageData } from 'src/app/shared/constants/app.constants';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ResApi } from 'src/app/viewModels/res-api';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent {
  fUser: any;
  dataUser: any;
  imagePreview: any;
  isImageSelected: boolean = false;
  public imgName: string = '';
  loading = [false];
  data: any;
  id: any;
  Idc: any;
  userId: any;
  fullName: string = '';
  userInfo: any;
  isEditName: boolean = false;
  fileImage: any;
  constructor(
    private http: HttpClient,
    private readonly userService: UserService,
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private router: Router,
    private readonly messageService: MessageService,
    private ref: DynamicDialogRef,
    private confirmationService: ConfirmationService,
    private readonly storeService: StorageService,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('id');
    });
    this.getCompanyId();
    this.getUserId();
    this.getUserInfo();
    if (this.userId > 0) {
      this.getUserById(this.Idc, this.userId);
    }
  }

  getCompanyId() {
    this.Idc = this.storeService.get(StorageData.companyId);
  }
  getUserId() {
    this.userId = this.storeService.get(StorageData.userId);
  }

  getUserById(idc: number, id: number) {
    this.isImageSelected = true;
    if (this.userId > 0) {
      //   this.userService.getUserById(this.Idc, this.userId).subscribe((res: ResApi) => {
      //     if(res.meta.error_code == AppStatusCode.StatusCode200) {
      //       this.data = res.data;
      //       this.data.Avata = res.data.Avata
      //       this.formGroup();
      //       this.uploadedImageUrl = `http://i-apigw.cnttvietnam.com.vn/uploads/images/${this.data.Avata}`;
      //     }
      //     else {
      //       this.data = [];
      //       this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      //     }
      //   })
      //   this.data={...this.data}
    } else {
      this.data = [];
    }
  }

  getUserInfo() {
    const info = JSON.parse(this.storeService.get(StorageData.userInfo));
    this.userInfo = info;
    this.fullName = info.fullName;
  }

  editUserName() {
    this.isEditName = true;
  }

  onSubmit() {
    const reqData = Object.assign({}, this.fUser.value);
    reqData.Avata = this.data.Avata;
    this.userService.changeInfoUser(reqData).subscribe((res: any) => {
      this.loading[0] = false;
      if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: res.meta.error_message || AppMessageResponse.CreatedSuccess
        });

        setTimeout(() => {
          this.ref.close();
        }, 1500);
        setTimeout(() => {
          this.reloadPage();
        }, 2500);
      } else {
        this.loading[0] = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    });
  }
  onImageSelected(event: any) {
    const file: File = event.target.files[0]; // Lấy file từ sự kiện event
    if (file) {
      const formData: FormData = new FormData();
      formData.append('image', file, file.name); // Gắn file vào FormData

      // Gửi yêu cầu POST tới API endpoint hỗ trợ việc upload file
      this.http.post('https://i-apigw.cnttvietnam.com.vn/api/upload/uploadImage', formData).subscribe(
        (response: any) => {
          this.isImageSelected = true;
          // Lấy đường dẫn ảnh đã upload từ phản hồi của server
          const uploadedImageName = response.data;
          this.data.Avata = uploadedImageName[0];
          this.imgName = uploadedImageName[0];
          console.log('Upload thành công:', response);
          this.imagePreview = `http://i-apigw.cnttvietnam.com.vn/uploads/images/${this.data.Avata}`;
        },
        error => {
          // Xử lý lỗi nếu có
          console.error('Lỗi upload:', error);
        }
      );
    }
  }
  reloadPage() {
    window.location.reload();
  }
  onReturnPage(url: string): void {
    this.router.navigate([url]);
  }
  onBack(event: any) {
    this.ref.close();
  }
  Imagenull() {
    this.data.Avata = '';
    this.isImageSelected = false;
    this.imagePreview = '';
  }

  onChangeImage(event: any) {
    this.fileImage = event.target.files;
    this.onFileChange(event.target.files);
  }

  onFileChange(files: File[]) {
    if (!files || files.length == 0) {
      return;
    }

    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(files[0]);

    reader.onload = _event => {
      this.imagePreview = reader.result;
    };
  }

  saveInfoUser() {
    if (this.imagePreview) this.userInfo.avatar = this.imagePreview;
    if (this.fullName) {
      this.userInfo.fullName = this.fullName;
    }
    this.authService.changeUserInfo(this.userId, this.userInfo).subscribe(res => {
      if (res.meta.status_code === AppStatusCode.StatusCode200) {
        this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật thông tin tài khoản thành công.' });
        this.getUser();
        this.isEditName = false;
      } else {
        this.messageService.add({ severity: 'error', summary: 'Thất bại', detail: 'Cập nhật thông tin tài khoản thất bại.' });
        this.isEditName = false;
      }
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Thất bại', detail: 'Cập nhật thông tin tài khoản thất bại.' });
      this.isEditName = false;
    });
  }

  getUser() {
    this.authService.getUrlUserInfo(this.userId).subscribe(res => {
      if (res.meta.status_code === AppStatusCode.StatusCode200) {
        this.storeService.set(StorageData.userInfo, JSON.stringify(res.data));
        this.getUserInfo();
      }
    });
  }
}
