import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { IconManageService } from 'src/app/services/icon-manage.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmModalComponent } from 'src/app/components/commons/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-create-icons-topic',
  templateUrl: './create-icons-topic.component.html',
  styleUrls: ['./create-icons-topic.component.scss']
})
export class CreateIconsTopicComponent {
  iconForm!: FormGroup;
  fileUpload: any;
  idTopic: number = 0;
  itemIcon: any;
  errorFileIcon: boolean = false;
  dialogRef: DynamicDialogRef | undefined;

  constructor(
    private readonly fb: FormBuilder,
    private readonly messageService: MessageService,
    private readonly iconManageService: IconManageService,
    private readonly router: Router,
    private readonly activeRoute: ActivatedRoute,
    private readonly confirmationService: ConfirmationService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.initForm();

    const id = this.activeRoute.snapshot.params['id'];
    if (id > 0) {
      this.idTopic = id;
      this.getDetailIcon();
    }
  }

  initForm() {
    this.iconForm = this.fb.group({
      nameIcon: ['', Validators.required]
    });
  }

  get icForm(): any {
    return this.iconForm.controls;
  }

  getDetailIcon() {
    this.iconManageService.getIconById(this.idTopic).subscribe(res => {
      if (res.meta.status_code === 200) {
        this.itemIcon = res.data;
        this.iconForm?.patchValue({
          nameIcon: res.data.name
        });
      }
    });
  }

  onUpload(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.fileUpload = input.files[0];
    }
  }

  onBack(event: any) {
    this.dialogRef = this.dialogService.open(ConfirmModalComponent, {
      header: 'Xác nhận huỷ',
      data: {
        content: !(this.idTopic > 0) ? 'Hủy thêm mới icon' : 'Hủy sửa icon: ',
        name: this.iconForm?.controls['nameIcon'].value,
        isModalRemove: false
      },
      width: '18%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000
    });
    this.dialogRef.onClose.subscribe(result => {
      if (result) {
        if (result.confirm) {
          this.router.navigate(['/demo/icon-manage']);
        } else {
          return;
        }
      }
    });
  }

  markAllAsDirty() {
    if (this.iconForm != null) {
      Object.keys(this.iconForm?.controls).forEach(key => {
        const control = this.iconForm?.get(key);
        if (control?.enabled && control?.invalid) {
          control.markAsDirty();
        }
      });
    }
  }

  onSubmit() {
    if (this.iconForm?.invalid) {
      this.markAllAsDirty();
      return;
    }
    if (!this.fileUpload) {
      this.errorFileIcon = true;
      return;
    }
    this.errorFileIcon = false;
    let param = new FormData();
    param.append('id', this.itemIcon ? this.itemIcon.id : 0);
    param.append('Name', this.icForm.nameIcon.value);
    param.append('File', this.fileUpload, this.fileUpload?.name);

    if (this.idTopic > 0) {
      this.iconManageService.updateIcon(param, this.idTopic).subscribe(res => {
        if (res.meta.status_code === 200) {
          this.router.navigate(['/demo/icon-manage']);
          setTimeout(() => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.status_message });
          }, 600);
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message });
        }
      });
    } else {
      this.iconManageService.createNewIcon(param).subscribe(res => {
        if (res.meta.status_code === 200) {
          this.router.navigate(['/demo/icon-manage']);
          setTimeout(() => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.status_message });
          }, 600);
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message });
        }
      });
    }
  }
}
