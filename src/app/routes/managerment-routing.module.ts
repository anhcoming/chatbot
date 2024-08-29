import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyComponent } from '../components/managerment/company/company.component';
import { AddCompanyComponent } from '../components/managerment/company/add-company/add-company.component';

const routes: Routes = [
  {
    path: 'company/list',
    component: CompanyComponent
  },
  {
    path: 'company/create',
    component: AddCompanyComponent
  },
  {
    path: 'company/update/:id',
    component: AddCompanyComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagermentRoutingModule { }
