import { Component } from '@angular/core';
import {DialogService} from "primeng/dynamicdialog";
import {DetailChatComponent} from "../detail-chat/detail-chat.component";
import {NgbDateStruct} from "@ng-bootstrap/ng-bootstrap";
import { TopicService } from 'src/app/services/topic.service';
import { ChatSessionService } from 'src/app/services/chatSession.service';

@Component({
  selector: 'app-history-chat',
  templateUrl: './history-chat.component.html',
  styleUrls: ['./history-chat.component.scss']
})
export class HistoryChatComponent {
    fromDate: NgbDateStruct | undefined;
    toDate: NgbDateStruct | undefined;
    visible=false;
    selectedChatSession: number = -1;
    constructor(private dialogService: DialogService,
        private readonly _topicService: TopicService,
        private readonly _chatSessionService: ChatSessionService
    ) {}
    data = [];


    ngOnInit(): void {
        this.getChatSessions();
    }

    deleteChatSession() {
        this._chatSessionService.deleteChatSession(this.selectedChatSession).subscribe(
            (response) => {
                this.getChatSessions();
                this.cancel();
            },
            (error) => {
                console.error(error);
            }
        );
    }

    confirm(id: number) {
        this.visible = true;
        this.selectedChatSession = id;
    }

    cancel() {
        this.visible = false;
        this.selectedChatSession = -1;
    }

    getChatSessions() {
        this._chatSessionService.getHistory().subscribe(
            (response) => {
                this.data = response;
            },
            (error) => {
                console.error(error);
            }
        );
    }

    storageChatSession(id: number) {
        const request = {
            Id: id,
            Storage: true
        }
        this._chatSessionService.storageChatSession(id, request).subscribe(
            (response) => {
                this.getChatSessions();
            },
            (error) => {
                console.error(error);
            }
        );
    }

    exportDocx(id: number, name: string) {
        this._chatSessionService.exportDocx(id).subscribe((response: any) => {
            let fileName = 'Chat_' + id + '.docx';
            const blob = new Blob([response.body], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }, (error) => {
            console.error(error);
        })
    }

    showDetail(){
            this.dialogService.open(DetailChatComponent, {
                header: 'Chi tiết cuộc trò chuyện',
                width: '90%',
                height:'90%',
                contentStyle: { "overflow": "auto" },
                baseZIndex: 10000,
                styleClass: 'custom-dialog-class'
            });
    }


}
