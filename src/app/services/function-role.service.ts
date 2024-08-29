import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, map } from 'rxjs';
import { ApiConstant } from '../shared/constants/api.constants';
import { DataService } from '../shared/services/data.service';
import { Paging } from '../viewModels/paging';

@Injectable({
  providedIn: 'root'
})
export class FunctionRoleService {
  public isEdit = false;
  public subject = new Subject<any>();
  private itemProductSource = new BehaviorSubject(this.isEdit);
  constructor(private readonly dataService: DataService) { }

  getListFunctionRoleByPaging(queryParams: Paging) {
    return this.dataService.get(ApiConstant.GetFunctionRoleByPaging
      .concat(`?page=`, '' + (queryParams.page || 1))
      .concat(`&page_size=`, '' +  (queryParams.page_size || 15))
      .concat(`&query=`, (queryParams.query || '1=1'))
      .concat(`&select=`, (queryParams.select || ''))
      .concat('&order_by=', (queryParams.order_by || '')))
      .pipe(map((res: any) => {
        return res;
      }));
  }

  getDropdown(){
    return this.dataService.get(ApiConstant.RestfulFunctionRole + 'Dropdown')
     .pipe(map((res: any) => {
        return res;
      }));
  }

  createFunctionRole(reqData: any) {
    return this.dataService.post(ApiConstant.CreateFunctionRole, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  updateFunctionRole(id: number, reqData: any) {
    return this.dataService.put(ApiConstant.UpdateFunctionRoleById + id, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  deleteFunctionRoleById(id: number ) {
    return this.dataService.delete(ApiConstant.DeleteFunctionRoleById, id.toString())
      .pipe(map((res: any) => {
        return res;
      }));
  }
  getFunctionRoleById(id: number) {
    return this.dataService.get(ApiConstant.GetFunctionRoleById + id)
      .pipe(map((res: any) => {
        return res;
      }));
  }

}
