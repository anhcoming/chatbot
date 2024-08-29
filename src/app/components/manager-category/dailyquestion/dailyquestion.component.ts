import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ProjectService } from 'src/app/services/project.service';
import { QuestiondailyService } from 'src/app/services/questiondaily.service';
import { TowerService } from 'src/app/services/tower.service';
import { ZoneService } from 'src/app/services/zone.service';
import { AppMessageResponse, AppStatusCode, StorageData } from 'src/app/shared/constants/app.constants';
import { StorageService } from 'src/app/shared/services/storage.service';
import { DailyQuestion } from 'src/app/viewModels/dailyquestion/dailyquestion';
import { NoteBook } from 'src/app/viewModels/notebook/notebook';
import { Paging } from 'src/app/viewModels/paging';
import { ResApi } from 'src/app/viewModels/res-api';

@Component({
  selector: 'app-dailyquestion',
  templateUrl: './dailyquestion.component.html',
  styleUrls: ['./dailyquestion.component.scss']
})
export class DailyquestionComponent implements OnInit {
  public filterParrams: Paging;
  public filterText: string;
  fSearch : any;
  lstQuestion : any[]
  loading  = [false]
  public filterTower : Paging;
  public filterZone : Paging;
  isInputEmpty: boolean = true;
  isLoadingTable : boolean = false
  selectedQuestion : any;
  public lstProject : any;
  public lstTower : any;
  public lstZone : any;
  Idc: any;
  menuItems: MenuItem[] = [];

  constructor(
    private readonly projectService : ProjectService,
    private readonly towerService : TowerService,
    private readonly zoneService : ZoneService,
    private readonly confirmationService: ConfirmationService,
    private readonly dailyquestionService : QuestiondailyService,
    private readonly storeService : StorageService,
    private readonly router : Router,
    private readonly fb: FormBuilder,
    private datePipe : DatePipe,
    private readonly messageService: MessageService,
  ){
    this.lstQuestion = [];
    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 100;
    this.filterText = '';
    this.filterTower = new Object as Paging;
    this.filterTower.page = 1;
    this.filterTower.page_size = 100;
    this.filterZone = new Object as Paging;
    this.filterZone.page = 1;
    this.filterZone.page_size = 100;



    this.fSearch = this.fb.group({
      ProjectId : [''],
      TowerId : [''],
      ZoneId : [''],
      DateStart : [''],
      DateEnd : [''],

    })

    this.menuItems = [{
      label: 'Xóa mục đã chọn', 
      icon: 'pi pi-fw pi-trash',
      command: () => {
        this.onDeletes();
    }},
    {
      label: 'Làm mới', 
      icon: 'pi pi-fw pi-refesh',
      command: () => {
        this.btnReset();
    }},
  ];
  }
  ngOnInit() {
    this.getLstQuestionByPaging();
    this.getCompanyId();
    this.getListProject();
    this.getListTower();
    this.getListZone();
    // this.fetchMoreTower();
    // this.fetchMoreZone();
  }
  getCompanyId() {
    this.Idc = this.storeService.get(StorageData.companyId); 
  }

