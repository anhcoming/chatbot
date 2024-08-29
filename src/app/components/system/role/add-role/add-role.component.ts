import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FunctionService } from 'src/app/services/function.service';
import { ProjectService } from 'src/app/services/project.service';
import { RoleService } from 'src/app/services/role.service';
import { AppMessageResponse, AppStatusCode } from 'src/app/shared/constants/app.constants';
import { Paging } from 'src/app/viewModels/paging';
import { ResApi } from 'src/app/viewModels/res-api';
import { Role } from 'src/app/viewModels/role/role';

@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.scss']
})
export class AddRoleComponent implements OnInit {
  public filterParrams: Paging;
  public filterFuncRole: Paging;
  public lstRole: Array<Role>;
  public first = 0;
  public rows = 10;
  search: string | undefined;
  public lstProjectName: any[];
  public filterProjectName: Paging;

  public lstFunction!: Array<Function>;

  public event: any;
  public newData: any;
  data = [];
  public itemRole: Role;

  public fRole: any;

  public lstFunc: any[];

  public filterFunc: Paging;
  public loading = [false];
  public dataRole: any;
  id: any;
  

  constructor(
    private readonly roleService: RoleService,
    private readonly messageService: MessageService,
    private readonly fb: FormBuilder,
    private confirmationService: ConfirmationService,

    private router: Router,

    private readonly route: ActivatedRoute,
    //private readonly customerService: CustomerService
  ) {
    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 1000;

    this.lstRole = new Array<Role>();
    this.itemRole = new Role();
    this.lstFunction = new Array<Function>();

    this.filterFunc = new Object as Paging;
    this.filterFuncRole = new Object as Paging;
    this.filterProjectName = new Object as Paging;

    this.lstFunc = [];
    this.dataRole = {}
    this.lstProjectName = []
    this.event = []
   
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('roleId');
    });
    
    if(this.id>0)
      this.getFunctionRoleById(this.id);
    this.fRole = this.fb.group({
      Id: [0],
      Code: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(150)])],
      Name: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(150)])],
      Note: ['', ],
      LevelRole: [0],
      listFunction: [],
      UserId: [0],
      Status: [0],
      UserEditId: [0],

    })
  }

  onBack(event: Event) {
    let isShow = true;//this.layoutService.getIsShow();

    if (isShow) {
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: !(this.id > 0) ? 'Hủy thêm mới' : 'Hủy cập nhật' ,
        icon: 'pi pi-spin pi-spinner',
        accept: () => {
          this.router.navigate(['system/role/list']);
        },
        reject: () => {
            return;
        }
      });
    } else {
      this.router.navigate(['system/role/list']);
    }
  }
  getFunctionRoleById(id: number) {

    this.roleService.getRole(id).subscribe((res: any) => {
      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.dataRole = res.data;

        this.formGroup();
      }
      else {
        this.dataRole = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.status_message || AppMessageResponse.BadRequest });
      }

    })
    this.dataRole = { ...this.dataRole }

  }

  markAllAsDirty() {
    Object.keys(this.fRole.controls).forEach(key => {
      const control = this.fRole.get(key);
      if (control.enabled && control.invalid) {
        control.markAsDirty();
      }
    });
  }
  onSubmit() {
    if(this.fRole.invalid){
      this.markAllAsDirty()
    }else{
      if(this.id == null) {
        if (this.fRole.controls['Name'].value == null || typeof this.fRole.controls['Name'].value === 'undefined') {
          this.fRole.controls['Name'].setValue(0);
        }
        this.fRole.controls['Id'].setValue(0);
        
        const reqData = Object.assign({}, this.fRole.value);
        
        this.loading[0] = true;
        this.roleService.createRole(reqData).subscribe(
          (res: any) => {
            this.loading[0] = false;
            if (res?.meta?.error_code == AppStatusCode.StatusCode200) {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.status_message || AppMessageResponse.CreatedSuccess });
              
              setTimeout(() => {this.onReturnPage('/system/role/list')}, 1000);
            } 
            else {
              this.loading[0] = false
              this.messageService.add({ severity: 'warn', summary: 'Warn', detail: res?.meta?.status_message || AppMessageResponse.BadRequest });
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
        if (this.fRole.controls['Name'].value == null || typeof this.fRole.controls['Name'].value === 'undefined') {
          this.fRole.controls['Name'].setValue(0);
        }

        const reqData = Object.assign({}, this.fRole.value);
    
        this.loading[0] = true;
        this.roleService.updateRole(this.id,reqData).subscribe(
          (res: any) => {
            this.loading[0] = false;
            if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: res.meta.status_message || AppMessageResponse.CreatedSuccess });

              setTimeout(() => {this.onReturnPage('/system/role/list')}, 1500);
            } else {
              this.loading[0] = false
              this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.status_message || AppMessageResponse.BadRequest });
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

  onReturnPage(url: string) : void {
    this.router.navigate([url]);
  }

  isLastPage(): boolean {
    return true;//this.customers ? this.first === this.customers.length - this.rows : true;
  }

  isFirstPage(): boolean {
    return true;//this.customers ? this.first === 0 : true;
  }
  formGroup() {
    this.fRole = this.fb.group({
      Id: this.dataRole.Id,
      Code: this.dataRole.Code,

      Name: this.dataRole.Name,

      Note: this.dataRole.Note,
    })
  }
 
}
