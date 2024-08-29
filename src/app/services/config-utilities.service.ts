import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { ApiConstant } from '../shared/constants/api.constants';
import { DataService } from '../shared/services/data.service';
import { Paging } from '../viewModels/paging';

@Injectable({
  providedIn: 'root'
})
export class ConfigRegisterService {
  constructor(private readonly dataService: DataService) { }

  getListConfigRegisterByPaging(queryParams: Paging) {
    return this.dataService.get(ApiConstant.GetConfigRegisterByPaging
        .concat(`?page=`, '' + (queryParams.page || 1))
        .concat(`&page_size=`, '' +  (queryParams.page_size || 15))
        .concat(`&query=`, (queryParams.query || '1=1'))
        .concat(`&select=`, (queryParams.select || ''))
        .concat('&order_by=', (queryParams.order_by || '')))
        .pipe(map((res: any) => {
          return res;
        }));
  }
  createConfigRegister(reqData: any) {
    return this.dataService.post(ApiConstant.CreateConfigRegister, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  updateConfigRegisterById(id: number, reqData: any) {
    return this.dataService.put(ApiConstant.ConfigRegisterById + id, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  deleteConfigRegisterById(id: number) {
    return this.dataService.delete(ApiConstant.ConfigRegisterById, id.toString() )
      .pipe(map((res: any) => {
        return res;
      }));
  }
  getConfigRegisterById(id: number) {
    return this.dataService.get(ApiConstant.ConfigRegisterById + id.toString())
      .pipe(map((res: any) => {
        return res;
      }));
  }

  deletesConfigRegister(idc: number, reqData: any) {
    return this.dataService.post(ApiConstant.DeletesConfigRegister + idc.toString(), reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
}
