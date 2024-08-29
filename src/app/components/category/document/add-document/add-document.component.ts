import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApartmentService } from 'src/app/services/apartment.service';
import { DocumentService } from 'src/app/services/document.service';
import { ProjectService } from 'src/app/services/project.service';
import { TowerService } from 'src/app/services/tower.service';
import { AppMessageResponse, AppStatusCode, StorageData, TypeDocument } from 'src/app/shared/constants/app.constants';
import { StorageService } from 'src/app/shared/services/storage.service';
import { Document, ListAttactments } from 'src/app/viewModels/document/document';
import { Paging } from 'src/app/viewModels/paging';
import { ResApi } from 'src/app/viewModels/res-api';

@Component({
  selector: 'app-add-document',
  templateUrl: './add-document.component.html',
  styleUrls: ['./add-document.component.scss']
})
export class AddDocumentComponent {
  fDocument:any;
  public id : any;
  public Idc : any;
  public lstProject!: any[] ;
  public lstDocument!: any[];
  public lstTower!: any[];
  public lstApartment!: any[];
  public Item : Document;
  public filterProject: Paging;
  public filterTower: Paging;
  public filterApartment: Paging;
  public listAttactments :  Array<ListAttactments>;
  public loading = [false];
  isSubmmited : boolean = false;
  public currentTime = new Date();
  public filterParrams : Paging ;
  dataDocument : any
  userId: any;

  constructor(
    private http: HttpClient,
    private readonly projectService: ProjectService,
    private readonly documentService: DocumentService,
    private readonly storeService: StorageService,
    private readonly towerService: TowerService,
    private readonly apartmentService: ApartmentService,
    private readonly messageService: MessageService,
    private readonly route: ActivatedRoute,
    private readonly fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private router: Router,
  ){
    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 100;
    this.Item = new Document();
    this.filterProject = new Object as Paging;
    this.filterProject.page = 1;
    this.filterProject.page_size = 100;
    this.filterTower = new Object as Paging;
    this.filterTower.page = 1;
    this.filterTower.page_size = 100;
    this.filterApartment = new Object as Paging;
    this.filterApartment.page = 1;
    this.filterApartment.page_size = 100;
    this.dataDocument = {};
    this.listAttactments = new Array<ListAttactments>();

    
  }

