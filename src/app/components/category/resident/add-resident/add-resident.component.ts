import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApartmentService } from 'src/app/services/apartment.service';
import { StatusOption, Staying, Role, RelationshipOption, AppStatusCode, AppMessageResponse, StorageData } from 'src/app/shared/constants/app.constants';
import { StorageService } from 'src/app/shared/services/storage.service';
import { Apartment } from 'src/app/viewModels/apartment/apartment';
import { Paging } from 'src/app/viewModels/paging';
import { ResApi } from 'src/app/viewModels/res-api';
import { DbApartment, ListAttactments } from 'src/app/viewModels/resident/resident';
import { AddApartmentResidentComponent } from '../dialogs/add-apartment-resident/add-apartment-resident.component';
import { ResidentService } from 'src/app/services/resident.service';
import { HttpClient } from '@angular/common/http';
import { CommonService } from 'src/app/services/common.service';


@Component({
  selector: 'app-add-resident',
  templateUrl: './add-resident.component.html',
  styleUrls: ['./add-resident.component.scss']
})
export class AddResidentComponent {
  fResident: any
  public id : any
  public ida : any
  public listApartmentMaps: Array<DbApartment>;
  public lstResident : any;
  public lstCountry : any;
  public listAttactments : any[] = [];
  public lstApartment: Array<Apartment>;
  Idc : number | undefined;
  public statusOptionName: string | undefined ;
  public stayingName: string | undefined ;
  public roleName: string | undefined ;
  public filterParrams: Paging
  public loading = [false];
  public isLoadingTable: boolean = false;
  public statusOption = StatusOption;
  public staying = Staying;
  public role = Role;
  public relationshipOption = RelationshipOption;
  userId: any;
  
