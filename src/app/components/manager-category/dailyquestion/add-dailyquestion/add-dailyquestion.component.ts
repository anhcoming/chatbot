import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProjectService } from 'src/app/services/project.service';
import { QuestiondailyService } from 'src/app/services/questiondaily.service';
import { TowerService } from 'src/app/services/tower.service';
import { ZoneService } from 'src/app/services/zone.service';
import { AppMessageResponse, AppStatusCode, StorageData } from 'src/app/shared/constants/app.constants';
import { StorageService } from 'src/app/shared/services/storage.service';
import { Paging } from 'src/app/viewModels/paging';
import { ListAttactments, ListProjectMaps, ListTowerMaps, ListZoneMaps } from 'src/app/viewModels/dailyquestion/dailyquestion';
import { NoteBook } from 'src/app/viewModels/notebook/notebook';
import { Project } from 'src/app/viewModels/project/project';
import { ResApi } from 'src/app/viewModels/res-api';
import { DbTower } from 'src/app/viewModels/tower/db-tower';

@Component({
  selector: 'app-add-dailyquestion',
  templateUrl: './add-dailyquestion.component.html',
  styleUrls: ['./add-dailyquestion.component.scss']
})
export class AddDailyquestionComponent {
  public fQuestion : any;
  id : any;
  public loading = [false];
  public allChecked : boolean = false;
  public allChecked2 : boolean = false;
  public filterParrams : Paging;
  Idc: any;
  public currentDate = new Date();
  dataQuestion : any;
  public listAttactments : Array<ListAttactments>;
  public Item : NoteBook;
  public lstProject : any[];
  public lstTower : any[];
  public lstZone: any[];
  public listTowerMaps : Array<ListTowerMaps>;
  public listZoneMaps : Array<ListZoneMaps>;
  public listProjectMaps : Array<ListProjectMaps>;
  public Editor = ClassicEditor;
  userId: any;
  Tower: any;


