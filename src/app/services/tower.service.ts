import { Injectable } from '@angular/core';
import { DataService } from '../shared/services/data.service';
import { Paging } from '../viewModels/paging';
import { ApiConstant } from '../shared/constants/api.constants';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TowerService {

  constructor(private readonly dataService: DataService) { }

  getListTowerByPaging(queryParams: Paging) {
    return this.dataService.get(ApiConstant.GetTowerByPaging
      .concat(`?page=`, '' + (queryParams.page || 1))
      .concat(`&page_size=`, '' +  (queryParams.page_size || 15))
      .concat(`&query=`, (queryParams.query || '1=1'))
      .concat(`&select=`, (queryParams.select || ''))
      .concat('&order_by=', (queryParams.order_by || '')))
      .pipe(map((res: any) => {
        return res;
      }));
  }

  createTower(reqData: any) {
    return this.dataService.post(ApiConstant.CreateTower, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  updateTowerById(id: number, reqData: any) {
    return this.dataService.put(ApiConstant.UpdateTowerById + id, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  deleteTowerById(idc: number, id: number) {
    return this.dataService.delete(ApiConstant.DeleteTowerById.concat(idc.toString() + '/'), id.toString() )
      .pipe(map((res: any) => {
        return res;
      }));
  }
  deletesTower(idc: number, reqData: any) {
    return this.dataService.post(ApiConstant.DeletesTower + idc.toString(), reqData)  
      .pipe(map((res: any) => {
        return res;
      }));
  }
  getTowerById(idc: number, id: number) {
    return this.dataService.get(ApiConstant.GetTowerById.concat(idc.toString() + '/') + id.toString())
      .pipe(map((res: any) => {
        return res;
      }));
  }
}