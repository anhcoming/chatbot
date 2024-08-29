import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProvincesService } from 'src/app/services/provinces.service';
import { TypeAttributeItemService } from 'src/app/services/type-attribute-item.service';
import { AppStatusCode, AppMessageResponse, StorageData } from 'src/app/shared/constants/app.constants';
import { StorageService } from 'src/app/shared/services/storage.service';
import { Paging } from 'src/app/viewModels/paging';
import { Provinces } from 'src/app/viewModels/provinces/provinces';
import { ResApi } from 'src/app/viewModels/res-api';

@Component({
  selector: 'app-add-type-attribute',
  templateUrl: './add-type-attribute.component.html',
  styleUrls: ['./add-type-attribute.component.scss']
})
export class AddTypeAttributeComponent implements OnInit {

  lstProvince: Provinces;
  public Id: any;
  public checked !: boolean;
  id : any;
   fTypeAttribute: any ;
  public data: any;
  public filterParrams : Paging ;
  public loading = [false];
  uploadedImageUrl: string = '';
  public nameFile = '';
  userId: any;
  Idc: any;

  constructor(
    private http: HttpClient,
    private readonly confirmationService : ConfirmationService,
    private readonly typeattributeitemService : TypeAttributeItemService,
    private readonly messageService: MessageService,
    private readonly fb: FormBuilder,
    private readonly provinceService: ProvincesService,
    private readonly route: ActivatedRoute,
    public ref: DynamicDialogRef,
    private router: Router,
    private readonly storeService : StorageService,
  ) {
    this.lstProvince = new Provinces();
    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 100;
    this.data = {};

    
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id =  params.get('id');
    });
    this.formGroup();
    
    if(this.id)
      this.getTypeAttibuteItemById(this.id);


    this.fTypeAttribute = this.fb.group({
      Id:  [0],
      CreatedById: this.userId,
      UpdatedById: this.userId,
      CompanyId : [0],
      Status: [1],
      TypeAttributeId : [0],
      CreatedBy : [''],
      UpdatedBy : [''],
      // IsActive: [],
      Icon : [''],
      Image: [''],
      Location : [0],
      Code : [''],
      Name: ['' ,  Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(150)])],
    })

  }
  getUserId() {
    this.userId = this.storeService.get(StorageData.userId); 
  }
  getCompanyId() {
    this.Idc = this.storeService.get(StorageData.companyId); 
  }

  onSubmit() {
    
    if(this.id == null) {
      // if (this.fBanner.controls['Title'].value == null || typeof this.fBanner.controls['Title'].value === 'undefined') {
      //   this.fBanner.controls['Title'].setValue(0);
      // }
      this.fTypeAttribute.controls['Id'].setValue(0);
      
      const reqData = Object.assign({}, this.fTypeAttribute.value);
      reqData.Image = this.data.Image;
      console.log(reqData.Image)
      this.loading[0] = true;
      this.typeattributeitemService.createTypeAttributeItem(reqData).subscribe(
        (res: any) => {
          this.loading[0] = false;
          if (res?.meta?.error_code == AppStatusCode.StatusCode200) {
            // this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.CreatedSuccess });
            
            setTimeout(() => {this.onReturnPage('/common/type-attribute/create')}, 1000);
          } 
          else { 
        
            // this.messageService.add({ severity: 'warn', summary: 'Warn', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
            setTimeout(() => {this.ref.close();},1500)
          }
        },
        () => {
          this.loading[0] = false;
          // this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest });
          setTimeout(() => {this.ref.close();},1500)
        },
        () => {
          this.loading[0] = false;
        }
      );
    }else{
      // if (this.fBanner.controls['Title'].value == null || typeof this.fBanner.controls['Title'].value === 'undefined') {
      //   this.fBanner.controls['Title'].setValue(0);
      // }

      const reqData = Object.assign({}, this.fTypeAttribute.value);
      reqData.Image = this.data.Image;
      this.uploadedImageUrl = `http://i-apigw.cnttvietnam.com.vn/uploads/images/${this.data.Image}`;
      this.loading[0] = true;
      this.typeattributeitemService.updateTypeAttributeItemById(this.id, reqData).subscribe(
        (res: any) => {
          this.loading[0] = false;
          if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
            this.uploadedImageUrl = `http://i-apigw.cnttvietnam.com.vn/uploads/images/${this.data.Image}`;
            // this.messageService.add({ severity: 'success', summary: 'Success', detail: res.meta.error_message || AppMessageResponse.CreatedSuccess });

            setTimeout(() => {this.onReturnPage('/common/type-attribute/create')}, 1500);
          } else {
            // this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
            setTimeout(() => {this.ref.close();},1500)
          }
        },
        () => {
          this.loading[0] = false;
          // this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest });
          setTimeout(() => {this.ref.close();},1500)
        },
        () => {
          this.loading[0] = false;
        }
      );
    }
  }
  onReturnPage(url: string) : void {
    this.router.navigate([url]);
  }
  formGroup(){
    this.fTypeAttribute = this.fb.group({
      Id: this.Id,
      CreatedById : this.data.CreatedById,
      TypeAttributeId : this.data.TypeAttributeId,
      UpdatedById : this.data.UpdatedById,
      CreatedBy : this.data.CreatedBy,
      UpdatedBy : this.data.UpdatedBy,
      Icon : this.data.Icon,
      Image: this.data.Image,
      // IsActive: this.data.IsActive,
      Location : this.data.Location,
      Code: this.data.Code,
      Name: this.data.Name,
    })
  }
  onFileSelected(event: any) {
    const file: File = event.target.files[0]; // Lấy file từ sự kiện event
    if (file) {
      const formData: FormData = new FormData();
      formData.append('image', file, file.name); // Gắn file vào FormData
  
      // Gửi yêu cầu POST tới API endpoint hỗ trợ việc upload file
      this.http.post('https://i-apigw.cnttvietnam.com.vn/api/upload/uploadImage', formData)
        .subscribe(
          (response: any) => {
            // Lấy đường dẫn ảnh đã upload từ phản hồi của server
            const uploadedImageName = response.data;
            this.nameFile = uploadedImageName[0];
            this.data.Image = uploadedImageName[0];
            console.log('Upload thành công:', response);
            this.uploadedImageUrl = `http://i-apigw.cnttvietnam.com.vn/uploads/images/${uploadedImageName}`;
          },
          (error) => {
            // Xử lý lỗi nếu có
            console.error('Lỗi upload:', error); 
          }
        );
    }
  }
  Imagenull(){
    this.uploadedImageUrl = 'null';
  }
  getTypeAttibuteItemById(Id: number) {

    this.typeattributeitemService.getTypeAttributeItemById(Id).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.data = res.data;
        // this.dataBanner.Image = this.nameFile;
        this.formGroup();
        this.uploadedImageUrl = `http://i-apigw.cnttvietnam.com.vn/uploads/images/${this.data.Image}`;
        console.log(this.data.Image)
      }
      else {
        this.data = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
      
    }) 
  }
  onBack(event: Event){
    this.ref.close();
  }
}
