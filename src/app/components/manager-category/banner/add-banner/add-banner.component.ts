import { Component, ElementRef, Renderer2 } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BannerService } from 'src/app/services/banner.service';
import { ProjectService } from 'src/app/services/project.service';
import { AppMessageResponse, AppStatusCode, StorageData } from 'src/app/shared/constants/app.constants';
import { Paging } from 'src/app/viewModels/paging';
import { Project } from 'src/app/viewModels/project/project';
import { ResApi } from 'src/app/viewModels/res-api';
import { HttpClient } from '@angular/common/http';
import { ImageService } from 'src/app/services/image.service';
import { docmainImage } from 'src/app/shared/constants/api.constants';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { StorageService } from 'src/app/shared/services/storage.service';
import { DbTower } from 'src/app/viewModels/tower/db-tower';
import { ListProjectMaps, ListTowerMaps, ListZoneMaps } from 'src/app/viewModels/banner/banner';
import { TowerService } from 'src/app/services/tower.service';
import { ZoneService } from 'src/app/services/zone.service';
import { Scale } from 'chart.js';


@Component({
  selector: 'app-add-banner',
  templateUrl: './add-banner.component.html',
  styleUrls: ['./add-banner.component.scss']
})
export class AddBannerComponent {
  public itemBanner !: any[];
  public isImageSelected: boolean = false; 
  isImageExpanded: boolean = false;
  expandedImageUrl: string = '';
  public docmainImage = docmainImage;
  public fBanner : any
  public fImage : any
  Id : any
  public filterProject : Paging;
  public filterParrams :Paging;
  public filterZone : Paging;
  public loading = [false]
  public dataBanner : any
  public lstProject:  any[];
  public lstTower : any[];
  public lstZone : any[];
  public listTowerMaps : Array<ListTowerMaps>;
  public listZoneMaps : Array<ListZoneMaps>;
  public listProjectMaps : Array<ListProjectMaps>;
  public allChecked: boolean = false;
  public allChecked2 : boolean = false;
  uploadedImageUrl: string = '';
  public nameFile = '';
  id: any;
  public currentDate = new Date();
  public Editor = ClassicEditor;
  userId: any;
  Idc: any;
  Tower: any;


