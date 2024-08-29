import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppLayoutModule } from 'src/app/layout/app.layout.module';
import { PaymentConfigComponent } from './payment-config/PaymentConfig.component';
import { ConfigurationRoutingModule } from 'src/app/routes/configuration-routing.module';
import { AddPaymentConfigComponent } from './payment-config/add-payment-config/add-payment-config.component';
import { CarParkingConfigComponent } from './carparking-config/carparking-config.component';
import { AddCarParkingConfigComponent } from './carparking-config/add-carparking-config/add-carparking-config.component';
import { UtilitiesConfigComponent } from './utilities-config/utilities-config.component';
import { EmailConfigComponent } from './email-config/email-config.component';
import { YardConfigComponent } from './yard-config/yard-config.component';
import { AppConfigComponent } from './app-config/app-config.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { AddUtilitiesConfigComponent } from './utilities-config/add-utilities-config/add-utilities-config.component';
import { AddEmailConfigComponent } from './email-config/add-email-config/add-email-config.component';
import { AddYardConfigComponent } from './yard-config/add-yard-config/add-yard-config.component';
import { AddAppConfigComponent } from './app-config/add-app-config/add-app-config.component';
import { AddYardDialogComponent } from './yard-config/dialog/add-yard-dialog/add-yard-dialog.component';
import { TableModule } from 'primeng/table';
import { PasswordModule } from 'primeng/password';
import { ConfigPaymentService } from 'src/app/services/config-payment.service';
import { UtilitiesServiceComponent } from './utilities-service/utilities-service.component';
import { AddUtilitiesServiceComponent } from './utilities-service/add-utilities-service/add-utilities-service.component';
import { CurrencyMaskModule } from "ng2-currency-mask";

@NgModule({
declarations: [
    PaymentConfigComponent,
    AddPaymentConfigComponent,
    CarParkingConfigComponent,
    AddCarParkingConfigComponent,
    UtilitiesConfigComponent,
    EmailConfigComponent,
    YardConfigComponent,
    AppConfigComponent,
    AddUtilitiesConfigComponent,
    AddEmailConfigComponent,
    AddYardConfigComponent,
    AddAppConfigComponent,
    AddYardDialogComponent,
    UtilitiesServiceComponent,
    AddUtilitiesServiceComponent,
  ],
  imports: [
    CommonModule,
    AppLayoutModule,
    TableModule,
    PasswordModule,
    ConfigurationRoutingModule,
    CKEditorModule,
    CurrencyMaskModule
  ],
  providers: [
    ConfigPaymentService,
  ],
})
export class PaymentConfigModule { }
