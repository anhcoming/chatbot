import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {ChatbotTheme} from "../chatbot.enum.ts/chatbot.enum";

@Injectable({
    providedIn: 'root'
})
export class LocalstorageService {
    isDarkTheme = new BehaviorSubject<boolean>(false);

    constructor() {
    }

    getTheme(): string {
        return localStorage.getItem('theme') || ChatbotTheme.light;
    }

    setTheme(theme: ChatbotTheme) {
        this.isDarkTheme.next(theme == ChatbotTheme.dark);
        return localStorage.setItem('theme', theme);
    }
}
