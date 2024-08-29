import { NgModule } from '@angular/core';
import { AppLayoutModule } from 'src/app/layout/app.layout.module';
import { CommonModule } from '@angular/common';
import { ManagerContractRoutingModule } from 'src/app/routes/manager-contract-routing.module';
import { ContractTypeComponent } from './contract-type/contract-type.component';
import { AddContractTypeComponent } from './contract-type/add-contract-type/add-contract-type.component';
import { ContractGroupComponent } from './contract-group/contract-group.component';
import { AddContractGroupComponent } from './contract-group/add-contract-group/add-contract-group.component';
import { ContractComponent } from './contract/contract.component';
import { AddContractComponent } from './contract/add-contract/add-contract.component';
import { InvoiceContractTypeService } from 'src/app/services/inv-contract-type.service'

@NgModule({
  declarations: [


    ContractTypeComponent,
    AddContractTypeComponent,
    ContractGroupComponent,
    AddContractGroupComponent,
    ContractComponent,
    AddContractComponent
  ],
  imports: [
    CommonModule,
    AppLayoutModule,
    ManagerContractRoutingModule
  ],
  providers: [
    InvoiceContractTypeService
  ]
})
export class ManagerContractModule { }