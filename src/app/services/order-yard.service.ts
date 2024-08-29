import { Injectable } from '@angular/core';
import { DataService } from '../shared/services/data.service';
import { Paging } from '../viewModels/paging';
import { ApiConstant } from '../shared/constants/api.constants';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderYardService {

  constructor(private readonly dataService: DataService) { }
  getOrderYardByPaging(queryParams: Paging) {
    return this.dataService.get(ApiConstant.GetOrderYardByPaging
      .concat(`?page=`, '' + (queryParams.page || 1))
      .concat(`&page_size=`, '' +  (queryParams.page_size || 15))
      .concat(`&query=`, (queryParams.query || '1=1'))
      .concat(`&select=`, (queryParams.select || ''))
      .concat('&order_by=', (queryParams.order_by || '')))
      .pipe(map((res: any) => {
        return res;
      }));
  }
  createOrderYard(reqData: any) {
    return this.dataService.post(ApiConstant.CreateOrderYard, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  updateOrderYard(id: number, reqData: any) {
    return this.dataService.put(ApiConstant.OrderYardById + id, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  getOrderYardById(idc: number, id: string) {
    return this.dataService.get(ApiConstant.OrderYardById.concat(idc.toString() ,'/', id.toString()))
      .pipe(map((res: any) => {
        return res;
      }));
  }
  deleteOrderYardById(idc: number, id: number ) {
    return this.dataService.delete(ApiConstant.OrderYardById.concat(idc.toString(),'/'), id.toString())
      .pipe(map((res: any) => {
        return res;
      }));
  }
  deletesListOrderYard(Idc: number, reqData: any) {
    return this.dataService.post(ApiConstant.DeleteListOrderYard.concat(Idc.toString()) , reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
}