  getLstQuestionByPaging() {
    this.isLoadingTable = true;
    this.filterParrams.query = `Type=6`;
    this.dailyquestionService.getListQuestionByPaging(this.filterParrams).subscribe((res: ResApi) => {
      this.isLoadingTable = false;

      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstQuestion = res.data;
      }
      else {
        this.lstQuestion = new Array<DailyQuestion>();
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    },
      () => {
        this.isLoadingTable = false;

        this.lstQuestion = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest });
      })
  }

  btnReset() {
    this.router.navigateByUrl('/manager-category/dailyquestion/list').then(() => {
      window.location.reload();
    });
  }

  getLstQuestionSearch(){
    this.isLoadingTable = true;
    this.filterParrams.query = `Title.ToLower().Contains("${this.filterText}") AND Type=6`;
    this.dailyquestionService.getListQuestionByPaging(this.filterParrams).subscribe((res: ResApi) => {
      this.isLoadingTable = false;

      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstQuestion = res.data;
      }
      else {
        this.lstQuestion = new Array<DailyQuestion>();
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    },
      () => {
        this.isLoadingTable = false;

        this.lstQuestion = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest });
      })
  }

  onSelect() {
    if(this.fSearch.get('ProjectId')?.value){
      this.filterParrams.ProjectId = `${this.fSearch.get('ProjectId')?.value}`;
    }else{
      this.filterParrams.ProjectId = "";
    }
    if(this.fSearch.get('TowerId')?.value){
      this.filterParrams.TowerId = `${this.fSearch.get('TowerId')?.value}`
    }else{
      this.filterParrams.TowerId = ""
    }
    if(this.fSearch.get('ZoneId')?.value){
      this.filterParrams.ZoneId = `${this.fSearch.get('ZoneId')?.value}`
    }else{
      this.filterParrams.ZoneId = ""
    }
    if(this.fSearch.get('DateStart')?.value){
      const dateStart = this.fSearch.get('DateStart')?.value;
      const formattedDateStart = this.datePipe.transform(dateStart, 'yyyy/MM/dd');
      this.filterParrams.dateStart = `${formattedDateStart}`;
    }else{
      this.filterParrams.dateStart = ""
    }
    if(this.fSearch.get('DateEnd')?.value){
      const dateEnd = this.fSearch.get('DateEnd')?.value;
      const formattedDateEnd = this.datePipe.transform(dateEnd, 'yyyy/MM/dd');
      this.filterParrams.dateEnd = `${formattedDateEnd}`;
    }else{
      this.filterParrams.dateEnd = "";
    }
    this.getLstQuestionByPaging();
  }

  onSelectProject(event: any) {
    if(event.value == null) {
      this.filterTower.query = '1=1';
      this.getListTower();
    }else{
      this.filterTower.query = `ProjectId=${event.value}`;
      this.getListTower();
    }  
  }

  onFilter(event: any) {
    this.fSearch.get('ProjectId').setValue(this.lstTower.filter((i: any) => i.Id == event.value)[0]?.ProjectId)
  
    let items = [{ProjectId: this.fSearch.get('ProjectId').value}];
    
    Object.keys(items[0]).forEach(key => {
      const control = this.fSearch.get(key);
      if (control.enabled && control.invalid) {
        control.markAsDirty();
      }
    });
  }


  getListProject() {
    this.lstProject = [];
    let filterProject = new Object as Paging;
    filterProject.page=1;
    filterProject.page_size=50;
    this.projectService.getListByPaging(filterProject).subscribe((res: ResApi) => {
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
    this.lstTower = [];
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
  getListZone() {
    this.lstZone = [];
    this.towerService.getListTowerByPaging(this.filterZone).subscribe((res: ResApi) => {
      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstZone = res.data;
      }
      else {
        this.lstZone = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })
  }

  fetchMoreTower() {
    this.filterTower.page = this.filterTower.page + 1;
    
    this.towerService.getListTowerByPaging(this.filterTower).subscribe((res: ResApi) => {
      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstTower = [...this.lstTower.concat(res.data)];
        this.lstTower = [...this.lstTower];
      }
      else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })
  }
  fetchMoreZone() {
    
    this.filterZone.page = this.filterZone.page + 1;
    console.log(this.filterZone.page);
    
    this.zoneService.getListZoneByPaging(this.filterZone).subscribe((res: ResApi) => {
      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstZone = [...this.lstZone.concat(res.data)];
        this.lstZone = [...this.lstZone];
      }
      else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })
  }
  
  onSearch(){
   this.getLstQuestionSearch();
  }
  onDelete(item : NoteBook) {
  
    this.confirmationService.confirm({
      message: 'Bạn có muốn xóa câu hỏi ' +item.Title+ ' này không?',
      header: 'XÓA CÂU HỎI THƯỜNG GẶP',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xác nhận',
      rejectLabel: 'Hủy bỏ',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.dailyquestionService.deleteQuestionById(item.Id).subscribe(
          (res: any) => {
            this.loading[0] = false;
            if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
              this.lstQuestion = this.lstQuestion.filter(s => s.Id !== item.Id);
              this.messageService.add({ severity: 'success', summary: 'Success', detail: res.meta.error_message || AppMessageResponse.CreatedSuccess });
  
              
              //return;
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
  onClearInput() {
    this.filterText = '';
    this.isInputEmpty = true;
    this.filterParrams.query = `Title.ToLower().Contains("${this.filterText}")`;
    this.getLstQuestionByPaging();
  }
  onDeletes() {
    this.confirmationService.confirm({
      message: 'Bạn có muốn câu hỏi này không?',
      header: 'XÓA CÂU HỎI THƯỜNG GẶP',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if(!this.selectedQuestion) {
          this.messageService.add({severity: 'warn', summary: 'Warn', detail: 'Không có mục nào được chọn!'})
        }
        this.dailyquestionService.deletesListQuestion(this.Idc,this.selectedQuestion).subscribe(
          (res: any) => {
            this.loading[0] = false;
            if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
              this.selectedQuestion.map((item: any) => {
                this.lstQuestion = this.lstQuestion.filter((s: { Id: number; }) => s.Id !== item.Id);
              })
              this.messageService.add({ severity: 'success', summary: 'Success', detail: res.meta.error_message || AppMessageResponse.CreatedSuccess });              
              //return;
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
