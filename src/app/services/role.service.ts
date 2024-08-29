import { Injectable } from '@angular/core';
import { DataService } from '../shared/services/data.service';
import { Paging } from '../viewModels/paging';
import { ApiConstant } from '../shared/constants/api.constants';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private readonly dataService: DataService) { }

  getListRoleByPaging(queryParams: Paging) {
    return this.dataService.get(ApiConstant.GetRoleByPaging
      .concat(`?page=`, '' + (queryParams.page || 1))
      .concat(`&page_size=`, '' +  (queryParams.page_size || 15))
      .concat(`&query=`, (queryParams.query || '1=1'))
      .concat(`&select=`, (queryParams.select || ''))
      .concat('&order_by=', (queryParams.order_by || '')))
      .pipe(map((res: any) => {
        return res;
      }));
  }

  createRole(reqData: any) {
    return this.dataService.post(ApiConstant.CreateRoleById, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  updateRole(id: number, reqData: any) {
    return this.dataService.put(ApiConstant.UpdateRoleById + id, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  deleteRole(id: number) {
    return this.dataService.delete(ApiConstant.DeleteRoleById, id.toString())
      .pipe(map((res: any) => {
        return res;
      }));
  }
  getRole(id: number) {
     return this.dataService.get(ApiConstant.GetRole + id.toString())
    .pipe(map((res: any) => {
      return res;
    }));
 }
}
