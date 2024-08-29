import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceRoutingModule } from 'src/app/routes/invoice-routing.module';
import { AppLayoutModule } from 'src/app/layout/app.layout.module';
import { InputTextModule } from 'primeng/inputtext';
import { ProjectService } from 'src/app/services/project.service';
import { TowerService } from 'src/app/services/tower.service';
import { FloorService } from 'src/app/services/floor.service';
import { PositionService } from 'src/app/services/position.service';
import { DepartmentService } from 'src/app/services/department.service';
import { InvServiceComponent } from './inv-service/inv-service.component';
import { InvServiceGroupComponent } from './inv-service-group/inv-service-group.component';
import { AddInvServiceGroupComponent } from './inv-service-group/add-inv-service-group/add-inv-service-group.component';
import { AddInvServiceComponent } from './inv-service/add-inv-service/add-inv-service.component';
import { InvServiceConfigComponent } from './inv-service-config/inv-service-config.component';
import { AddInvServiceConfigComponent } from './inv-service-config/add-inv-service-config/add-inv-service-config.component';
import { ServiceConfigDetailComponent } from './inv-service-config/service-config-detail/service-config-detail.component';
import { CustomerComponent } from './customer/customer.component';
import { AddCustomerComponent } from './customer/add-customer/add-customer.component';
import { DialogsCustomerComponent } from './customer/dialogs/dialogs-customer/dialogs-customer.component';
import { ManagerServiceComponent } from './manager-service/manager-service.component';
import { AddManagerServiceComponent } from './manager-service/add-manager-service/add-manager-service.component';
import { ElectricIndexComponent } from './monthly-service/electric-index/electric-index.component';
import { WaterIndexComponent } from './monthly-service/water-index/water-index.component';
import { AddElectricIndexComponent } from './monthly-service/electric-index/add-electric-index/add-electric-index.component';
import { AddWaterIndexComponent } from './monthly-service/water-index/add-water-index/add-water-index.component';
import { DetailElectricIndexComponent } from './monthly-service/electric-index/detail-electric-index/detail-electric-index.component';
import { DetailWaterIndexComponent } from './monthly-service/water-index/detail-water-index/detail-water-index.component';

@NgModule({
declarations: [
    InvServiceComponent,
    InvServiceGroupComponent,
    AddInvServiceGroupComponent,
    AddInvServiceComponent,
    InvServiceConfigComponent,
    AddInvServiceConfigComponent,
    ServiceConfigDetailComponent,
    CustomerComponent,
    AddCustomerComponent,
    DialogsCustomerComponent,
    ManagerServiceComponent,
    AddManagerServiceComponent,
    ElectricIndexComponent,
    WaterIndexComponent,
    AddElectricIndexComponent,
    AddWaterIndexComponent,
    DetailElectricIndexComponent,
    DetailWaterIndexComponent
  ],
  imports: [
    CommonModule,
    AppLayoutModule,
    InvoiceRoutingModule,
    InputTextModule
  ],
  providers: [
    ProjectService,
    TowerService,
    FloorService,
    PositionService,
    DepartmentService,
  ]
})
export class InvoiceModule { }
