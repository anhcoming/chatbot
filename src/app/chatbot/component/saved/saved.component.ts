import { Component } from '@angular/core';
import {DetailChatComponent} from "../detail-chat/detail-chat.component";
import {DialogService} from "primeng/dynamicdialog";
import {NgbDateStruct} from "@ng-bootstrap/ng-bootstrap";
import { ChatbotService } from 'src/app/shared/services/chatbot.service';
import { TopicService } from 'src/app/services/topic.service';
import { ChatSessionService } from 'src/app/services/chatSession.service';

@Component({
  selector: 'app-saved',
  templateUrl: './saved.component.html',
  styleUrls: ['./saved.component.scss']
})
export class SavedComponent {
    constructor(private dialogService: DialogService,
        private _chatBotService: ChatbotService,
        private readonly _topicService: TopicService,
        private readonly _chatSessionService: ChatSessionService
    ) {}
    fromDate: NgbDateStruct | undefined;
    toDate: NgbDateStruct | undefined;
    visible=false
    selectedChatSession: number = -1;
    data = [];

    getChatStorages(){
        this._chatSessionService.getChatStorages().subscribe(
            (response) => {
                this.data = response;
            },
            (error) => {
                console.error(error);
            }
        );
    }

    cancel(){
        this.visible = false;
        this.selectedChatSession = -1;
    }

    confirm(id: number){
        this.visible = true;
        this.selectedChatSession = id;
    }

    deleteChatSession(){
        this._chatSessionService.deleteChatSession(this.selectedChatSession).subscribe(
            (response) => {
                this.getChatStorages();
                this.cancel();
            },
            (error) => {
                console.error(error);
            }
        );
    }


    unStorageChatSession(id: number) {
        const request = {
            Id: id,
            Storage: false
        }
        this._chatSessionService.storageChatSession(id, request).subscribe(
            (response) => {
                this.getChatStorages();
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

    ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        this.getChatStorages();
    }


    showDetail(id: number){
        this.dialogService.open(DetailChatComponent, {
            header: 'Chi tiết cuộc trò chuyện',
            width: '90%',
            height:'90%',
            contentStyle: { "overflow": "auto" },
            baseZIndex: 10000,
            styleClass: 'custom-dialog-class',
            data: {
                id: id
            }
        });
    }

}
