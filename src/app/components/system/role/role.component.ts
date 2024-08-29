import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Paging } from 'src/app/viewModels/paging';
import { ResApi } from 'src/app/viewModels/res-api';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AppMessageResponse, AppStatusCode } from 'src/app/shared/constants/app.constants';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Role } from 'src/app/viewModels/role/role';
import { RoleService } from 'src/app/services/role.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent {
  public filterParrams : Paging ;
  public lstRole: Array<Role>;
  public first = 0;
  public rows = 10;
  search: string = '';
  isInputEmpty: boolean = true;
  data = [];
  public fRole: FormGroup ;
  public Role: any[];
  public loading = [false];
  public isLoadingTable: boolean =false;
  roleID: any;

  constructor(
    private readonly roleService: RoleService,
    private readonly messageService: MessageService,
    private modalService: NgbModal,
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly confirmationService: ConfirmationService,
  ) {
    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 1000;

    this.lstRole = new Array<Role>();
    this.Role = [];

    this.fRole = fb.group({
      Code: ['' , Validators.required],
      Name: ['' , Validators.required],
      CreatedAt: [''],
      UpdatedAt: [''],
      Note: ['' , ],
      ListFuction: [],
      LevelRole : [0],
      UserId: [0],
    })
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.roleID = params.get('roleId');
    });

    this.getListRoleByPaging();
    this.route.paramMap.subscribe(params => {
      this.roleID = params.get('roleId');
    });
}
getListRoleByPaging() {
  this.isLoadingTable = true;

  this.roleService.getListRoleByPaging(this.filterParrams).subscribe((res: any) => {
    this.isLoadingTable = false;

    if(res.meta.error_code == AppStatusCode.StatusCode200) {
      this.lstRole = res.data;
    }
    else {
      this.lstRole = new Array<Role>();
      this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.status_message || AppMessageResponse.BadRequest });
    }
  },
  () => {
    this.isLoadingTable = false;

    this.lstRole = [];
    this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest });
  })
}
  // deleteRole(id : number , index : number) {
  //   this.roleService.deleteRole(id).subscribe((res:any)=>{
  //     this.loading[0] = false;
  //     if(res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
  //       this.lstRole = this.lstRole.filter((id,i)=> i !== index);
  //       this.messageService.add({severity: 'success', summary: 'Success', detail: res?.meta?.status_message || AppMessageResponse.CreatedSuccess})
  //     } else {
  //       this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.status_message || AppMessageResponse.BadRequest });
  //       return;
  //     }
  //   })
  // }
  deleteRole(id: number, index: number) {
  
    this.confirmationService.confirm({
      message: 'Bạn có muốn xóa chức năng <b>"'+ this.lstRole.filter((i: any) => i.Id == id)[0].Name +'"</b> không?',
      header: 'XÓA CHỨC NĂNG',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.roleService.deleteRole(id).subscribe(
          (res: any) => {
            this.loading[0] = false;
            if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
              this.lstRole = this.lstRole.filter((id, i) => i !== index);
              this.messageService.add({ severity: 'success', summary: 'Success', detail: res.meta.status_message || AppMessageResponse.CreatedSuccess });
  
              
              //return;
            } else {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.status_message || AppMessageResponse.BadRequest });
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
  onSearch() {
    this.filterParrams.query = `Name.ToLower().Contains("${this.search}") OR Code.ToLower().Contains("${this.search}")`;
    this.getListRoleByPaging();
  }
  onClearInput() {
    this.search = '';
    this.isInputEmpty = true;
    this.filterParrams.query = `Name.ToLower().Contains("${this.search}") OR Code.ToLower().Contains("${this.search}")`;
    this.getListRoleByPaging();
  }
}