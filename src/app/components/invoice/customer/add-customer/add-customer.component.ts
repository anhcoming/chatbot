import { Component } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { AppMessageResponse, AppStatusCode, RelationshipOption, Role, StatusOption, Staying, StorageData } from 'src/app/shared/constants/app.constants';
import { StorageService } from 'src/app/shared/services/storage.service';
import { Apartment } from 'src/app/viewModels/apartment/apartment';
import { Paging } from 'src/app/viewModels/paging';
import { ResApi } from 'src/app/viewModels/res-api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DbApartment, ListAttactments } from 'src/app/viewModels/customer/customer';
import { ApartmentService } from 'src/app/services/apartment.service';
import { CustomerService } from 'src/app/services/customer.service';
import { HttpClient } from '@angular/common/http';
import { CommonService } from 'src/app/services/common.service';
import { DialogsCustomerComponent } from '../dialogs/dialogs-customer/dialogs-customer.component';


@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.scss']
})
export class AddCustomerComponent {
  fCustomer: any
  public id : any
  public listApartmentMaps: Array<DbApartment>;
  public lstCustomer : any;
  public lstCountry : any;
  public listAttactments : any[] = [];
  public lstApartment: Array<Apartment>;
  Idc : number | undefined;
  statusOptionName: string | undefined;
  stayingName: string | undefined;
  roleName: string | undefined;
  public filterParrams: Paging
  public loading = [false];
  public isLoadingTable: boolean = false;
  public statusOption = StatusOption;
  public staying = Staying;
  public role = Role;
  public relationshipOption = RelationshipOption;
  userId: any;
  
