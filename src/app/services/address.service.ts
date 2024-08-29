import { Injectable } from '@angular/core';
import { DataService } from '../shared/services/data.service';
import { Paging } from '../viewModels/paging';
import { ApiConstant } from '../shared/constants/api.constants';
import { Observable, map } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AddressService {

  constructor(private readonly dataService: DataService) { }

  getListAddressByPaging(queryParams: Paging) {
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

  createAddress(reqData: any) {
    return this.dataService.post(ApiConstant.CreateZone, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  updateAddress(reqData: any) {
    return this.dataService.put(ApiConstant.CreateZone, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  deleteAddress(reqData: any) {
    return this.dataService.delete(ApiConstant.CreateZone, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  getAddressByID(ID: string) {
    return this.dataService.get(ApiConstant.GetZoneById + ID)
      .pipe(map((res: any) => {
        return res;
      }));
  }
}
