import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from "primeng/checkbox";
import { SidebarModule } from 'primeng/sidebar';
import { BadgeModule } from 'primeng/badge';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputSwitchModule } from 'primeng/inputswitch';
import { RippleModule } from 'primeng/ripple';
import { AppMenuComponent } from './app.menu.component';
import { AppMenuitemComponent } from './app.menuitem.component';
import { RouterModule } from '@angular/router';
import { AppTopBarComponent } from './app.topbar.component';
import { AppFooterComponent } from './app.footer.component';
import { AppConfigModule } from './config/config.module';
import { AppSidebarComponent } from "./app.sidebar.component";
import { AppLayoutComponent } from "./app.layout.component";
import { AppBeadcrumbComponent } from './app-beadcrumb.component';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { AppLayoutRoutingModule } from '../routes/app-layout-routing.module';
import { CommonModule, DatePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { PanelMenuModule } from 'primeng/panelmenu';
import { StyleClassModule } from 'primeng/styleclass';
import { TableModule } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card'
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ComfirmDialogComponent } from '../components/shared/comfirm-dialog/comfirm-dialog.component';
import { AuthGuard } from '../shared/services/auth.guard';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CalendarModule } from "primeng/calendar";
import { DialogService , DynamicDialogRef } from 'primeng/dynamicdialog';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MenubarModule } from 'primeng/menubar';
import { ContextMenuModule } from 'primeng/contextmenu';
import { NgSelectModule } from '@ng-select/ng-select';
import { PasswordModule } from 'primeng/password';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputMaskModule } from "primeng/inputmask";
import { PaginatorModule } from 'primeng/paginator';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations: [
        AppMenuitemComponent,
        AppTopBarComponent,
        AppFooterComponent,
        AppMenuComponent,
        AppSidebarComponent,
        AppLayoutComponent,
        AppBeadcrumbComponent,
        ComfirmDialogComponent,
    ],
    imports: [
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
        AppConfigModule,
        AppLayoutRoutingModule,
        CardModule,
        ConfirmPopupModule ,
        ToastModule ,
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
        AppConfigModule,
        AppLayoutComponent,
        CardModule,
        DropdownModule,
        ConfirmPopupModule,
        ToastModule,
        ConfirmDialogModule,
        NgbModule,
        CheckboxModule,
        CalendarModule,
        SelectButtonModule,
        ToggleButtonModule ,
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
        AuthGuard,
        MessageService,
        ConfirmationService,
        DialogService,
        DatePipe,
        DynamicDialogRef
      ]
})
export class AppLayoutModule { }