  constructor(
    private readonly apartmentService: ApartmentService,
    private readonly customerService: CustomerService,
    private readonly commonService: CommonService,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private readonly storeService: StorageService,
    private readonly route: ActivatedRoute,
    private readonly http: HttpClient,
    private router: Router,
    private readonly fb: FormBuilder,
    public dialogService: DialogService,
    private ref: DynamicDialogRef
  ){
    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 1000;
    this.lstCustomer = [];
    this.lstApartment = [];
    this.listApartmentMaps = [];
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id =  params.get('id');
    });
   
    if(this.id)
      this.getCustomerById(this.id);
    
    this.getCompanyId();
    this.getUserId();
    this.getCountry();
    // if(this.id)
    //   this.getFloorById(this.id);

      this.fCustomer = this.fb.group({
        Id:  [0],
        CreatedById: this.userId,
        UpdatedById: this.userId,
        CompanyId: this.Idc,
        BirthDay: [''],
        TypeCardId: [0],
        FullName: ['' , Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(150)])],
        Note: ['' ],
        Address: ['' ],
        Email: ['' ],
        AddressId: [''],
        DateId: ['' ],
        CardId: [''  , Validators.required],
        Phone: ['' , Validators.compose([Validators.required,  Validators.pattern('[0-9\s]*')])],
        CountryId: new FormControl(83),
        Sex:[0],
        Type: [0],
        
        listApartmentMaps: [],
      });
      
      
    }
    getUserId() {
      this.userId = this.storeService.get(StorageData.userId); 
    }

    markAllAsDirty() {
      Object.keys(this.fCustomer.controls).forEach(key => {
        const control = this.fCustomer.get(key);
        if (control.enabled && control.invalid) {
          control.markAsDirty();
        }
      });
    }
    onSubmit() {
      if(this.fCustomer.invalid){
        this.markAllAsDirty()
      }else{
        if(this.id == null) {
          const reqData = Object.assign({}, this.fCustomer.value);
          reqData.listApartmentMaps=this.listApartmentMaps;
          reqData.listAttactments = this.listAttactments;
          this.loading[0] = true;
          
          this.customerService.createCustomer(reqData).subscribe(
            (res: any) => {
              this.loading[0] = false;
              if (res?.meta?.error_code == AppStatusCode.StatusCode200) {
                this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.CreatedSuccess });
                
                setTimeout(() => {this.onReturnPage('/invoice/customer/list')}, 1000);
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
          );
        }else{
    
          const reqData = Object.assign({}, this.fCustomer.value);
          reqData.listApartmentMaps=this.listApartmentMaps;
          reqData.listAttactments = this.listAttactments;
          this.loading[0] = true;
    
          this.customerService.updateCustomer(this.id, reqData).subscribe(
            (res: any) => {
              this.loading[0] = false;
              if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
                this.messageService.add({ severity: 'success', summary: 'Success', detail: res.meta.error_message || AppMessageResponse.CreatedSuccess });
    
                setTimeout(() => {this.onReturnPage('/invoice/customer/list')}, 1500);
              } else {
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

    setFormGroup() {
      this.fCustomer = this.fb.group({
        Id:  this.id,
        CreatedById: this.userId,
        UpdatedById: this.userId,
        CompanyId: this.Idc,
        BirthDay: this.lstCustomer.Birthday ? new Date(this.lstCustomer.Birthday) : undefined,
        FullName: this.lstCustomer.FullName,
        Note: this.lstCustomer.Note,
        Address: this.lstCustomer.Address,
        Email: this.lstCustomer.Email,
        AddressId: this.lstCustomer.AddressId,
        DateId: this.lstCustomer.DateId ? new Date(this.lstCustomer.DateId) : undefined,
        CardId: this.lstCustomer.CardId,
        Phone: this.lstCustomer.Phone,
        CountryId: this.lstCustomer.CountryId,
        Sex: this.lstCustomer.Sex,
        Type: this.lstCustomer.Type,
        listAttactments: this.listAttactments,
      });
      
    }

  getCompanyId() {
    this.Idc = this.storeService.get(StorageData.companyId); 
  }
  getCustomerById(id: number) {
    this.customerService.getCustomer(id).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstCustomer = res.data;
        this.listAttactments = res.data.listAttactments;
        this.setFormGroup();
      }else{
        this.lstCustomer = [];
        this.messageService.add({severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest});
      }
    })
  }
  getListApartmentByPaging(){
    this.isLoadingTable = true;

    this.apartmentService.getListApartmentByPaging(this.filterParrams).subscribe((res:ResApi) => {
      this.isLoadingTable = false;

      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstApartment = res.data;
        this.lstApartment.forEach(apartment => {
          if (apartment.Status === 1) {
            apartment.StatusName = 'Đang sử dụng';
          }else {
            apartment.StatusName = 'Không sử dụng';
          }
        });
      }
      else {
        this.lstApartment = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    },
    () => {
      this.isLoadingTable =false;
      this.lstApartment = [];
      this.messageService.add({ severity: 'error', summary: 'Error', detail:  AppMessageResponse.BadRequest });
    })
  }
  onDelete(index: number) {
    this.listApartmentMaps.splice(index, 1);
    
    this.confirmationService.confirm({
      message: 'Bạn có muốn xóa căn hộ này không?',
      header: 'XÓA CĂN HỘ',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xác nhận',
      rejectLabel: 'Hủy bỏ',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
      accept: () => {
        if(index){
          this.listApartmentMaps.splice(index, 1);
              this.messageService.add({ severity: 'success', summary: 'Success', detail:  AppMessageResponse.CreatedSuccess });
        }  
        else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest });
          return;
        } 
      },
      reject: (type: any) => {
          return;
      }
    });
  }
  onBack(event: Event) {
    let isShow = true;

    if (isShow) {
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: !(this.id > 0) ? 'Hủy thêm mới khách hàng' : 'Hủy cập nhật thông tin khách hàng' ,
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Xác nhận',
        rejectLabel: 'Hủy bỏ',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
        accept: () => {
          this.router.navigate(['/invoice/customer/list']);
        },
        reject: () => {
            return;
        }
      });
    } else {
      this.router.navigate(['/invoice/customer/list']);
    }
  }
  RemoveAttactment(item: ListAttactments){
    this.listAttactments = [...this.listAttactments.filter(s => s.Name != item.Name)];
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
              console.log(this.listAttactments);
              
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
  getCountry() {
    this.commonService.getListCountrieByPaging(this.filterParrams).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstCountry = res.data;
      }
    })
  }
}

