import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PositionService } from 'src/app/services/position.service';
import { AppMessageResponse, AppStatusCode } from 'src/app/shared/constants/app.constants';
import { Paging } from 'src/app/viewModels/paging';
import { DbPosition } from 'src/app/viewModels/position/position';
import { Project } from 'src/app/viewModels/project/project';
import { ResApi } from 'src/app/viewModels/res-api';
import { ProjectService } from 'src/app/services/project.service';
import { Checkbox } from 'primeng/checkbox';

@Component({
  selector: 'app-position',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.scss']
})
export class PositionComponent implements OnInit {
  public filterParrams: Paging;
  public first = 0;
  public rows = 10;
  public lstPosition: Array<DbPosition>;
  public lstProject: Array<Project>;
  public filterProject: Paging;
  public filterText: string;
  public isLoadingTable: boolean = false;
  public loading = [false];
  public fPosition : FormGroup;
  search: string = '';
  isInputEmpty: boolean = true;

  constructor(
    private readonly positionService: PositionService,
    private readonly messageService: MessageService,
    private readonly projectService: ProjectService,

    private readonly confirmationService: ConfirmationService,
    private readonly fb: FormBuilder
  ) {
    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 1000;
    this.lstPosition = new Array<DbPosition>();
    this.filterText = '';
    this.filterProject = new Object as Paging;
    this.lstProject = new Array<Project>();
    this.fPosition = this.fb.group({
      ProjectId: ['']
    })

  }
  ngOnInit() {
    this.getLstPositionByPaging();
    this.getListProject();
  }
  getLstPositionByPaging() {
    this.isLoadingTable = true;

    this.positionService.getListPositionByPaging(this.filterParrams).subscribe((res: ResApi) => {
      this.isLoadingTable = false;

      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstPosition = res.data;
      }
      else {
        this.lstPosition = new Array<DbPosition>();
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    },
    () => {
      this.isLoadingTable = false;
  
      this.lstPosition = [];
      this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest });
    })
  }
  onSelect(event: any) {
    if(event.value > 0) {
      this.filterParrams.query = `ProjectId=${event.value}`
    }else{
      this.filterParrams.query = `1=1`;
    }
    this.getLstPositionByPaging();
  }

  deletePosition(id: number, index: number) {
  
    this.confirmationService.confirm({
      message: 'Bạn có muốn xóa chức vụ này không?',
      header: 'XÓA CHỨC VỤ',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xác nhận',
      rejectLabel: 'Hủy bỏ',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.positionService.deletePositionById(id).subscribe(
          (res: any) => {
            this.loading[0] = false;
            if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
              this.lstPosition = this.lstPosition.filter((id, i) => i !== index);
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
  getListProject() {
    this.lstProject = [];
    this.projectService.getListByPaging(this.filterProject).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstProject = res.data;
      }
      else {
        this.lstProject = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })  
  }

  onSearch(event:any){
    // this.filterParrams.query = event.target.value.toLowerCase().trim();
    const searchValue = event.target.value.toLowerCase().trim();
    this.filterParrams.query = `Name.ToLower().Contains("${searchValue}") OR Code.ToLower().Contains("${searchValue}")`;

    this.getLstPositionByPaging();
  }
  onClearInput() {
    this.search = '';
    this.isInputEmpty = true;
    this.filterParrams.query = `Name.ToLower().Contains("${this.search}") OR Code.ToLower().Contains("${this.search}")`;
    this.getLstPositionByPaging();
  }
}