  ngOnInit(): void {
    
    this.fDocument = new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]);

    // Đánh dấu FormControl là dirty và touched
    this.fDocument.markAsDirty();
    this.fDocument.markAsTouched();
    this.route.paramMap.subscribe(params => {
      this.id =  params.get('id');
    });
    console.log(this.id);
    this.setData()
    this.getListProjectName();
    this.getListTower();
    this.getCompanyId();
    this.getUserId();
    this.getListApartmentName();
    if(this.id){
      this.getLstDocumentByID(this.id)
    }
    this.fDocument = this.fb.group({
      ProjectId:  [''],
      TowerId: ['' ],
      Type: ['' , Validators.required],
      ApartmentId: [''],
      Status : [1],
      FloorId: [null],
      Name: ['' , Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(150)])],
      Id:  [0],
      CreatedAt : [this.currentTime],
      UpdatedAt: [this.currentTime],
      CreatedById: this.userId,
      CreatedBy: [''],
      UpdatedBy: [''],
      Location: [0],
      UpdatedById: this.userId,
      CompanyId: this.Idc,
      DateCreated: new Date (this.currentTime ),
      DateUpdated: new Date (this.currentTime ),
      Note: ['' ],
      Description:[''],
      listAttactments:[,Validators.required],
    });
    }
    getCompanyId() {
      this.Idc = this.storeService.get(StorageData.companyId); 
      console.log(this.Idc);
    }
    getUserId() {
      this.userId = this.storeService.get(StorageData.userId); 
    }
    setFormGroup() {
      this.fDocument = this.fb.group({
        Id : this.dataDocument.Id,
        Status : this.dataDocument.Status,
        CreatedAt: this.dataDocument.CreatedAt,
        UpdatedAt:this.dataDocument.UpdatedAt,
        ProjectId:  this.dataDocument.ProjectId,
        TowerId:  this.dataDocument.TowerId,
        FloorId: this.dataDocument.FloorId,
        Location : this.dataDocument.Location,
        Type: this.dataDocument.Type,
        ApartmentId: this.dataDocument.ApartmentId,
        Name: this.dataDocument.Name,
        DateCreated: this.dataDocument.DateCreated,
        DateUpdated: this.dataDocument.DateUpdated,
        Note: this.dataDocument.Note,
        CompanyId: this.dataDocument.CompanyId,
        CreatedBy: this.dataDocument.CreatedBy,
        UpdatedBy: this.dataDocument.UpdatedBy,
        CreatedById: this.dataDocument.CreatedById,
        UpdatedById: this.dataDocument.UpdatedById,
        Description:this.dataDocument.Description,
        listAttactments: '',
      })
    }
    
    getLstDocumentByID(id: number) {
      this.isSubmmited = true;
      this.documentService.getDocumentById(id).subscribe((res: ResApi) => {
        console.log(res);
        if(res.meta.error_code == AppStatusCode.StatusCode200) {
          this.dataDocument = res.data;
          this.listAttactments = res.data.listAttactments || [];
          console.log(res.data.listAttactments);
          this.setData();
          this.setFormGroup();
        }
        else {
          this.dataDocument = [];
          this.dataDocument.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
        }
        
      }) 
      // this.dataNotebook={...this.dataNotebook}
    }
    setData() {
      this.lstDocument = TypeDocument.map(item => ({ Name : item.label, Id: item.value }));
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
    markAllAsDirty() {
      Object.keys(this.fDocument.controls).forEach(key => {
        const control = this.fDocument.get(key);
        if (control.enabled && control.invalid) {
          control.markAsDirty();
        }
      });
    }
    onSubmit() {
      if(this.fDocument.invalid){
        this.markAllAsDirty()
      }else{
        if(this.id == null) {
          if (this.fDocument.controls['ProjectId'].value == null || typeof this.fDocument.controls['ProjectId'].value === 'undefined') {
            this.fDocument.controls['ProjectId'].setValue(0);
          }
          this.fDocument.controls['Id'].setValue(0);
          const reqData = Object.assign({}, this.fDocument.value);

          reqData.listAttactments = this.listAttactments; 
  
    
          this.loading[0] = true;
          this.documentService.createDocument(reqData).subscribe(
            (res: any) => {
              this.loading[0] = false;
              if (res?.meta?.error_code == AppStatusCode.StatusCode200) {
                this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.CreatedSuccess });
                
                setTimeout(() => {this.onReturnPage('/category/document/list')}, 1000);
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
          if (this.fDocument.controls['ProjectId'].value == null || typeof this.fDocument.controls['ProjectId'].value === 'undefined') {
            this.fDocument.controls['ProjectId'].setValue(0);
          }
          const reqData = Object.assign({}, this.fDocument.value);

          reqData.listAttactments =  this.listAttactments;
          this.loading[0] = true;
          this.documentService.updateDocument(this.id, reqData).subscribe(
            (res: any) => {
              this.loading[0] = false;
              if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
                this.messageService.add({ severity: 'success', summary: 'Success', detail: res.meta.error_message || AppMessageResponse.CreatedSuccess });
    
                setTimeout(() => {this.onReturnPage('/category/document/list')}, 1500);
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
    getListProjectName() {
      this.lstProject = [];
      this.projectService.getListByPaging(this.filterProject).subscribe((res: ResApi) => {
        if(res.meta.error_code == AppStatusCode.StatusCode200) {
          this.lstProject = res.data;
        }
        else {
          this.lstProject  = [];
          this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
        }
      })  
    }
    RemoveAttactment(item: ListAttactments){
      this.listAttactments = [...this.listAttactments.filter(s => s.Name != item.Name)];
      this.fDocument.get('listAttactments').setValue('');
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
      const selectedProjectId = this.fDocument.controls['ProjectId'].value;
     
      if (!selectedProjectId) {
        this.lstTower = [];
        this.lstApartment = [];
       
      }
      if(event.value == null) {
        this.filterTower.query = '1=1'
      }else{
        this.filterTower.query = `ProjectId=${event.value}`;
        this.getListTower();
      }  

    }
    onSelectApartment(event: any) {
      if(event.value == null) {
        this.fDocument.get('ProjectId').setValue(this.lstTower.filter((i: any) => i.Id == event.value)[0]?.ProjectId)
        const control = this.fDocument.get('ProjectId');
        if (control.enabled && control.invalid) {
          control.markAsDirty();
        }
        this.filterApartment.query = '1=1'
      }else{
        this.fDocument.get('ProjectId').setValue(this.lstTower.filter((i: any) => i.Id == event.value)[0]?.ProjectId)
        const control = this.fDocument.get('TowerId');
        if (control.enabled && control.invalid) {
          control.markAsDirty();
        }
        this.filterApartment.query = `TowerId=${event.value}`;
      }
      this.getListApartmentName()
    }
    getListApartmentName() {
      this.apartmentService.getListApartmentByPaging(this.filterApartment).subscribe((res: ResApi) => {
        if(res.meta.error_code == AppStatusCode.StatusCode200) {
          this.lstApartment = res.data;
        }
        else {
          this.lstApartment = [];
          this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
        }
      })  
    }

    onFilter(event: any) {
      this.fDocument.get('ProjectId').setValue(this.lstApartment.filter((i: any) => i.Id == event.value)[0]?.ProjectId)
      this.fDocument.get('TowerId').setValue(this.lstApartment.filter((i: any) => i.Id === event.value)[0]?.TowerId) 
      let items = [{ProjectId: this.fDocument.get('ProjectId').value, TowerId: this.fDocument.get('TowerId').value}];
      
      Object.keys(items[0]).forEach(key => {
        const control = this.fDocument.get(key);
        if (control.enabled && control.invalid) {
          control.markAsDirty();
        }
      });
    }

    onReturnPage(url: string) : void {
      this.router.navigate([url]);
    }
    onBack(event: Event) {
      let isShow = true;//this.layoutService.getIsShow();
  
      if (isShow) {
        this.confirmationService.confirm({
          target: event.target as EventTarget,
          message: !(this.id>0) ? "Chưa hoàn tất thêm mới tài liệu,Bạn có muốn Hủy?" : "Chưa hoàn tất sửa tài liệu này ,Bạn có muốn Hủy?",
          icon: 'pi pi-exclamation-triangle',
          acceptLabel: 'Xác nhận',
          rejectLabel: 'Hủy bỏ',
          acceptButtonStyleClass: 'p-button-success',
          rejectButtonStyleClass: 'p-button-danger',
          accept: () => {
            this.router.navigate(['/category/document/list']);
          },
          reject: () => {
              return;
          }
        });
      } else {
        this.router.navigate(['/category/document/list']);
      }
    }
}
