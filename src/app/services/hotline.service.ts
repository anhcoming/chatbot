import { Injectable } from '@angular/core';
import { DataService } from '../shared/services/data.service';
import { ApiConstant } from '../shared/constants/api.constants';
import { map } from 'rxjs';
import { Paging } from '../viewModels/paging';

@Injectable({
  providedIn: 'root'
})
export class HotlineService {

  constructor(private readonly dataService: DataService) { }
  getListHotlineByPaging(queryParams: Paging) {
    return this.dataService.get(ApiConstant.GetHotlineByPaging
      .concat(`?page=`, '' + (queryParams.page || 1))
      .concat(`&page_size=`, '' +  (queryParams.page_size || 15))
      .concat(`&query=`, (queryParams.query || '1=1'))
      .concat(`&ProjectId=`, (queryParams.ProjectId || '-1'))
      .concat(`&TowerId=`, (queryParams.TowerId || '-1'))
      .concat(`&ZoneId=`, (queryParams.ZoneId || '-1'))
      .concat(`&dateStart=`,(queryParams.dateStart || ''))
      .concat(`&dateEnd=`,(queryParams.dateEnd || ''))
      .concat(`&select=`, (queryParams.select || ''))
      .concat(`&type=`,'' + (queryParams.type || -1))
      .concat('&order_by=', (queryParams.order_by || '')))
      .pipe(map((res: any) => {
        return res;
      }));
  }
  createHotline(reqData: any) {
    return this.dataService.post(ApiConstant.CreateHotline, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  updateHotline(id: number, reqData: any) {
    return this.dataService.put(ApiConstant.UpdateHotlineById + id, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  deleteHotlineById(id: number) {
    return this.dataService.delete(ApiConstant.DeleteHotlineById, id.toString())
      .pipe(map((res: any) => {
        return res;
      }));
  }
  deletesListHotline(Idc: number, reqData: any) {
    return this.dataService.post(ApiConstant.DeleteListHotline.concat(Idc.toString()) , reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  getHotlineById(id: number) {
    return this.dataService.get(ApiConstant.GetHotlineById + id)
      .pipe(map((res: any) => {
        return res;
      }));
  }
}
