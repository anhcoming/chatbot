import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ModelsService } from 'src/app/services/models.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmModalComponent } from 'src/app/components/commons/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-add-model',
  templateUrl: './add-model.component.html',
  styleUrls: ['./add-model.component.scss']
})
export class AddModelComponent {
  fFunction!: FormGroup;
  funcId: any;
  loading: any;
  karma: any;
  dialogRef: DynamicDialogRef | undefined;

  constructor(
    private readonly _modelService: ModelsService,
    private readonly fb: FormBuilder,
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService,
    private router: Router,
    private readonly activeRoute: ActivatedRoute,
    public dialogService: DialogService
  ) {
    this.setupFormGroup();
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.funcId = parseInt(this.activeRoute.snapshot.params['id']);
    if (this.funcId > 0) {
      this.getModelById();
    }
  }

  getModelById() {
    this._modelService.getModelById(this.funcId).subscribe(res => {
      if (res.meta.status_code === 200) {
        this.karma = res.data;
        this.setupFormGroup();
      } else {
        this.messageService.add({ severity: 'error', summary: 'Có lỗi', detail: res.meta.status_message });
      }
    });
  }

  markAllAsDirty() {
    if (this.fFunction != null) {
      Object.keys(this.fFunction?.controls).forEach(key => {
        const control = this.fFunction?.get(key);
        if (control?.enabled && control?.invalid) {
          control.markAsDirty();
        }
      });
    }
  }

  setupFormGroup() {
    this.fFunction = this.fb.group({
      Id: [this.karma?.id || 0],
      Code: [this.karma?.code || '', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(150)])],
      Name: [this.karma?.name || '', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(150)])],
      Note: [this.karma?.note || '']
    });
  }

  onBack(event: any) {
    this.dialogRef = this.dialogService.open(ConfirmModalComponent, {
      header: 'Xác nhận huỷ',
      data: {
        content: !(this.funcId > 0) ? 'Bạn có chắc chắn muốn hủy thêm mới model' : 'Bạn có chắc chắn muốn huỷ sửa model: ',
        name: this.fFunction?.controls['Name'].value,
        isModalRemove: false,
      },
      width: '25%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000
    });
    this.dialogRef.onClose.subscribe(result => {
      if (result) {
        if (result.confirm) {
          this.router.navigate(['/demo/models']);
        } else {
          return;
        }
      }
    })
  }
  onSubmit() {
    if (this.fFunction.invalid) {
      this.markAllAsDirty();
      return;
    }
    const reqData = this.fFunction.getRawValue();
    if (this.funcId > 0) {
      this.loading = true;
      this._modelService.updateModel(this.funcId, reqData).subscribe((res: any) => {
        this.loading = false;
        if (res.meta.status_code === 200) {
          this.messageService.add({ severity: 'success', summary: 'Thành công', detail: res.meta.status_message });
          setTimeout(() => {
            this.router.navigate(['/demo/models']);
          }, 800);
        } else {
          this.messageService.add({ severity: 'error', summary: 'Có lỗi', detail: res.meta.status_message });
        }
      });
    } else {
      this.loading = true;
      this._modelService.createModel(reqData).subscribe((res: any) => {
        this.loading = false;
        if (res.meta.status_code === 200) {
          this.messageService.add({ severity: 'success', summary: 'Thành công', detail: res.meta.status_message });
          setTimeout(() => {
            this.router.navigate(['/demo/models']);
          }, 800);
        } else {
          this.messageService.add({ severity: 'error', summary: 'Có lỗi', detail: res.meta.status_message });
        }
      });
    }
  }
}
