import { Component, DoCheck, EventEmitter, OnInit, Output } from '@angular/core';
import { ChatbotTheme } from "../../chatbot.enum.ts/chatbot.enum";
import { LocalstorageService } from "../../service/localstorage.service";
import { ShareService } from '../../service/share.service';

declare var $: any;
@Component({
    selector: 'app-topbar-chatbot',
    templateUrl: './topbar-chatbot.component.html',
    styleUrls: ['./topbar-chatbot.component.scss']
})
export class TopbarChatbotComponent implements DoCheck, OnInit {
    visible = false
    isShowPass = false
    theme: ChatbotTheme = ChatbotTheme.light
    isToggle = false
    sidebarVisible3 = false
    @Output() toggle = new EventEmitter(false)
    ChatbotTheme = ChatbotTheme
    openModalChangePass: boolean = false;
    hideCurrentPass: boolean = true;
    hideNewPass: boolean = true;
    hideConfirmPass: boolean = true;
    showOverlay = false;

    constructor(private localstorageService: LocalstorageService,private shareService:ShareService) {
    }

    switchTheme() {
        this.theme = this.theme == ChatbotTheme.dark ? ChatbotTheme.light : ChatbotTheme.dark;
        document.documentElement.setAttribute('data-theme', this.theme);
        this.localstorageService.setTheme(this.theme)
    }

    toggleSidebar() {
        this.toggle.emit(!this.isToggle);
    }

    ngDoCheck(): void {
        const popup = document.getElementById("top-popup") as HTMLInputElement;
        // console.log(popup.className)

    }

    showPass() {
        this.isShowPass = !this.isShowPass;
    }

    openModal() {
        this.openModalChangePass = true;
    }

    ngOnInit(): void {
        this.theme = this.localstorageService.getTheme() == ChatbotTheme.dark ? ChatbotTheme.dark : ChatbotTheme.light;
        this.localstorageService.setTheme(this.theme)
        document.documentElement.setAttribute('data-theme', this.theme);
    }

}
