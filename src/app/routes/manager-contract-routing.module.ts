import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContractTypeComponent } from '../components/manager-contract/contract-type/contract-type.component';
import { AddContractTypeComponent } from '../components/manager-contract/contract-type/add-contract-type/add-contract-type.component';
import { ContractGroupComponent } from '../components/manager-contract/contract-group/contract-group.component';
import { AddContractGroupComponent } from '../components/manager-contract/contract-group/add-contract-group/add-contract-group.component';
import { ContractComponent } from '../components/manager-contract/contract/contract.component';
import { AddContractComponent } from '../components/manager-contract/contract/add-contract/add-contract.component';

const routes: Routes = [
  {
    path : 'contract-type/list',
    component : ContractTypeComponent,
  },
  {
    path : 'contract-type/create',
    component : AddContractTypeComponent,
  },
  {
    path : 'contract-type/update/:id',
    component : AddContractTypeComponent,
  },
  {
    path : 'contract-group/list',
    component : ContractGroupComponent,
  },
  {
    path : 'contract-group/create',
    component : AddContractGroupComponent,
  },
  {
    path : 'contract-group/update/:id',
    component : AddContractGroupComponent,
  },
  {
    path : 'contracts/list',
    component : ContractComponent,
  },
  {
    path : 'contracts/create',
    component : AddContractComponent,
  },
  {
    path : 'contracts/update/:id',
    component : AddContractComponent,
  },
  {
    path : 'contracts/update/:id',
    component : AddContractComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagerContractRoutingModule { }