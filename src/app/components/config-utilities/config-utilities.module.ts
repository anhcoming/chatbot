import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TypeCardComponent } from './type-card/type-card.component';
import { AppLayoutModule } from 'src/app/layout/app.layout.module';
import { ConfigUtilitiesRoutingModule } from 'src/app/routes/config-utilities-routing.module';
import { TypeCardService } from 'src/app/services/type-card.service';
import { VehicleService } from 'src/app/services/vehicle.service';
import { AddTypeCardComponent } from './type-card/add-type-card/add-type-card.component';
import { ConfigCardComponent } from './config-card/config-card.component';
import { ConfigCardService } from 'src/app/services/config-card.service';
import { AddCardVehicleComponent } from './card-vehicle/add-card-vehicle/add-card-vehicle.component';
import { CardVehicleComponent } from './card-vehicle/card-vehicle.component';
import { AddConfigCardComponent } from './config-card/add-config-card/add-config-card.component';
import { ConfigCardDetailComponent } from './config-card/add-config-card/config-card-detail/config-card-detail.component';


@NgModule({
  declarations: [
    TypeCardComponent,
    AddTypeCardComponent,
    ConfigCardComponent,
    CardVehicleComponent,
    AddCardVehicleComponent,
    AddConfigCardComponent,
    ConfigCardDetailComponent
  ],
  imports: [
    CommonModule,
    AppLayoutModule,
    ConfigUtilitiesRoutingModule,
  ],
  providers: [
    TypeCardService,
    VehicleService,
    ConfigCardService
  ]
})
export class ConfigUtilitiesModule { }
