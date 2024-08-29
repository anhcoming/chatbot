import { Component, Inject } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent {
  contentModal: any;
  constructor(@Inject(DynamicDialogConfig) public config: DynamicDialogConfig, private ref: DynamicDialogRef) {
    this.contentModal = config.data; // Lấy dữ liệu truyền sang từ dialog
  }

  closeModal() {
    this.ref.close({ cancel: 'Cancel' });
  }

  accept() {
    this.ref.close({ confirm: 'Confirmed' });
  }
}
