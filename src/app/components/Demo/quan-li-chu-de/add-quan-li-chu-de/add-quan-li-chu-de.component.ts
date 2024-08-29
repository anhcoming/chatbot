import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmModalComponent } from 'src/app/components/commons/confirm-modal/confirm-modal.component';
import { IconManageService } from 'src/app/services/icon-manage.service';
import { TopicService } from 'src/app/services/topic.service';

@Component({
  selector: 'app-add-quan-li-chu-de',
  templateUrl: './add-quan-li-chu-de.component.html',
  styleUrls: ['./add-quan-li-chu-de.component.scss']
})
export class AddQuanLiChuDeComponent {
  fFunction: FormGroup | null = null;
  funcId: any = -1;
  loading: any = false;
  listIcon: any;
  dialogRef: DynamicDialogRef | undefined;

  constructor(
    private readonly fb: FormBuilder,
    private readonly confirmationService: ConfirmationService,
    private readonly _topicService: TopicService,
    private router: Router,
    private readonly activeRoute: ActivatedRoute,
    private iconManageService: IconManageService,
    private messageService: MessageService,
    private dialogService: DialogService
  ) {

  }

  ngOnInit(): void {
    this.setupFormGroup();
    this.getListIcon();

    const id = this.activeRoute.snapshot.params['id'];
    if (id > 0) {
      this.funcId = id;
      this.getTopicById();
    }

  }

  getListIcon() {
    const param = {
      page: 1,
      page_size: 10,
      keyWord: '',
    }

    this.iconManageService.getListIcon(param).subscribe(res => {
      if (res.meta.status_code === 200) {
        this.listIcon = res.data;
        console.log(this.listIcon, '---listIcon');
        
      } else {
        this.messageService.add({ severity: 'danger', summary: 'Lấy danh sách icon thất bại', detail: '' });
        console.log(res.meta.status_message);
      }
    })
  }

  getTopicById() {
    this._topicService.getTopicById(this.funcId).subscribe((res: any) => {
      if (res.meta.status_code === 200) {
        console.log(res.data);
        this.fFunction?.patchValue({
          Id: res.data.id,
          Code: res.data.code,
          Name: res.data.name,
          Note: res.data.note,
          IcoDarkId: res.data.icoDarkId,
          IcoLightId: res.data.icoLightId,
        });
      } else {
        console.log(res.meta.status_message);
      }

    });
  }

  setupFormGroup() {
    this.fFunction = this.fb.group({
      Id: [0],
      Code: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(150)])],
      Name: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(150)])],
      IcoLightId: ['', Validators.required],
      IcoDarkId: ['', Validators.required],
      Note: ['']
    });
  }


  onBack(event: any) {
    this.dialogRef = this.dialogService.open(ConfirmModalComponent, {
      header: 'Xác nhận huỷ',
      data: {
        content: !(this.funcId > 0) ? 'Hủy thêm mới chủ đề' : 'Hủy sửa chủ đề: ',
        name: this.fFunction?.controls["Name"].value,
        isModalRemove: false,
      },
      width: '20%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000
    });
    this.dialogRef.onClose.subscribe(result => {
      if (result) {
        if (result.confirm) {
          this.router.navigate(['/demo/quanlichude']);
        } else {
          return;
        }
      }
    })
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

  onSubmit() {
    if (this.fFunction?.invalid) {
      this.markAllAsDirty();
    } else {
      const request = this.fFunction?.getRawValue();
      if (this.funcId > 0) {
        // Update
        this._topicService.updateTopic(this.funcId, request).subscribe((res: any) => {
          if (res.meta.status_code === 200) {
            this.router.navigate(['/demo/quanlichude']);
            setTimeout(() => {
              this.messageService.add({ severity: 'success', summary: 'Thành công', detail: res.meta.error_message || 'Thêm mới chủ đề thành công' });
            }, 600);
          } else {
            console.log(res.meta.status_message);
            this.messageService.add({ severity: 'error', summary: 'Thất bại', detail: res.meta.error_message || 'Thêm mới chủ đề thất bại' });
          }
        });

      } else {
        // Insert
        this._topicService.createNewTopic(request).subscribe((res: any) => {
          if (res.meta.status_code === 200) {
            this.router.navigate(['/demo/quanlichude']);
            setTimeout(() => {
              this.messageService.add({ severity: 'success', summary: 'Thành công', detail: res.meta.error_message || 'Thêm mới chủ đề thành công' });
            }, 600);
          } else {
            console.log(res.meta.status_message);
            this.messageService.add({ severity: 'error', summary: 'Thất bại', detail: res.meta.error_message || 'Thêm mới chủ đề thất bại' });
          }
        });
      }
    }
  }
}
