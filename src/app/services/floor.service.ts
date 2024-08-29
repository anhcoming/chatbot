import { Injectable } from '@angular/core';
import { DataService } from '../shared/services/data.service';
import { Paging } from '../viewModels/paging';
import { ApiConstant } from '../shared/constants/api.constants';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FloorService {
  constructor(private readonly dataService: DataService) { }

  getListFloorByPaging(queryParams: Paging) {
    return this.dataService.get(ApiConstant.GetFloorByPaging
      .concat(`?page=`, '' + (queryParams.page || 1))
      .concat(`&page_size=`, '' +  (queryParams.page_size || 15))
      .concat(`&query=`, (queryParams.query || '1=1'))
      .concat(`&select=`, (queryParams.select || ''))
      .concat('&order_by=', (queryParams.order_by || '')))
      .pipe(map((res: any) => {
        return res;
      }));
  }

  createFloor(reqData: any) {
    return this.dataService.post(ApiConstant.CreateFloor, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  updateFloorById(id: number, reqData: any) {
    return this.dataService.put(ApiConstant.DeleteFloorById + id, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  deleteFloorById(Idc: number, id: number) {
    return this.dataService.delete(ApiConstant.DeleteFloorById.concat(Idc.toString() + '/') , id.toString())
      .pipe(map((res: any) => {
        return res;
      }));
  }
  deletesFloor(Idc: number, reqData: any) {
    return this.dataService.post(ApiConstant.DeletesFloor.concat(Idc.toString()) , reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }

  getFloorById(idc: number, id: number) {
    return this.dataService.get(ApiConstant.GetFloorById.concat(idc.toString() + '/')+ id.toString())
      .pipe(map((res: any) => {
        return res;
      }));
  }
}
