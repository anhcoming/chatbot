import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { ApiConstant } from '../shared/constants/api.constants';
import { DataService } from '../shared/services/data.service';
import { Paging } from '../viewModels/paging';

@Injectable({
  providedIn: 'root'
})
export class WardsService {

  constructor(private readonly dataService: DataService) { }

  createWard(reqData: any) {
    return this.dataService.post(ApiConstant.CreateWard, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  updateWardById(id: number, reqData: any) {
    return this.dataService.put(ApiConstant.ApiWardById + id, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  deleteWardById(idc: number, id: number) {
    return this.dataService.delete(ApiConstant.DeleteWardById.concat(idc.toString(), '/'), id.toString())
      .pipe(map((res: any) => {
        return res;
      }));
  }
  getWardById(id: number) {
    return this.dataService.get(ApiConstant.ApiWardById + id)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  deletesListWard(Idc: number, reqData: any) {
    return this.dataService.post(ApiConstant.DeleteListWard.concat(Idc.toString()) , reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
}