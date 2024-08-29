import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { ApiConstant } from '../shared/constants/api.constants';
import { DataService } from '../shared/services/data.service';

@Injectable({
  providedIn: 'root'
})
export class ProvincesService {
  constructor(private readonly dataService: DataService) { }

  createProvince(reqData: any) {
    return this.dataService.post(ApiConstant.CreateProvince, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  updateProvinceById(id: number, reqData: any) {
    return this.dataService.put(ApiConstant.ApiProvinceById + id, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  deleteProvincesById(id: number) {
    return this.dataService.delete(ApiConstant.DeleteProvinceById, id.toString() )
      .pipe(map((res: any) => {
        return res;
      }));
  }
  getProvinceById(id: number) {
    return this.dataService.get(ApiConstant.ApiProvinceById + id)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  deletesListProvincess(Idc: number, reqData: any) {
    return this.dataService.post(ApiConstant.DeleteListProvinces.concat(Idc.toString()) , reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
}