import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-comfirm-dialog',
  templateUrl: './comfirm-dialog.component.html',
  styleUrls: ['./comfirm-dialog.component.scss']
})
export class ComfirmDialogComponent {
  @Input() titleMessage : string = '';
  @Output() isConfirm: EventEmitter<any> = new EventEmitter();

  constructor(private confirmationService: ConfirmationService, private messageService: MessageService) {}
    
  confirm(event: Event) {
      this.confirmationService.confirm({
          target: event.target as EventTarget,
          message: this.titleMessage,
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            this.isConfirm.emit(true);
          },
          reject: () => {
              return;
          }
      });
  }
}
