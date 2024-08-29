import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectComponent } from './project/project.component';
import { CategoryRoutingModule } from 'src/app/routes/category-routing.module';
import { AppLayoutModule } from 'src/app/layout/app.layout.module';
import { ProjectService } from 'src/app/services/project.service';
import { AddProjectComponent } from './project/add-project/add-project.component';
import { TowerComponent } from './tower/tower.component';
import { TowerUploadComponent } from './tower/tower-upload/tower-upload.component';
import { FloorComponent } from './floor/floor.component';
import { FloorUploadComponent } from './floor/floor-upload/floor-upload.component';
import { AddFloorComponent } from './floor/add-floor/add-floor.component';
import { AddTowerComponent } from './tower/add-tower/add-tower.component';
import { TowerService } from 'src/app/services/tower.service';
import { FloorService } from 'src/app/services/floor.service';
import { DepartmentComponent } from './department/department.component';
import { AddDepartmentComponent } from './department/add-department/add-department.component';
import { AddressComponent } from './address/address.component';
import { AddAddressComponent } from './address/add-address/add-address.component';
import { AddressUploadComponent } from './address/address-upload/address-upload.component';
import { PositionComponent } from './position/position.component';
import { AddPositionComponent } from './position/add-position/add-position.component';
import { PositionService } from 'src/app/services/position.service';
import { DepartmentService } from 'src/app/services/department.service';
import { ApartmentComponent } from './apartment/apartment.component';
import { AddApartmentComponent } from './apartment/add-apartment/add-apartment.component';
import { UploadApartmentComponent } from './apartment/upload-apartment/upload-apartment.component';
import { EmployeeComponent } from './employee/employee.component';
import { AddEmployeeComponent } from './employee/add-employee/add-employee.component';
import { AddEmployeeAccountComponent } from './employee/add-employee-account/add-employee-account.component';
import { DocumentComponent } from './document/document.component';
import { AddDocumentComponent } from './document/add-document/add-document.component';
import { DocumentService } from 'src/app/services/document.service';
import { ResidentComponent } from './resident/resident.component';
import { AddResidentComponent } from './resident/add-resident/add-resident.component';
import { CreateAccountComponent } from './resident/dialogs/create-account/create-account.component';
import { AddApartmentResidentComponent } from './resident/dialogs/add-apartment-resident/add-apartment-resident.component';
import { PasswordModule } from 'primeng/password';
import { TableModule } from 'primeng/table';
import { DetailResidentComponent } from './resident/dialogs/detail-resident/detail-resident.component';
import { ResetPasswordComponent } from './resident/dialogs/reset-password/reset-password.component';
import { ChangePasswordComponent } from './employee/dialogs/change-password/change-password.component';
import { CardAcceptedComponent } from './resident/dialogs/card-accepted/card-accepted.component';

@NgModule({
declarations: [
    ProjectComponent,
    TowerComponent,
    AddProjectComponent,
    TowerUploadComponent,
    FloorComponent,
    FloorUploadComponent,
    AddFloorComponent,
    AddTowerComponent,
    DepartmentComponent,
    AddDepartmentComponent,
    AddressComponent,
    AddAddressComponent,
    AddressUploadComponent,
    PositionComponent,
    AddPositionComponent,
    ApartmentComponent,
    AddApartmentComponent,
    UploadApartmentComponent,
    EmployeeComponent,
    AddEmployeeComponent,
    AddEmployeeAccountComponent,
    DocumentComponent,
    AddDocumentComponent,
    ResidentComponent,
    AddResidentComponent,
    CreateAccountComponent,
    AddApartmentResidentComponent,
    DetailResidentComponent,
    ResetPasswordComponent,
    ChangePasswordComponent,
    CardAcceptedComponent
  ],
  imports: [
    CommonModule,
    AppLayoutModule,
    CategoryRoutingModule,
    TableModule,
    PasswordModule,
  ],
  providers: [
    ProjectService,
    TowerService,
    FloorService,
    PositionService,
    DepartmentService,
    DocumentService
  ]
})
export class CategoryModule { }
