import { Injectable } from '@angular/core';
import { DataService } from '../shared/services/data.service';
import { Paging } from '../viewModels/paging';
import { ApiConstant } from '../shared/constants/api.constants';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderAcceptanceService {

  constructor(private readonly dataService: DataService) { }
  getOrderConstructionByPaging(queryParams: Paging) {
    return this.dataService.get(ApiConstant.GetOrderAcceptanceByPaging
      .concat(`?page=`, '' + (queryParams.page || 1))
      .concat(`&page_size=`, '' +  (queryParams.page_size || 15))
      .concat(`&query=`, (queryParams.query || '1=1'))
      .concat(`&select=`, (queryParams.select || ''))
      .concat('&order_by=', (queryParams.order_by || '')))
      .pipe(map((res: any) => {
        return res;
      }));
  }
  createOrderConstruction(reqData: any) {
    return this.dataService.post(ApiConstant.CreateOrderAcceptance, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  updateOrderConstruction(id: number, reqData: any) {
    return this.dataService.put(ApiConstant.UpdateOrderAcceptance + id, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  getOrderConstructionById(idc: number, id: string) {
    return this.dataService.get(ApiConstant.getOrderAcceptancebyId.concat(idc.toString() ,'/', id.toString()))
      .pipe(map((res: any) => {
        return res;
      }));
  }
  deleteOrderConstructionById(idc: number, id: string ) {
    return this.dataService.delete(ApiConstant.UpdateOrderConstruction.concat(idc.toString(),'/'), id.toString())
      .pipe(map((res: any) => {
        return res;
      }));
  }
  getOrderConstructionByTarget(idc: number, id: string,type:number) {
    return this.dataService.get(ApiConstant.getOrderAcceptanceByTarget.concat(idc.toString() ,'/', id.toString(),'/',type.toString()))
      .pipe(map((res: any) => {
        return res;
      }));
  }
}