  constructor(
    private readonly commonService: CommonService,
    private readonly http: HttpClient,
    private readonly residentService: ResidentService,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private readonly storeService: StorageService,
    private readonly route: ActivatedRoute,
    private router: Router,
    private readonly fb: FormBuilder,
    public dialogService: DialogService,
    private ref: DynamicDialogRef
  ){
    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 1000;
    this.lstResident = [];
    this.lstApartment = [];
    this.listApartmentMaps = [];
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id =  params.get('id');
    });

    if(this.id)
      this.getResidentById(this.id);
    
    this.getCompanyId();
    this.getUserId();
    this.getCountry();
    // if(this.id)
    //   this.getFloorById(this.id);

    this.fResident = this.fb.group({
      Id:  [0],
      CreatedById: this.userId,
      UpdatedById: this.userId,
      CompanyId: this.Idc,
      Status: [1],
      BirthDay: [''],
      TypeCardId: [0],
      FullName: ['' , Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(150)])],
      Note: ['' ],
      Address: ['' ],
      Email: ['' ],
      AddressId: ['' ],
      IsAccount: false,
      DateId: ['' ],
      DateRent: ['' ],
      CardId: ['' ],
      Phone: ['' , Validators.pattern('[0-9\s]*')],
      CountryId: new FormControl(83),
      Sex:[0],
      Type: [0],
      listApartmentMaps: [''],
      listAttactments: [''],
    });
      
      
    }

    onSubmit() {
      if(this.fResident.invalid) {
        this.markAllAsDirty();
      }
      else{
        const reqData = Object.assign({}, this.fResident.value);
        reqData.listApartmentMaps = this.listApartmentMaps;
        reqData.listAttactments = this.listAttactments;
        if(this.id == null) {
          reqData.IsAccount = false;
          this.loading[0] = true;
          
          this.residentService.createResident(reqData).subscribe(
            (res: any) => {
              this.loading[0] = false;
              if (res?.meta?.error_code == AppStatusCode.StatusCode200) {
                this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.CreatedSuccess });
                
                setTimeout(() => {this.onReturnPage('/category/resident/list')}, 1000);
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
          this.loading[0] = true;
    
          this.residentService.updateResident(this.id, reqData).subscribe(
            (res: any) => {
              this.loading[0] = false;
              if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
                this.messageService.add({ severity: 'success', summary: 'Success', detail: res.meta.error_message || AppMessageResponse.CreatedSuccess });
    
                setTimeout(() => {this.onReturnPage('/category/resident/list')}, 1500);
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

    getUserId() {
      this.userId = this.storeService.get(StorageData.userId); 
    }

    markAllAsDirty() {
      Object.keys(this.fResident.controls).forEach(key => {
        const control = this.fResident.get(key);
        if (control.enabled && control.invalid) {
          control.markAsDirty();
        }
      });
    }
    onOpenDialog(ida: string, id: number) {
      
      this.ref = this.dialogService.open(AddApartmentResidentComponent, {
        header: 'Cập nhật thông tin căn hộ của cư dân',
        width: '80%',
        height: '90%',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
        maximizable: true,
        data: {
          Id: id,
          Ida: ida
        }
      });
    
      this.ref.onClose.subscribe((data: DbApartment) => {
        if(!ida) {
          if (data) {
            
            this.listApartmentMaps =  [...this.listApartmentMaps, data];
            
            this.setData();
          }
        }else{
          if (data) {
            
            this.listApartmentMaps = this.listApartmentMaps.map((item: any) => {
              if (item.Id === ida) {
                return data;
              } else {
                return item;
              }
            });
            this.setData();
          }
        }
      });
    }
    onReturnPage(url: string) : void {
      this.router.navigate([url]);
    }
    setData() {
      this.listApartmentMaps.forEach((apartment: any) => {
        apartment.statusOptionName = this.statusOption.filter(item => item.value === apartment.Status)[0]?.label;
        apartment.stayingName = this.staying.filter(item => item.value === apartment.ResidentStatus)[0]?.label;
        apartment.roleName = this.role.filter(item => item.value === apartment.Type)[0]?.label;
      })
    }

    setFormGroup() {
      this.fResident = this.fb.group({
        Id:  this.id,
        CreatedById: this.userId,
        UpdatedById: this.userId,
        CompanyId: this.Idc,
        Status: [1],
        BirthDay: this.lstResident.Birthday ? new Date(this.lstResident.Birthday) : '',
        FullName: this.lstResident.FullName,
        Note: this.lstResident.Note,
        Address: this.lstResident.Address,
        Email: this.lstResident.Email,
        AddressId: this.lstResident.AddressId,
        DateId: this.lstResident.DateId ? new Date(this.lstResident.DateId) : '',
        DateRent: this.lstResident.DateRent ? new Date(this.lstResident.DateRent) : '',
        CardId: this.lstResident.CardId,
        Phone: this.lstResident.Phone,
        CountryId: this.lstResident.CountryId,
        Sex: this.lstResident.Sex,
        Type: this.lstResident.Type,
        IsAccount: this.lstResident.IsAccount,
        listAttactments: this.lstResident.listAttactments,
      });
      
    }

  getCompanyId() {
    this.Idc = this.storeService.get(StorageData.companyId); 
  }
  getResidentById(id: number) {
    this.residentService.getResident(id).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstResident = res.data;
        this.setFormGroup();
        this.listApartmentMaps = res.data.listApartmentMaps;
        this.listAttactments = res.data.listAttactments;
        this.setData()
      }else{
        this.lstResident = [];
        this.messageService.add({severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest});
      }
    })
  }
  onDelete(index: number) {
    this.confirmationService.confirm({
      message: 'Bạn có muốn xóa căn hộ này không?',
      header: 'XÓA CĂN HỘ',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xác nhận',
      rejectLabel: 'Hủy bỏ',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
      accept: () => {
          this.listApartmentMaps.splice(index, 1);
          let ApartmentMaps = [...this.listApartmentMaps];
          this.fResident.listApartmentMaps = ApartmentMaps   
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
        message: !(this.id > 0) ? 'Dừng thêm mới cư dân' : 'Dừng cập nhật cư dân: <b>"'+ this.lstResident?.FullName +'"</b>' ,
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Xác nhận',
        rejectLabel: 'Hủy bỏ',
        acceptButtonStyleClass: 'p-button-success',
        rejectButtonStyleClass: 'p-button-danger',
        accept: () => {
          this.router.navigate(['/category/resident/list']);
        },
        reject: () => {
            return;
        }
      });
    } else {
      this.router.navigate(['/category/resident/list']);
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
  onAccess(apartment: any) {
    this.confirmationService.confirm({
      message: 'Bạn có muốn phê duyệt tài khoản cư dân cho căn hộ <b>"'+ apartment.apartment?.Name +'"</b> không?',
      header: 'PHÊ DUYỆT TÀI KHOẢN CƯ DÂN',
      acceptLabel: 'Xác nhận',
      rejectLabel: 'Hủy bỏ',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
      accept: () => {
        console.log(apartment);
        
        this.residentService.AccessApartment(this.Idc, this.id, apartment.Id).subscribe(
          (res: any) => {
            this.loading[0] = false;
            if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: res.meta.error_message || AppMessageResponse.CreatedSuccess });
              setTimeout(() => {this.onReturnPage(`/category/resident/list`)}, 700);
            } else {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
              return;
            }
          }
        );

      },
      reject: (type: any) => {
        return;
      }
    });
  }
}