  constructor(
    private readonly http : HttpClient,
    private readonly storeService: StorageService,
    private readonly questionService : QuestiondailyService,
    private readonly projectService : ProjectService,
    private readonly towerService : TowerService,
    private readonly zoneService : ZoneService,
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private router: Router,
    private readonly messageService : MessageService,
  ){
    this.Item = new NoteBook();
    this.dataQuestion = {};
    this.listAttactments = new Array<ListAttactments>();
    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 100;
    this.lstProject = new Array<Project>();
    this.lstTower = new Array<DbTower>();
    this.lstZone = new Array<Zone>();
    this.listTowerMaps = new Array<ListTowerMaps>();
    this.listProjectMaps = new Array<ListProjectMaps>();
    this.listZoneMaps = new Array<ListZoneMaps>();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
    });
    this.getListProject();
    this.getListTower();
    this.getListZone();
    this.getCompanyId();
    this.getUserId();

      this.fQuestion =  this.fb.group({
        Id: [0],
        Status: [1],
        CompanyId: this.Idc,
        listProjectMaps :this.fb.array([], Validators.required),
        listTowerMaps : this.fb.array([], Validators.required),
        listZoneMaps: this.fb.array([], Validators.required),
        UpdatedById: this.userId,
        CreatedById: this.userId,
        CreatedBy: [''],
        UpdatedBy: [''],
        Contents: [''],
        Image: [''],
        Type: [6],
        Description: [''],
        Url : [''],
        Location: [0],
        CreatedAt: this.currentDate,
        UpdatedAt: this.currentDate,
        Title: ['',Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(500)])],
        CategoryParentId: [],
        IsHot: [true],
        ViewNumber: [0],
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
  

  onSubmit() {
    if(!this.fQuestion.get('Title').value) {
      this.messageService.add({severity: 'error', summary:'Error', detail: 'Tên câu hỏi không được để trống!'})
      return
    }
    if(this.fQuestion.get('Title').value.length < 6) {
      this.messageService.add({severity: 'error', summary:'Error', detail: 'Tên câu hỏi phải từ 6 ký tự trở lên!'})
      return
    } 
    if(this.fQuestion.get('Title').value.length > 500) {
      this.messageService.add({severity: 'error', summary:'Error', detail: 'Tên câu hỏi tối đa 500 ký tự!'})
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
    if(this.id == null) {
      
      const projectList = selectedProjects.map(projectId => ({ProjectId: projectId,CreatedById: this.userId,UpdatedById: this.userId, check : true }));
      const towerList = selectedTowers.map(towerId => ({TowerId: towerId,ProjectId : selectedProjects[0],CreatedById: this.userId,UpdatedById: this.userId,checked : true }));
      const zoneList = selectedZone.map(zoneId => ({ZoneId: zoneId,CreatedById: this.userId,UpdatedById: this.userId,checked : true }));
      this.fQuestion.controls['Id'].setValue(0);
      
      const reqData = Object.assign({}, this.fQuestion.value);
      reqData.listProjectMaps = projectList;
      reqData.listTowerMaps = towerList;
      reqData.listZoneMaps = zoneList;
      reqData.listAttactments = this.listAttactments;
      reqData.categoryMappings = this.Item.categoryMappings;
      this.loading[0] = true;
      this.questionService.createQuestion(reqData).subscribe(
        (res: any) => {
          this.loading[0] = false;
          if (res?.meta?.error_code == AppStatusCode.StatusCode200) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.CreatedSuccess });
            
            setTimeout(() => {this.onReturnPage('/manager-category/dailyquestion/list')}, 1000);
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
      const reqData = Object.assign({}, this.fQuestion.value);
      reqData.listAttactments = this.listAttactments;
      reqData.categoryMappings = this.Item.categoryMappings;
      reqData.listProjectMaps = projectList;
      reqData.listTowerMaps = towerList;
      reqData.listZoneMaps = zoneList;
      this.loading[0] = true;
      this.questionService.updateQuestion(this.id, reqData).subscribe(
        (res: any) => {
          this.loading[0] = false;
          if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: res.meta.error_message || AppMessageResponse.CreatedSuccess });

            setTimeout(() => {this.onReturnPage('/manager-category/dailyquestion/list')}, 1500);
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
  getCompanyId() {
    this.Idc = this.storeService.get(StorageData.companyId); 
  }
  onReturnPage(url: string) : void {
    this.router.navigate([url]);
  }
  getQuestionByID(id: number) {
    this.questionService.getQuestionById(id).subscribe((res: ResApi) => {
      console.log(res);
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.dataQuestion = res.data;
        this.listProjectMaps = res.data.listProjectMaps;
        this.listTowerMaps = res.data.listTowerMaps;
        this.listZoneMaps = res.data.listZoneMaps;
        this.listAttactments = res.data.listAttactments;
        console.log(this.listZoneMaps);
        
        this.formGroup();
        
        if (this.listProjectMaps) {
          this.lstProject.forEach(item => {
            const projectMap = this.listProjectMaps.find(p => p.ProjectId == item.Id);
            if (projectMap) {
              item.check = true;
              if(this.id == null){
              this.onSelectTower(item.Id);}else{
                this.onselectTowerByIdProject(item.Id);
              }
            }
          });
        }

        
        if(this.listTowerMaps){
          this.lstTower.every(item => {
            const towerMap = this.listTowerMaps.find(p => p.ProjectId == item.Id);
            if (towerMap) {
              item.checked = true;
            }
          })
        }
  
        if (this.listZoneMaps) {
          this.lstZone.forEach(item => {
            const zoneMap = this.listZoneMaps.find(z => z.ZoneId == item.Id);
            if (zoneMap) {
              item.checked = true;
            }
          });
        }
      }
      else {
        this.dataQuestion = [];
        this.dataQuestion.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
      
    }) 
    // this.dataNotebook={...this.dataNotebook}
  }
  formGroup(){
    this.fQuestion =  this.fb.group({
      Id: this.dataQuestion.Id,
      Status: this.dataQuestion.Status,
      CompanyId: this.dataQuestion.CompanyId,
      CreatedById: this.dataQuestion.CreatedById,
      UpdatedById: this.dataQuestion.UpdatedById,
      listProjectMaps: this.listProjectMaps,
      listTowerMaps : this.listTowerMaps,
      listZoneMaps : this.listZoneMaps,
      CreatedBy: this.dataQuestion.CreatedBy,
      UpdatedBy: this.dataQuestion.UpdatedBy,
      Contents: this.dataQuestion.Contents,
      Type: this.dataQuestion.Type,
      ViewNumber: this.dataQuestion.ViewNumber,
      Description: this.dataQuestion.Description,
      Url: this.dataQuestion.Url,
      Location: this.dataQuestion.Location,
      CreatedAt: this.dataQuestion.CreatedAt,
      UpdatedAt: this.currentDate,
      Title: this.dataQuestion.Title,
      CategoryParentId: this.dataQuestion.CategoryParentId,
      IsHot: this.dataQuestion.IsHot,
      MetaKeyword: this.dataQuestion.MetaKeyword,
      DateStartActive: this.dataQuestion.DateStartActive,
      MetaDescription: this.dataQuestion.MetaDescription,
      MetaTitle: this.dataQuestion.MetaTitle,
      categoryMappings: this.dataQuestion.categoryMappings,
      listAttactments: '',
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

  onselectTowerByIdProject(item: any) {
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
        if(this.dataQuestion.listTowerMaps){
          this.dataQuestion.listTowerMaps.map((items: any) => {
            this.lstTower.forEach((item) => {
              if (item.Id == items.TowerId) {
                item.checked = true;
              }
            });
          })
          this.allChecked = this.lstTower.every(item => item.checked);
        }
      }
    }
  }

  RemoveAttactment(item: ListAttactments){
    this.listAttactments = [...this.listAttactments.filter(s => s.Name != item.Name)];
  }

  getListProject() {
    this.lstProject = [];
    this.projectService.getListByPaging(this.filterParrams).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstProject = res.data;
        for(let i=0; i< this.lstProject.length; i++) {
          this.lstProject[i].check = false;
        }
        if(this.id){
          this.getQuestionByID(this.id);
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
    this.zoneService.getListZoneByPaging(this.filterParrams).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstZone = res.data;
        console.log(this.lstZone);
        
        for(let i=0; i<this.lstZone.length; i++){
          this.lstZone[i].checked = false;
        }
        if(this.dataQuestion.ListZoneMaps){
          this.dataQuestion.ListZoneMaps.map((items: any) => {
            this.lstZone.forEach((item) => {
              if (item.Id == items.ZoneId) {
                item.checked = true;
                this.allChecked2 = true;
              }
            });
          })
          this.allChecked = this.lstZone.every(item => item.checked);
          console.log(this.dataQuestion.ListZoneMaps);
        }
      }
      else {
        this.lstZone = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })
  }

  onBack(event: Event){
    let isShow = true;//this.layoutService.getIsShow();
  
    if (isShow) {
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: !(this.id > 0) ? "Chưa hoàn tất thêm mới câu hỏi,Bạn có muốn Hủy?" : "Chưa hoàn thành sửa câu hỏi,Bạn có muốn Hủy",
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Xác nhận',
        rejectLabel: 'Hủy bỏ',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
        accept: () => {
          this.router.navigate(['/manager-category/dailyquestion/list']);
        },
        reject: () => {
            return;
        }
      });
    } else {
      this.router.navigate(['/manager-category/dailyquestion/list']);
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