  constructor(  
    private renderer: Renderer2, private el: ElementRef,
    private readonly imageservice : ImageService,
    private readonly bannerService : BannerService,
    private http: HttpClient,
    private readonly projectService : ProjectService,
    private readonly towerService : TowerService,
    private readonly zoneService : ZoneService,
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private messageService : MessageService,
    private readonly storeService : StorageService,
    private router: Router,
  ){
    this.dataBanner = {}
    this.lstProject = new Array<Project>();
    this.filterProject =  new Object as Paging;
    this.filterParrams = new Object as Paging;
    this.lstTower = new Array<DbTower>();
    this.lstZone = new Array<Zone>();
    this.listTowerMaps = new Array<ListTowerMaps>();
    this.listProjectMaps = new Array<ListProjectMaps>();
    this.listZoneMaps = new Array<ListZoneMaps>();
    this.lstProject = [];
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 100;
    this.filterZone = new Object as Paging;
    this.filterZone.page = 1;
    this.filterZone.page_size = 100;

  }
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
    });
  
    this.getListProject();
    this.getCompanyId();
    this.getListTower();
    this.getListZone();
    this.getUserId();
    if(this.id)
      this.getBannerByID(this.id)
  

    this.fBanner = this.fb.group({
      Id: [0],
      CreatedById : this.userId,
      listProjectMaps :this.fb.array([], Validators.required),
      listTowerMaps : this.fb.array([], Validators.required),
      listZoneMaps: this.fb.array([], Validators.required),
      UpdatedById : this.userId,
      CompanyId: this.Idc,
      Title : ['',Validators.required],
      Description: [''],
      CreatedBy: [''],
      Url : ['',Validators.required],
      DateStartActive: [''],
      UpdatedBy: [''],
      Contents: ['',Validators.required],
      Status: [0],
      CreatedAt: this.currentDate,
      UpdatedAt: this.currentDate,
      Image : [''],
    })
  }
  getUserId() {
    this.userId = this.storeService.get(StorageData.userId); 
  }
  getCompanyId() {
    this.Idc = this.storeService.get(StorageData.companyId); 
  }
  onSubmit() {
    if(!this.fBanner.get('Title').value) {
      this.messageService.add({severity: 'error', summary:'Error', detail: 'Tiêu đề quảng cáo không được để trống!'})
      return;
    }
    if(!this.fBanner.get('Url').value) {
      this.messageService.add({severity: 'error', summary:'Error', detail: 'Link quảng cáo không được để trống!'})
      return;
    }
    // if(!this.fBanner.get('Image').value) {
    //   this.messageService.add({severity: 'error', summary:'Error', detail: 'Ảnh đính kèm không được để trống!'})
    //   return
    // }
    const selectedProjects = this.lstProject.filter((project:any) => project.check).map(project => project.Id);
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
    if(this.id == null) {
      const projectList = selectedProjects.map(projectId => ({ProjectId: projectId,CreatedById: this.userId,UpdatedById: this.userId, check : true }));
      const towerList = selectedTowers.map(towerId => ({TowerId: towerId,ProjectId : selectedProjects[0],CreatedById: this.userId,UpdatedById: this.userId,checked : true }));
      const zoneList = selectedZone.map(zoneId => ({ZoneId: zoneId,CreatedById: this.userId,UpdatedById: this.userId,checked : true }));
      this.fBanner.controls['Id'].setValue(0);
      
      const reqData = Object.assign({}, this.fBanner.value);
      reqData.Image = this.dataBanner.Image;
      reqData.listProjectMaps = projectList;
      reqData.listTowerMaps = towerList;
      reqData.listZoneMaps = zoneList;
      console.log(reqData.Image)
      this.loading[0] = true;
      this.bannerService.createBanner(reqData).subscribe(
        (res: any) => {
          this.loading[0] = false;
          if (res?.meta?.error_code == AppStatusCode.StatusCode200) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.CreatedSuccess });
            
            setTimeout(() => {this.onReturnPage('/manager-category/banner/list')}, 1000);
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
      const projectList = selectedProjects.map(projectId => ({ProjectId: projectId,CreatedById: this.userId,UpdatedById: this.userId, check : true }));
      const towerList = selectedTowers.map(towerId => ({TowerId: towerId,ProjectId : selectedProjects[0],CreatedById: this.userId,UpdatedById: this.userId,checked : true }));
      const zoneList = selectedZone.map(zoneId => ({ZoneId: zoneId,CreatedById: this.userId,UpdatedById: this.userId,checked : true }));
      
      const reqData = Object.assign({}, this.fBanner.value);
      reqData.Image = this.dataBanner.Image;
      reqData.listProjectMaps = projectList;
      reqData.listTowerMaps = towerList;
      reqData.listZoneMaps = zoneList;
      this.uploadedImageUrl = `http://i-apigw.cnttvietnam.com.vn/uploads/images/${this.dataBanner.Image}`;
      this.loading[0] = true;
      this.bannerService.updateBanner(this.id, reqData).subscribe(
        (res: any) => {
          this.loading[0] = false;
          if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
            this.uploadedImageUrl = `http://i-apigw.cnttvietnam.com.vn/uploads/images/${this.dataBanner.Image}`;
            this.messageService.add({ severity: 'success', summary: 'Success', detail: res.meta.error_message || AppMessageResponse.CreatedSuccess });

            setTimeout(() => {this.onReturnPage('/manager-category/banner/list')}, 1500);
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
  getListProject() {
    this.lstProject = [];
    this.projectService.getListByPaging(this.filterProject).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstProject = res.data;
        for(let i=0; i< this.lstProject.length; i++) {
          this.lstProject[i].check = false;
        }
        if(this.id){
          this.getBannerByID(this.id);
        }
      }
      else {
        this.lstProject  = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })  
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

  onselectTowerByIdProject(item: any) {
    this.lstTower = [];
    for (let i=0;i<this.lstProject.length;i++)
    {
      if(this.lstProject[i].check)
      {
        let Id=this.lstProject[i].Id;
        this.lstTower.push(...this.Tower.filter((i: any) => i.ProjectId == Id))
        if(this.dataBanner.listTowerMaps){
          this.dataBanner.listTowerMaps.map((items: any) => {
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
  getListZone() {
    this.zoneService.getListZoneByPaging(this.filterZone).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstZone = res.data;
        console.log(this.lstZone);
        
        for(let i=0; i<this.lstZone.length; i++){
          this.lstZone[i].checked = false;
        }
        if(this.dataBanner.ListZoneMaps){
          this.dataBanner.ListZoneMaps.map((items: any) => {
            this.lstZone.forEach((item) => {
              if (item.Id == items.ZoneId) {
                item.checked = true;
                this.allChecked2 = true;
              }
            });
          })
          this.allChecked = this.lstZone.every(item => item.checked);
          console.log(this.dataBanner.ListZoneMaps);
        }
      }
      else {
        this.lstZone = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })
  }

  getBannerByID(id: number) {
    this.isImageSelected = true;
    this.bannerService.getBannerById(id).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.dataBanner = res.data;
        this.dataBanner.Image = res.data.Image;
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
       
        this.uploadedImageUrl = `http://i-apigw.cnttvietnam.com.vn/uploads/images/${this.dataBanner.Image}`;
        // console.log(this.dataBanner.Image)
      }
      else {
        this.dataBanner = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
      
    }) 
  }
  Imagenull(){
    this.uploadedImageUrl = '';
    this.dataBanner.Image = '';
    this.isImageSelected = false;
    this.isImageExpanded = false;
  }
  formGroup() {
    this.fBanner = this.fb.group({
      Id: this.dataBanner.Id,
      CreatedById : this.userId,
      ProjectId: this.dataBanner.ProjectId,
      UpdatedById : this.userId,
      Url : this.dataBanner.Url,
      DateStartActive: new Date(this.dataBanner.DateStartActive),
      CompanyId: this.Idc,
      Title : this.dataBanner.Title,
      Description: this.dataBanner.Description,
      Contents: this.dataBanner.Contents,
      CreatedAt: this.dataBanner.CreatedAt,
      UpdatedAt: this.currentDate.toLocaleTimeString(),
      Image : '',
    })

  }
  
  // onFileSelected(event: any) {
  //   if(event.target.files.length>0){
  //     const file = event.target.file[0];
  //     if(file.type == 'image/png' || file.type == 'image/jpeg'){
  //       const formData = new FormData();
  //       formData.append('file',file);
  //       this.http.post('https://i-apigw.cnttvietnam.com.vn/api/upload/uploadImage', formData).subscribe((res:any)=>{
  //       })
  //     } else {
  //       alert('Vui lòng chọn ảnh')
  //     }
  //   }
  // }
  // onFileSelected(event: any) {
  //   const file: File = event.target.files[0]; // Lấy file từ sự kiện event
  //   if (file) {
  //     const formData: FormData = new FormData();
  //     formData.append('image', file, file.type); // Gắn file vào FormData
  
  //     // Gửi yêu cầu POST tới API endpoint hỗ trợ việc upload file
  //     this.http.post('https://i-apigw.cnttvietnam.com.vn/api/upload/uploadImage', formData)
  //       .subscribe(
  //         (response) => {
  //           // Xử lý phản hồi từ server sau khi upload thành công
  //           console.log('Upload thành công:', response);
  //         },
  //         (error) => {
  //           // Xử lý lỗi nếu có
  //           console.error('Lỗi upload:', error);
  //         }
  //       );
  //   }
  // }
  onFileSelected(event: any) {
    const file: File = event.target.files[0]; // Lấy file từ sự kiện event
    if (file) {
      const formData: FormData = new FormData();
      formData.append('image', file, file.name); // Gắn file vào FormData
  
      // Gửi yêu cầu POST tới API endpoint hỗ trợ việc upload file
      this.http.post('https://i-apigw.cnttvietnam.com.vn/api/upload/uploadImage', formData)
        .subscribe(
          (response: any) => {
            this.isImageSelected = true;
            this.isImageExpanded = false;
            // Lấy đường dẫn ảnh đã upload từ phản hồi của server
            const uploadedImageName = response.data;
            this.nameFile = uploadedImageName[0];
            this.dataBanner.Image = uploadedImageName[0];
            console.log('Upload thành công:', response);
            this.uploadedImageUrl = `http://i-apigw.cnttvietnam.com.vn/uploads/images/${this.nameFile}`;
          },
          (error) => {
            // Xử lý lỗi nếu có
            console.error('Lỗi upload:', error); 
          }
        );
    }
  }

  zoomImage(): void {
    const imageElement = this.el.nativeElement.querySelector('.zoomable-image');
    if (imageElement) {
      this.renderer.addClass(document.body, 'image-zoomed');
      imageElement.addEventListener('click', () => {
        this.renderer.removeClass(document.body, 'image-zoomed');
      });
    }
  }


//   onFileSelected(event: any) {
//     const file: File = event.target.files[0]; // Lấy file từ sự kiện event
//     if (file) {
//       const reqData = Object.assign({}, this.fBanner.Image);
//       this.imageservice.uploadImage(reqData).subscribe(
//         (res: any) => {
//           this.loading[0] = false;
//           if (res?.meta?.error_code == AppStatusCode.StatusCode200) {
//            console.log('Thành công');
//           } 
//           else { 
//            console.log('Thất bại');
//           }
//     })
//   }
// }
  
        
  

  onReturnPage(url: string) : void {
    this.router.navigate([url]);
  }
  onBack(event: Event){
    let isShow = true;//this.layoutService.getIsShow();
  
    if (isShow) {
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: !(this.id > 0) ? "Chưa hoàn tất thêm mới quảng cáo,Bạn có muốn Hủy?" : "Chưa hoàn tất sửa quảng cáo,Bạn có muốn Hủy?",
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Xác nhận',
        rejectLabel: 'Hủy bỏ',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
        accept: () => {
          this.router.navigate(['/manager-category/banner/list']);
        },
        reject: () => {
            return;
        }
      });
    } else {
      this.router.navigate(['/manager-category/banner/list']);
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
