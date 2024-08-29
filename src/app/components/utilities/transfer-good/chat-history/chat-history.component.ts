import { Component } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-chat-history',
  templateUrl: './chat-history.component.html',
  styleUrls: ['./chat-history.component.scss']
})
export class ChatHistoryComponent {
  constructor(
    public ref: DynamicDialogRef
  ){

  }
  
}
