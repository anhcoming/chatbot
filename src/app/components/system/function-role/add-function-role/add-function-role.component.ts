import { Component, Input, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmModalComponent } from 'src/app/components/commons/confirm-modal/confirm-modal.component';
import { FunctionRoleService } from 'src/app/services/function-role.service';
import { FunctionService } from 'src/app/services/function.service';
import { RoleService } from 'src/app/services/role.service';
import { AppMessageResponse, AppStatusCode, RoleManagement } from 'src/app/shared/constants/app.constants';
import { DbFunctionRole, FunctionRole } from 'src/app/viewModels/function-role/function-role';
import { Paging } from 'src/app/viewModels/paging';
import { ResApi } from 'src/app/viewModels/res-api';

export enum Role {
  name,
  value
}
@Component({
  selector: 'app-add-function-role',
  templateUrl: './add-function-role.component.html',
  styleUrls: ['./add-function-role.component.scss']
})
export class AddFunctionRoleComponent {

  functionRole: FunctionRole;
  @Input() isView!: boolean;

  Action: any;
  submitted = false;


  listFunction: any[] = [];
  public Id: any;
  fFunctionRole: any;
  public data: any;
  public filterParrams: Paging;
  public loading = [false];

  public lstFunctionRole: any;
  listRole = RoleManagement;
  dialogRef: DynamicDialogRef | undefined;

