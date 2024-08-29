import { HttpClient } from '@angular/common/http';
import { Component, ElementRef } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NotificationService } from 'src/app/services/notification.service';
import { ProjectService } from 'src/app/services/project.service';
import { TowerService } from 'src/app/services/tower.service';
import { ZoneService } from 'src/app/services/zone.service';
import { AppMessageResponse, AppStatusCode, StorageData } from 'src/app/shared/constants/app.constants';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ListAttactments, ListProjectMaps, ListTowerMaps, ListZoneMaps, Notification } from 'src/app/viewModels/notification/notification';
import { Paging } from 'src/app/viewModels/paging';
import { Project } from 'src/app/viewModels/project/project';
import { ResApi } from 'src/app/viewModels/res-api';
import { DbTower } from 'src/app/viewModels/tower/db-tower';
import { Zone } from 'src/app/viewModels/zone/zone';

@Component({
  selector: 'app-add-notification',
  templateUrl: './add-notification.component.html',
  styleUrls: ['./add-notification.component.scss']
})
export class AddNotificationComponent {
  public Item : Notification;
  fileAttactment!: ElementRef;
  public filterProject : Paging;
  public currentDate = new Date();
  public fileName = '';
  public imgName = '';
  public Tower: any;
  public allChecked: boolean = false;
  public allChecked2: boolean = false;
  public fNotification : any;
  isImageSelected: boolean = false;
  uploadedImageUrl: string = '';
  uploadedFileUrl: string = '';
  public lstNoteBook : any[] = [];
  public lstProject!:  any[];
  public lstTower : any[];
  public lstZone : any[];
  public filterParrams : Paging;
  public isSelected : boolean = false;
  // public dataNotification: Array<NoteBook>
  public listAttactments:  Array<ListAttactments>; 
  public listZoneMaps : Array<ListZoneMaps>;
  public listProjectMaps : Array<ListProjectMaps>;
  public listTowerMaps : Array<ListTowerMaps>;
  public loading = [false];
  dataNotification : any;
  public id : any;
  public Editor = ClassicEditor;
  userId: any;
  Idc: any;

