import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { ApiConstant } from '../shared/constants/api.constants';
import { DataService } from '../shared/services/data.service';
import { Paging } from '../viewModels/paging';

@Injectable({
  providedIn: 'root'
})
export class ConfigPaymentService {
  constructor(private readonly dataService: DataService) { }

  getListConfigPaymentByPaging(queryParams: Paging) {
    return this.dataService.get(ApiConstant.GetConfigPaymentByPaging
        .concat(`?page=`, '' + (queryParams.page || 1))
        .concat(`&page_size=`, '' +  (queryParams.page_size || 15))
        .concat(`&query=`, (queryParams.query || '1=1'))
        .concat(`&select=`, (queryParams.select || ''))
        .concat('&order_by=', (queryParams.order_by || '')))
        .pipe(map((res: any) => {
          return res;
        }));
  }

  createConfigPayment(reqData: any) {
    return this.dataService.post(ApiConstant.CreateConfigPayment, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  updateConfigPaymentById(id: number, reqData: any) {
    return this.dataService.put(ApiConstant.ConfigPaymentById + id, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  deleteConfigPaymentById(id: number) {
    return this.dataService.delete(ApiConstant.ConfigPaymentById, id.toString() )
      .pipe(map((res: any) => {
        return res;
      }));
  }
  getConfigPaymentById(id: number) {
    return this.dataService.get(ApiConstant.ConfigPaymentById + id.toString())
      .pipe(map((res: any) => {
        return res;
      }));
  }

  deletesConfigPayment(idc: number, reqData: any) {
    return this.dataService.post(ApiConstant.DeletesConfigPayment + idc.toString(), reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
}
