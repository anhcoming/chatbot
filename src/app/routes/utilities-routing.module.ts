import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransferGoodComponent } from '../components/utilities/transfer-good/transfer-good.component';
import { AddTransferGoodComponent } from '../components/utilities/transfer-good/add-transfer-good/add-transfer-good.component';
import { AddResidentServiceManagerComponent } from '../components/utilities/registration/resident-service-manager/add-resident-service-manager/add-resident-service-manager.component';
import { RegistrationComponent } from '../components/utilities/registration/registration.component';
import { ChangeInformationComponent } from '../components/utilities/registration/change-information/change-information.component';
import { CardCancelComponent } from '../components/utilities/registration/card-cancel/card-cancel.component';
import { compileClassMetadata } from '@angular/compiler';
import { CardLockComponent } from '../components/utilities/registration/card-lock/card-lock.component';
import { CardComponent } from '../components/utilities/card/card.component';
import { AddCardEmptyComponent } from '../components/utilities/card/add-card-empty/add-card-empty.component';
import { RegistrationConstructionComponent } from '../components/utilities/registration-construction/registration-construction.component';
import { AddRegisConstructionComponent } from '../components/utilities/registration-construction/add-regis-construction/add-regis-construction.component';
import { YardBookingComponent } from '../components/utilities/yard-booking/yard-booking.component';
import { AddBookingComponent } from '../components/utilities/yard-booking/add-booking/add-booking.component';
import { CardUnlockComponent } from '../components/utilities/registration/card-unlock/card-unlock.component';
import { OrderAcceptanceComponent } from '../components/utilities/registration-construction/add-regis-construction/order-acceptance/order-acceptance.component';
import { AddOrderAcceptanceComponent } from '../components/utilities/registration-construction/add-regis-construction/order-acceptance/add-order-acceptance/add-order-acceptance.component';

const routes: Routes = [
    {
      path: 'order-transport/list',
      component: TransferGoodComponent,
    },
    {
      path : 'order-transport/create/in',
      component: AddTransferGoodComponent,
    },
    {
      path : 'order-transport/create/out',
      component: AddTransferGoodComponent,
    },
    {
      path : 'order-transport/update/:id',
      component: AddTransferGoodComponent,
    },
    {
      path: 'resident-service/create',
      component: AddResidentServiceManagerComponent,
    },
    {
      path: 'resident-service/update/:id',
      component: AddResidentServiceManagerComponent,
    },
    {
      path: 'registration/list',
      component: RegistrationComponent,
    },
    {
      path: 'registration/change-information',
      component: ChangeInformationComponent,
    },
    {
      path: 'registration/update/:id',
      component: ChangeInformationComponent,
    },
    {
      path : 'cancel-card/create',
      component: CardCancelComponent,
    },
    {
      path : 'cancel-card/update/:id',
      component: CardCancelComponent,
    },
    {
      path: 'resident-service/card-lock',
      component : CardLockComponent,
    },
    {
      path: 'resident-service/card-lock/update/:id',
      component : CardLockComponent,
    },
    {
      path: 'resident-service/card-unlock',
      component : CardUnlockComponent,
    },
    {
      path: 'resident-service/card-unlock/update/:id',
      component : CardUnlockComponent,
    },
    {
      path: 'card/list',
      component : CardComponent,
    },
    {
      path: 'card/create',
      component : AddCardEmptyComponent,
    },
    {
      path: 'card/detail/:id',
      component : AddCardEmptyComponent,
    },
    {
      path: 'construction/list',
      component : RegistrationConstructionComponent,
    },
    {
      path : 'construction/create',
      component : AddRegisConstructionComponent,
    },
    {
      path : 'construction/update/:id',
      component : AddRegisConstructionComponent,
    },
    {
      path: 'yard-booking/list',
      component : YardBookingComponent,
    },
    {
      path : 'yard-booking/create',
      component : AddBookingComponent,
    },
    {
      path : 'yard-booking/update/:id',
      component : AddBookingComponent,
    },
    {
      path : 'order-acceptance/list',
      component : OrderAcceptanceComponent,
    },
    {
      path : 'order-acceptance/create',
      component : AddOrderAcceptanceComponent,
    },
    {
      path : 'order-acceptance/update/:id',
      component : AddOrderAcceptanceComponent,
    }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UtilitiesRoutingModule { }
