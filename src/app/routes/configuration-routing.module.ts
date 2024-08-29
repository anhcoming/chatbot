import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FunctionComponent } from '../components/system/function/function.component';
import { PaymentConfigComponent } from '../components/configuration/payment-config/PaymentConfig.component';
import { AddPaymentConfigComponent } from '../components/configuration/payment-config/add-payment-config/add-payment-config.component';
import { CarParkingConfigComponent } from '../components/configuration/carparking-config/carparking-config.component';
import { AddCarParkingConfigComponent } from '../components/configuration/carparking-config/add-carparking-config/add-carparking-config.component';
import { UtilitiesConfigComponent } from '../components/configuration/utilities-config/utilities-config.component';
import { AddUtilitiesConfigComponent } from '../components/configuration/utilities-config/add-utilities-config/add-utilities-config.component';
import { EmailConfigComponent } from '../components/configuration/email-config/email-config.component';
import { AddEmailConfigComponent } from '../components/configuration/email-config/add-email-config/add-email-config.component';
import { YardConfigComponent } from '../components/configuration/yard-config/yard-config.component';
import { AddYardConfigComponent } from '../components/configuration/yard-config/add-yard-config/add-yard-config.component';
import { AppConfigComponent } from '../components/configuration/app-config/app-config.component';
import { AddAppConfigComponent } from '../components/configuration/app-config/add-app-config/add-app-config.component';
import { UtilitiesServiceComponent } from '../components/configuration/utilities-service/utilities-service.component';
import { AddUtilitiesServiceComponent } from '../components/configuration/utilities-service/add-utilities-service/add-utilities-service.component';


const routes: Routes = [
  {
    path: 'payment-config/list',
    component: PaymentConfigComponent,
  },
  {
    path: 'payment-config/create',
    component: AddPaymentConfigComponent,
  },
  {
    path: 'payment-config/update/:id',
    component: AddPaymentConfigComponent,
  },
  {
    path: 'carparking-config/list',
    component: CarParkingConfigComponent,
  },
  {
    path: 'carparking-config/create',
    component: AddCarParkingConfigComponent,
  },
  {
    path: 'carparking-config/update/:id',
    component: AddCarParkingConfigComponent,
  },
  {
    path: 'utilities-config/list',
    component: UtilitiesConfigComponent,
  },
  {
    path: 'utilities-config/create',
    component: AddUtilitiesConfigComponent,
  },
  {
    path: 'utilities-config/update/:id',
    component: AddUtilitiesConfigComponent,
  },
  {
    path: 'email-config/list',
    component: EmailConfigComponent,
  },
  {
    path: 'email-config/create',
    component: AddEmailConfigComponent,
  },
  {
    path: 'email-config/update/:id',
    component: AddEmailConfigComponent,
  },
  {
    path: 'yard-config/list',
    component: YardConfigComponent,
  },
  {
    path: 'yard-config/create',
    component: AddYardConfigComponent,
  },
  {
    path: 'yard-config/update/:id',
    component: AddYardConfigComponent,
  },
  {
    path: 'app-config/list',
    component: AppConfigComponent,
  },
  {
    path: 'app-config/create',
    component: AddAppConfigComponent,
  },
  {
    path: 'app-config/update/:id',
    component: AddAppConfigComponent,
  },
  {
    path: 'utilities-service/list',
    component : UtilitiesServiceComponent,
  },
  {
    path: 'utilities-service/create',
    component : AddUtilitiesServiceComponent,
  },
  {
    path: 'utilities-service/update/:id',
    component : AddUtilitiesServiceComponent,
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigurationRoutingModule { }
