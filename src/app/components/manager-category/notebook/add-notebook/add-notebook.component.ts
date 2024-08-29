import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NotebookService } from 'src/app/services/notebook';
import { ProjectService } from 'src/app/services/project.service';
import { AppMessageResponse, AppStatusCode, StorageData } from 'src/app/shared/constants/app.constants';
import { Paging } from 'src/app/viewModels/paging';
import { Project } from 'src/app/viewModels/project/project';
import { ResApi } from 'src/app/viewModels/res-api';
import { ListAttactments, ListProjectMaps, ListTowerMaps, ListZoneMaps, NoteBook } from 'src/app/viewModels/notebook/notebook';
import { TypeNews } from 'src/app/shared/constants/app.constants';
import { HttpClient, HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { DbTower } from 'src/app/viewModels/tower/db-tower';
import { TowerService } from 'src/app/services/tower.service';
import { Zone } from 'src/app/viewModels/zone/zone';
import { ZoneService } from 'src/app/services/zone.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { NotebookCategoryService } from 'src/app/services/notebook-category';
import { NoteBookCategory } from 'src/app/viewModels/notebook-category/notebook-category';


@Component({
  selector: 'app-add-notebook',
  templateUrl: './add-notebook.component.html',
  styleUrls: ['./add-notebook.component.scss']
})
export class AddNotebookComponent {
  public Item : NoteBook;
  @ViewChild('fileInput') fileInput: any;

  fileAttactment!: ElementRef;
  public filterProject : Paging;
  public currentDate = new Date();
  public fileName = '';
  public imgName = '';
  public Tower: any;
  public allChecked: boolean = false;
  public allChecked2 : boolean = false;
  isContentVisible: boolean = true;
  isContentVisible2: boolean = true;
  isImageSelected : boolean = false;
  public fNotebook : any;
  uploadedImageUrl: string = '';
  uploadedFileUrl: string = '';
  public lstNoteBook : any[] = [];
  public lstProject!:  any[];
  public lstTower : any[];
  public lstZone : any[];
  public filterParrams : Paging;
  public isSelected : boolean = false;
  // public dataNotebook: Array<NoteBook>
  public listAttactments:  Array<ListAttactments>;
  public loading = [false];
  public lstCategory : any[];
  public listTowerMaps : Array<ListTowerMaps>;
  public listZoneMaps : Array<ListZoneMaps>;
  public listProjectMaps : Array<ListProjectMaps>;
  dataNotebook : any;
  public id : any;
  public Editor = ClassicEditor;
  Idc: any;
  userId: any;
  Zone: any;

  constructor( 
    private http: HttpClient,
    private readonly messageService : MessageService,
    private readonly projectService : ProjectService,
    private readonly towerService : TowerService,
    private readonly zoneService : ZoneService,
    private readonly notebookService : NotebookService,
    private readonly categoryService : NotebookCategoryService,
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private router: Router,
    private readonly storeService : StorageService,
    private renderer: Renderer2,
    private el: ElementRef,

    )
  {
    this.Item = new NoteBook();
    this.listAttactments = new Array<ListAttactments>();
    this.dataNotebook = {};
    this.filterProject = new Object as Paging;
    this.lstProject = new Array<Project>();
    this.lstTower = new Array<DbTower>();
    this.lstZone = new Array<Zone>();
    this.listTowerMaps = new Array<ListTowerMaps>();
    this.listProjectMaps = new Array<ListProjectMaps>();
    this.listZoneMaps = new Array<ListZoneMaps>();
    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 100;

    this.lstCategory = new Array<NoteBookCategory>;
    // this.dataNotebook = new Array<NoteBook>();
    this.initForm();
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
    this.setData();
    this.getLstCategoryNotebookByPaging();
    this.onSelectCategory(event);
    this.initForm();
  }
  initForm(){
    this.fNotebook =  this.fb.group({
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
      Type: 1,
      Description: [''],
      Url : [''],
      Location: 0,
      CreatedAt: this.currentDate,
      UpdatedAt: this.currentDate,
      Title: [''],
      CategoryId : [0 ,Validators.required],
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
  setData() {
    this.lstNoteBook = TypeNews.map(item => ({ Name : item.label, Id: item.value }));
  }
  getCompanyId() {
    this.Idc = this.storeService.get(StorageData.companyId); 
  }
  getUserId() {
    this.userId = this.storeService.get(StorageData.userId); 
  }


  getListZone() {
    this.zoneService.getListZoneByPaging(this.filterParrams).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstZone = res.data;
        console.log(this.lstZone);
        
        for(let i=0; i<this.lstZone.length; i++){
          this.lstZone[i].checked = false;
        }
        if(this.dataNotebook.ListZoneMaps){
          this.dataNotebook.ListZoneMaps.map((items: any) => {
            this.lstZone.forEach((item) => {
              if (item.Id == items.ZoneId) {
                item.checked = true;
                this.allChecked2 = true;
              }
            });
          })
          this.allChecked = this.lstZone.every(item => item.checked);
          console.log(this.dataNotebook.ListZoneMaps);
        }
      }
      else {
        this.lstZone = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })
  }
  getNotebookByID(id: number) {
    this.isImageSelected = true;
    this.notebookService.getNotebookById(this.Idc,id,1).subscribe((res: ResApi) => {
      
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.isSelected = true;
        this.dataNotebook = res.data;
        this.dataNotebook.Image = res.data.Image;
        this.listAttactments = res.data.listAttactments || [];
        this.Item.categoryMappings = res.data.categoryMappings || [];
        this.listProjectMaps = res.data.listProjectMaps;
        this.listTowerMaps = res.data.listTowerMaps;
        this.listZoneMaps = res.data.listZoneMaps;

        // console.log(res.data.attactments);
        this.setData();
        this.formGroup();
        if (this.listProjectMaps) {
          this.lstProject.forEach(item => {
            const projectMap = this.listProjectMaps.find(p => p.ProjectId == item.Id);
            if (projectMap) {
              item.check = true;
              if(!this.id){
                this.onSelectTower(item.Id);
              } else {
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
        this.uploadedImageUrl = `http://i-apigw.cnttvietnam.com.vn/uploads/images/${this.dataNotebook.Image}`;
      }
      else {
        this.dataNotebook = [];
        this.dataNotebook.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      } 
    }) 
    // this.dataNotebook={...this.dataNotebook}
  }

  onselectTowerByIdProject(item: any) {
    this.lstTower = [];
    for (let i=0;i<this.lstProject.length;i++)
    {
      if(this.lstProject[i].check)
      {
        let Id=this.lstProject[i].Id;
        this.lstTower.push(...this.Tower.filter((i: any) => i.ProjectId == Id))
        if(this.dataNotebook.listTowerMaps){
          this.dataNotebook.listTowerMaps.map((items: any) => {
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
    if(!this.fNotebook.get('Type').value) {
      this.messageService.add({severity: 'error', summary:'Error', detail: 'Loại bài viết không được để trống!'})
      return
    }
    // if(!(this.fNotebook.get('listProjectMaps') as FormArray)) {
    //   this.messageService.add({severity: 'error', summary:'Error', detail: 'Khu đô thị không được để trống!'})
    //   return
    // }
    if(!this.fNotebook.get('Title').value) {
      this.messageService.add({severity: 'error', summary:'Error', detail: 'Tiêu đề không được để trống!'})
      return
    }
    if(!this.fNotebook.get('Contents').value) {
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
    if(!this.fNotebook.get('CategoryId').value){
      this.messageService.add({severity: 'error', summary:'Error', detail: 'Vui lòng chọn danh mục !'});
      return;
    }
    if(this.id == null) {
      // if (this.fNotebook.controls['ProjectId'].value == null || typeof this.fNotebook.controls['ProjectId'].value === 'undefined') {
      //   this.fNotebook.controls['ProjectId'].setValue(0);
      // }
      const projectList = selectedProjects.map(projectId => ({ProjectId: projectId,CreatedById: this.userId,UpdatedById: this.userId, check : true }));
      const towerList = selectedTowers.map(towerId => ({TowerId: towerId,ProjectId : selectedProjects[0],CreatedById: this.userId,UpdatedById: this.userId,checked : true }));
      const zoneList = selectedZone.map(zoneId => ({ZoneId: zoneId,CreatedById: this.userId,UpdatedById: this.userId,checked : true }));
        // this.fNotebook.controls['Id'].setValue(0);
        const reqData = Object.assign({}, this.fNotebook.value);
        reqData.Image = this.dataNotebook.Image;
        reqData.listAttactments = this.listAttactments; 
        // for(let i=0;i<reqData.categoryMappings.length;i++){
        //   reqData.categoryMappings[i] = this.dataNotebook.categoryMappings[i].filter((item:any) => {
        //     if(this.dataNotebook.categoryMappings[i].Selected == true){
        //       this.dataNotebook.categoryMappings.push(...this.dataNotebook.categoryMappings[i]);
        //     }
        //   });
        // } 
        reqData.listProjectMaps = projectList;
        reqData.listTowerMaps = towerList;
        reqData.listZoneMaps = zoneList;
        this.loading[0] = true;
        this.notebookService.createNotebook(reqData).subscribe(
        (res: any) => {
          this.loading[0] = false;
          if (res?.meta?.error_code == AppStatusCode.StatusCode200) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.CreatedSuccess });
            
            setTimeout(() => {this.onReturnPage('/manager-category/notebook/list')}, 1000);
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
      // if (this.fNotebook.controls['ProjectId'].value == null || typeof this.fNotebook.controls['ProjectId'].value === 'undefined') {
      //   this.fNotebook.controls['ProjectId'].setValue(0);
      // }
      const selectedProjects = this.lstProject.filter(project => project.check).map(project => project.Id);
      const selectedTowers = this.lstTower.filter(tower => tower.checked).map(tower => tower.Id);
      const selectedZone = this.lstZone.filter(zone => zone.checked).map(zone => zone.Id);
      const projectList = selectedProjects.map(projectId => ({ProjectId: projectId,CreatedById: this.userId,UpdatedById: this.userId }));
      const towerList = selectedTowers.map(towerId => ({TowerId: towerId,CreatedById: this.userId,UpdatedById: this.userId }));
      const zoneList = selectedZone.map(zoneId => ({ZoneId: zoneId,CreatedById: this.userId,UpdatedById: this.userId }));
      const reqData = Object.assign({}, this.fNotebook.value);
      reqData.Image = this.dataNotebook.Image;
      this.uploadedImageUrl = `http://i-apigw.cnttvietnam.com.vn/uploads/images/${this.dataNotebook.Image}`;
      reqData.listAttactments =  this.listAttactments;
      // for(let i=0;i<reqData.categoryMappings.length;i++){
      //   reqData.categoryMappings[i] = this.dataNotebook.categoryMappings[i].filter((item:any) => {
      //     if(this.dataNotebook.categoryMappings[i].Selected == true){
      //       this.dataNotebook.categoryMappings.push(...this.dataNotebook.categoryMappings[i]);
      //     }
      //   });
      // } 
      reqData.listProjectMaps = projectList;
      reqData.listTowerMaps = towerList;
      reqData.listZoneMaps = zoneList;
      this.loading[0] = true;
      this.notebookService.updateNotebook(this.id, reqData).subscribe(
        (res: any) => {
          this.loading[0] = false;
          if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
            this.uploadedImageUrl = `http://i-apigw.cnttvietnam.com.vn/uploads/images/${this.dataNotebook.Image}`;
            this.messageService.add({ severity: 'success', summary: 'Success', detail: res.meta.error_message || AppMessageResponse.CreatedSuccess });

            setTimeout(() => {this.onReturnPage('/manager-category/notebook/list')}, 1500);
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

  onShowGallery() {
   
   
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

  // resetFileInput() {
  //   const fileInput = this.el.nativeElement.querySelector('#fileInput');
  //   const parent = fileInput.parentNode;
  //   const newFileInput = document.createElement('input');
  //   newFileInput.type = 'file';
  //   newFileInput.accept = 'image/*';
  //   newFileInput.classList.add('form-control', 'no-bor');
  //   newFileInput.addEventListener('change', (event) => {
  //     this.onImageSelected(event);
  //   });
  //   parent.replaceChild(newFileInput, fileInput);
  // }

  
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
            this.dataNotebook.Image = uploadedImageName[0];
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
    this.dataNotebook.Image = undefined;
    this.isImageSelected = false;
  }
  onReturnPage(url: string): void{
    this.router.navigate([url]);
  }
  formGroup(){
    this.fNotebook  = this.fb.group({
      Id: this.dataNotebook.Id,
      Status: this.dataNotebook.Status,
      CompanyId: this.dataNotebook.CompanyId,
      CreatedById: this.dataNotebook.CreatedById,
      UpdatedById: this.dataNotebook.UpdatedById,
      CreatedBy: this.dataNotebook.CreatedBy,
      UpdatedBy: this.dataNotebook.UpdatedBy,
      listProjectMaps: this.listProjectMaps,
      listTowerMaps : this.listTowerMaps,
      listZoneMaps : this.listZoneMaps,
      Contents: this.dataNotebook.Contents,
      Type: this.dataNotebook.Type,
      ViewNumber: this.dataNotebook.ViewNumber,
      Description: this.dataNotebook.Description,
      TypeN : this.dataNotebook.Type,
      Url: this.dataNotebook.Url,
      Location: this.dataNotebook.Location,
      CreatedAt: this.dataNotebook.CreatedAt,
      UpdatedAt: this.currentDate,
      Title: this.dataNotebook.Title,
      CategoryId : this.dataNotebook.CategoryId,
      IsHot: this.dataNotebook.IsHot,
      MetaKeyword: this.dataNotebook.MetaKeyword,
      DateStartActive: this.dataNotebook.DateStartActive,
      MetaDescription: this.dataNotebook.MetaDescription,
      MetaTitle: this.dataNotebook.MetaTitle,
      Image: '',
      listAttactments : '',
    })
  }
  
 

  getLstCategoryNotebookByPaging() {
    this.categoryService.getListNotebookCategoryByPaging(this.filterParrams).subscribe((res: ResApi) => {
   
      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstCategory = res.data;
      }
      else {
        this.lstCategory = new Array<NoteBookCategory>();
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })
  }
  onSelectCategory(event:any){
    console.log(event?.value);

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
          this.getNotebookByID(this.id);
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
          this.router.navigate(['/manager-category/notebook/list']);
        },
        reject: () => {
            return;
        }
      });
    } else {
      this.router.navigate(['/manager-category/notebook/list']);
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
