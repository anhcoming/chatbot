import { Injectable } from '@angular/core';
import { ApiConstant } from '../shared/constants/api.constants';
import { map } from 'rxjs';
import { Paging } from '../viewModels/paging';
import { DataService } from '../shared/services/data.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private readonly dataService: DataService) { }
  getListEmployeeByPaging(queryParams: Paging) {
    return this.dataService.get(ApiConstant.GetEmployeeByPaging
      .concat(`?page=`, '' + (queryParams.page || 1))
      .concat(`&page_size=`, '' +  (queryParams.page_size || 15))
      .concat(`&ProjectId=`, (queryParams.ProjectId || '-1'))
      .concat(`&query=`, (queryParams.query || '1=1'))
      .concat(`&select=`, (queryParams.select || ''))
      .concat('&order_by=', (queryParams.order_by || '')))
      .pipe(map((res: any) => {
        return res;
      }));
  }
  createAccountEmployee(ide: number, reqData: any) {
    return this.dataService.post(ApiConstant.CreateAccountEmployee + ide, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  createEmployee(reqData: any) {
    return this.dataService.post(ApiConstant.CreateEmploy, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  updateEmployee(id: number, reqData: any) {
    return this.dataService.put(ApiConstant.ApiEmployeeById + id, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  deleteEmployee(id: number) {
    return this.dataService.delete(ApiConstant.ApiEmployeeById, id.toString())
      .pipe(map((res: any) => {
        return res;
      }));
  }
  getEmployee(id: number) {
     return this.dataService.get(ApiConstant.ApiEmployeeById + id)
    .pipe(map((res: any) => {
      return res;
    }));
 }
 newPassword(id: number, reqData: any) {
  return this.dataService.put(ApiConstant.newPassword + id.toString(), reqData)
  .pipe(map((res: any) => {
    return res;
  }))
 }

 
}
