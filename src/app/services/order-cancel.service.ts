import { Injectable } from '@angular/core';
import { DataService } from '../shared/services/data.service';
import { Paging } from '../viewModels/paging';
import { ApiConstant } from '../shared/constants/api.constants';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderCancelService {

  constructor(private readonly dataService: DataService) { }
  getOrderCancelByPaging(queryParams: Paging) {
    return this.dataService.get(ApiConstant.GetOrderCancelByPaging
      .concat(`?page=`, '' + (queryParams.page || 1))
      .concat(`&page_size=`, '' +  (queryParams.page_size || 15))
      .concat(`&query=`, (queryParams.query || '1=1'))
      .concat(`&select=`, (queryParams.select || ''))
      .concat('&order_by=', (queryParams.order_by || '')))
      .pipe(map((res: any) => {
        return res;
      }));
  }
  createOrderCancel(reqData: any) {
    return this.dataService.post(ApiConstant.CreateOrderCancel, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  updateOrderCancel(id: string, reqData: any) {
    return this.dataService.put(ApiConstant.UpdateOrderCancel + id, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  getOrderCancelById(idc: number, id: string,type:number) {
    return this.dataService.get(ApiConstant.getOrderCancelByTargetId.concat(idc.toString() ,'/', id.toString(),'/',type.toString()))
      .pipe(map((res: any) => {
        return res;
      }));
  }
  getOrderReviewById(idc: number, id: string,type:number) {
    return this.dataService.get(ApiConstant.getOrderReviewByTargetId.concat(idc.toString() ,'/', id.toString(),'/',type.toString()))
      .pipe(map((res: any) => {
        return res;
      }));
  }
  deleteOrderCancelById(idc: number, id: number ) {
    return this.dataService.delete(ApiConstant.UpdateOrderCancel.concat(idc.toString(),'/'), id.toString())
      .pipe(map((res: any) => {
        return res;
      }));
  }
}
