import { Injectable } from '@angular/core';
import { DataService } from '../shared/services/data.service';
import { Paging } from '../viewModels/paging';
import { ApiConstant } from '../shared/constants/api.constants';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ZoneService {

  constructor(private readonly dataService: DataService) { }

  getListZoneByPaging(queryParams: Paging) {
    return this.dataService.get(ApiConstant.GetZoneByPaging
      .concat(`?page=`, '' + (queryParams.page || 1))
      .concat(`&page_size=`, '' +  (queryParams.page_size || 15))
      .concat(`&query=`, (queryParams.query || '1=1'))
      .concat(`&select=`, (queryParams.select || ''))
      .concat('&order_by=', (queryParams.order_by || '')))
      .pipe(map((res: any) => {
        return res;
      }));
  }

  createZone(reqData: any) {
    return this.dataService.post(ApiConstant.CreateZone, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  updateZone(id: number, reqData: any) {
    return this.dataService.put(ApiConstant.UpdateZoneById + id, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  deleteZoneById(Idc: number, id: number) {
    return this.dataService.delete(ApiConstant.DeleteZoneById.concat(Idc.toString() + '/') , id.toString())
      .pipe(map((res: any) => {
        return res;
      }));
  }
  deletesZone(Idc: number, reqData: any) {
    return this.dataService.post(ApiConstant.DeleteListZone.concat(Idc.toString()) , reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }

  getZoneById(idc: number, id: number) {
    return this.dataService.get(ApiConstant.GetZoneById.concat(idc.toString() ,'/', id.toString()))
      .pipe(map((res: any) => {
        return res;
      }));
  }
}