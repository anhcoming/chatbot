import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppLayoutModule } from 'src/app/layout/app.layout.module';
import { CountriesComponent } from './countries/countries.component';
import { DistrictsComponent } from './districts/districts.component';
import { ProvincesComponent } from './provinces/provinces.component';
import { TypeAttributeComponent } from './type-attribute/type-attribute.component';
import { WardsComponent } from './wards/wards.component';
import { DistrictsService } from 'src/app/services/districts.service';
import { CountriesService } from 'src/app/services/countries.service';
import { ProvincesService } from 'src/app/services/provinces.service';
import { TypeAttributeService } from 'src/app/services/type-attribute.service';
import { WardsService } from 'src/app/services/wards.service';
import { CommonService } from 'src/app/services/common.service';
import { CommonRoutingModule } from 'src/app/routes/common-routing.module';
import { AddCountryComponent } from './countries/add-country/add-country.component';
import { AddProvinceComponent } from './provinces/add-province/add-province.component';
import { AddWardComponent } from './wards/add-ward/add-ward.component';
import { AddDistrictComponent } from './districts/add-district/add-district.component';
import { AddTypeAttributeComponent } from './type-attribute/add-type-attribute/add-type-attribute.component';
import { AddTypeComponent } from './type-attribute/add-type/add-type.component';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';

@NgModule({
declarations: [
    CountriesComponent,
    DistrictsComponent,
    ProvincesComponent,
    TypeAttributeComponent,
    WardsComponent,
    AddCountryComponent,
    AddProvinceComponent,
    AddWardComponent,
    AddDistrictComponent,
    AddTypeAttributeComponent,
    AddTypeComponent,
    ConfirmModalComponent,
  ],
  imports: [
    CommonModule,
    AppLayoutModule,
    CommonRoutingModule,
    
  ],
  providers: [
    DistrictsService,
    CountriesService,
    ProvincesService,
    TypeAttributeService,
    WardsService,
    CommonService
  ]
})
export class CommonsModule { }
