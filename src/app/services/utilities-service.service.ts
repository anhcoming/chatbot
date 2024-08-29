import { Injectable } from '@angular/core';
import { DataService } from '../shared/services/data.service';
import { Paging } from '../viewModels/paging';
import { ApiConstant } from '../shared/constants/api.constants';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesServiceService {

  constructor(private readonly dataService: DataService) { }
  getListUtilitiesServiceByPaging(queryParams: Paging) {
    return this.dataService.get(ApiConstant.GetUtilitiesServiceByPaging
        .concat(`?page=`, '' + (queryParams.page || 1))
        .concat(`&page_size=`, '' +  (queryParams.page_size || 15))
        .concat(`&query=`, (queryParams.query || '1=1'))
        .concat(`&select=`, (queryParams.select || ''))
        .concat('&order_by=', (queryParams.order_by || '')))
        .pipe(map((res: any) => {
          return res;
        }));
  }

  createUtilitiesService(reqData: any) {
    return this.dataService.post(ApiConstant.CreateUtilitiesService, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  updateUtilitiesServiceById(id: number, reqData: any) {
    return this.dataService.put(ApiConstant.UtilitiesServiceById + id, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  deleteUtilitiesServiceById(id: number) {
    return this.dataService.delete(ApiConstant.UtilitiesServiceById, id.toString() )
      .pipe(map((res: any) => {
        return res;
      }));
  }
  getUtilitiesServiceById(id: number) {
    return this.dataService.get(ApiConstant.UtilitiesServiceById + id)
      .pipe(map((res: any) => {
        return res;
      }));
  }


  deletesUtilitiesService(idc: number, reqData: any) {
    return this.dataService.post(ApiConstant.DeletesUtilitiesService + idc.toString(), reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
}
