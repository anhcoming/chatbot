import { UserModule } from './../components/user/user.module';
import { AppLayoutComponent } from './../layout/app.layout.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { DashboardModule } from '../components/dashboard/dashboard.module';
import { AuthGuard } from '../shared/services/auth.guard';


const routes: Routes = [
  {
    path: '', component: AppLayoutComponent,
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: DashboardComponent
      },
      // { path: '', loadChildren: () => import('../components/dashboard/dashboard.module').then(m => m.DashboardModule)},
      { path: 'user', loadChildren: () => import('../components/user/user.module').then(m => m.UserModule)},
      { path: 'category', loadChildren: () => import('../components/category/category.module').then(m => m.CategoryModule)},
      { path: 'system', loadChildren: () => import('../components/system/system.module').then(m => m.SystemModule)},
      { path: 'commons', loadChildren: () => import('../components/commons/common.module').then(m => m.CommonsModule)},
      { path: 'manager-category', loadChildren: () => import('../components/manager-category/manager-category.module').then(m=>m.ManagerCategoryModule)},
      { path: 'managerment', loadChildren: () => import('../components/managerment/managerment.module').then(m => m.ManagermentModule)},
      { path: 'invoice', loadChildren: () => import('../components/invoice/invoice.module').then(m => m.InvoiceModule)},
      { path: 'utilities', loadChildren: () => import('../components/utilities/utilities.module').then(m => m.UtilitiesModule)},
      { path: 'manager-contract', loadChildren: () => import('../components/manager-contract/manager-contract.module').then(m => m.ManagerContractModule)},
      { path: 'configuration', loadChildren: () => import('../components/configuration/configuration.module').then(m => m.PaymentConfigModule)},
      { path: 'config-utilities', loadChildren: () => import('../components/config-utilities/config-utilities.module').then(m => m.ConfigUtilitiesModule)},
      { path: 'demo', loadChildren: () => import('../components/Demo/demo.module').then(m => m.DemoModule)},

    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppLayoutRoutingModule { }
