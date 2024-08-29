import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApartmentService } from 'src/app/services/apartment.service';
import { FloorService } from 'src/app/services/floor.service';
import { ProjectService } from 'src/app/services/project.service';
import { TowerService } from 'src/app/services/tower.service';
import { ZoneService } from 'src/app/services/zone.service';
import { AppStatusCode, AppMessageResponse, StorageData } from 'src/app/shared/constants/app.constants';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ListAttactments } from 'src/app/viewModels/apartment/apartment';
import { Paging } from 'src/app/viewModels/paging';
import { HttpClient } from '@angular/common/http';
import { ResApi } from 'src/app/viewModels/res-api';

@Component({
  selector: 'app-add-apartment',
  templateUrl: './add-apartment.component.html',
  styleUrls: ['./add-apartment.component.scss']
})
export class AddApartmentComponent {
  fApartment:any
  public id : any
  public Idc : any
  public listAttactments : any[] =[]
  public lstApartment: any
  public lstProject!: any[] 
  public lstStatus!: any[]
  public lstTower!: any[]
  public lstFloor!: any[]
  public lstZone!: any[]
  public loading = [false];
  public filterFloor: Paging ;
  public filterProject: Paging ;
  public filterTower: Paging ;
  public filterZone: Paging ;
  public filterParrams : Paging ;
  userId: any;

