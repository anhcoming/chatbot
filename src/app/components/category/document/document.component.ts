import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApartmentService } from 'src/app/services/apartment.service';
import { DocumentService } from 'src/app/services/document.service';
import { FloorService } from 'src/app/services/floor.service';
import { ProjectService } from 'src/app/services/project.service';
import { TowerService } from 'src/app/services/tower.service';
import { AppMessageResponse, AppStatusCode, TypeDocument } from 'src/app/shared/constants/app.constants';
import { Apartment } from 'src/app/viewModels/apartment/apartment';
import { Document, ListAttactments } from 'src/app/viewModels/document/document';
import { Floor } from 'src/app/viewModels/floor/floor';
import { Paging } from 'src/app/viewModels/paging';
import { Project } from 'src/app/viewModels/project/project';
import { ResApi } from 'src/app/viewModels/res-api';
import { DbTower } from 'src/app/viewModels/tower/db-tower';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent {
  public filterParrams: Paging;
  public lstFloor!: Array<Floor>;
  public lstProject!: Array<Project>;
  public lstDocument!: Array<Document>;
  public lstTower!: Array<DbTower>;
  public lstApartment: Array<Apartment>;
  public Item : Document;
  public first = 0;
  public rows = 10;
  public filterTower: Paging;
  public filterApartment: Paging;
  selectedDocument: any;
  public filterProject: Paging;
  idFrozen : boolean = true;
  isColumnFrozen: boolean = false;
  public filterFloor: Paging;
  public loading = [false];
  // fileName : string = '';
  search: string = '';
  isInputEmpty: boolean = true;
  public fSearch: FormGroup;
  public lstDoc : any[];
  public listAttactments :  Array<ListAttactments>;
  public filterText: string;
  public id : any

  constructor(
    private http: HttpClient,
    private readonly floorService: FloorService,
    private readonly documentService: DocumentService,
    private readonly apartmentService: ApartmentService,
    private readonly towerService: TowerService,
    private readonly projectService: ProjectService,
    private readonly messageService: MessageService,
    private readonly route: ActivatedRoute,
    private readonly confirmationService: ConfirmationService,
    private readonly fb: FormBuilder,
  ) {
    this.Item = new Document();
    this.listAttactments = new Array<ListAttactments>();
    this.lstDoc = []
    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 100;
    this.lstFloor = new Array<Floor>();
    this.lstProject = new Array<Project>();
    this.lstApartment = new Array<Apartment>();
    this.lstTower = new Array<DbTower>;
    this.lstDocument = new Array<Document>();
    this.filterFloor = new Object as Paging;
    this.filterApartment = new Object as Paging;
    this.filterTower = new Object as Paging;
    this.filterProject = new Object as Paging;
    this.filterText = '';
    this.fSearch = fb.group({
      ProjectId: [''],
      TowerId: [''],
      Type: [''],
      FloorId: [''],
      ApartmentId: [''],
    })
  }

  ngOnInit() {
    // this.onFileSelected(event);
    this.getListFloorByPaging();
    this.getListProject();
    this.getListDocument();
    this.getListTowersByPaging();
    this.getListApartmentByPaging();
    this.setData()
  }
  // getListTowerName(event: any) {
  //   if (!event || event.value) {
  //     this.lstTower = [];
  //   }

  //   this.filterTower.query = `ProjectId=${event.value}`;

  //   this.towerService.getListTowerByPaging(this.filterTower)
  //   .subscribe((res: ResApi) => {
  //     if(res.meta.error_code == AppStatusCode.StatusCode200) {
  //       this.lstTower = res.data;
  //     }
  //     else {
  //       this.lstTower = [];
  //       this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
  //     }
      
  //   })
  // }
  onSelectFloor(event: any) {
    if (event.value == null) {
      this.filterParrams.query = '1=1';
      this.getListDocument();
    } else {
      this.filterParrams.query = `FloorId=${event.value}`;
    }
    this.getListDocument();
  }
  onSelectTower(event: any) {
    if (event.value == null) {
      this.filterParrams.query = '1=1';
      this.getListDocument();
    } else {
      this.filterParrams.query = `TowerId=${event.value}`;
    }
    this.getListDocument();
  }

  onSelectProject(event: any){
    if(event.value == null){
      this.filterParrams.query = '1=1';
      this.getListDocument();
    } else {
      this.filterParrams.query = `ProjectId=${event.value}`;
    } this.getListDocument();
  }
  onSelectDocument(event:any){
    if(event.value == null){
      this.filterParrams.query = '1=1';
      this.getListDocument();
    } else {
      this.filterParrams.query = `Type=${event.value}`;
    } this.getListDocument();
  }
  onSelectApartment(event: any){
    if(event.value == null){
      this.filterParrams.query = '1=1';
      this.getListDocument();
    } else {
      this.filterParrams.query = `ApartmentId=${event.value}`;
    } this.getListDocument();
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
  setData() {
    this.lstDoc = TypeDocument.map(item => ({ Name : item.label, Id: item.value }));
    return TypeDocument[0].value
  }

  getListFloorByPaging() {
    this.lstFloor = [];
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
  
  getListDocument() {
    this.lstDocument = [];
    this.documentService.getListDocumentByPaging(this.filterParrams).subscribe((res: ResApi) => {
      if (res.meta.error_code == AppStatusCode.StatusCode200) {

        this.lstDocument = res.data;
      }
      else {
        this.lstDocument = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })
  }
  getListTowersByPaging() {
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
  getListApartmentByPaging(){
    this.lstApartment = [];
    this.apartmentService.getListApartmentByPaging(this.filterApartment).subscribe((res:ResApi) => {
      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstApartment = res.data;
      }
      else {
        this.lstApartment = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })
  }
  ShowTypeDocument(Type : any) {
		let data = TypeDocument.filter(x => x.value == Type)[0];
		return data != undefined ? data.label : "";
	}
  onSearch(){
    this.filterParrams.query = `Name.ToLower().Contains("${this.filterText}")`;
    this.getListDocument();
  }
  updateColumnFrozen() {
    //
  }
  onDelete(item : Document) {
  
    this.confirmationService.confirm({
      message: 'Bạn có muốn xóa tài liệu <b> '+item.Name+' </b> này không?',
      header: 'XÓA TÀI LIỆU',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xác nhận',
      rejectLabel: 'Hủy bỏ',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.documentService.deleteDocumentById(item.Id).subscribe(
          (res: any) => {
            this.loading[0] = false;
            if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
              this.lstDocument = this.lstDocument.filter(s => s.Id !== item.Id);
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
    this.search = '';
    this.isInputEmpty = true;
    this.filterParrams.query = `Name.ToLower().Contains("${this.search}") OR Code.ToLower().Contains("${this.search}")`;
    this.getListDocument();
  }
}
