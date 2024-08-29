import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatBotService {
  private subjectEvent = new Subject<string>();
  eventHandle = this.subjectEvent.asObservable();
  constructor() {}

  sendData(data: any) {
    this.subjectEvent.next(data);
  }
}
