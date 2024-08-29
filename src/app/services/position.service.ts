import { Injectable } from '@angular/core';
import { DataService } from '../shared/services/data.service';
import { Paging } from '../viewModels/paging';
import { ApiConstant } from '../shared/constants/api.constants';
import { Observable, map } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PositionService {

  constructor(private readonly dataService: DataService) { }

  getListPositionByPaging(queryParams: Paging) {
    return this.dataService.get(ApiConstant.GetPositionByPaging
      .concat(`?page=`, '' + (queryParams.page || 1))
      .concat(`&page_size=`, '' +  (queryParams.page_size || 15))
      .concat(`&query=`, (queryParams.query || '1=1'))
      .concat(`&select=`, (queryParams.select || ''))
      .concat('&order_by=', (queryParams.order_by || '')))
      .pipe(map((res: any) => {
        return res;
      }));
  }

  createPosition(reqData: any) {
    return this.dataService.post(ApiConstant.CreatePosition, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  updatePosition(id: number, reqData: any) {
    return this.dataService.put(ApiConstant.UpdatePositionById + id, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  deletePositionById(id: number ) {
    return this.dataService.delete(ApiConstant.DeleTePosition, id.toString())
      .pipe(map((res: any) => {
        return res;
      }));
  }
  getPositionById(id: number) {
    return this.dataService.get(ApiConstant.GetPositionMapById + id)
      .pipe(map((res: any) => {
        return res;
      }));
  }
}
