import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { ApiConstant } from '../shared/constants/api.constants';
import { DataService } from '../shared/services/data.service';
import { Paging } from '../viewModels/paging';

@Injectable({
  providedIn: 'root'
})
export class ConfigCardService {
  constructor(private readonly dataService: DataService) { }

  getListConfigCardByPaging(queryParams: Paging, projectId: number) {
    return this.dataService.get(ApiConstant.GetConfigCardByPaging
      .concat(`?page=`, '' + (queryParams.page || 1))
      .concat(`&page_size=`, '' +  (queryParams.page_size || 15))
      .concat(``, (queryParams.query ? '&queryString=' + queryParams.query : ''))
      .concat(``, ((projectId && projectId > 0) ? '&projectId=' + projectId : ''))
      .concat(`&select=`, (queryParams.select || ''))
      .concat('&order_by=', (queryParams.order_by || '')))
      .pipe(map((res: any) => {
        return res;
      }));
  }

  getListConfigCardByProjectId(projectId: number) {
    return this.dataService.get(ApiConstant.GetConfigCardByProjectId
      .concat(`?projectId=`, projectId.toString()))
      .pipe(map((res: any) => {
        return res;
      }));
  }

  createConfigCard(reqData: any) {
    return this.dataService.post(ApiConstant.CreateConfigCard, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  updateConfigCardByIdIndex(idIndex: string, reqData: any) {
    return this.dataService.put(ApiConstant.UpdateConfigCardById + idIndex, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  deleteConfigCardById(idc: number, id: string) {
    return this.dataService.delete(ApiConstant.DeleteConfigCardById, id )
      .pipe(map((res: any) => {
        return res;
      }));
  }
  getConfigCardById(idc: number, id: number) {
    return this.dataService.get(ApiConstant.GetConfigCardById + id.toString())
      .pipe(map((res: any) => {
        return res;
      }));
  }

  getConfigCardByIdIndex(idc: number, idIndex: string) {
    return this.dataService.get(ApiConstant.GetConfigCardById + idIndex)
      .pipe(map((res: any) => {
        return res;
      }));
  }
}
