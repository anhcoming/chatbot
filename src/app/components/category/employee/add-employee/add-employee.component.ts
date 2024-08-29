import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApartmentService } from 'src/app/services/apartment.service';
import { DepartmentService } from 'src/app/services/department.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { PositionService } from 'src/app/services/position.service';
import { AppMessageResponse, AppStatusCode, StorageData } from 'src/app/shared/constants/app.constants';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ListAttactments} from 'src/app/viewModels/employee/employee';
import { Paging } from 'src/app/viewModels/paging';
import { ResApi } from 'src/app/viewModels/res-api';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent {
  fEmployee:any;
  public id : any;
  public Idc : any;
  public ProjectId : any;
  public Project : any;
  public projectItem : any;
  public project : any;
  public Tower: any;
  public lstTower : any[] = [];
  public lstProject : any[] = [];
  public lstEmployee: any ;
  public lstApartment : any;
  public lstDepartment: any;
  public lstPosition!: any[];
  public listAttactments : Array<ListAttactments>;

  public loading = [false];
  public filterParrams : Paging ;
  public allChecked: boolean = false;
  userId: any;
  constructor(
    private readonly apartmentService: ApartmentService,
    private readonly employeeService: EmployeeService,
    private readonly storeService: StorageService,
    private readonly positionService: PositionService,
    private readonly departmentService: DepartmentService,
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService,
    private readonly route: ActivatedRoute,
    private router: Router,
    private readonly http : HttpClient,
    private readonly fb: FormBuilder,
  ){
    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 100;
    this.listAttactments = new Array<ListAttactments>();

    this.Project = {
      Id: '',
      Code: '',
      Name: ''
    }
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id =  params.get('id');
    });

    this.getDepartment();
    this.getPosition();
    this.getCompanyId()
    this.getUserId();
    if(this.id)
      this.getEmployeebyId(this.id);

      this.fEmployee = this.fb.group({
        CardId: ['',],
        AddressId: ['',],
        Id:  [0],
        CreatedById: this.userId,
        UpdatedById: this.userId,
        CompanyId: this.Idc,
        Code: ['' , Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(150)])],
        FullName: ['' , Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(150)])],
        Note: ['' ],
        IsAccount: false,
        DateId:[''],
        Birthday: [''],
        Phone: ['' ,Validators.compose([Validators.required,Validators.minLength(10),Validators.maxLength(12),Validators.pattern('^[0-9]{10,12}$')])],
        PositionId: [''],
        DepartmentId: [''],
        DateStartJob: [''],
        DateEndJob: [''],
        Address: [''],
        Email: [''],
        Sex : [''],
        listAttactments : [],
      });
  }
  getCompanyId() {
    this.Idc = this.storeService.get(StorageData.companyId);  
  }
  getUserId() {
    this.userId = this.storeService.get(StorageData.userId); 
  }
  setFormGroup() {
    
    this.fEmployee = this.fb.group({
      Id:  this.id,
      CreatedById: this.userId,
      UpdatedById: this.userId,
      CompanyId: this.Idc,
      FullName: this.lstEmployee.FullName,
      PositionId:  this.lstEmployee.PositionId,
      DepartmentId: this.lstEmployee.DepartmentId,
      DistrictId: this.lstEmployee.DistrictId,
      DateId: new Date(this.lstEmployee.DateId),
      CardId: this.lstEmployee.CardId,
      Code: this.lstEmployee.Code,
      IsAccount: this.lstEmployee.IsAccount,
      Note: this.lstEmployee.Note,
      DateStartJob: new Date(this.lstEmployee.DateStartJob),
      DateEndJob: new Date(this.lstEmployee.DateEndJob),
      Address: this.lstEmployee.Address,
      Email: this.lstEmployee.Email,
      listAttactments: '',
      AddressId: this.lstEmployee.AddressId,
      Birthday: new Date(this.lstEmployee.Birthday),
      Phone: this.lstEmployee.Phone,
      Sex: this.lstEmployee.Sex,
    }); 
  }

  getEmployeebyId(id: number) {
    if(this.id > 0) {
      this.employeeService.getEmployee(id).subscribe((res: ResApi ) => {
        if(res.meta.error_code == AppStatusCode.StatusCode200) {
          this.lstEmployee = res.data;
          this.listAttactments = res.data.listAttactments || [];
          this.setFormGroup();
        }else {
          this.lstEmployee = [];
          this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
        }
      })
      this.lstEmployee = {...this.lstEmployee}
    }else{
      this.lstEmployee = [];      
    }

  }
  getPosition() {
    this.positionService.getListPositionByPaging(this.filterParrams).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstPosition = res.data;
      }else {
        this.lstPosition = [];
      }
    })
  }

  getDepartment() {
    this.departmentService.getListDepartmentByPaging(this.filterParrams).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstDepartment = res.data;
      }
      else{
        this.lstDepartment = [];
      }
    })
  }

  markAllAsDirty() {
    Object.keys(this.fEmployee.controls).forEach(key => {
      const control = this.fEmployee.get(key);
      if (control.enabled && control.invalid) {
        control.markAsDirty();
      }
    });
  }
  onSubmit() {
    if(this.fEmployee.invalid){
      this.markAllAsDirty()
    }else{
      if(this.id == null) {
        const reqData = Object.assign({}, this.fEmployee.value);
        reqData.IsAccount = false,
        reqData.listAttactments = this.listAttactments; 
        this.loading[0] = true;
        
        this.employeeService.createEmployee(reqData).subscribe(
          (res: any) => {
            this.loading[0] = false;
            if (res?.meta?.error_code == AppStatusCode.StatusCode200) {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.CreatedSuccess });
              
              setTimeout(() => {this.onReturnPage('/category/employee/list')}, 1000);
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
        const reqData = Object.assign({}, this.fEmployee.value);
        reqData.IsAccount = this.lstEmployee.IsAccount,
        this.loading[0] = true;
        reqData.listAttactments = this.listAttactments; 
        this.employeeService.updateEmployee(this.id, reqData).subscribe(
          (res: any) => {
            this.loading[0] = false;
            if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: res.meta.error_message || AppMessageResponse.CreatedSuccess });

              setTimeout(() => {this.onReturnPage('/category/employee/list')}, 1000);
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
  // onSubmit() {
  //   if(this.fEmployee.invalid){
  //     this.markAllAsDirty();
  //     console.log(111);
      
  //   }else{
      
  //     if(this.id == null) {
  //       const reqData = Object.assign({}, this.fEmployee.value);
  //       reqData.listAttactments = this.listAttactments;
  //       reqData.IsAccount = false,
  //       this.loading[0] = true;
  //       this.employeeService.createEmployee(reqData).subscribe((res: ResApi) => {
  //         this.loading[0] = false;
  //         if(res.meta.error_code == AppStatusCode.StatusCode200) {
  //           this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.CreatedSuccess });

  //           setTimeout(() => {this.onReturnPage('/category/employee/list')}, 1500);
  //         }
  //         else {
            
  //           this.loading[0] = false
  //           this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
  //         }
  //       },
  //       () => {
  //         this.loading[0] = false
  //         this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest }) },
  //       () => {this.loading[0] = false} 
  //       ) 
  //     }
  //     else{
  //       const reqData = Object.assign({}, this.fEmployee.value);
  //       reqData.listAttactments = this.listAttactments;

  //       this.loading[0] = true;
  //       this.employeeService.updateEmployee(this.id, reqData).subscribe((res: ResApi) => {
  //         this.loading[0] = false;
  //         if(res.meta.error_code == AppStatusCode.StatusCode200) {
  //           this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.CreatedSuccess });

  //           setTimeout(() => {this.onReturnPage('/category/employee/list')}, 1500);
  //         }
  //         else {
            
  //           this.loading[0] = false
  //           this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
  //         }
  //       },
  //       () => {
  //         this.loading[0] = false
  //         this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest }) },
  //       () => {this.loading[0] = false} 
  //       )
  //     }
  //   }
  // }
  onReturnPage(url: string) : void {
    this.router.navigate([url]);
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

  RemoveAttactment(item: ListAttactments){
    this.listAttactments = [...this.listAttactments.filter(s => s.Name != item.Name)];
  }

  onBack(event: Event) {
    let isShow = true;

    if (isShow) {
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message:  !(this.id > 0) ? 'Hủy thêm mới nhân viên' : 'Hủy cập nhật nhân viên' ,
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Xác nhận',
        rejectLabel: 'Hủy bỏ',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
        accept: () => {
          this.router.navigate(['/category/employee/list']);
        },
        reject: () => {
            return;
        }
      });
    } else {
      this.router.navigate(['/category/employee/list']);
    }
  }
  onCheck() {
    this.Tower = this.lstTower.filter((i: any) => i.check === true).map((item: any) => ({RoleId:item.Id, RoleName: item.Name }))
  }
  checkAll() {
    this.allChecked = this.lstTower.every(item => item.checked);
  }
  toggleAll() {
    this.lstTower.forEach(item => item.checked = this.allChecked);
  }

}
