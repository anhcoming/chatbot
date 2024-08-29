import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { Paging } from 'src/app/viewModels/paging';
import { DialogsPricingComponent } from '../dialogs/dialogs-pricing/dialogs-pricing.component';
import { DbFunction, ListAttactments } from 'src/app/viewModels/company/company';
import { CompanyService } from 'src/app/services/company.service';
import { AppMessageResponse, AppStatusCode, IsStatus, StorageData } from 'src/app/shared/constants/app.constants';
import { ResApi } from 'src/app/viewModels/res-api';
import { ServicePricingService } from 'src/app/services/service-pricing.service';
import { CommonService } from 'src/app/services/common.service';
import { Md5 } from 'ts-md5';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/shared/services/storage.service';

@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.scss']
})
export class AddCompanyComponent {
  public listCompany: any;
  public itemCompany: any;
  public listFunction: any;
  public lstPricingCompany: any;
  public listAttactments: any;
  public lstSPC: any;
  public PricingCompany: any;
  public ServicePricing: any;
  PricingCompanyItem:any;
  id: any;
  isCustom:boolean=false;
  fCompany: any = FormGroup ;
  public lstCountry: any[];
  public lstProvince: any[];
  public data: any;
  public selectedOption: any;
  password!: string;
  public filterList: Paging;
  public isStatus = IsStatus;
  public filterParrams : Paging ;
  public mismatchedPasswords: any;
  public loading = [false];
  public ref: DynamicDialogRef | undefined;
  public pakage_custom = {
    Id: 1,
    Name : 'Custom',
  }
  userId: any;
  Idc: any;
  public uploadedImageUrl: any;
  public imgName = '';
  isImageSelected : boolean = false;
  constructor(
    private readonly commonService: CommonService,
    private readonly companyService: CompanyService,
    private readonly storeService : StorageService,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private readonly http: HttpClient,
    private readonly fb: FormBuilder,
    private readonly pricingService: ServicePricingService,
    private readonly route: ActivatedRoute,
    private router: Router,
    public dialogService: DialogService,
    
  ) {
    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 100;

    this.filterList = new Object as Paging;

    this.lstCountry = [];
    this.listCompany = [];
    this.listFunction = [];
    this.lstProvince = [];
    this.data = [];
    this.PricingCompany = [];
    this.selectedOption = [];
    this.ServicePricing={
      Name:'',
      Code:'',
      IsCustom: true,
      Id: '',
    }
    this.fCompany = this.fb.group({
      Id:  [0],
      Status: null,
      CompanyId: [1],
      ProjectId: ['' ],
      Code: ['' ,  Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(15)])],
      Name: ['' ,  Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(15)])],
      CountryId: new FormControl(83, Validators.required) ,
      ProvinceId: ['' ,  Validators.required],
      Address: ['' ,  Validators.required],
      Phone: ['' ,  Validators.compose([ Validators.required, Validators.pattern('[0-9\s]*')])],
      Email: [''],
      ContactPhone: ['', Validators.pattern('[0-9\s]*')],
      ContactSex: [''],
      ContactName: [''],
      ContactEmail: [''],
      ContactIdAdress: [''],
      ContactBrithday: [''],
      ContactIdDate: [''],
      ContactIdNo: [''],
      Website: [''],
      Logo: [''],
      Note: [''],
      ServicePricingId: ['' ,  Validators.required],
      AppartmentNo: ['' ,  Validators.required],
      UserName: ['' ,  Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(15)])],
      Password: ['' ,  Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(15)])],
      ConfirmPassword: ['', Validators.required],
      RegistrationDate: new Date(),
      RegistrationEnd: new Date(),
      RegistrationNumber: [''],
      RegistrationStart:new Date(),
      TaxCode: ['' ,  Validators.required],
      IsCustom: [''],
      listFunctions: [],
      listAttactments: [],
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.id =  params.get('id');
    });

    if(this.id){
      this.getCompanyById(this.id);
    }
    else{
      this.getServicePricing();
    }
    
    this.getListCountries();
    this.getListProvinces();
    this.getUserId();
    this.getCompanyId();
  }
  
  getUserId() {
    this.userId = this.storeService.get(StorageData.userId); 
  }
  getCompanyId() {
    this.Idc = this.storeService.get(StorageData.companyId); 
  }

  matchingPasswords() {
    const password = this.fCompany.get('Password').value;
    let confirmPassword = this.fCompany.get('ConfirmPassword').value;
    if (password !== confirmPassword) {
      this.fCompany.get('ConfirmPassword').setErrors({mismatchedPasswords: true});
    } else {
      this.fCompany.get('ConfirmPassword').setErrors(null);
    }
  }
  markAsPristineStart(){
    this.fCompany.get('RegistrationStart').markAsPristine();
  };
  markAsPristineEnd(){
    this.fCompany.get('RegistrationEnd').markAsPristine();
  };
  markAllAsDirty() {
    Object.keys(this.fCompany.controls).forEach(key => {
      const control = this.fCompany.get(key);
      if (control.enabled && control.invalid) {
        control.markAsDirty();
      }
    });
  }
