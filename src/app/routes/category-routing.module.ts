import { ProjectComponent } from './../components/category/project/project.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddProjectComponent } from '../components/category/project/add-project/add-project.component';
import { TowerComponent } from '../components/category/tower/tower.component';
import { TowerUploadComponent } from '../components/category/tower/tower-upload/tower-upload.component';
import { FloorComponent } from '../components/category/floor/floor.component';
import { AddFloorComponent } from '../components/category/floor/add-floor/add-floor.component';
import { FloorUploadComponent } from '../components/category/floor/floor-upload/floor-upload.component';
import { AddTowerComponent } from '../components/category/tower/add-tower/add-tower.component';
import { DepartmentComponent } from '../components/category/department/department.component';
import { AddDepartmentComponent } from '../components/category/department/add-department/add-department.component';
import { AddressComponent } from '../components/category/address/address.component';
import { AddAddressComponent } from '../components/category/address/add-address/add-address.component';
import { PositionComponent } from '../components/category/position/position.component';
import { AddPositionComponent } from '../components/category/position/add-position/add-position.component';
import { AddApartmentComponent } from '../components/category/apartment/add-apartment/add-apartment.component';
import { ApartmentComponent } from '../components/category/apartment/apartment.component';
import { UploadApartmentComponent } from '../components/category/apartment/upload-apartment/upload-apartment.component';
import { AddEmployeeComponent } from '../components/category/employee/add-employee/add-employee.component';
import { EmployeeComponent } from '../components/category/employee/employee.component';
import { AddEmployeeAccountComponent } from '../components/category/employee/add-employee-account/add-employee-account.component';
import { DocumentComponent } from '../components/category/document/document.component';
import { AddDocumentComponent } from '../components/category/document/add-document/add-document.component';
import { AddResidentComponent } from '../components/category/resident/add-resident/add-resident.component';
import { AddApartmentResidentComponent } from '../components/category/resident/dialogs/add-apartment-resident/add-apartment-resident.component';
import { ResidentComponent } from '../components/category/resident/resident.component';


const routes: Routes = [
  {
    path: 'project/list',
    component: ProjectComponent,
  },
  {
    path: 'project/create',
    component: AddProjectComponent
  },
  {
    path: 'project/update/:Id',
    component: AddProjectComponent
  },
  {
    path: 'tower/list',
    component: TowerComponent
  },
  {
    path: 'tower/create',
    component: AddTowerComponent
  },
  {
    path: 'tower/update/:towerId',
    component: AddTowerComponent
  },
  {
    path: 'tower/upload',
    component: TowerUploadComponent
  },
  {
    path: 'floor/list',
    component: FloorComponent
  },
  {
    path: 'floor/create',
    component: AddFloorComponent
  },
  {
    path: 'floor/update/:floorId',
    component: AddFloorComponent
  },
  {
    path: 'floor/upload',
    component: FloorUploadComponent
  },
  {
    path: 'department/list',
    component: DepartmentComponent
  },
  {
    path: 'department/create',
    component: AddDepartmentComponent
  },
  {
    path: 'department/update/:id',
    component: AddDepartmentComponent
  },
  {
    path: 'zone/list',
    component: AddressComponent
  },
  {
    path: 'zone/create',
    component: AddAddressComponent
  },
  {
    path: 'zone/update/:id',
    component: AddAddressComponent
  },
  {
    path: 'position/list',
    component: PositionComponent
  },
  {
    path: 'position/create',
    component: AddPositionComponent
  },
  {
    path: 'position/update/:posID',
    component: AddPositionComponent
  },
  {
    path: 'apartment/list',
    component: ApartmentComponent,
  },
  {
    path: 'apartment/create',
    component: AddApartmentComponent,
  },
  {
    path: 'apartment/update/:id',
    component: AddApartmentComponent,
  },
  {
    path: 'apartment/upload',
    component: UploadApartmentComponent,
  },
  {
    path: 'resident/list',
    component: ResidentComponent,
  },
  {
    path: 'resident/create',
    component: AddResidentComponent,
  },
  {
    path: 'resident/update/:id',
    component: AddResidentComponent,
  },
  {
    path: 'resident/add-Resident',
    component: AddApartmentResidentComponent,
  },
  {
    path: 'resident/add-Resident/:id',
    component: AddApartmentResidentComponent,
  },
  {
    path: 'employee/list',
    component: EmployeeComponent,
  },
  {
    path: 'employee/create',
    component: AddEmployeeComponent,
  },
  {
    path: 'employee/update/:id',
    component: AddEmployeeComponent,
  },
  {
    path: 'employee/add-account/:id',
    component: AddEmployeeAccountComponent,
  },

  {
    path: 'document/list',
    component: DocumentComponent,
  },
  {
    path: 'document/create',
    component: AddDocumentComponent,
  },
  {
    path: 'document/update/:id',
    component: AddDocumentComponent,
  },
  // {
  //   path: 'project/detail/:proId',
  //   component: AddProjectComponent
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoryRoutingModule { }
