import { Injectable } from '@angular/core';
import { DataService } from '../shared/services/data.service';
import { Paging } from '../viewModels/paging';
import { ApiConstant } from '../shared/constants/api.constants';
import { BehaviorSubject, Subject, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FunctionService {
  public isEdit = false;
  public subject = new Subject<any>();
  private itemProductSource = new BehaviorSubject(this.isEdit);
  constructor(private readonly dataService: DataService) { }

  getListFunctionByPaging(queryParams: Paging) {
    return this.dataService.get(ApiConstant.GetFunctionByPaging
      .concat(`?page=`, '' + (queryParams.page || 1))
      .concat(`&page_size=`, '' +  (queryParams.page_size || 15))
      .concat(`&query=`, (queryParams.query || '1=1'))
      .concat(`&select=`, (queryParams.select || ''))
      .concat('&order_by=', (queryParams.order_by || '')))
      .pipe(map((res: any) => {
        return res;
      }));
  }

  createFunction(reqData: any) {
    return this.dataService.post(ApiConstant.CreateFunction, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  updateFunction(id: number, reqData: any) {
    return this.dataService.put(ApiConstant.UpdateFunctionById + id, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  deleteFunctionById(id: number ) {
    return this.dataService.delete(ApiConstant.DeleteFunctionById, id.toString())
      .pipe(map((res: any) => {
        return res;
      }));
  }
  getFunctionById(id: number) {
    return this.dataService.get(ApiConstant.GetFunctionById + id)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  getTreeFunction(id?: number) {
    return this.dataService.get(ApiConstant.getlstFunction + (id === undefined ? '' : '?Subsystem=' + id))
      .pipe(
        map(res => {
          return res;
        }
      ))
  }
  getTreeFunctionRole(id: number) {
    return this.dataService.get(ApiConstant.getlstFunctionRole.concat((id ? '?id=' + id: '')))
      .pipe(
        map(res => {
          return res;
        }
      ))
  }

  getFunctionPerantByPaging(queryParams: Paging) {
    return this.dataService.get(ApiConstant.GetFunctionPerantByPaging
      .concat(`?page=`, '' + (queryParams.page || 1))
      .concat(`&page_size=`, '' +  (queryParams.page_size || 15))
      .concat(`&query=`, (queryParams.query || '1=1'))
      .concat(`&select=`, (queryParams.select || ''))
      .concat('&order_by=', (queryParams.order_by || '')))
      .pipe(map((res: any) => {
        return res;
      }));
  }
}
