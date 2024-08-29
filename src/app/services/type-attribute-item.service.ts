import { Injectable } from '@angular/core';
import { DataService } from '../shared/services/data.service';
import { map } from 'rxjs';
import { ApiConstant } from '../shared/constants/api.constants';
import { Paging } from '../viewModels/paging';

@Injectable({
  providedIn: 'root'
})
export class TypeAttributeItemService {

  constructor(private readonly dataService: DataService) { }

  getListTypeAttributeItemByPaging(queryParams: Paging) {
    return this.dataService.get(ApiConstant.GetTypeAttributeItemByPaging
      .concat(`?page=`, '' + (queryParams.page || 1))
      .concat(`&page_size=`, '' +  (queryParams.page_size || 15))
      .concat(`&query=`, (queryParams.query || '1=1'))
      .concat(`&select=`, (queryParams.select || ''))
      .concat('&order_by=', (queryParams.order_by || '')))
      .pipe(map((res: any) => {
        return res;
      }));
  }
  createTypeAttributeItem(reqData: any) {
    return this.dataService.post(ApiConstant.CreateTypeAttributeItem, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  updateTypeAttributeItemById(id: number, reqData: any) {
    return this.dataService.put(ApiConstant.UpdateTypeAttributeItemById + id, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  deleteTypeAttributeItem(id: number) {
    return this.dataService.delete(ApiConstant.DeleteTypeAttributeItemById, id.toString() )
      .pipe(map((res: any) => {
        return res;
      }));
  }
  getTypeAttributeItemById(id: number) {
    return this.dataService.get(ApiConstant.ApiTypeAttributeItemById + id)
      .pipe(map((res: any) => {
        return res;
      }));
  }
}
