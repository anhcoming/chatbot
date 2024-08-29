import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { ApiConstant } from '../shared/constants/api.constants';
import { DataService } from '../shared/services/data.service';

@Injectable({
  providedIn: 'root'
})
export class DistrictsService {
  constructor(private readonly dataService: DataService) { }

  createDistrict(reqData: any) {
    return this.dataService.post(ApiConstant.CreateDistrict, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  updateDistrictById(id: number, reqData: any) {
    return this.dataService.put(ApiConstant.ApiDistrictById + id, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  deleteDistrictById(id: number) {
    return this.dataService.delete(ApiConstant.DeleteDistrictById, id.toString() )
      .pipe(map((res: any) => {
        return res;
      }));
  }
  getDistrictById(id: number) {
    return this.dataService.get(ApiConstant.ApiDistrictById + id)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  deletesListDistricts(Idc: number, reqData: any) {
    return this.dataService.post(ApiConstant.DeleteListDistricts.concat(Idc.toString()) , reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
}
