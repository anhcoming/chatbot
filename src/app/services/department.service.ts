import { Injectable } from '@angular/core';
import { DataService } from '../shared/services/data.service';
import { Paging } from '../viewModels/paging';
import { ApiConstant } from '../shared/constants/api.constants';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  constructor(private readonly dataService: DataService) { }

  getListDepartmentByPaging(queryParams: Paging) {
    return this.dataService.get(ApiConstant.GetDepartmentByPaging
      .concat(`?page=`, '' + (queryParams.page || 1))
      .concat(`&page_size=`, '' +  (queryParams.page_size || 15))
      .concat(`&query=`, (queryParams.query || '1=1'))
      .concat(`&select=`, (queryParams.select || ''))
      .concat('&order_by=', (queryParams.order_by || '')))
      .pipe(map((res: any) => {
        return res;
      }));
  }

  createDepartment(reqData: any) {
    return this.dataService.post(ApiConstant.CreateDepartment, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  updateDepartment(id: number, reqData: any) {
    return this.dataService.put(ApiConstant.UpdateDepartmentById + id, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  deleteDepartment(id: number) {
    return this.dataService.delete(ApiConstant.DeleteDepartmentById, id.toString())
      .pipe(map((res: any) => {
        return res;
      }));
  }

  getDepartmentById(id: number) {
    return this.dataService.get(ApiConstant.GetDepartmentById + id)
      .pipe(map((res: any) => {
        return res;
      }));
  }
}