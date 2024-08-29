import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { HotlineService } from 'src/app/services/hotline.service';
import { ProjectService } from 'src/app/services/project.service';
import { TowerService } from 'src/app/services/tower.service';
import { ZoneService } from 'src/app/services/zone.service';
import { AppMessageResponse, AppStatusCode, StorageData } from 'src/app/shared/constants/app.constants';
import { StorageService } from 'src/app/shared/services/storage.service';
import { Hotline, ListProjectMaps, ListTowerMaps, ListZoneMaps } from 'src/app/viewModels/hotline/hotline';
import { Paging } from 'src/app/viewModels/paging';
import { Project } from 'src/app/viewModels/project/project';
import { ResApi } from 'src/app/viewModels/res-api';
import { DbTower } from 'src/app/viewModels/tower/db-tower';

@Component({
  selector: 'app-add-contacts',
  templateUrl: './add-contacts.component.html',
  styleUrls: ['./add-contacts.component.scss']
})
export class AddContactsComponent {
  public fContacts : any;
  public filterProject !: Paging; 
  public nameFile = '';
  public uploadedImageUrl : string = '';
  public text!: string;
  public itemContacts!: any[];
  public isLoadingTable : boolean = false;
  public filterParrams : Paging;
  public currentDate = new Date();
  public lstProject:  any[];
  public lstTower : any[];
  public lstZone : any[];
  public lstContact : Array<Hotline>
  public listTowerMaps : Array<ListTowerMaps>;
  public listZoneMaps : Array<ListZoneMaps>;
  public listProjectMaps : Array<ListProjectMaps>;
  public loading = [false];
  public allChecked: boolean = false;
  public allChecked2 : boolean = false;
  isImageSelected: boolean = false;
  public id : any
  dataContacts : any;
  userId: any;
  Tower : any;
  Idc: any;
  constructor( 
    private http: HttpClient,
    private readonly projectService : ProjectService,
    private readonly towerService : TowerService,
    private readonly zoneService : ZoneService,
    private readonly contactService : HotlineService,
    private readonly messageService : MessageService,
    private readonly fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private readonly route: ActivatedRoute,
    private router: Router,
    private readonly storeService : StorageService,
    )
  {
    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 100;
    this.dataContacts = {};
    this.filterProject =  new Object as Paging;
    this.lstContact = new Array<Hotline>();
    this.lstTower = new Array<DbTower>();
    this.lstZone = new Array<Zone>();
    this.listTowerMaps = new Array<ListTowerMaps>();
    this.listProjectMaps = new Array<ListProjectMaps>();
    this.listZoneMaps = new Array<ListZoneMaps>();
    this.lstProject = [];
    this.fContacts = this.fb.group({
      Id: [0],
      listProjectMaps :this.fb.array([], Validators.required),
      listTowerMaps : this.fb.array([], Validators.required),
      listZoneMaps: this.fb.array([], Validators.required),
      CreatedById : this.userId,
      UpdatedById : this.userId,
      Name : ['',Validators.compose([Validators.required,Validators.minLength(6),Validators.maxLength(150)])],
      Icon: [''],
      Phone : ['',Validators.compose([Validators.required,Validators.minLength(10),Validators.maxLength(12),Validators.pattern('^[0-9]{10,12}$')])],
      CreatedAt : this.currentDate,
      UpdatedAt: this.currentDate,
      // Note: [''],
      CompanyId: this.Idc,
      TowerId : null,
      Status: [1],
    })
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
    });

    this.getLstHotlineByPaging();
    this.getListProject();
    this.getListProject();
    this.getListTower();
    this.getListZone();
    this.getCompanyId();
    this.getUserId();
    if(this.id)
      this.getContactsByID(this.id)


    this.fContacts = this.fb.group({
      Id: [0],
      listProjectMaps :this.fb.array([], Validators.required),
      listTowerMaps : this.fb.array([], Validators.required),
      listZoneMaps: this.fb.array([], Validators.required),
      CreatedById : this.userId,
      UpdatedById : this.userId,
      CompanyId: this.Idc,
      Name : ['',Validators.compose([Validators.required,Validators.minLength(6),Validators.maxLength(150)])],
      Phone : ['',Validators.compose([Validators.required,Validators.minLength(10),Validators.maxLength(12),Validators.pattern('^[0-9]{10,12}$')])],
      TowerId : [''],
      // Note: [''],
      Status: [1],
      CreatedAt: this.currentDate,
      UpdatedAt: this.currentDate,
      Icon : [''],
    })
  }

  getUserId() {
    this.userId = this.storeService.get(StorageData.userId); 
  }
  getCompanyId() {
    this.Idc = this.storeService.get(StorageData.companyId); 
  }

  getContactsByID(id: number) {
    this.isImageSelected = true;
    this.contactService.getHotlineById(id).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.isImageSelected = true;
        this.dataContacts = res.data;
        this.dataContacts.Icon = res.data.Icon;
        this.listProjectMaps = res.data.listProjectMaps;
        this.listTowerMaps = res.data.listTowerMaps;
        this.listZoneMaps = res.data.listZoneMaps;
       
        this.formGroup();
       if (this.listProjectMaps) {
          this.lstProject.forEach((item:any) => {
            const projectMap = this.listProjectMaps.find(p => p.ProjectId == item.Id);
            if (projectMap) {
              item.check = true;
              if(!this.id){
              this.onSelectTower(item.Id);}
              else{
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
        
        this.uploadedImageUrl = `http://i-apigw.cnttvietnam.com.vn/uploads/images/${this.dataContacts.Icon}`;
        console.log(this.dataContacts.Icon);
      }
      else {
        this.dataContacts = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
      
    }) 
  }
  formGroup() {
    this.fContacts = this.fb.group({
      Id: this.dataContacts.Id,
      CreatedById : this.userId,
      listProjectMaps: this.listProjectMaps,
      listTowerMaps : this.listTowerMaps,
      listZoneMaps : this.listZoneMaps,
      UpdatedById : this.userId,
      Phone : this.dataContacts.Phone,
      Name : this.dataContacts.Name,
      // Note: this.dataContacts.Note,
      CreatedAt: this.dataContacts.CreatedAt,
      UpdatedAt: this.dataContacts.UpdatedAt,
      Icon: '',
      CreatedBy: this.dataContacts.CreatedBy,
      UpdatedBy: this.dataContacts.UpdatedBy,
      Status: [1],
      CompanyId: this.Idc,
    })
  }
  onSubmit() {
    if(!this.fContacts.get('Name').value) {
      this.messageService.add({severity: 'error', summary:'Error', detail: 'Tên hiển thị không được để trống!'});
      return
    }
    const phoneNumber = this.fContacts.get('Phone').value;
    const existingContact = this.lstContact.find(contact => contact.Phone === phoneNumber);
    // let phoneNumber = this.fContacts.get('Phone').value;
    // if (this.checkPhoneNumberExists(phoneNumber)==true) {
    //   this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Số điện thoại đã tồn tại!' });
    //   return;
    // }
    if(!this.fContacts.get('Phone').value) {
      this.messageService.add({severity: 'error', summary:'Error', detail: 'Số điện thoại không được để trống!'});
      return
    }
    // if(!this.fContacts.get('Icon').value) {
    //   this.messageService.add({severity: 'error', summary:'Error', detail: 'Ảnh đính kèm không được để trống!'});
    //   return
    // }
    const phoneControl = this.fContacts.get('Phone');
    const phoneValue = phoneControl.value;
    const phonePattern = /^[0-9]{10,12}$/;
    if (!phonePattern.test(phoneValue)) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Số điện thoại không hợp lệ!' });
      return;
    }
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
      if (existingContact) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Số điện thoại đã tồn tại!' });
        return;
      }
      const projectList = selectedProjects.map(projectId => ({ProjectId: projectId,CreatedById: this.userId,UpdatedById: this.userId, check : true }));
      const towerList = selectedTowers.map(towerId => ({TowerId: towerId,CreatedById: this.userId,UpdatedById: this.userId,checked : true }));
      const zoneList = selectedZone.map(zoneId => ({ZoneId: zoneId,CreatedById: this.userId,UpdatedById: this.userId,checked : true }));

      // this.fContacts.controls['Id'].setValue(0);
      
      const reqData = Object.assign({}, this.fContacts.value);
      reqData.Icon = this.dataContacts.Icon;
      reqData.listProjectMaps = projectList;
      reqData.listTowerMaps = towerList;
      reqData.listZoneMaps = zoneList;
      this.loading[0] = true;
      this.contactService.createHotline(reqData).subscribe(
        (res: any) => {
          this.loading[0] = false;
          if (res?.meta?.error_code == AppStatusCode.StatusCode200) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.CreatedSuccess });
            
            setTimeout(() => {this.onReturnPage('/manager-category/contacts/list')}, 1000);
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
      const towerList = selectedTowers.map(towerId => ({TowerId: towerId,CreatedById: this.userId,UpdatedById: this.userId,checked : true }));
      const zoneList = selectedZone.map(zoneId => ({ZoneId: zoneId,CreatedById: this.userId,UpdatedById: this.userId,checked : true }));
      const reqData = Object.assign({}, this.fContacts.value);
      reqData.Icon = this.dataContacts.Icon;
      reqData.listProjectMaps = projectList;
      reqData.listTowerMaps = towerList;
      reqData.listZoneMaps = zoneList;
      console.log(reqData.Icon)
      this.loading[0] = true;
      this.contactService.updateHotline(this.id, reqData).subscribe(
        (res: any) => {
          this.loading[0] = false;
          if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: res.meta.error_message || AppMessageResponse.CreatedSuccess });

            setTimeout(() => {this.onReturnPage('/manager-category/contacts/list')}, 1500);
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

  checkPhoneNumberExists(phoneNumber: string): boolean {
    const existingContact = this.lstContact.some(s => s.Phone === phoneNumber);
    return existingContact;
  }

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
            // Lấy đường dẫn ảnh đã upload từ phản hồi của server
            const uploadedImageName = response.data;
            this.nameFile = uploadedImageName[0];
            this.dataContacts.Icon = uploadedImageName[0]
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
  getLstHotlineByPaging() {
    this.isLoadingTable = true;

    this.contactService.getListHotlineByPaging(this.filterParrams).subscribe((res: ResApi) => {
      this.isLoadingTable = false;

      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstContact = res.data;
      }
      else {
        this.lstContact = new Array<Hotline>();
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    },
      () => {
        this.isLoadingTable = false;

        this.lstContact = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest });
      })
  }
  Imagenull(){
    this.uploadedImageUrl = '';
    this.dataContacts.Icon = '';
    this.isImageSelected = false;
  }
  onReturnPage(url: string) : void {
    this.router.navigate([url]);
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
          this.getContactsByID(this.id);
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
        if(this.dataContacts.listTowerMaps){
          this.dataContacts.listTowerMaps.map((items: any) => {
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
    this.zoneService.getListZoneByPaging(this.filterParrams).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstZone = res.data;
        console.log(this.lstZone);
        
        for(let i=0; i<this.lstZone.length; i++){
          this.lstZone[i].checked = false;
        }
        if(this.dataContacts.ListZoneMaps){
          this.dataContacts.ListZoneMaps.map((items: any) => {
            this.lstZone.forEach((item) => {
              if (item.Id == items.ZoneId) {
                item.checked = true;
                this.allChecked2 = true;
              }
            });
          })
          this.allChecked = this.lstZone.every(item => item.checked);
          console.log(this.dataContacts.ListZoneMaps);
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
        message: !(this.id > 0) ? "Chưa hoàn tất thêm mới danh bạ,Bạn có muốn Hủy?" : "Chưa hoàn tất sửa danh bạ,Bạn có muốn Hủy"  ,
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Xác nhận',
        rejectLabel: 'Hủy bỏ',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
        accept: () => {
          this.router.navigate(['/manager-category/contacts/list']);
        },
        reject: () => {
            return;
        }
      });
    } else {
      this.router.navigate(['/manager-category/contacts/list']);
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
