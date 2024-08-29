import { Injectable } from '@angular/core';
import { DataService } from '../shared/services/data.service';
import { Paging } from '../viewModels/paging';
import { ApiConstant } from '../shared/constants/api.constants';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderTransportService {

  constructor(private readonly dataService: DataService) { }
  getOrderTransportByPaging(queryParams: Paging) {
    return this.dataService.get(ApiConstant.GetOrderTransportByPaging
      .concat(`?page=`, '' + (queryParams.page || 1))
      .concat(`&page_size=`, '' +  (queryParams.page_size || 15))
      .concat(`&query=`, (queryParams.query || '1=1'))
      .concat(`&select=`, (queryParams.select || ''))
      .concat('&order_by=', (queryParams.order_by || '')))
      .pipe(map((res: any) => {
        return res;
      }));
  }
  createOrderTransport(reqData: any) {
    return this.dataService.post(ApiConstant.CreateOrderTransport, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  updateOrderTransport(id: number, reqData: any) {
    return this.dataService.put(ApiConstant.UpdateOrderTransport + id, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  getOrderTransportById(idc: number, id: string) {
    return this.dataService.get(ApiConstant.getOrderTransportById.concat(idc.toString() ,'/', id.toString()))
      .pipe(map((res: any) => {
        return res;
      }));
  }
  deleteOrderTransportById(idc: number, id: number ) {
    return this.dataService.delete(ApiConstant.UpdateOrderTransport.concat(idc.toString(),'/'), id.toString())
      .pipe(map((res: any) => {
        return res;
      }));
  }
  deletesListOrderTransport(Idc: number, reqData: any) {
    return this.dataService.post(ApiConstant.DeleteListOrderTransport.concat(Idc.toString()) , reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
}
