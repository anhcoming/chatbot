import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RoleComponent } from '../components/system/role/role.component';
import { FunctionComponent } from '../components/system/function/function.component';
import { AddFunctionComponent } from '../components/system/function/add-function/add-function.component';
import { AddRoleComponent } from '../components/system/role/add-role/add-role.component';
import { FunctionRoleComponent } from '../components/system/function-role/function-role.component';
import { AddFunctionRoleComponent } from '../components/system/function-role/add-function-role/add-function-role.component';
import { AddServicePricingComponent } from '../components/system/service-pricing/add-service-pricing/add-service-pricing.component';
import { ServicePricingComponent } from '../components/system/service-pricing/service-pricing.component';
import { UserRoleComponent } from '../components/system/user-role/user-role.component';
import { AddUserRoleComponent } from '../components/system/user-role/add-user-role/add-user-role.component';


const routes: Routes = [
  {
    path: 'function/list',
    component: FunctionComponent,
  },
  {
    path: 'function/create',
    component: AddFunctionComponent,
  },
  {
    path: 'function/update/:funcId',
    component: AddFunctionComponent,
  },
  {
    path: 'role/create',
    component: AddRoleComponent,
  },
  {
    path: 'role/update/:roleId',
    component: AddRoleComponent,
  },
  {
    path: 'role/list',
    component: RoleComponent,
  },
  {
    path: 'function-role/list',
    component: FunctionRoleComponent,
  },
  {
    path: 'function-role/create',
    component: AddFunctionRoleComponent,
  },
  {
    path: 'function-role/update/:Id',
    component: AddFunctionRoleComponent,
  },
  {
    path: 'service-pricing/list',
    component: ServicePricingComponent,
  },
  {
    path: 'service-pricing/create',
    component: AddServicePricingComponent,
  },
  {
    path: 'service-pricing/update/:id',
    component: AddServicePricingComponent,
  },
  {
    path: 'user-role/list',
    component: UserRoleComponent,
  },
  {
    path: 'user-role/create',
    component: AddUserRoleComponent,
  },
  {
    path: 'user-role/update/:id',
    component: AddUserRoleComponent,
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemRoutingModule { }
