import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { ApiConstant } from '../shared/constants/api.constants';
import { DataService } from '../shared/services/data.service';
import { Paging } from '../viewModels/paging';

@Injectable({
  providedIn: 'root'
})
export class ConfigCarparkingService {
  constructor(private readonly dataService: DataService) { }

  getListConfigCarparkingByPaging(queryParams: Paging) {
    return this.dataService.get(ApiConstant.GetConfigCarparkingByPaging
        .concat(`?page=`, '' + (queryParams.page || 1))
        .concat(`&page_size=`, '' +  (queryParams.page_size || 15))
        .concat(`&query=`, (queryParams.query || '1=1'))
        .concat(`&select=`, (queryParams.select || ''))
        .concat('&order_by=', (queryParams.order_by || '')))
        .pipe(map((res: any) => {
          return res;
        }));
  }

  createConfigCarparking(reqData: any) {
    return this.dataService.post(ApiConstant.CreateConfigCarparking, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  updateConfigCarparkingById(id: number, reqData: any) {
    return this.dataService.put(ApiConstant.ApiConfigCardById + id, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  deleteConfigCarparkingById(id: number) {
    return this.dataService.delete(ApiConstant.ApiConfigCardById, id.toString() )
      .pipe(map((res: any) => {
        return res;
      }));
  }
  getConfigCarparkingById(id: number) {
    return this.dataService.get(ApiConstant.ApiConfigCardById + id.toString())
      .pipe(map((res: any) => {
        return res;
      }));
  }
}
