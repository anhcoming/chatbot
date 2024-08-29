import { Injectable } from '@angular/core';
import { DataService } from '../shared/services/data.service';
import { Paging } from '../viewModels/paging';
import { ApiConstant } from '../shared/constants/api.constants';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TypeCardService {

  constructor(private readonly dataService: DataService) { }

  getListTypeCardByPaging(queryParams: Paging, projectId: number) {
    return this.dataService.get(ApiConstant.GetTypeCardByPaging
      .concat(`?page=`, '' + (queryParams.page || 1))
      .concat(`&page_size=`, '' +  (queryParams.page_size || 15))
      .concat(`&projectId=`, '' +  projectId)
      .concat(``, (queryParams.query ? '&queryString=' + queryParams.query : ''))
      .concat(`&select=`, (queryParams.select || ''))
      .concat('&order_by=', (queryParams.order_by || '')))
      .pipe(map((res: any) => {
        return res;
      }));
  }


  getListTypeCardByProjectId(projectId: number) {
    return this.dataService.get(ApiConstant.GetTypeCardByProjectId
      .concat(`?projectId=`, '' + projectId))
      .pipe(map((res: any) => {
        return res;
      }));
  }
  createTypeCard(reqData: any) {
    return this.dataService.post(ApiConstant.CreateTypeCard, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  updateTypeCardById(id: number, reqData: any) {
    return this.dataService.put(ApiConstant.UpdateTypeCardById + id, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  deleteTypeCardById(idc: number, id: number) {
    return this.dataService.delete(ApiConstant.DeleteTypeCardById, id.toString() )
      .pipe(map((res: any) => {
        return res;
      }));
  }
  getTypeCardById(idc: number, id: number) {
    return this.dataService.get(ApiConstant.GetTypeCardById + id.toString())
      .pipe(map((res: any) => {
        return res;
      }));
  }
}