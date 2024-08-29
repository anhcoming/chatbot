import {Component, DoCheck, OnInit} from '@angular/core';
import {ShareService} from "../../service/share.service";
import {ChatbotTheme} from "../../chatbot.enum.ts/chatbot.enum";

@Component({
    selector: 'app-welcom-chat',
    templateUrl: './welcom-chat.component.html',
    styleUrls: ['./welcom-chat.component.scss']
})
export class WelcomChatComponent implements OnInit,DoCheck {
    constructor(private shareService:ShareService) {
    }

    ngOnInit(): void {
    }

    get theme(){
        return this.shareService.theme.getValue() == ChatbotTheme.light
    }

    ngDoCheck(): void {
    }
}
