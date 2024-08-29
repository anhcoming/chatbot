import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import { AppMessageResponse, AppStatusCode } from 'src/app/shared/constants/app.constants';
import { Paging } from 'src/app/viewModels/paging';
import { ResApi } from 'src/app/viewModels/res-api';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from 'src/app/services/project.service';
import { Function } from 'src/app/viewModels/function/function';
import { FunctionService } from 'src/app/services/function.service';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmModalComponent } from 'src/app/components/commons/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-add-function',
  templateUrl: './add-function.component.html',
  styleUrls: ['./add-function.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class AddFunctionComponent {
  function: Function;
  public itemFunc: Function;

  public funcId: any;
  fFunction: any;

  public lstWard: any[];
  public lstTower: any[];
  public lstFunctionPerant: any[];
  public dataFunction: any;

  public filterTower: Paging;
  public filterWard: Paging;
  public filterFunctionPerant: Paging;

  public filterParrams: Paging;
  public loading = [false];
  isSubSystem: boolean = false;
  dialogRef: DynamicDialogRef | undefined;

  constructor(
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private readonly fb: FormBuilder,
    private readonly functionService: FunctionService,
    private readonly route: ActivatedRoute,
    private router: Router,
    private dialogService: DialogService,

  ) {
    this.function = new Function();
    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 100;
    this.itemFunc = new Function();


    this.filterTower = new Object as Paging;

    this.filterWard = new Object as Paging;

    this.filterFunctionPerant = new Object as Paging;

    this.lstTower = [];
    this.lstWard = [];
    this.lstFunctionPerant = [];
    this.dataFunction = {};


  }

  formGroup() {
    this.fFunction = this.fb.group({
      Id: this.funcId,
      Code: [this.dataFunction.code, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(150)])],
      Url: [this.dataFunction.url, Validators.required],
      Name: [this.dataFunction.name, Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(150)])],
      Icon: [this.dataFunction.icon, Validators.required],
      Location: [this.dataFunction.location, Validators.required],
      FunctionParentId: this.dataFunction.functionParentId,
      SubSystem: [this.dataFunction.subSystem === 1 ? true : false],
      Note: this.dataFunction.note
    })
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.funcId = params.get('funcId');
    });

    this.getListFunctionPerant();

    if (this.funcId)
      this.getFunctionById(this.funcId);

    this.fFunction = this.fb.group({
      Id: [0],
      Code: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(150)])],
      Url: ['', Validators.required],
      Name: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(150)])],
      Location: ['', Validators.required],
      FunctionParentId: [0],
      Icon: ['', Validators.required],
      CreateById: 8,
      SubSystem: [],
      Note: ['']
    })
    //set Validators cho Url khi FunctionParentId đưuọc chọn
    const control = this.fFunction.get('FunctionParentId');
    const urlControl = this.fFunction.get('Url');

    control.valueChanges.subscribe((value: any) => {
      if (value) {
        // Nếu trường "FunctionParentId" khác null, đặt validators cho trường "Url"
        urlControl.setValidators([
          Validators.required,
        ]);
      } else {
        // Nếu trường "FunctionParentId" là null, xóa validators của trường "Url"
        urlControl.setValidators(null);
      }
      // Cập nhật validators cho trường "Url"
      urlControl.updateValueAndValidity();
    });
  }

  markAllAsDirty() {
    Object.keys(this.fFunction.controls).forEach(key => {
      const control = this.fFunction.get(key);
      if (control.enabled && control.invalid) {
        control.markAsDirty();
      }
    });
  }
  onSubmit() {
    if (this.fFunction.invalid) {
      this.markAllAsDirty();
    } else {
      if (this.funcId == null) {
        if (this.fFunction.controls['FunctionParentId'].value == null || typeof this.fFunction.controls['FunctionParentId'].value === 'undefined') {
          this.fFunction.controls['FunctionParentId'].setValue(0);
        }
        this.fFunction.controls['Id'].setValue(0);

        const reqData = Object.assign({}, this.fFunction.value);
        reqData.SubSystem = reqData.SubSystem ? 1 : 0;
        this.loading[0] = true;
        this.functionService.createFunction(reqData).subscribe(
          (res: any) => {
            this.loading[0] = false;
            if (res?.meta?.status_code == AppStatusCode.StatusCode200) {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.status_message || AppMessageResponse.CreatedSuccess });
              setTimeout(() => { this.onReturnPage('/system/function/list') }, 1000);
            }
            else {
              this.loading[0] = false;
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
      } else {
        if (this.fFunction.controls['FunctionParentId'].value == null || typeof this.fFunction.controls['FunctionParentId'].value === 'undefined') {
          this.fFunction.controls['FunctionParentId'].setValue(0);
        }

        const reqData = Object.assign({}, this.fFunction.value);
        this.loading[0] = true;
        reqData.Id = parseInt(this.funcId);
        reqData.SubSystem = reqData.SubSystem ? 1 : 0;
        this.functionService.updateFunction(this.funcId, reqData).subscribe(
          (res: any) => {
            this.loading[0] = false;
            if (res && res.meta && res.meta.status_code == AppStatusCode.StatusCode200) {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: res.meta.status_message || AppMessageResponse.UpdatedSuccess });

              setTimeout(() => { this.onReturnPage('/system/function/list') }, 1500);
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

  onReturnPage(url: string): void {
    this.router.navigate([url]);
  }



  getFunctionById(id: number) {
    this.functionService.getFunctionById(id).subscribe((res: any) => {
      if (res.meta.status_code == AppStatusCode.StatusCode200) {
        this.dataFunction = res.data;
        this.formGroup();
      }
      else {
        this.dataFunction = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.status_message || AppMessageResponse.BadRequest });
      }
    })
    this.dataFunction = { ...this.dataFunction }
  }

  getListFunctionPerant() {

    this.lstFunctionPerant = [];
    this.functionService.getFunctionPerantByPaging(this.filterFunctionPerant).subscribe((res: any) => {
      if (res.meta.status_code == AppStatusCode.StatusCode200) {
        this.lstFunctionPerant = res.data;
      }
      else {
        this.lstFunctionPerant = []
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.status_message || AppMessageResponse.BadRequest });
      }
    })
  }
  onBack(event: Event) {
    let isShow = true;

    if (isShow) {
      this.dialogRef = this.dialogService.open(ConfirmModalComponent, {
        header: 'Huỷ chức năng',
        data: {
          content: !(this.funcId > 0) ? 'Hủy thêm mới chức năng' : 'Hủy sửa chức năng: ',
          name: this.dataFunction?.name,
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
      this.router.navigate(['/system/function/list']);
    }
  }

  changeSubSystem(event: any) {
    this.isSubSystem = event.checked;
  }

}