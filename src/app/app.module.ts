import { NgModule } from '@angular/core';
import { APP_BASE_HREF, CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { NotfoundComponent } from './components/shared/notfound/notfound.component';
import { EmptyComponent } from './components/shared/empty/empty.component';
import { ErrorComponent } from './components/shared/error/error.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DataService } from './shared/services/data.service';
import { StorageService } from './shared/services/storage.service';
import { CookieService } from 'ngx-cookie-service';
import { AppInterceptor } from './shared/interceptors/app.interceptor';
import { AuthService } from './services/auth.service';
import { SharedModule } from 'primeng/api';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideMessaging,getMessaging } from '@angular/fire/messaging';
import { FormsModule } from '@angular/forms';
import {AppChatbotLayoutModule} from "./chatbot/module/app-chatbot.layout.module";
import { WelcomChatComponent } from './chatbot/component/welcom-chat/welcom-chat.component';
import { HistoryChatComponent } from './chatbot/component/history-chat/history-chat.component';
import { DetailChatComponent } from './chatbot/component/detail-chat/detail-chat.component';
import { UserInfoComponent } from './chatbot/component/user-info/user-info.component';
import { SavedComponent } from './chatbot/component/saved/saved.component';
import {DialogModule} from "primeng/dialog";

@NgModule({
    declarations: [
        AppComponent,
        NotfoundComponent,
        EmptyComponent,
        ErrorComponent,
        HistoryChatComponent,
        DetailChatComponent,
        UserInfoComponent,
        SavedComponent,
    ],
    imports: [
        BrowserModule,
        CommonModule,
        BrowserAnimationsModule,
        HttpClientModule,
        AppRoutingModule,
        AppLayoutModule,
        AppChatbotLayoutModule,
        SharedModule,
        FormsModule,
        provideFirebaseApp(() => initializeApp(environment.firebase)),

        provideMessaging(() => getMessaging()),
        DialogModule
    ],
    providers: [
        {provide: APP_BASE_HREF, useValue: ''},
        {provide: LocationStrategy, useClass: HashLocationStrategy},
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AppInterceptor,
            multi: true
        },
        DataService,
        AuthService,
        CookieService,
        StorageService,
    ],
    exports: [
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