  constructor(
    private readonly apartmentService: ApartmentService,
    private readonly projectService: ProjectService,
    private readonly towerService: TowerService,
    private readonly floorService: FloorService,
    private readonly storeService: StorageService,
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService,
    private readonly route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private readonly fb: FormBuilder,
  ){
    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 100;

    this.filterTower = new Object as Paging;

    this.filterZone = new Object as Paging;
    
    this.filterFloor = new Object as Paging;

    this.filterProject = new Object as Paging;

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id =  params.get('id');
    });

    this.getCompanyId();
    this.getUserId();
    this.getListProject();
    this.getListTower();
    this.getListFloor();
    if(this.id)
      this.getApartmentbyId(this.Idc, this.id);

      this.fApartment = this.fb.group({
        ProjectId:  ['' , Validators.required],
        TowerId: ['' , Validators.required],
        ZoneId: ['' ],
        FloorId: ['' , Validators.required],
        Id:  [0],
        CreatedById: this.userId,
        UpdatedById: this.userId,
        CompanyId: this.Idc,
        Code: ['',Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(150)]) ],
        Name: ['' , Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(150)])],
        Note: ['' ],
        UsableArea:[''],
        Area: [''],
        NumberBedroom: [''],
        NumberBathroom: [''],
        NumberWindow: [''],
        NumberBalcony: [''],
        NumberFloor: [''],
        Direction: [''],
        Status:['' ,Validators.required],
        listAttactments: [''],
      });
  }
  getUserId() {
    this.userId = this.storeService.get(StorageData.userId); 
  }
  setFormGroup() {
    
    this.fApartment = this.fb.group({
      Id:  this.id,
      CreatedById: this.userId,
      UpdatedById: this.userId,
      CompanyId: this.Idc,
      Name: this.lstApartment.Name,
      ProjectId:  this.lstApartment.ProjectId,
      TowerId: this.lstApartment.TowerId,
      ZoneId: this.lstApartment.ZoneId,
      FloorId: this.lstApartment.FloorId,
      Code: this.lstApartment.Code,
      Note: this.lstApartment.Note,
      Area: this.lstApartment.Area,
      UsableArea: this.lstApartment.UsableArea,
      NumberBedroom: this.lstApartment.NumberBedroom,
      NumberBathroom: this.lstApartment.NumberBathroom,
      NumberWindow: this.lstApartment.NumberWindow,
      NumberBalcony: this.lstApartment.NumberBalcony,
      NumberFloor: this.lstApartment.NumberFloor,
      Direction: this.lstApartment.Direction,
      Status: this.lstApartment.Status,
      listAttactments: this.lstApartment.listAttactments,
    }); 
  }
  getApartmentbyId(idc: number, id: number) {
    
    if(this.id > 0) {
      this.apartmentService.getApartmentById(idc, id).subscribe((res: ResApi ) => {
        if(res.meta.error_code == AppStatusCode.StatusCode200) {
          this.lstApartment = res.data;
          this.setFormGroup();
        }else {
          this.lstApartment = [];
          this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
        }
      })
      this.lstApartment = {...this.lstApartment}
    }else{
      this.lstApartment = [];      
    }

  }
  onReturnPage(url: string) : void {
    this.router.navigate([url]);
  }
  markAllAsDirty() {
    Object.keys(this.fApartment.controls).forEach(key => {
      const control = this.fApartment.get(key);
      if (control.enabled && control.invalid) {
        control.markAsDirty();
      }
    });
  }
  onSubmit() {
    if(this.fApartment.invalid){
      this.markAllAsDirty()
    }else{
      if(this.id == null) {
        const reqData = Object.assign({}, this.fApartment.value);
        reqData.listAttactments = this.listAttactments; 
        this.loading[0] = true;
        this.apartmentService.createApartment(reqData).subscribe((res: ResApi) => {
          this.loading[0] = false;
          if(res.meta.error_code == AppStatusCode.StatusCode200) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.CreatedSuccess });

            setTimeout(() => {this.onReturnPage('/category/apartment/list')}, 1500);
          }
          else {
            
            this.loading[0] = false
            this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
          }
        },
        () => {
          this.loading[0] = false
          this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest }) },
        () => {this.loading[0] = false} 
        ) 
      }
      else{
        const reqData = Object.assign({}, this.fApartment.value);
        reqData.listAttactments = this.listAttactments; 
        this.loading[0] = true;
        this.apartmentService.updateApartment(this.id, reqData).subscribe((res: ResApi) => {
          this.loading[0] = false;
          if(res.meta.error_code == AppStatusCode.StatusCode200) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.CreatedSuccess });

            setTimeout(() => {this.onReturnPage('/category/apartment/list')}, 1500);
          }
          else {
            
            this.loading[0] = false
            this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
          }
        },
        () => {
          this.loading[0] = false
          this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest }) },
        () => {this.loading[0] = false} 
        )
      }
    }
  }
  getListProject() {
    this.lstProject = [];
    this.projectService.getListByPaging(this.filterProject).subscribe((res: ResApi) => {
      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstProject = res.data;
      }
      else {
        this.lstProject = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })
  }
  getListTower() {
    this.towerService.getListTowerByPaging(this.filterTower).subscribe((res: ResApi) => {
      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstTower = res.data;
      }
      else {
        this.lstTower = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })
  }
  onSelectTower(event: any) {
    if(event.value == null) {
      this.filterTower.query = '1=1'
    }else{
      this.filterTower.query = `ProjectId=${event.value}`;
    }
    this.getListTower();
  }

  getListFloor() {
    this.floorService.getListFloorByPaging(this.filterFloor).subscribe((res: ResApi) => {
      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstFloor = res.data;
      }
      else {
        this.lstFloor = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }

    })
  }
  onSelectFloor(event: any) {
    if(event.value == null) {
      this.fApartment.get('ProjectId').setValue(this.lstTower.filter((i: any) => i.Id == event.value)[0]?.ProjectId)
      const control = this.fApartment.get('ProjectId');
      if (control.enabled && control.invalid) {
        control.markAsDirty();
      }
      this.filterFloor.query = '1=1'
    }else{
      this.fApartment.get('ProjectId').setValue(this.lstTower.filter((i: any) => i.Id == event.value)[0]?.ProjectId)
      const control = this.fApartment.get('TowerId');
      if (control.enabled && control.invalid) {
        control.markAsDirty();
      }
      this.filterFloor.query = `TowerId=${event.value}`;
    }
    this.getListFloor()
  }
  onFilter(event: any) {
    this.fApartment.get('ProjectId').setValue(this.lstFloor.filter((i: any) => i.Id == event.value)[0]?.ProjectId)
    this.fApartment.get('TowerId').setValue(this.lstFloor.filter((i: any) => i.Id === event.value)[0]?.TowerId) 
    let items = [{ProjectId: this.fApartment.get('ProjectId').value, TowerId: this.fApartment.get('TowerId').value}];
    
    Object.keys(items[0]).forEach(key => {
      const control = this.fApartment.get(key);
      if (control.enabled && control.invalid) {
        control.markAsDirty();
      }
    });
  }
  getCompanyId() {
    this.Idc = this.storeService.get(StorageData.companyId); 
  }
  onBack(event: Event) {
    let isShow = true;

    if (isShow) {
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message:  !(this.id > 0) ? 'Bạn có muốn dừng thêm mới căn hộ!' : 'Bạn có muốn dừng cập nhật căn hộ!' ,
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Xác nhận',
        rejectLabel: 'Hủy bỏ',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
        accept: () => {
          this.router.navigate(['/category/apartment/list']);
        },
        reject: () => {
            return;
        }
      });
    } else {
      this.router.navigate(['/category/apartment/list']);
    }
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
}
