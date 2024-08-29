import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {ChatbotTheme} from "../chatbot.enum.ts/chatbot.enum";

@Injectable({
    providedIn: 'root'
})
export class ShareService {

    theme = new BehaviorSubject<ChatbotTheme>(ChatbotTheme.light);
    isMobile = new BehaviorSubject<any>(null);
    isCollapsed = new BehaviorSubject<boolean>(false);
    constructor() {
    }
}
