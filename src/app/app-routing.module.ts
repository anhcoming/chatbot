import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './components/shared/notfound/notfound.component';
import { EmptyComponent } from './components/shared/empty/empty.component';

@NgModule({
    imports: [
        RouterModule.forRoot([
            { path: '', loadChildren: () => import('./layout/app.layout.module').then(m => m.AppLayoutModule) },
            { path: 'auth', loadChildren: () => import('./components/auth/auth.module').then(m => m.AuthModule) },
            { path: 'notfound', component: NotfoundComponent },
            { path: 'empty', component: EmptyComponent },
            { path: 'chat-bot', loadChildren: () => import('././chatbot/module/app-chatbot.layout.module').then(m => m.AppChatbotLayoutModule) },
            { path: '**', redirectTo: '/notfound' },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
