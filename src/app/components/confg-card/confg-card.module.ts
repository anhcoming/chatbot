import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppLayoutModule } from 'src/app/layout/app.layout.module';
import { ConfigCardRoutingModule } from 'src/app/routes/config-card-routing.module';
import { CardVehicleComponent } from './card-vehicle/card-vehicle.component';
import { AddCardVehicleComponent } from './card-vehicle/add-card-vehicle/add-card-vehicle.component';



@NgModule({
  declarations: [
    CardVehicleComponent,
    AddCardVehicleComponent
  ],
  imports: [
    CommonModule,
    AppLayoutModule,
    ConfigCardRoutingModule,
  ],
  providers: [
  ]
})
export class ConfigCardModule { }
