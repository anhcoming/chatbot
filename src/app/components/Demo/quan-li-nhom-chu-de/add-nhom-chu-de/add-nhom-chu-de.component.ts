import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmModalComponent } from 'src/app/components/commons/confirm-modal/confirm-modal.component';
import { GroupTopicService } from 'src/app/services/groupTopic.service';
import { ModelsService } from 'src/app/services/models.service';

@Component({
  selector: 'app-add-nhom-chu-de',
  templateUrl: './add-nhom-chu-de.component.html',
  styleUrls: ['./add-nhom-chu-de.component.scss']
})
export class AddNhomChuDeComponent {
  fFunction: any;
  funcId: any;
  loading: any;
  topics: any;
  karma: any;
  models: any;
  selectedTopics: any;
  isLoadingTable: boolean = false
  dialogRef: DynamicDialogRef | undefined
  constructor(
    private readonly fb: FormBuilder,
    private readonly _groupTopicService: GroupTopicService,
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService,
    private readonly activeRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly _modelService: ModelsService,
    private readonly dialogService: DialogService,
  ) {
    this.setUpFormGroup();

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.karma = null;
    this.models = null;
    this.topics = null;
    this.selectedTopics = null;
    this.funcId = parseInt(this.activeRoute.snapshot.params["id"]);
    if (this.funcId > 0) {
      this.getGroupTopicById();
    }

    this.getTopicByOrganizationId();
    this.getDropdownModels();
  }

  getDropdownModels() {
    this._modelService.getDropdown().subscribe(res => {
      if (res.meta.status_code === 200) {
        this.models = res.data;
      } else {
        this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: res.meta.status_message });
      }
    });
  }

  getTopicByOrganizationId() {
    this.isLoadingTable = true;
    this._groupTopicService.getTopicByOrganizationId().subscribe(res => {
      if (res.meta.status_code === 200) {
        this.topics = res.data;
        this.isLoadingTable = false;
      } else {
        this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: res.meta.status_message });
        this.isLoadingTable = true;
      }
    });
  }

  onSubmit() {
    if (this.fFunction.invalid) {
      this.markAllAsDirty();
      return;
    }
    const reqData = this.fFunction.getRawValue();
    reqData.Topics = this.selectedTopics;
    if (this.funcId > 0) {
      this.loading = true;
      this._groupTopicService.updateGroupTopic(this.funcId, reqData).subscribe((res: any) => {
        this.loading = false;
        if (res.meta.status_code === 200) {
          this.router.navigate(['/demo/groupTopic']);
          setTimeout(() => {
            this.messageService.add({ severity: 'success', summary: 'Cập nhật thành công', detail: '' });
          }, 600);
        } else {
          this.messageService.add({ severity: 'error', summary: 'Có lỗi', detail: res.meta.status_message });
        }
      });
    } else {
      this.loading = true;
      this._groupTopicService.createGroupTopic(reqData).subscribe((res: any) => {
        this.loading = false;
        if (res.meta.status_code === 200) {
          this.router.navigate(['/demo/groupTopic']);
          setTimeout(() => {
            this.messageService.add({ severity: 'success', summary: 'Thêm mới thành công', detail: '' });
          }, 600);
        } else {
          this.messageService.add({ severity: 'error', summary: 'Có lỗi', detail: res.meta.status_message });
        }
      });
    }
  }

  getGroupTopicById() {
    this._groupTopicService.getGroupTopicById(this.funcId).subscribe(res => {
      if (res.meta.status_code === 200) {
        this.karma = res.data;
        this.selectedTopics = this.karma.topics;
        this.setUpFormGroup();
      } else {
        this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: res.meta.status_message });
      }
    })
  }

  onBack(event: any) {
    this.dialogRef = this.dialogService.open(ConfirmModalComponent, {
      header: 'Xác nhận huỷ',
      data: {
        content: !(this.funcId > 0) ? 'Hủy thêm mới nhóm chủ đề' : 'Hủy sửa nhóm chủ đề: ',
        name: this.fFunction?.controls["Name"].value,
        isModalRemove: false,
      },
      width: '18%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000
    });
    this.dialogRef.onClose.subscribe(result => {
      if (result) {
        if (result.confirm) {
          this.router.navigate(['/demo/employee']);
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

  setUpFormGroup() {
    this.fFunction = this.fb.group({
      Id: [this.karma?.id || 0],
      Code: [this.karma?.code || '', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(150)])],
      Name: [this.karma?.name || '', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(150)])],
      Note: [this.karma?.note || ''],
      ModelId: [this.karma?.modelId, Validators.required],
    });
  }

}
