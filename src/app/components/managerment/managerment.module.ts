import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppLayoutModule } from 'src/app/layout/app.layout.module';
import { ManagermentRoutingModule } from 'src/app/routes/managerment-routing.module';
import { AddCompanyComponent } from './company/add-company/add-company.component';
import { CompanyComponent } from './company/company.component';
import {TableModule} from 'primeng/table';
import { CompanyService } from 'src/app/services/company.service';
import { PasswordModule } from 'primeng/password';
import { DialogsPricingComponent } from './company/dialogs/dialogs-pricing/dialogs-pricing.component';
import { PricingCompanyComponent } from './company/dialogs/pricing-company/pricing-company.component';
import { ChangePasswordComponent } from './company/dialogs/change-password/change-password.component';


@NgModule({
  declarations: [
    CompanyComponent,
    AddCompanyComponent,
    DialogsPricingComponent,
    PricingCompanyComponent,
    ChangePasswordComponent,
  ],
  imports: [
    CommonModule,
    AppLayoutModule,
    ManagermentRoutingModule,
    TableModule,
    PasswordModule
  ],
  providers: [
    CompanyService
  ]
})
export class ManagermentModule { }
