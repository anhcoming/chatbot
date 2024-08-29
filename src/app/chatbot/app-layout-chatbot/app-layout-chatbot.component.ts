import {Component, DoCheck, HostListener, OnInit} from '@angular/core';
import {ShareService} from "../service/share.service";
import {ChatbotTheme} from "../chatbot.enum.ts/chatbot.enum";


@Component({
    selector: 'app-layout-chatbot',
    templateUrl: './app-layout-chatbot.component.html',
    styleUrls: [`./app-layout-chatbot.component.scss`],
})
export class AppLayoutChatbotComponent implements OnInit, DoCheck {
    isSidebarClosed = false;
    sidebarVisible = false

    @HostListener('window:resize', ['$event'])
    onResize(event: Event): void {
        this.checkScreenSize();
    }

    constructor(private shareService: ShareService) {
    }

    onSidebarToggled(isClosed: boolean) {
        this.isSidebarClosed = isClosed;
    }

    onSidebarMobileToggled(isClosed: boolean) {
        this.sidebarVisible = isClosed
    }

    toggleSideBar(event: any) {
        this.sidebarVisible = event
    }

    ngOnInit(): void {
        this.checkScreenSize()
    }

    checkScreenSize(): void {
        this.shareService.isMobile.next(window.innerWidth >= 767)
    }

    ngDoCheck(): void {
        this.shareService.theme.next(localStorage.getItem('theme') == ChatbotTheme.light ? ChatbotTheme.light : ChatbotTheme.dark);
    }
}