onSubmit() {
  if(this.fCompany.invalid){
    this.markAllAsDirty()
  }else{
    const reqData = Object.assign({}, this.fCompany.value);
    reqData.CompanyId = this.Idc;
    reqData.listFunctions = this.listFunction;
    reqData.ServicePricing = this.ServicePricing;
    reqData.Password = Md5.hashStr(reqData.Password);
    reqData.IsCustom = this.ServicePricing.IsCustom;
    reqData.IsAccount = false;
    reqData.ServicePricingId = this.ServicePricing.Id;
    reqData.listAttactments = this.listAttactments;
    reqData.Logo = this.listCompany.Logo;
    this.uploadedImageUrl = `http://i-apigw.cnttvietnam.com.vn/uploads/images/${this.data.Image}`;
    
    if(this.id == null) {
      reqData.CreatedById = this.userId,
      this.loading[0] = true;
      this.companyService.createCompany(reqData).subscribe(
        (res: any) => {
          this.loading[0] = false;
          if (res?.meta?.error_code == AppStatusCode.StatusCode200) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.CreatedSuccess });
            
            setTimeout(() => {this.onReturnPage('/managerment/company/list')}, 1000);
          } 
          else { 
            this.loading[0] = false
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
      );
    }else{
      reqData.UpdatedById = this.userId;
      this.loading[0] = true;
      this.companyService.updateCompany(this.id, reqData).subscribe(
        (res: any) => {
          this.loading[0] = false;
          if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: res.meta.error_message || AppMessageResponse.CreatedSuccess });

            setTimeout(() => {this.onReturnPage('/managerment/company/list')}, 1500);
          } else {
            this.loading[0] = false
            this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
          }
        },
        () => {
          this.loading[0] = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest });
        },
        () => {
          this.loading[0] = false;
        }
      );
    }
  }
  }
  onReturnPage(url: string) : void {
    this.router.navigate([url]);
  }
  setFormGroup(){
    this.fCompany = this.fb.group({
      Id:  this.id,
      CreatedById: this.userId,
      UpdatedById: this.userId,
      CompanyId: [1],
      ProjectId: this.listCompany.ProjectId,
      Code: this.listCompany.Code,
      Status: this.listCompany.Status,
      Name: this.listCompany.Name,
      CountryId: this.listCompany.CountryId,
      ProvinceId: this.listCompany.ProvinceId,
      Address: this.listCompany.Address,
      Phone: this.listCompany.Phone,
      Email: this.listCompany.Email,
      ContactPhone: this.listCompany.ContactPhone,
      ContactSex: this.listCompany.ContactSex,
      ContactName: this.listCompany.ContactName,
      ContactEmail: this.listCompany.ContactEmail,
      ContactIdAdress: this.listCompany.ContactIdAdress,
      ContactBrithday: this.listCompany.ContactBrithday ? new Date(this.listCompany.ContactBrithday) : undefined,
      ContactIdDate: this.listCompany.ContactIdDate ? new Date(this.listCompany.ContactIdDate) : undefined,
      ContactIdNo: this.listCompany.ContactIdNo,
      Website: this.listCompany.Website,
      Note: this.listCompany.Note,
      Logo: '',
      ServicePricingId: this.listCompany.ServicePricingId,
      ServicePricing: this.listCompany.ServicePricing,
      AppartmentNo: this.listCompany.AppartmentNo,
      listFunctions: this.listCompany.listFunctions,
      UserName: this.listCompany.UserName,
      Password: this.listCompany.Password,
      ConfirmPassword: this.listCompany.Password,
      RegistrationDate: this.listCompany.RegistrationDate ? new Date(this.listCompany.RegistrationDate) : undefined,
      RegistrationEnd: this.listCompany.RegistrationEnd ? new Date(this.listCompany.RegistrationEnd) : undefined,
      RegistrationNumber: this.listCompany.RegistrationNumber,
      RegistrationStart: this.listCompany.RegistrationStart ? new Date(this.listCompany.RegistrationStart) : undefined,
      TaxCode: this.listCompany.TaxCode,
      listAttactments: this.listCompany.listAttactments,

    })

  }
  getCompanyById(id: number) {
    this.companyService.getCompany(id).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.listCompany = res.data;
        this.listCompany.Logo = res.data.Logo;
        this.itemCompany = this.listCompany.servicePricing;
        this.listAttactments = this.listCompany.listAttactments;
        this.setFormGroup();
        this.uploadedImageUrl = `http://i-apigw.cnttvietnam.com.vn/uploads/images/${this.listCompany.Logo}`;
        this.isImageSelected=true;
        
        
        if(this.itemCompany?.IsCustom){
          this.pakage_custom = {
            Id: this.itemCompany.Id,
            Name: 'Custom : ' + this.itemCompany.Code
          }
          this.isCustom = this.itemCompany.IsCustom;
        }
        this.listFunction = this.listCompany.listFunctions;
        this.ServicePricing = this.listCompany.servicePricing

        this.getServicePricing();
      }
      else {
        this.listCompany = [];
        this.messageService.add({ severity:'error', summary:'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest})
      }
    })
  }
  onOpenConfigDialog() {
    
    this.ref = this.dialogService.open(DialogsPricingComponent, {
      header:  'Xem thông tin gói',
      width: '60%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
      data: {
        servicePricingId: this.pakage_custom.Id
      }
    });
    this.ref.onClose.subscribe((data: DbFunction) => {
        
      if (data) {
          this.listFunction = data ; 
          this.ServicePricing.IsCustom = true;     
      }
  });
  }
  onPricingClick(event:any){
    
    if(event.value == this.pakage_custom.Id) {
      this.isCustom=true;
    }
    else 
      this.isCustom=false;
    if(!this.isCustom) {
      this.PricingCompanyItem = this.lstPricingCompany.filter((i: any) => i.Id == event.value)[0];
      this.listFunction = this.PricingCompanyItem?.listFunctions;
      this.ServicePricing.Name = this.PricingCompanyItem?.Name;
      this.ServicePricing.Code = this.PricingCompanyItem?.Code;
      this.ServicePricing.Id = this.PricingCompanyItem?.Id;
      this.ServicePricing.IsCustom = false;
    }    
  }
  getServicePricing() {
    this.filterParrams.query = `CompanyId=0`
    this.pricingService.getListServicePricingByPaging(this.filterParrams).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstPricingCompany = res.data;
        this.lstSPC = this.lstPricingCompany.map((item: any) => item.ServicePricingId)
        this.PricingCompany =  [...this.lstPricingCompany,  this.pakage_custom ];
      }
      else{
        this.PricingCompany = [];
      }
      
    })
  }
  getPricing(event: any) {
    this.selectedOption = this.PricingCompany.find((option: any) => option.ServicePricingId == event.value);
  }
  getListCountries() {
    this.commonService.getListCountrieByPaging(this.filterList).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstCountry = res.data;
      }
    })
  }
  getListProvinces() {
    this.commonService.getListProvinceByPaging(this.filterList).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstProvince = res.data;
      }
    })
  }
  onBack(event: Event) {

    let isShow = true;
    if (isShow == true) {
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: !(this.id > 0) ? 'Hủy thêm mới khách hàng' : 'Hủy cập nhật khách hàng: <b>"'+ this.listCompany?.Name +'"</b>' ,
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Xác nhận',
        rejectLabel: 'Hủy bỏ',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
        accept: () => {
          this.router.navigate(['/managerment/company/list']);
        },
        reject: () => {
            return;
        }
      });
    } else {
      this.router.navigate(['/managerment/company/list']);
    }
  }
  onCountry(event: any) {
    if(event.value == null){
      this.filterParrams.query = '1=1';
    }else{
      this.filterParrams.query = `CountryId=${event.value}`;
    }
    this.getListProvinces();
  }
  RemoveAttactment(item: ListAttactments){
    this.listAttactments = [...this.listAttactments.filter((s: any) => s.Name != item.Name)];
  }
  onFileSelected(event: any) {
    const file: File = event.target.files[0]; // Lấy file từ sự kiện event
    if (file) {
      const formData: FormData = new FormData();
      formData.append('file', file, file.name); // Gắn file vào FormData
  
      // Gửi yêu cầu POST tới API endpoint hỗ trợ việc upload file
      this.http.post('https://i-apigw.cnttvietnam.com.vn/api/upload/uploadMultifile', formData)
        .subscribe(
          (response: any) => {
            // Lấy đường dẫn đã upload từ phản hồi của server
            const uploadedFileName = response.data;
            

            for(let i = 0; i < uploadedFileName.length; i++) {
              const fileName = uploadedFileName[i];
              

              let itemFile = new ListAttactments();
              itemFile.Name = fileName;
              itemFile.Url = fileName;

              this.listAttactments.push(itemFile);
              
            }
            console.log('Upload thành công:', response);
          
          },
          (error) => {
            // Xử lý lỗi nếu có
            console.error('Lỗi upload:', error); 
          }
        );
    }
  }
  onImageSelected(event: any) {
    const file: File = event.target.files[0]; // Lấy file từ sự kiện event
    if (file) {
      const formData: FormData = new FormData();
      formData.append('image', file, file.name); // Gắn file vào FormData
  
      // Gửi yêu cầu POST tới API endpoint hỗ trợ việc upload file
      this.http.post('https://i-apigw.cnttvietnam.com.vn/api/upload/uploadImage', formData)
        .subscribe(
          (response: any) => {
            this.isImageSelected=true;
            // Lấy đường dẫn ảnh đã upload từ phản hồi của server
            const uploadedImageName = response.data;
            this.listCompany.Logo = uploadedImageName[0];
            this.imgName = uploadedImageName[0];
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
    this.uploadedImageUrl = '';
    this.data.Image = undefined;
    this.isImageSelected=false;
  }
}
