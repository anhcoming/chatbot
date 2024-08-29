import { Injectable } from '@angular/core';
import { DataService } from '../shared/services/data.service';
import { Paging } from '../viewModels/paging';
import { ApiConstant } from '../shared/constants/api.constants';
import { Observable, map } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class EmployeeUnitService {

  constructor(private readonly dataService: DataService) { }

  getListEmployee(queryParams: any) {
    const request = {
        page: queryParams.page || 1,
        page_size: queryParams.page_size || 10,
        keyWord: queryParams.search || ''
    }
    return this.dataService.post(ApiConstant.RestfulEmployeeUnit + "GetList", request)
      .pipe(map((res: any) => {
        return res;
      }));
  }

  accountCreatedUpdate(id: number, body: any){
    const url = ApiConstant.RestfulEmployeeUnit + "accountCreated/" + id;
    return this.dataService.put(url, body)
       .pipe(map((res: any) => {
            return res;
        }));
}

  createEmployee(reqData: any) {
    return this.dataService.post(ApiConstant.RestfulEmployeeUnit, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  updateEmployee(id: number, reqData: any) {
    return this.dataService.put(ApiConstant.RestfulEmployeeUnit + id, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  deleteEmployee(id: number) {
    return this.dataService.delete(ApiConstant.RestfulEmployeeUnit, id.toString())
      .pipe(map((res: any) => {
        return res;
      }));
  }
  getEmployeeByID(ID: number) {
    return this.dataService.get(ApiConstant.RestfulEmployeeUnit + ID)
      .pipe(map((res: any) => {
        return res;
      }));
  }

  changePassword(id: number, param: any) {
    return this.dataService.put(ApiConstant.changePassUser + id, param)
      .pipe(map((res: any) => {
        return res;
      }));
  }

  lockUserAccount(id: number) {
    return this.dataService.get(ApiConstant.ApiEmployeeManageById + `lock/${id}`)
      .pipe(map((res: any) => {
        return res;
      }));
  }

  unLockUserAccount(id: number) {
    return this.dataService.get(ApiConstant.ApiEmployeeManageById + `unlock/${id}`)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  createUser(param: any) {
    return this.dataService.post(ApiConstant.ApiCreateEmployee, param)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  getGroupTopicByEI(id: number) {
    return this.dataService.get(ApiConstant.ApiEmployeeManageById + `getGroupTopicByEI/${id}`)
    .pipe(map((res: any) => {
      return res;
    }));
  }

  updateTopicByUserId(id: number, param: any) {
    return this.dataService.put(ApiConstant.ApiEmployeeManageById + `Em_Gt/${id}`, param)
    .pipe(map((res: any) => {
      return res;
    }));
  }
}
