import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { ApiConstant } from '../shared/constants/api.constants';
import { DataService } from '../shared/services/data.service';
import { Paging } from '../viewModels/paging';

@Injectable({
  providedIn: 'root'
})
export class ConfigBookingService {
  constructor(private readonly dataService: DataService) { }

  getListConfigBookingByPaging(queryParams: Paging) {
    return this.dataService.get(ApiConstant.GetConfigBookingByPaging
        .concat(`?page=`, '' + (queryParams.page || 1))
        .concat(`&page_size=`, '' +  (queryParams.page_size || 15))
        .concat(`&query=`, (queryParams.query || '1=1'))
        .concat(`&select=`, (queryParams.select || ''))
        .concat('&order_by=', (queryParams.order_by || '')))
        .pipe(map((res: any) => {
          return res;
        }));
  }

  createConfigBooking(reqData: any) {
    return this.dataService.post(ApiConstant.CreateConfigBooking, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  updateConfigBookingById(id: number, reqData: any) {
    return this.dataService.put(ApiConstant.ConfigBookingById + id, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  deleteConfigBookingById(id: number) {
    return this.dataService.delete(ApiConstant.ConfigBookingById, id.toString() )
      .pipe(map((res: any) => {
        return res;
      }));
  }
  getConfigBookingById(id: number) {
    return this.dataService.get(ApiConstant.ConfigBookingById + id.toString())
      .pipe(map((res: any) => {
        return res;
      }));
  }
  getOrderYardCode(idc: any) {
    return this.dataService.get(ApiConstant.OrderYardCode + idc.toString())
      .pipe(map((res: any) => {
        return res;
      }))
  }
}