  constructor( 
    private http: HttpClient,
    private readonly messageService : MessageService,
    private readonly projectService : ProjectService,
    private readonly towerService : TowerService,
    private readonly notificationService : NotificationService,
    private readonly zoneService : ZoneService,
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private router: Router,
    private readonly storeService : StorageService,
    )
  {
    this.Item = new Notification();
    this.listAttactments = new Array<ListAttactments>();
    this.dataNotification = {};
    this.filterProject = new Object as Paging;
    this.listProjectMaps = new Array<ListProjectMaps>();
    this.listTowerMaps = new Array<ListTowerMaps>();
    this.listZoneMaps= new Array<ListZoneMaps>();
    this.lstProject = new Array<Project>();
    this.lstZone = new Array<Zone>();
    this.lstTower = new Array<DbTower>();
    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 100;
    // this.dataNotification = new Array<NoteBook>();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(param => {
      this.id = param.get('id');
    })
    this.getListProject();
    this.getListTower();
    this.getListZone();
    this.getCompanyId();
    this.getUserId();

    
    
    this.initForm();
  }
  initForm(){
    this.fNotification =  this.fb.group({
      Id: 0,
      Status: 1,
      CompanyId: this.Idc,
      listProjectMaps :this.fb.array([], Validators.required),
      listTowerMaps : this.fb.array([], Validators.required),
      listZoneMaps: this.fb.array([], Validators.required),
      CreatedById: this.userId,
      UpdatedById: this.userId,
      CreatedBy: [''],
      UpdatedBy: [''],
      Contents: [''],
      Image: [''],
      Type: 4,
      Description: [''],
      Url : [''],
      Location: 0,
      CreatedAt: this.currentDate,
      UpdatedAt: this.currentDate,
      Title: [''],
      CategoryParentId: null,
      IsHot: true,
      ViewNumber: null,
      MetaKeyword: [''],
      DateStartActive : this.currentDate,
      MetaDescription: [''],
      MetaTitle: [''],
      categoryMappings: [],
      listAttactments: []
    })  
  }
  getUserId() {
    this.userId = this.storeService.get(StorageData.userId); 
  }
  getCompanyId() {
    this.Idc = this.storeService.get(StorageData.companyId); 
  }
 
  getNotificationByID(id: number) {
    this.notificationService.getNotificationById(id).subscribe((res: ResApi) => {
      
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.isSelected = true;
        this.isImageSelected = true;
        this.dataNotification = res.data;
        this.dataNotification.Image = res.data.Image;
        this.listAttactments = res.data.listAttactments || [];
        this.Item.categoryMappings = res.data.categoryMappings || [];
        this.listProjectMaps = res.data.listProjectMaps;
        this.listTowerMaps = res.data.listTowerMaps;
        this.listZoneMaps = res.data.listZoneMaps;
        this.formGroup();
        if (this.listProjectMaps) {
          this.lstProject.forEach(item => {
            const projectMap = this.listProjectMaps.find(p => p.ProjectId == item.Id);
            if (projectMap) {
              item.check = true;
              if(!this.id){
              this.onSelectTower(item.Id);}else{
                this.onselectTowerByIdProject(item.Id);
              }
            }
          });
        }
  
        if (this.listZoneMaps) {
          this.lstZone.forEach(item => {
            const zoneMap = this.listZoneMaps.find(z => z.ZoneId == item.Id);
            if (zoneMap) {
              item.checked = true;
            } else {
              item.checked = false;
            }
          });
        }
        this.uploadedImageUrl = `http://i-apigw.cnttvietnam.com.vn/uploads/images/${this.dataNotification.Image}`;
      }
      else {
        this.dataNotification = [];
        this.dataNotification.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      } 
    }) 
    // this.dataNotification={...this.dataNotification}
  }

  onselectTowerByIdProject(item: any) {
    this.lstTower = [];
    for (let i=0;i<this.lstProject.length;i++)
    {
      if(this.lstProject[i].check)
      {
        let Id=this.lstProject[i].Id;
        this.lstTower.push(...this.Tower.filter((i: any) => i.ProjectId == Id))
        if(this.dataNotification.listTowerMaps){
          this.dataNotification.listTowerMaps.map((items: any) => {
            this.lstTower.forEach((item) => {
              if (item.Id == items.TowerId) {
                item.checked = true;
              }
            });
          })
        }
      }
    }
  }

  onSubmit() {
    if(!this.fNotification.get('Type').value) {
      this.messageService.add({severity: 'error', summary:'Error', detail: 'Loại bài viết không được để trống!'})
      return
    }
    // if(!(this.fNotification.get('listProjectMaps') as FormArray)) {
    //   this.messageService.add({severity: 'error', summary:'Error', detail: 'Khu đô thị không được để trống!'})
    //   return
    // }
    if(!this.fNotification.get('Title').value) {
      this.messageService.add({severity: 'error', summary:'Error', detail: 'Tiêu đề không được để trống!'})
      return
    }
    if(!this.fNotification.get('Contents').value) {
      this.messageService.add({severity: 'error', summary:'Error', detail: 'Nội dung không được để trống!'})
      return
    }
    const selectedProjects = this.lstProject.filter(project => project.check).map(project => project.Id);
    if (selectedProjects.length === 0) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Vui lòng chọn ít nhất một khu đô thị!' });
      return;
    }
    const selectedTowers = this.lstTower.filter(tower => tower.checked).map(tower => tower.Id);
    if (selectedTowers.length === 0) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Vui lòng chọn ít nhất một tòa nhà!' });
      return;
    }
    const selectedZone = this.lstZone.filter(zone => zone.checked).map(zone => zone.Id);
    if (selectedZone.length === 0) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Vui lòng chọn ít nhất một vị trí!' });
      return;
    }
    const projectList = selectedProjects.map(projectId => ({ProjectId: projectId,CreatedById: this.userId,UpdatedById: this.userId, check : true }));
    const towerList = selectedTowers.map(towerId => ({TowerId: towerId,ProjectId : selectedProjects[0],CreatedById: this.userId,UpdatedById: this.userId,checked : true }));
    const zoneList = selectedZone.map(zoneId => ({ZoneId: zoneId,CreatedById: this.userId,UpdatedById: this.userId,checked : true }));
      // this.fNotification.controls['Id'].setValue(0);
      const reqData = Object.assign({}, this.fNotification.value);
      reqData.Image = this.dataNotification.Image;
      reqData.listAttactments = this.listAttactments; 
      // reqData.categoryMappings = this.Item.categoryMappings;
      reqData.listProjectMaps = projectList;
      reqData.listTowerMaps = towerList;
      reqData.listZoneMaps = zoneList;
    if(this.id == null) {
      // if (this.fNotification.controls['ProjectId'].value == null || typeof this.fNotification.controls['ProjectId'].value === 'undefined') {
      //   this.fNotification.controls['ProjectId'].setValue(0);
      // }

      this.loading[0] = true;
      this.notificationService.createNotification(reqData).subscribe(
        (res: any) => {
          this.loading[0] = false;
          if (res?.meta?.error_code == AppStatusCode.StatusCode200) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.CreatedSuccess });
            
            setTimeout(() => {this.onReturnPage('/manager-category/notification/list')}, 1000);
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
      // if (this.fNotification.controls['ProjectId'].value == null || typeof this.fNotification.controls['ProjectId'].value === 'undefined') {
      //   this.fNotification.controls['ProjectId'].setValue(0);
      // }
      const selectedProjects = this.lstProject.filter(project => project.check).map(project => project.Id);
      const selectedTowers = this.lstTower.filter(tower => tower.checked).map(tower => tower.Id);
      const selectedZone = this.lstZone.filter(zone => zone.checked).map(zone => zone.Id);
      const projectList = selectedProjects.map(projectId => ({ProjectId: projectId,CreatedById: this.userId,UpdatedById: this.userId }));
      const towerList = selectedTowers.map(towerId => ({TowerId: towerId,CreatedById: this.userId,UpdatedById: this.userId }));
      const zoneList = selectedZone.map(zoneId => ({ZoneId: zoneId,CreatedById: this.userId,UpdatedById: this.userId }));
      const reqData = Object.assign({}, this.fNotification.value);
      reqData.Image = this.dataNotification.Image;
      this.uploadedImageUrl = `http://i-apigw.cnttvietnam.com.vn/uploads/images/${this.dataNotification.Image}`;
      reqData.listAttactments =  this.listAttactments;
      // reqData.categoryMappings = this.Item.categoryMappings;
      reqData.listProjectMaps = projectList;
      reqData.listTowerMaps = towerList;
      reqData.listZoneMaps = zoneList;
      this.loading[0] = true;
      this.notificationService.updateNotification(this.id, reqData).subscribe(
        (res: any) => {
          this.loading[0] = false;
          if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
            this.uploadedImageUrl = `http://i-apigw.cnttvietnam.com.vn/uploads/images/${this.dataNotification.Image}`;
            this.messageService.add({ severity: 'success', summary: 'Success', detail: res.meta.error_message || AppMessageResponse.CreatedSuccess });

            setTimeout(() => {this.onReturnPage('/manager-category/notification/list')}, 1500);
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
 
  onSelectTower(item: any) {
    this.lstTower = [];
    console.log(this.lstProject.some((item:any) => item.check === true));
    
    if(this.lstProject.some((item:any) => item.check === true))
    for (let i=0;i<this.lstProject.length;i++)
    {
      if(this.lstProject[i].check)
      {
        let Id=this.lstProject[i].Id;
        this.lstTower.push(...this.Tower.filter((i: any) => i.ProjectId == Id))
        console.log(this.lstTower)
        this.lstTower.forEach(item => {
          item.checked = true;
          this.allChecked = true;
        });
      }
    }
  }
  getListZone() {
    this.zoneService.getListZoneByPaging(this.filterParrams).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstZone = res.data;
        console.log(this.lstZone);
        
        for(let i=0; i<this.lstZone.length; i++){
          this.lstZone[i].checked = false;
        }
        if(this.dataNotification.ListZoneMaps){
          this.dataNotification.ListZoneMaps.map((items: any) => {
            this.lstZone.forEach((item) => {
              if (item.Id == items.ZoneId) {
                item.checked = true;
                this.allChecked2 = true;
              }
            });
          })
          this.allChecked = this.lstZone.every(item => item.checked);
          console.log(this.dataNotification.ListZoneMaps);
        }
      }
      else {
        this.lstZone = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })
  }

  getListTower() {
    this.towerService.getListTowerByPaging(this.filterParrams).subscribe((res: ResApi) => {
      if(res.meta.error_code = AppStatusCode.StatusCode200) {
        this.Tower = res.data;
      } else {
        this.Tower = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })
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
            this.isImageSelected = true;
            // Lấy đường dẫn ảnh đã upload từ phản hồi của server
            const uploadedImageName = response.data;
            this.dataNotification.Image = uploadedImageName[0];
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
  
  RemoveAttactment(item: ListAttactments){
    this.listAttactments = [...this.listAttactments.filter(s => s.Name != item.Name)];
  }
  Imagenull(){
    this.uploadedImageUrl = '';
    this.dataNotification.Image = undefined;
    this.isImageSelected = false;
  }
  onReturnPage(url: string): void{
    this.router.navigate([url]);
  }
  formGroup(){
    this.fNotification  = this.fb.group({
      Id: this.dataNotification.Id,
      Status: this.dataNotification.Status,
      CompanyId: this.dataNotification.CompanyId,
      CreatedById: this.dataNotification.CreatedById,
      UpdatedById: this.dataNotification.UpdatedById,
      CreatedBy: this.dataNotification.CreatedBy,
      UpdatedBy: this.dataNotification.UpdatedBy,
      listProjectMaps: this.listProjectMaps,
      listTowerMaps : this.listTowerMaps,
      listZoneMaps : this.listZoneMaps,
      Contents: this.dataNotification.Contents,
      Type: this.dataNotification.Type,
      ViewNumber: this.dataNotification.ViewNumber,
      Description: this.dataNotification.Description,
      Url: this.dataNotification.Url,
      Location: this.dataNotification.Location,
      CreatedAt: this.dataNotification.CreatedAt,
      UpdatedAt: this.currentDate,
      Title: this.dataNotification.Title,
      CategoryParentId: this.dataNotification.CategoryParentId,
      IsHot: this.dataNotification.IsHot,
      MetaKeyword: this.dataNotification.MetaKeyword,
      DateStartActive: this.dataNotification.DateStartActive,
      MetaDescription: this.dataNotification.MetaDescription,
      MetaTitle: this.dataNotification.MetaTitle,
      Image: '',
      listAttactments :'',
    })
  }

  
  getListProject() {
    this.lstProject = [];
    this.projectService.getListByPaging(this.filterProject).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstProject = res.data;
        for(let i=0; i< this.lstProject.length; i++) {
          this.lstProject[i].check = false;
        }
        if(this.id){
          this.getNotificationByID(this.id);
        }
        if(this.id){
          this.getListZone();
        }
      }
      else {
        this.lstProject  = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })  
  }
  onBack(event: Event){
    let isShow = true;//this.layoutService.getIsShow();
  
    if (isShow) {
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: !( this.id > 0) ? "Chưa hoàn tất thêm mới bài viết sổ tay cư dân,Bạn có muốn Hủy?" : "Chưa hoàn tất sửa bài viết sổ tay cư dân,Bạn có muốn Hủy?",
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Xác nhận',
        rejectLabel: 'Hủy bỏ',
        acceptButtonStyleClass: 'p-button-success',
        rejectButtonStyleClass: 'p-button-danger',
      
        accept: () => {
          this.router.navigate(['/manager-category/notification/list']);
        },
        reject: () => {
            return;
        }
      });
    } else {
      this.router.navigate(['/manager-category/notification/list']);
    }
  }
  checkAll() {
    this.allChecked = this.lstTower.every(item => item.checked);
  }
  toggleAll() {
    this.lstTower.forEach(item => item.checked = this.allChecked);
  }
  checkAll2() {
    this.allChecked2 = this.lstZone.every(item => item.checked);
  }
  toggleAll2() {
    this.lstZone.forEach(item => item.checked = this.allChecked2);
  }
}
