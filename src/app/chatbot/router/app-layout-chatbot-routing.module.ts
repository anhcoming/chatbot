import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AppLayoutChatbotComponent} from "../app-layout-chatbot/app-layout-chatbot.component";
import {HistoryChatComponent} from "../component/history-chat/history-chat.component";
import {UserInfoComponent} from "../component/user-info/user-info.component";
import {MainChatComponent} from "../component/main-chat/main-chat.component";
import {SavedComponent} from "../component/saved/saved.component";
import { ChangePasswordComponent } from '../component/change-password/change-password.component';


const routes: Routes = [
    {
        path: '', component: AppLayoutChatbotComponent,
        children: [
            {path: '', component: MainChatComponent},
            {path: 'history', component: HistoryChatComponent},
            {path: 'user-info', component: UserInfoComponent},
            {path: 'saved', component: SavedComponent},
            {path: 'change-password', component: ChangePasswordComponent},
            {path: ':id', component: MainChatComponent},
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AppLayoutChatbotRoutingModule {
}
