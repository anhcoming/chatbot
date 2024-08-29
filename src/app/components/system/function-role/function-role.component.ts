import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Paging } from 'src/app/viewModels/paging';
import { ResApi } from 'src/app/viewModels/res-api';
import { MessageService, ConfirmationService } from 'primeng/api';
import { AppMessageResponse, AppStatusCode, RoleManagement } from 'src/app/shared/constants/app.constants';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Role } from 'src/app/viewModels/role/role';
import { FunctionRoleService } from 'src/app/services/function-role.service';
import { FunctionRole } from 'src/app/viewModels/function-role/function-role';

@Component({
  selector: 'app-function-role',
  templateUrl: './function-role.component.html',
  styleUrls: ['./function-role.component.scss']
})
export class FunctionRoleComponent {
  public filterParrams: Paging;
  public lstFunctionRole!: Array<FunctionRole>;
  public first = 0;
  public rows = 10;
  search: string = '';
  isInputEmpty: boolean = true;
  public loading = [false];
  public isLoadingTable: boolean = false;
  visible: boolean = false;
  nameRole: string = '';
  idRole: any;
  totalElements: number = 0;
  listRole = RoleManagement;
  selectedRole = '';

  constructor(
    private readonly functionroleService: FunctionRoleService,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    //private readonly customerService: CustomerService
  ) {
    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 10;

    this.lstFunctionRole = new Array<FunctionRole>();

  }

  ngOnInit() {
    this.getListRoleByPaging();
  }

  getListRoleByPaging() {
    this.isLoadingTable = true;

    this.functionroleService.getListFunctionRoleByPaging(this.filterParrams).subscribe((res: any) => {
      this.isLoadingTable = false;

      if (res.meta.status_code == AppStatusCode.StatusCode200) {
        this.lstFunctionRole = res.data;
        this.totalElements = res.metadata;
      }
      else {
        this.lstFunctionRole = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.status_message || AppMessageResponse.BadRequest });
      }

    },
      () => {
        this.isLoadingTable = false;

        this.lstFunctionRole = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest });
      })
  }
  onDelete(id: number, index: number) {
    this.visible = true;
    const target: any = this.lstFunctionRole.find((i: any) => i.id == id);
    this.nameRole = target?.name;
    this.idRole = id;
  }
  onSearch(event: any) {
    const searchValue = event.target.value.toLowerCase().trim();
    this.filterParrams.query = `Name.ToLower().Contains("${searchValue}") OR Code.ToLower().Contains("${searchValue}")`;
    this.getListRoleByPaging();
  }
  onClearInput() {
    this.search = '';
    this.isInputEmpty = true;
    this.filterParrams.query = `Name.ToLower().Contains("${this.search}") OR Code.ToLower().Contains("${this.search}")`;
    this.getListRoleByPaging();
  }

  closeModal() {
    this.visible = false;
  }

  confirmRemove() {
    this.functionroleService.deleteFunctionRoleById(this.idRole).subscribe(
      (res: any) => {
        this.loading[0] = false;
        if (res && res.meta && res.meta.status_code == AppStatusCode.StatusCode200) {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: res.meta.status_message || AppMessageResponse.DeletedSuccess });
          this.visible = false;
          this.getListRoleByPaging();
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.status_message || AppMessageResponse.BadRequest });
          this.visible = false;
          return;
        }
      }
    );
  }

  onPageChange(e: any) {
    this.filterParrams.page = e.page + 1;
    this.filterParrams.page_size = e.rows;
    this.getListRoleByPaging();
  }

  getTextRole(id: number) {
    if (id === 0) {
      return 'Quản trị hệ thống';
    } else if (id === 1) {
      return 'Quản trị đơn vị';
    } else {
      return '';
    }
  }

  onSelect(event: any) {
    const role = event.value;
    this.filterParrams.select = role?.value;
    this.getListRoleByPaging();
  }
}