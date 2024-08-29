import { Injectable } from '@angular/core';
import { DataService } from '../shared/services/data.service';
import { Paging } from '../viewModels/paging';
import { ApiConstant } from '../shared/constants/api.constants';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderconstructionService {

  constructor(private readonly dataService: DataService) { }
  getOrderConstructionByPaging(queryParams: Paging) {
    return this.dataService.get(ApiConstant.GetOrderConstructionByPaging
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
    return this.dataService.post(ApiConstant.CreateOrderConstruction, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  updateOrderConstruction(id: number, reqData: any) {
    return this.dataService.put(ApiConstant.UpdateOrderConstruction + id, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  getOrderConstructionById(idc: number, id: string) {
    return this.dataService.get(ApiConstant.getOrderConstructionById.concat(idc.toString() ,'/', id.toString()))
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
  deletesListOrderConstruction(Idc: number, reqData: any) {
    return this.dataService.post(ApiConstant.DeleteListOrderConstruction.concat(Idc.toString()) , reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
}