  constructor(
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private router: Router,
    private functionroleService: FunctionRoleService,
    private roleService: RoleService,
    private functionService: FunctionService,
    private fRoleService: FunctionRoleService,
    private dialogService: DialogService) {
    this.Action = {
      View: false,
      Create: false,
      Update: false,
      Delete: false,
      Import: false,
      Export: false,
      Print: false,
      Other: false,
      Menu: false
    };
    this.functionRole = new FunctionRole();
    this.functionRole.listFunction = new Array<DbFunctionRole>();

    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 100;

    this.lstFunctionRole = [];

    this.data = {};
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.Id = params.get('Id');
    });

    if (this.Id)
      this.getFunctionRoleById(this.Id);

    this.fFunctionRole = this.fb.group({
      RoleId: [0],
      Id: [0],
      levelRole: [1],
      Code: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(150)])],
      Name: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(150)])],
      Note: [''],
      Subsystem: ['', Validators.compose([Validators.required])],
      listFunction: [],
    });
    this.GetListFunction();

  }
  setFormGroup() {
    if (!this.Id) {
      this.Id = 0
    }
    this.fFunctionRole = this.fb.group({
      Id: this.Id,
      RoleId: this.Id,
      levelRole: [1],
      Code: this.lstFunctionRole.code,
      Name: this.lstFunctionRole.name,
      Note: this.lstFunctionRole.note,
      listFunction: this.lstFunctionRole.functionRoles,
      Subsystem: this.lstFunctionRole.subsystem,
    })
  }

  getFunctionRoleById(id: number) {
    this.functionroleService.getFunctionRoleById(this.Id).subscribe((res: any) => {
      if (res.meta.status_code == AppStatusCode.StatusCode200) {
        this.lstFunctionRole = res.data;
        this.setFormGroup();
      }
      else {
        this.lstFunctionRole = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.status_message || AppMessageResponse.BadRequest })
      }
    })
  }
  onReturnPage(url: string): void {
    this.router.navigate([url]);
  }
  markAllAsDirty() {
    Object.keys(this.fFunctionRole.controls).forEach(key => {
      const control = this.fFunctionRole.get(key);
      if (control.enabled && control.invalid) {
        control.markAsDirty();
      }
    });
  }
  onSubmit() {
    if (this.fFunctionRole.invalid) {
      this.markAllAsDirty()
    } else {
      this.submitted = true;
      const reqData = Object.assign({}, this.fFunctionRole.value);
      let listFunction: any[] = [];
      this.listFunction.forEach(item => {
        let newFunc = new DbFunctionRole();
        newFunc.FunctionId = item.id;
        newFunc.ActiveKey = "";
        newFunc.ActiveKey += item.View == true ? 1 : 0;
        newFunc.ActiveKey += item.Create == true ? 1 : 0;
        newFunc.ActiveKey += item.Update == true ? 1 : 0;
        newFunc.ActiveKey += item.Delete == true ? 1 : 0;
        newFunc.ActiveKey += item.Import == true ? 1 : 0;
        newFunc.ActiveKey += item.Export == true ? 1 : 0;
        newFunc.ActiveKey += item.Print == true ? 1 : 0;
        newFunc.ActiveKey += item.Other == true ? 1 : 0;
        newFunc.ActiveKey += item.IsParamRoute ? 0 : (item.Menu == true ? 1 : 0);
        
        listFunction.push(newFunc);
      });

      reqData.functionRoles = listFunction;
      if (!this.Id) {
        this.Id = 0;
      }
      this.setFormGroup();
      reqData.RoleId = this.Id;
      reqData.UserId = 1;
      if (reqData.RoleId) {
        reqData.Id = parseInt(reqData.RoleId);
        this.functionroleService.updateFunctionRole(this.Id, reqData).subscribe((res: any) => {
          this.loading[0] = false;
          if (res.meta.status_code == AppStatusCode.StatusCode200) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.status_message || AppMessageResponse.UpdatedSuccess });

            setTimeout(() => { this.onReturnPage('/system/function-role/list') }, 1500);
          }
          else {
            this.loading[0] = false
            this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.status_message || AppMessageResponse.BadRequest });
          }
        },
          () => {
            this.loading[0] = false
            this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest })
          },
          () => { this.loading[0] = false }
        )
      }
      else {
        this.functionroleService.createFunctionRole(reqData).subscribe((res: any) => {
          this.loading[0] = false;
          if (res.meta.status_code == AppStatusCode.StatusCode200) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.status_message || AppMessageResponse.CreatedSuccess });

            setTimeout(() => { this.onReturnPage('/system/function-role/list') }, 1500);
          }
          else {
            this.loading[0] = false
            this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.status_message || AppMessageResponse.BadRequest });
          }
        },
          () => {
            this.loading[0] = false
            this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest })
          },
          () => { this.loading[0] = false }
        )
      }
    }
  }

  GetListFunction(id?: number) {
    this.functionService.getTreeFunction(id).subscribe(
      (res: any) => {
        this.loading[0] = false;
        if (res?.meta?.status_code == AppStatusCode.StatusCode200) {
          this.listFunction = res["data"];
          if (!this.Id) {
            this.listFunction = this.listFunction.map(item => {
              return {
                ...item,
                Space: "",
                View: false,
                Create: false,
                Update: false,
                Delete: false,
                Import: false,
                Export: false,
                Print: false,
                Other: false,
                Menu: false
              }
            });

            this.listFunction = [...this.listFunction];
          }
          else {
          
            for (let i = 0; i < this.listFunction.length; i++) {
              for (let j = 0; j < this.lstFunctionRole.functionRoles?.length; j++) {
                if (this.listFunction[i].id == this.lstFunctionRole.functionRoles[j].functionId) {
                  this.listFunction[i].View = this.lstFunctionRole.functionRoles[j].activeKey[0] == "1" ? true : false;
                  this.listFunction[i].Create = this.lstFunctionRole.functionRoles[j].activeKey[1] == "1" ? true : false;
                  this.listFunction[i].Update = this.lstFunctionRole.functionRoles[j].activeKey[2] == "1" ? true : false;
                  this.listFunction[i].Delete = this.lstFunctionRole.functionRoles[j].activeKey[3] == "1" ? true : false;
                  this.listFunction[i].Import = this.lstFunctionRole.functionRoles[j].activeKey[4] == "1" ? true : false;
                  this.listFunction[i].Export = this.lstFunctionRole.functionRoles[j].activeKey[5] == "1" ? true : false;
                  this.listFunction[i].Print = this.lstFunctionRole.functionRoles[j].activeKey[6] == "1" ? true : false;
                  this.listFunction[i].Other = this.lstFunctionRole.functionRoles[j].activeKey[7] == "1" ? true : false;
                  this.listFunction[i].Menu = this.lstFunctionRole.functionRoles[j].activeKey[8] == "1" ? true : false;
                  break;
                }
              }
            }

            this.changeCell();
          }
        }
      },
    );
  }
  changeCell() {
    this.changeAction(10);
    this.changeFull(undefined);
  }
  changeAction(cs: any) {
    this.listFunction.forEach(item => {
      switch (cs) {
        case 1:
          item.View = this.Action.View;
          break;
        case 2:
          // if (!item.IsParamRoute) item.Create = this.Action.Create;
          // else item.Create = false;
          item.Create = this.Action.Create;
          break;
        case 3:
          // if (!item.IsParamRoute) item.Update = this.Action.Update;
          // else item.Update = false;
          item.Update = this.Action.Update;
          break;
        case 4:
          // if (!item.IsParamRoute) item.Delete = this.Action.Delete;
          // else item.Delete = false;
          item.Delete = this.Action.Delete;
          break;
        case 5:
          // if (!item.IsParamRoute) item.Import = this.Action.Import;
          // else item.Import = false;
          item.Import = this.Action.Import;
          break;
        case 6:
          // if (!item.IsParamRoute) item.Export = this.Action.Export;
          // else item.Export = false;
          item.Export = this.Action.Export;
          break;
        case 7:
          // if (!item.IsParamRoute) item.Print = this.Action.Print;
          // else item.Print = false;
          item.Print = this.Action.Print;
          break;
        case 8:
          // if (!item.IsParamRoute) item.Other = this.Action.Other;
          // else item.Other = false;
          item.Other = this.Action.Other;
          break;
        case 9:
          if (!item.IsParamRoute) item.Menu = this.Action.Menu;
          else item.Menu = false;
          break;
        default:
          break;
      }

      if (item.IsParamRoute) {
        if (item.View && item.Create && item.Update && item.Delete && item.Import && item.Export && item.Print && item.Other) {
          item.Full = true;
        }
        else {
          item.Full = false;
        }
      }
      else {
        if (item.View && item.Create && item.Update && item.Delete && item.Import && item.Export && item.Print && item.Other && item.Menu) {
          item.Full = true;
        }
        else {
          item.Full = false;
        }
      }
    });
  }

  changeFull(i: any) {
    if (i != undefined) {
      this.listFunction[i].View = this.listFunction[i].Full;
      this.listFunction[i].Create = this.listFunction[i].Full;
      this.listFunction[i].Update = this.listFunction[i].Full;
      this.listFunction[i].Delete = this.listFunction[i].Full;
      this.listFunction[i].Import = this.listFunction[i].Full;
      this.listFunction[i].Export = this.listFunction[i].Full;
      this.listFunction[i].Print = this.listFunction[i].Full;
      this.listFunction[i].Other = this.listFunction[i].Full;
      this.listFunction[i].Menu = !this.listFunction[i].IsParamRoute ? this.listFunction[i].Full : false;
    }

    if (this.listFunction.filter(l => l.View == false || l.View == undefined).length > 0) {
      this.Action.View = false;
    }
    else {
      this.Action.View = true;
    }

    if (this.listFunction.filter(l => l.Create == false || l.Create == undefined).length > 0) {
      this.Action.Create = false;
    }
    else {
      this.Action.Create = true;
    }

    if (this.listFunction.filter(l => l.Update == false || l.Update == undefined).length > 0) {
      this.Action.Update = false;
    }
    else {
      this.Action.Update = true;
    }

    if (this.listFunction.filter(l => l.Delete == false || l.Delete == undefined).length > 0) {
      this.Action.Delete = false;
    }
    else {
      this.Action.Delete = true;
    }

    if (this.listFunction.filter(l => l.Import == false || l.Import == undefined).length > 0) {
      this.Action.Import = false;
    }
    else {
      this.Action.Import = true;
    }

    if (this.listFunction.filter(l => l.Export == false || l.Export == undefined).length > 0) {
      this.Action.Export = false;
    }
    else {
      this.Action.Export = true;
    }

    if (this.listFunction.filter(l => l.Print == false || l.Print == undefined).length > 0) {
      this.Action.Print = false;
    }
    else {
      this.Action.Print = true;
    }

    if (this.listFunction.filter(l => l.Other == false || l.Other == undefined).length > 0) {
      this.Action.Other = false;
    }
    else {
      this.Action.Other = true;
    }

    if (this.listFunction.filter(l => (l.Menu == false || l.Menu == undefined) && l.IsParamRoute != true).length > 0) {
      this.Action.Menu = false;
    }
    else {
      this.Action.Menu = true;
    }

  }
  validationExtend(cs: number) {
    let invalid = false;
    switch (cs) {
      case 1:
        invalid = this.functionRole.LevelRole < 1 || this.functionRole.LevelRole > 99 ? true : false;
        break;
      default:
        break;
    }

    return invalid;
  }
  onBack(event: Event) {
    let isShow = true;

    if (isShow) {
      this.dialogRef = this.dialogService.open(ConfirmModalComponent, {
        header: !(this.Id > 0) ? 'Hủy thêm mới' : 'Hủy cập nhật',
        data: {
          content: !(this.Id > 0) ? 'Hủy thêm mới quyền' : 'Hủy sửa quyền: ',
          name: this.lstFunctionRole.name,
          isModalRemove: false
        },
        width: '18%',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000
      });
      this.dialogRef.onClose.subscribe(result => {
        if (result) {
          if (result.confirm) {
            this.router.navigate(['/system/function/list']);
          } else {
            return;
          }
        }
      });
    } else {
      this.router.navigate(['/system/function-role/list']);
    }
  }

  changeRole(event: any) {
    const idRole = event.value;
    if (idRole === null) {
      this.GetListFunction();
    } else {
      this.GetListFunction(idRole);
    }
  }
}
