import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TypeCardComponent } from '../components/config-utilities/type-card/type-card.component';
import { AddTypeCardComponent } from '../components/config-utilities/type-card/add-type-card/add-type-card.component';
import { ConfigCardComponent } from '../components/config-utilities/config-card/config-card.component';
import { AddCardVehicleComponent } from '../components/config-utilities/card-vehicle/add-card-vehicle/add-card-vehicle.component';
import { CardVehicleComponent } from '../components/config-utilities/card-vehicle/card-vehicle.component';
import { AddConfigCardComponent } from '../components/config-utilities/config-card/add-config-card/add-config-card.component';

const routes: Routes = [
  {
    path: 'type-card/list',
    component: TypeCardComponent,
  },
  {
    path: 'type-card/create',
    component: AddTypeCardComponent,
  },
  {
    path: 'type-card/detail/:id',
    component: AddTypeCardComponent,
  },
  {
    path: 'config-card/list',
    component: ConfigCardComponent,
  },
  {
    path: 'config-card/create',
    component: AddConfigCardComponent,
  },
  {
    path: 'config-card/detail/:id',
    component: AddConfigCardComponent,
  },
  {
    path: 'card-vehicle/list',
    component: CardVehicleComponent,
  },
  {
    path: 'card-vehicle/create',
    component: AddCardVehicleComponent,
  },
  {
    path: 'card-vehicle/update/:id',
    component: AddCardVehicleComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigUtilitiesRoutingModule { }
