import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppLayoutModule } from 'src/app/layout/app.layout.module';
import { FunctionService } from 'src/app/services/function.service';
import { SystemRoutingModule } from 'src/app/routes/system-routing.module';

import { RoleComponent } from './role/role.component';
import { FunctionComponent } from './function/function.component';
import { AddFunctionComponent } from './function/add-function/add-function.component';
import { AddRoleComponent } from './role/add-role/add-role.component';
import { RoleService } from 'src/app/services/role.service';
import { FunctionRoleComponent } from './function-role/function-role.component';
import { AddFunctionRoleComponent } from './function-role/add-function-role/add-function-role.component';
import { ServicePricingComponent } from './service-pricing/service-pricing.component';
import { AddServicePricingComponent } from './service-pricing/add-service-pricing/add-service-pricing.component';
import { ServicePricingService } from 'src/app/services/service-pricing.service';
import { UserRoleComponent } from './user-role/user-role.component';
import { AddUserRoleComponent } from './user-role/add-user-role/add-user-role.component';
import { PasswordModule } from 'primeng/password';
import { DialogModule } from 'primeng/dialog';


@NgModule({
  declarations: [
    RoleComponent,
    FunctionComponent,
    AddFunctionComponent,
    AddRoleComponent,
    FunctionRoleComponent,
    AddFunctionRoleComponent,
    ServicePricingComponent,
    AddServicePricingComponent,
    UserRoleComponent,
    AddUserRoleComponent,


  ],
  imports: [
    CommonModule,
    AppLayoutModule,
    SystemRoutingModule,
    PasswordModule,
    DialogModule,
  ],
  providers: [
    FunctionService,
    RoleService,
    ServicePricingService
  ]
})
export class SystemModule { }
