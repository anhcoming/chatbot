import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { ApiConstant } from '../shared/constants/api.constants';
import { DataService } from '../shared/services/data.service';
import { Paging } from '../viewModels/paging';

@Injectable({
  providedIn: 'root'
})
export class ConfigAppService {
  constructor(private readonly dataService: DataService) { }

  getListConfigAppByPaging(queryParams: Paging) {
    return this.dataService.get(ApiConstant.GetConfigAppByPaging
      .concat(`?page=`, '' + (queryParams.page || 1))
        .concat(`&page_size=`, '' +  (queryParams.page_size || 15))
        .concat(`&query=`, (queryParams.query || '1=1'))
        .concat(`&select=`, (queryParams.select || ''))
        .concat('&order_by=', (queryParams.order_by || '')))
        .pipe(map((res: any) => {
          return res;
        }));
  }

  createConfigApp(reqData: any) {
    return this.dataService.post(ApiConstant.CreateConfigApp, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  updateConfigAppByIdIndex(idIndex: string, reqData: any) {
    return this.dataService.put(ApiConstant.ConfigAppById + idIndex, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  deleteConfigAppById(id: string) {
    return this.dataService.delete(ApiConstant.ConfigAppById, id )
      .pipe(map((res: any) => {
        return res;
      }));
  }
  deletesConfigApp(id: string, reqData: any) {
    return this.dataService.post(ApiConstant.DeletesConfigApp + id.toString(), reqData )
      .pipe(map((res: any) => {
        return res;
      }));
  }
  getConfigAppById(id: number) {
    return this.dataService.get(ApiConstant.ConfigAppById + id.toString())
      .pipe(map((res: any) => {
        return res;
      }));
  }
}
