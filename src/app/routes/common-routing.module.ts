import { NgModule } from '@angular/core';
import { CountriesComponent } from '../components/commons/countries/countries.component';
import { DistrictsComponent } from '../components/commons/districts/districts.component';
import { ProvincesComponent } from '../components/commons/provinces/provinces.component';
import { WardsComponent } from '../components/commons/wards/wards.component';
import { RouterModule, Routes } from '@angular/router';
import { AddCountryComponent } from '../components/commons/countries/add-country/add-country.component';
import { AddDistrictComponent } from '../components/commons/districts/add-district/add-district.component';
import { AddProvinceComponent } from '../components/commons/provinces/add-province/add-province.component';
import { AddWardComponent } from '../components/commons/wards/add-ward/add-ward.component';
import { TypeAttributeComponent } from '../components/commons/type-attribute/type-attribute.component';
import { AddTypeAttributeComponent } from '../components/commons/type-attribute/add-type-attribute/add-type-attribute.component';
import { AddTypeComponent } from '../components/commons/type-attribute/add-type/add-type.component';


const routes: Routes = [
  {
    path: 'countries/list',
    component: CountriesComponent,
  },
  {
    path: 'countrie/create',
    component: AddCountryComponent,
  },
  {
    path: 'countrie/update/:id',
    component: AddCountryComponent,
  },
  {
    path: 'districts/list',
    component: DistrictsComponent,
  },
  {
    path: 'district/create',
    component: AddDistrictComponent,
  },
  {
    path: 'district/update/:id',
    component: AddDistrictComponent,
  },
  {
    path: 'provinces/list',
    component: ProvincesComponent,
  },
  {
    path: 'province/create',
    component: AddProvinceComponent,
  },
  {
    path: 'province/update/:id',
    component: AddProvinceComponent,
  },
  {
    path: 'wards/list',
    component: WardsComponent,
  },
  {
    path: 'ward/create',
    component: AddWardComponent,
  },
  {
    path: 'ward/update/:id',
    component: AddWardComponent,
  },
  {
    path: 'type-attributes/list',
    component: TypeAttributeComponent,
  },
  {
    path: 'type-attributes/create',
    component: AddTypeComponent,
  },
  {
    path: 'type-attributes/update/:id',
    component: AddTypeComponent,
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommonRoutingModule { }
