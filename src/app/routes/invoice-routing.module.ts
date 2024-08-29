import { NgModule } from '@angular/core';
import { RouterModule, Routes, } from '@angular/router';
import { AddInvServiceConfigComponent } from '../components/invoice/inv-service-config/add-inv-service-config/add-inv-service-config.component';
import { InvServiceConfigComponent } from '../components/invoice/inv-service-config/inv-service-config.component';
import { AddInvServiceGroupComponent } from '../components/invoice/inv-service-group/add-inv-service-group/add-inv-service-group.component';  
import { InvServiceGroupComponent } from '../components/invoice/inv-service-group/inv-service-group.component';
import { AddInvServiceComponent } from '../components/invoice/inv-service/add-inv-service/add-inv-service.component';
import { InvServiceComponent } from '../components/invoice/inv-service/inv-service.component';
import { CustomerComponent } from '../components/invoice/customer/customer.component';
import { AddCustomerComponent } from '../components/invoice/customer/add-customer/add-customer.component';
import { ManagerServiceComponent } from '../components/invoice/manager-service/manager-service.component';
import { AddManagerServiceComponent } from '../components/invoice/manager-service/add-manager-service/add-manager-service.component';
import { ElectricIndexComponent } from '../components/invoice/monthly-service/electric-index/electric-index.component';
import { WaterIndexComponent } from '../components/invoice/monthly-service/water-index/water-index.component';
import { AddWaterIndexComponent } from '../components/invoice/monthly-service/water-index/add-water-index/add-water-index.component';
import { AddElectricIndexComponent } from '../components/invoice/monthly-service/electric-index/add-electric-index/add-electric-index.component';
import { DetailElectricIndexComponent } from '../components/invoice/monthly-service/electric-index/detail-electric-index/detail-electric-index.component';
import { DetailWaterIndexComponent } from '../components/invoice/monthly-service/water-index/detail-water-index/detail-water-index.component';



const routes: Routes = [
  {
    path: 'inv-service/list',
    component: InvServiceComponent,
  },
  {
    path: 'inv-service/create',
    component: AddInvServiceComponent,
  },
  {
    path: 'inv-service/update/:id',
    component: AddInvServiceComponent,
  },
  {
    path: 'inv-service-group/list',
    component: InvServiceGroupComponent,
  },
  {
    path: 'inv-service-group/create',
    component: AddInvServiceGroupComponent,
  },
  {
    path: 'inv-service-group/update/:id',
    component: AddInvServiceGroupComponent,
  },
  {
    path: 'inv-service-config/list',
    component: InvServiceConfigComponent
    ,
  },
  {
    path: 'inv-service-config/create',
    component: AddInvServiceConfigComponent
    ,
  },

  {
    path: 'inv-service-config/update/:id',
    component: AddInvServiceConfigComponent
    ,
  },
  {
    path: 'customer/list',
    component: CustomerComponent
    ,
  },
  {
    path: 'customer/create',
    component: AddCustomerComponent
    ,
  },

  {
    path: 'customer/update/:id',
    component: AddCustomerComponent
    ,
  },
  {
    path: 'manager-service/list',
    component: ManagerServiceComponent,
  },
  {
    path: 'manager-service/create',
    component: AddManagerServiceComponent,
  },
  {
    path: 'manager-service/update/:id',
    component: AddManagerServiceComponent,
  },
  {
    path: 'electric-index/list',
    component: ElectricIndexComponent,
  },
  {
    path: 'electric-index/create',
    component: AddElectricIndexComponent,
  },
  {
    path: 'electric-index/detail',
    component: DetailElectricIndexComponent,
  },
  {
    path: 'electric-index/update/:id',
    component: AddElectricIndexComponent,
  },
  {
    path: 'water-index/list',
    component: WaterIndexComponent,
  },
  {
    path: 'water-index/create',
    component: AddWaterIndexComponent,
  },
  {
    path: 'water-index/update/:id',
    component: AddWaterIndexComponent,
  },
  {
    path : 'water-index/detail',
    component : DetailWaterIndexComponent,
  }
  // {
  //   path: 'project/detail/:proId',
  //   component: AddProjectComponent
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoiceRoutingModule { }
