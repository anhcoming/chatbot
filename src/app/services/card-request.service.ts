import { Injectable } from '@angular/core';
import { DataService } from '../shared/services/data.service';
import { ApiConstant } from '../shared/constants/api.constants';
import { Paging } from '../viewModels/paging';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CardRequestService {
  constructor(private readonly dataService: DataService) { }
  getListCardRequestByPaging(queryParams: Paging) {
    return this.dataService.get(ApiConstant.GetCardRequestByPaging
      .concat(`?page=`, '' + (queryParams.page || 1))
      .concat(`&page_size=`, '' +  (queryParams.page_size || 15))
      .concat(`&query=`, (queryParams.query || '1=1'))
      .concat(`&select=`, (queryParams.select || ''))
      .concat('&order_by=', (queryParams.order_by || '')))
      .pipe(map((res: any) => {
        return res;
      }));
  }
  getListCardManagerByPaging(queryParams: Paging) {
    return this.dataService.get(ApiConstant.GetCardManagerByPaging
      .concat(`?page=`, '' + (queryParams.page || 1))
      .concat(`&page_size=`, '' +  (queryParams.page_size || 15)))
      .pipe(map((res: any) => {
        return res;
      }));
  }
  CardRequest(reqData: any) {
    return this.dataService.post(ApiConstant.ApiCardRequest, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  updateCardRequest(id: number, reqData: any) {
    return this.dataService.put(ApiConstant.ApiUpdateCardRequest.concat(id.toString()), reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  ChangeCardRequest(reqData: any) {
    return this.dataService.post(ApiConstant.ChangeCardRequest, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  updateChangeCardRequest(id: number, reqData: any) {
    return this.dataService.put(ApiConstant.updateChangeCardRequest.concat(id.toString()), reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  CancelCardRequest(reqData: any) {
    return this.dataService.post(ApiConstant.CancelCardRequest, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  updateCancelCardRequest(id: number, reqData: any) {
    return this.dataService.put(ApiConstant.UpdateCancelCardRequest.concat(id.toString()), reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  deleteCardRequest(id: number) {
    return this.dataService.delete(ApiConstant.ApiDeleteCardRequest, id.toString())
      .pipe(map((res: any) => {
        return res;
      }));
  }
  getCardRequestId(queryParams: Paging) {
    return this.dataService.get(ApiConstant.getCardRequestId
    .concat(`?id=`, '' +  (queryParams.id || '')))
    .pipe(map((res: any) => {
      return res;
    }));
  }
}
