import { NgModule } from '@angular/core';
import { AppLayoutModule } from 'src/app/layout/app.layout.module';
import { CommonModule } from '@angular/common';
import { UtilitiesRoutingModule } from 'src/app/routes/utilities-routing.module'
import { TransferGoodComponent } from './transfer-good/transfer-good.component';
import { AddTransferGoodComponent } from './transfer-good/add-transfer-good/add-transfer-good.component';
import { CancelTransferGoodComponent } from './transfer-good/cancel-order-transport/cancel-transfer-good.component';
import { PaymentTransferComponent } from './transfer-good/payment-transfer/payment-transfer.component';
import { CarCardComponent } from './registration/resident-service-manager/dialogs/car-card/car-card.component';
import { RegistrationComponent } from './registration/registration.component';
import { AddResidentServiceManagerComponent } from './registration/resident-service-manager/add-resident-service-manager/add-resident-service-manager.component';
import { ResidentCardComponent } from './registration/resident-service-manager/dialogs/resident-card/resident-card.component';
import { ResidentMoveInComponent } from './registration/resident-service-manager/dialogs/resident-move-in/resident-move-in.component';
import { ChangeInformationComponent } from './registration/change-information/change-information.component';
import { ResidentInformationComponent } from './registration/change-information/dialogs/resident-information/resident-information.component';
import { ResidentCardInformationComponent } from './registration/change-information/dialogs/resident-card-information/resident-card-information.component';
import { VehicleCardInformationComponent } from './registration/change-information/dialogs/vehicle-card-information/vehicle-card-information.component';
import { CardCancelComponent } from './registration/card-cancel/card-cancel.component';
import { CardLockComponent } from './registration/card-lock/card-lock.component';
import { CardService } from 'src/app/services/card.service';
import { CardComponent } from './card/card.component';
import { AddCardEmptyComponent } from './card/add-card-empty/add-card-empty.component';
import { RegistrationConstructionComponent } from './registration-construction/registration-construction.component';
import { AddRegisConstructionComponent } from './registration-construction/add-regis-construction/add-regis-construction.component';
import { DepositPaymentComponent } from './registration-construction/add-regis-construction/deposit-payment/deposit-payment.component';
import { ConstructionUnitComponent } from './registration-construction/add-regis-construction/construction-unit/construction-unit.component';
import { ConstructionExtendComponent } from './registration-construction/add-regis-construction/construction-extend/construction-extend.component';
import { ConstructionDocumentsComponent } from './registration-construction/add-regis-construction/construction-documents/construction-documents.component';
import { CancelComponent } from './registration/resident-service-manager/dialogs/cancel/cancel.component';
import { YardBookingComponent } from './yard-booking/yard-booking.component';
import { AddBookingComponent } from './yard-booking/add-booking/add-booking.component';
import { CancelChangeComponent } from './registration/change-information/dialogs/cancel/cancel.component';
import { CancelDocumentComponent } from './registration-construction/add-regis-construction/cancel-document/cancel-document.component'
import { CardUnlockComponent } from './registration/card-unlock/card-unlock.component';
import { AddPayComponent } from './yard-booking/dialogs/add-pay/add-pay.component';
import { CancelRegistrationComponent } from './yard-booking/dialogs/cancel-registration/cancel-registration.component'
import { ChatHistoryComponent } from './transfer-good/chat-history/chat-history.component'
import { RatingModule } from 'primeng/rating';
import { OrderAcceptanceComponent } from './registration-construction/add-regis-construction/order-acceptance/order-acceptance.component';
import { AddOrderAcceptanceComponent } from './registration-construction/add-regis-construction/order-acceptance/add-order-acceptance/add-order-acceptance.component';
import { CurrencyMaskModule } from "ng2-currency-mask";
import { CancellationLogComponent } from './yard-booking/dialogs/cancellation-log/cancellation-log.component';

//import { CardComponent } from './card/card.component';

@NgModule({
    declarations: [
        TransferGoodComponent,
        AddTransferGoodComponent,
        CancelTransferGoodComponent,
        PaymentTransferComponent,
        RegistrationComponent,
        CarCardComponent,
        RegistrationComponent,        
        AddResidentServiceManagerComponent,
        ResidentCardComponent,
        ResidentMoveInComponent,
        RegistrationComponent,
        ChangeInformationComponent,
        ResidentInformationComponent,
        ResidentCardInformationComponent,
        CardLockComponent,
        CardComponent,
        VehicleCardInformationComponent,
        AddCardEmptyComponent,
        RegistrationConstructionComponent,
        AddRegisConstructionComponent,
        DepositPaymentComponent,
        ConstructionUnitComponent,
        ConstructionExtendComponent,
        ConstructionDocumentsComponent,
        CancelComponent,
        YardBookingComponent,
        AddBookingComponent,
        CancelChangeComponent,
        CardCancelComponent,
        CancelDocumentComponent,
        CardUnlockComponent,
        AddPayComponent,
        CancelRegistrationComponent,
        ChatHistoryComponent,
        OrderAcceptanceComponent,
        AddOrderAcceptanceComponent,
        CancellationLogComponent,

      ],
      imports: [
        CommonModule,
        AppLayoutModule,
        UtilitiesRoutingModule,
        RatingModule,
        CurrencyMaskModule,
      ],
      providers: [
        CardService
      ]
    })
    export class UtilitiesModule { }
