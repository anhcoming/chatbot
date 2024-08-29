import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmModalComponent } from 'src/app/components/commons/confirm-modal/confirm-modal.component';
import { OrganizationService } from 'src/app/services/organization.service';
import { TopicService } from 'src/app/services/topic.service';

@Component({
    selector: 'app-cau-hinh-chu-de',
    templateUrl: './cau-hinh-chu-de.component.html',
    styleUrls: ['./cau-hinh-chu-de.component.scss']
})
export class CauHinhChuDeComponent {
    isInputEmpty: boolean = true;
    isLoadingTable: any;
    listData: any;
    search: any;
    fGroup!: FormGroup;
    topicId: number = 0;
    Topic!: any;
    topicDialog: boolean = false;
    Organization: any = {
        id: 0,
        name: ''
    }
    dialogRef: DynamicDialogRef | undefined;
    totalElement: number = 0;
    pageIndex: number = 1;
    pageSize: number = 10;

    constructor(
        private readonly activeRoute: ActivatedRoute,
        private readonly messageService: MessageService,
        private readonly confirmationService: ConfirmationService,
        private readonly _organizationService: OrganizationService,

        private readonly _topicService: TopicService,
        private readonly fb: FormBuilder,
        private readonly dialogService: DialogService,
    ) { }

    initFormGroup() {
        this.fGroup = this.fb.group({
            Id: [''],
            Code: ['', Validators.compose([Validators.required])],
            Name: ['', Validators.compose([Validators.required])],
            Note: [''],
        });
    }

    hideDialog() {
        this.topicDialog = false;
        this.initFormGroup();
    }

    markAllAsDirty() {
        if (this.fGroup != null) {
            Object.keys(this.fGroup?.controls).forEach(key => {
                const control = this.fGroup?.get(key);
                if (control?.enabled && control?.invalid) {
                    control.markAsDirty();
                }
            });
        }
    }

    onSubmit() {
        if (this.fGroup.invalid) {
            this.markAllAsDirty();
            return;
        }

        const request = this.fGroup?.getRawValue();
        request.OrganizationId = this.Organization.id;

        if (this.topicId > 0) {
            // Update
            this._topicService.updateTopic(this.topicId, request).subscribe((res: any) => {
                if (res.meta.status_code === 200) {
                    this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật thành công.' });
                    this.hideDialog();
                    this.getTopicByOrganizationId();
                } else {
                    this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: res.meta.status_message });
                    console.log(res.meta.status_message);
                }
            });

        } else {
            // Insert
            this._topicService.createNewTopic(request).subscribe((res: any) => {
                if (res.meta.status_code === 200) {
                    this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Thêm mới thành công.' });
                    this.hideDialog();
                    this.getTopicByOrganizationId();
                } else {
                    this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: res.meta.status_message });
                    console.log(res.meta.status_message);
                }
            });
        }


    }

    ngOnInit(): void {
        this.initFormGroup();
        this.Topic = null;
        const id = parseInt(this.activeRoute.snapshot.params["id"]);

        if (id > 0) {
            this.Organization.id = id;
            this.getTopicByOrganizationId();
        }

    }

    onDelete(topic: any){
        this.Topic = topic;
        this.dialogRef = this.dialogService.open(ConfirmModalComponent, {
          header: 'Xoá chủ đề',
          data: {
            content: 'Bạn có chắc chắn muốn xóa chủ đề:',
            nameRemove: this.Topic?.name,
            isModalRemove: true
          },
          width: '18%',
          contentStyle: { overflow: 'auto' },
          baseZIndex: 10000
        });
        this.dialogRef.onClose.subscribe(result => {
          if (result) {
            if (result.confirm) {
              this.deleteTopic();
            } else {
              return;
            }
          }
        });
    }

    deleteTopic(){
        this._topicService.deleteTopic(this.Topic.id).subscribe(res => {
            if (res.meta.status_code === 200) {
                this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Xóa thành công.' });
                this.getTopicByOrganizationId();
            } else {
                this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: res.meta.status_message });
                console.log(res.meta.status_message);
            }
        });
    }

    cancel(){
          this.dialogRef = this.dialogService.open(ConfirmModalComponent, {
            header: '',
            data: {
              content: !(this.topicId > 0) ? 'Hủy thêm mới chủ đề' : 'Hủy sửa chủ đề',
              name: '',
              isModalRemove: false
            },
            width: '18%',
            contentStyle: { overflow: 'auto' },
            baseZIndex: 10000
          });
          this.dialogRef.onClose.subscribe(result => {
            if (result) {
              if (result.confirm) {
                this.hideDialog();
              } else {
                return;
              }
            }
          });
    }

    getTopicByOrganizationId() {
        if (this.Organization.id < 0
            || this.Organization.id === undefined
            || this.Organization.id === null
            || this.Organization.id === 0) {
            this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Id không hợp lệ!' });
            return;
        }
        const request = {
            page: this.pageIndex,
            page_size: this.pageSize,
            organizationId: this.Organization.id,
            search: this.search
        }
        this.isLoadingTable = true;

        this._organizationService.getTopicByOrganizationId(request).subscribe(res => {
            if (res.meta.status_code === 200) {
                this.isLoadingTable = false;

                this.listData = res.data.topics;
                this.Organization.name = res.data.organizationName;
                this.totalElement = res.metadata || 0;
            } else {
                this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: res.meta.status_message });
                console.log(res.meta.status_message);
            }
        });

    }

    createTopic(){
        this.initFormGroup();
        this.openDialog();
    }

    openDialog() {
        this.topicDialog = true;
    }

    updateTopic(id: number){
        this.topicId = id;
        this._topicService.getTopicById(this.topicId).subscribe(res => {
            if (res.meta.status_code === 200) {
                this.Topic = res.data;
                this.fGroup.patchValue({
                    Id: this.Topic.id,
                    Code: this.Topic.code,
                    Name: this.Topic.name,
                    Note: this.Topic.note
                });
                this.openDialog();
            } else {
                this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: res.meta.status_message });
                console.log(res.meta.status_message);
            }
        });
    }

    onSearch($event: any) {
        this.getTopicByOrganizationId();
    }

    onClearInput(){
        this.search = '';
        this.getTopicByOrganizationId();
    }

    onPageChange(e: any) {
        this.pageIndex = e.page + 1;
        this.pageSize = e.rows;
        this.getTopicByOrganizationId();
    }
}
