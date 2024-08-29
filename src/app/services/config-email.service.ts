import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { ApiConstant } from '../shared/constants/api.constants';
import { DataService } from '../shared/services/data.service';
import { Paging } from '../viewModels/paging';

@Injectable({
  providedIn: 'root'
})
export class ConfigEmailService {
  constructor(private readonly dataService: DataService) { }

  getListConfigEmailByPaging(queryParams: Paging) {
    return this.dataService.get(ApiConstant.GetConfigEmailByPaging
        .concat(`?page=`, '' + (queryParams.page || 1))
        .concat(`&page_size=`, '' +  (queryParams.page_size || 15))
        .concat(`&query=`, (queryParams.query || '1=1'))
        .concat(`&select=`, (queryParams.select || ''))
        .concat('&order_by=', (queryParams.order_by || '')))
        .pipe(map((res: any) => {
          return res;
        }));
  }

  createConfigEmail(reqData: any) {
    return this.dataService.post(ApiConstant.CreateConfigEmail, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  updateConfigEmailById(id: number, reqData: any) {
    return this.dataService.put(ApiConstant.ConfigEmailById + id, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  deleteConfigEmailById(id: number) {
    return this.dataService.delete(ApiConstant.ConfigEmailById, id.toString() )
      .pipe(map((res: any) => {
        return res;
      }));
  }
  getConfigEmailById(id: number) {
    return this.dataService.get(ApiConstant.ConfigEmailById + id.toString())
      .pipe(map((res: any) => {
        return res;
      }));
  }
}
