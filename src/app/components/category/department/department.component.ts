import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Paging } from 'src/app/viewModels/paging';
import { TowerService } from 'src/app/services/tower.service';
import { ResApi } from 'src/app/viewModels/res-api';
import { MessageService, ConfirmationService } from 'primeng/api';
import { AppMessageResponse, AppStatusCode, TypeDepartment } from 'src/app/shared/constants/app.constants';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Department } from 'src/app/viewModels/department/department';
import { DepartmentService } from 'src/app/services/department.service';
import { DepartmentMap } from 'src/app/viewModels/department-map/department-map';
import { ProjectService } from 'src/app/services/project.service';


@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})
export class DepartmentComponent {
  public filterParrams : Paging ;
  public lstDepartment!: Array<Department>;
  public lstDepartmentMap!: Array<DepartmentMap>;
  public first = 0;
  public rows = 10;
  search: string = '';
  isInputEmpty: boolean = true;
  public lstDepartmentType : any;
  data = [];
  public itemDepartment: Department;

  public fDepartment: FormGroup ;
  public fFilter: FormGroup ;

  public Department: any[];
  public lstProject: any[];

  public filterTower: Paging;
  public filterProject: Paging;
  public filterProjectName: Paging;
  public isLoadingTable: boolean = false;
  public loading = [false];

  positions = [];
  departments = [];

  constructor(
    private readonly departmentService: DepartmentService,
    private readonly projectService: ProjectService,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private modalService: NgbModal,
    private readonly fb: FormBuilder,
    //private readonly customerService: CustomerService
  ) {
    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 100;

    this.Department = new Array<Department>();
    this.itemDepartment = new Department();

    this.filterTower = new Object as Paging;

    this.filterProject = new Object as Paging;

    this.filterProjectName = new Object as Paging;

    this.Department = [];
    this.lstProject = [];

    this.fDepartment = fb.group({
      Code: ['' , Validators.required],
      DepartmentId: ['' , Validators.required],
      Name: ['' , Validators.required],
      Email: ['' , Validators.required],
      Phone: ['' , ],
      Status: ['' , ],
      Note: ['' , ]
    })
    this.fFilter = fb.group({
      Id: [0],
      DepartmentId: ['' ],
    })
  }

  ngOnInit() {
    this.getListDepartmentByPaging();
    this.getListProject();
    this.setData();
  }

  isFirstPage(): boolean {
      return true;//this.customers ? this.first === 0 : true;
  }
  setData() {
    this.lstDepartmentType = TypeDepartment.map(item => ({ Name : item.label, Id: item.value }));
  }
  getListDepartmentByPaging() {
    this.isLoadingTable = true;

    this.departmentService.getListDepartmentByPaging(this.filterParrams).subscribe((res: ResApi) => {
      this.isLoadingTable = false;

      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstDepartment = res.data;
        this.lstDepartment.forEach(item => {
          if(item.Type === 1) {
            item.TypeName = 'Ban quản lý';
          } else {
            item.TypeName = 'Ban kỹ thuật';
          }
        })
        
      }
      else {
        this.lstDepartment = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
      
    },
    () => {
      this.isLoadingTable = false;

      this.lstDepartment = [];
      this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest });
    })
  }
  onDelete(id: number) {
    this.confirmationService.confirm({
      message: 'Bạn có muốn xóa phòng ban <b>"'+ this.lstDepartment.filter((i: any) => i.Id == id)[0].Name +'"</b> không?',
      header: 'XÓA PHÒNG BAN',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xác nhận',
      rejectLabel: 'Hủy bỏ',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.departmentService.deleteDepartment(id).subscribe(
          (res: any) => {
            this.loading[0] = false;
            if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
              this.lstDepartment = this.lstDepartment.filter(s => s.Id !== id);
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
  onSearch(event: any) {
    const searchValue = event.target.value.toLowerCase().trim();
    this.filterParrams.query = `Name.ToLower().Contains("${searchValue}") OR Code.ToLower().Contains("${searchValue}")`;
    this.getListDepartmentByPaging();
  }
  // onSelect(event: any) {
    
  //   if(event.value != null){
  //     this.filterParrams.query = `ProjectId=${event.value}`;
  //     this.getListDepartmentByPaging();
  //   } else{
  //     this.filterParrams.query = '1=1';
  //     this.getListDepartmentByPaging();
  //   }
    
  // }
  onSelectType(event: any) {
    if (event.value == null) {
      this.filterParrams.query = '1=1';
    } else {
      this.filterParrams.query = `Type=${event.value}`;
    }
    this.getListDepartmentByPaging();
  }
  getListProject() {
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
  ShowTypeDepartment(Type : any) {
		let data = TypeDepartment.filter(i => i.value == Type)[0];
		return data == undefined ?  "" : data.label;
	}
  onClearInput() {
    this.search = '';
    this.isInputEmpty = true;
    this.filterParrams.query = `Name.ToLower().Contains("${this.search}") OR Code.ToLower().Contains("${this.search}")`;
    this.getListDepartmentByPaging();
  }
}
