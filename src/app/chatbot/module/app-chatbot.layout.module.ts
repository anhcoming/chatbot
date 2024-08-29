import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import {CheckboxModule} from "primeng/checkbox";
import {SidebarModule} from 'primeng/sidebar';
import {BadgeModule} from 'primeng/badge';
import {RadioButtonModule} from 'primeng/radiobutton';
import {InputSwitchModule} from 'primeng/inputswitch';
import {RippleModule} from 'primeng/ripple';
import {RouterModule} from '@angular/router';
import {BreadcrumbModule} from 'primeng/breadcrumb';
import {CommonModule, DatePipe} from '@angular/common';
import {ButtonModule} from 'primeng/button';
import {MenuModule} from 'primeng/menu';
import {PanelMenuModule} from 'primeng/panelmenu';
import {StyleClassModule} from 'primeng/styleclass';
import {TableModule} from 'primeng/table';
import {ConfirmationService, MessageService} from 'primeng/api';
import {CardModule} from 'primeng/card'
import {DropdownModule} from 'primeng/dropdown';
import {ConfirmPopupModule} from 'primeng/confirmpopup';
import {ToastModule} from 'primeng/toast';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {CalendarModule} from "primeng/calendar";
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import {SelectButtonModule} from 'primeng/selectbutton';
import {ToggleButtonModule} from 'primeng/togglebutton';
import {SplitButtonModule} from 'primeng/splitbutton';
import {MenubarModule} from 'primeng/menubar';
import {ContextMenuModule} from 'primeng/contextmenu';
import {NgSelectModule} from '@ng-select/ng-select';
import {PasswordModule} from 'primeng/password';
import {MultiSelectModule} from 'primeng/multiselect';
import {InputMaskModule} from "primeng/inputmask";
import {PaginatorModule} from 'primeng/paginator';
import {NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
import {AppLayoutChatbotRoutingModule} from "../router/app-layout-chatbot-routing.module";
import {MainChatComponent} from '../component/main-chat/main-chat.component';
import {SidebarChatbotComponent} from "../app-layout-chatbot/sidebar-chatbot/sidebar-chatbot.component";
import {TopbarChatbotComponent} from "../app-layout-chatbot/topbar-chatbot/topbar-chatbot.component";
import {AppLayoutChatbotComponent} from "../app-layout-chatbot/app-layout-chatbot.component";
import {DividerModule} from "primeng/divider";
import {AvatarModule} from "primeng/avatar";
import {WelcomChatComponent} from "../component/welcom-chat/welcom-chat.component";
import {DialogModule} from "primeng/dialog";
import { ChangePasswordComponent } from '../component/change-password/change-password.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';

@NgModule({
    declarations: [
        SidebarChatbotComponent,
        TopbarChatbotComponent,
        AppLayoutChatbotComponent,
        MainChatComponent,
        WelcomChatComponent,
        ChangePasswordComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        InputTextModule,
        SidebarModule,
        BadgeModule,
        OverlayPanelModule,
        MenuModule,
        TableModule,
        StyleClassModule,
        PanelMenuModule,
        ButtonModule,
        BreadcrumbModule,
        RadioButtonModule,
        InputSwitchModule,
        RippleModule,
        RouterModule,
        CardModule,
        ConfirmPopupModule,
        ToastModule,
        ConfirmDialogModule,
        NgbModule,
        CheckboxModule,
        CalendarModule,
        SelectButtonModule,
        ToggleButtonModule,
        SplitButtonModule,
        MenubarModule,
        ContextMenuModule,
        NgSelectModule,
        PasswordModule,
        MultiSelectModule,
        InputMaskModule,
        PaginatorModule,
        NgbPaginationModule,
        AppLayoutChatbotRoutingModule,
        DividerModule,
        AvatarModule,
        DialogModule
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        InputTextModule,
        SidebarModule,
        BadgeModule,
        MenuModule,
        TableModule,
        StyleClassModule,
        PanelMenuModule,
        ButtonModule,
        BreadcrumbModule,
        RadioButtonModule,
        InputSwitchModule,
        RippleModule,
        RouterModule,
        CardModule,
        DropdownModule,
        ConfirmPopupModule,
        ToastModule,
        ConfirmDialogModule,
        NgbModule,
        CheckboxModule,
        CalendarModule,
        SelectButtonModule,
        ToggleButtonModule,
        SplitButtonModule,
        MenubarModule,
        ContextMenuModule,
        NgSelectModule,
        PasswordModule,
        MultiSelectModule,
        InputMaskModule,
        PaginatorModule,
        NgbPaginationModule,
    ],
    providers: [
        MessageService,
        ConfirmationService,
        DialogService,
        DatePipe,
        DynamicDialogRef
    ]
})
export class AppChatbotLayoutModule {
}
