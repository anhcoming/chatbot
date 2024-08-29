import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CardVehicleComponent } from '../components/confg-card/card-vehicle/card-vehicle.component';
import { AddCardVehicleComponent } from '../components/confg-card/card-vehicle/add-card-vehicle/add-card-vehicle.component';

const routes: Routes = [
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
export class ConfigCardRoutingModule { }