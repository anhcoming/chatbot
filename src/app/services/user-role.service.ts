import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { ApiConstant } from '../shared/constants/api.constants';
import { DataService } from '../shared/services/data.service';
import { Paging } from '../viewModels/paging';

@Injectable({
  providedIn: 'root'
})
export class UserRoleService {

  constructor(private readonly dataService: DataService) { }
  getListUserRoleByPaging(request: Paging) {
    return this.dataService.post(ApiConstant.GetUserRoleByPaging, request)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  GetNotRoleByPaging(queryParams: Paging) {
    return this.dataService.get(ApiConstant.GetNotRoleByPaging
      .concat(`?page=`, '' + (queryParams.page || 1))
      .concat(`&page_size=`, '' +  (queryParams.page_size || 15))
      .concat(`&query=`, (queryParams.query || '1=1'))
      .concat(`&select=`, (queryParams.select || ''))
      .concat('&order_by=', (queryParams.order_by || '')))
      .pipe(map((res: any) => {
        return res;
      }));
  }

  createUserRole(reqData: any) {
    return this.dataService.post(ApiConstant.CreateUserRole, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  updateUserRoleById(id: number, reqData: any) {
    return this.dataService.put(ApiConstant.ApiUserRoleById + id, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  deleteUserRoleById(id: number) {
    return this.dataService.delete(ApiConstant.ApiUserRoleById , id.toString())
      .pipe(map((res: any) => {
        return res;
      }));
  }
  getUserRoleById(id: number) {
    return this.dataService.get(ApiConstant.ApiUserRoleById + id)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  GetUserRoleByCode(code: string, idp: number, idd: number) {
    return this.dataService.get(ApiConstant.GetUserRoleByCode.concat(code.toString(), '/', idp.toString(), '/', idd.toString()))
      .pipe(map((res: any) => {
        return res;
      }));
  }
}