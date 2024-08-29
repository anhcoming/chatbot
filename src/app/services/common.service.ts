import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { ApiConstant } from '../shared/constants/api.constants';
import { DataService } from '../shared/services/data.service';
import { Paging } from '../viewModels/paging';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  [x: string]: any;

  constructor(private readonly dataService: DataService) { }

  getListCountrieByPaging(queryParams: Paging) {
    return this.dataService.get(ApiConstant.GetCountryByPaging
      .concat(`?page=`, '' + (queryParams.page || 1))
      .concat(`&page_size=`, '' +  (queryParams.page_size || 300))
      .concat(`&query=`, (queryParams.query || '1=1'))
      .concat(`&select=`, (queryParams.select || ''))
      .concat('&order_by=', (queryParams.order_by || '')))
      .pipe(map((res: any) => {
        return res;
      }));
  }
  getListTypeAttributeByPaging(queryParams: Paging) {
    return this.dataService.get(ApiConstant.GetTypeAttributeByPaging
      .concat(`?page=`, '' + (queryParams.page || 1))
      //.concat(`&page_size=`, '' +  (queryParams.page_size || 0))
      .concat(`&query=`, (queryParams.query || '1=1'))
      .concat(`&select=`, (queryParams.select || ''))
      .concat('&order_by=', (queryParams.order_by || '')))
      .pipe(map((res: any) => {
        return res;
      }));
  }
  getListProvinceByPaging(queryParams: Paging) {
    return this.dataService.get(ApiConstant.GetProvinceByPaging
      .concat(`?page=`, '' + (queryParams.page || 1))
      //.concat(`&page_size=`, '' +  (queryParams.page_size || 0))
      .concat(`&query=`, (queryParams.query || '1=1'))
      .concat(`&select=`, (queryParams.select || ''))
      .concat('&order_by=', (queryParams.order_by || '')))
      .pipe(map((res: any) => {
        return res;
      }));
  }

  getListDistrictByPaging(queryParams: Paging) {
    return this.dataService.get(ApiConstant.GetDistrictByPaging
      .concat(`?page=`, '' + (queryParams.page || 1))
      //.concat(`&page_size=`, '' +  (queryParams.page_size || 0))
      .concat(`&query=`, (queryParams.query || '1=1'))
      .concat(`&select=`, (queryParams.select || ''))
      .concat('&order_by=', (queryParams.order_by || '')))
      .pipe(map((res: any) => {
        return res;
      }));
  }
  getListProjectByPaging(queryParams: Paging) {
    return this.dataService.get(ApiConstant.GetTowerByPaging
      .concat(`?page=`, '' + (queryParams.page || 1))
      //.concat(`&page_size=`, '' +  (queryParams.page_size || 0))
      .concat(`&query=`, (queryParams.query || '1=1'))
      .concat(`&select=`, (queryParams.select || ''))
      .concat('&order_by=', (queryParams.order_by || '')))
      .pipe(map((res: any) => {
        return res;
      }));
  }

  getListWardByPaging(queryParams: Paging) {
    return this.dataService.get(ApiConstant.GetWardByPaging
      .concat(`?page=`, '' + (queryParams.page || 1))
      //.concat(`&page_size=`, '' +  (queryParams.page_size || 0))
      .concat(`&query=`, (queryParams.query || '1=1'))
      .concat(`&select=`, (queryParams.select || ''))
      .concat('&order_by=', (queryParams.order_by || '')))
      .pipe(map((res: any) => {
        return res;
      }));
  }
  changePassword(idc: number, id: number, type: number, reqData: any) {
   return this.dataService.put(ApiConstant.ChangePassword.concat( idc.toString() + '/' + id.toString() + '/' + type) , reqData )
     .pipe(map((res: any) => {
       return res
     }))
   }
   LockUser(idc: number, id: number, status: number) {
      return this.dataService.put(ApiConstant.LockAccount.concat(idc.toString() + '/' + id.toString() + '/' + status.toString()))
     .pipe(map((res: any) => {
       return res;
     }));
   }
   getServiceUtilities(queryParams: Paging) {
     return this.dataService.get(ApiConstant.getListServiceUtilities
       .concat(`?page=`, '' + (queryParams.page || 1))
       .concat(`&page_size=`, '' +  (queryParams.page_size || 15))
       .concat(`&query=`, (queryParams.query || '1=1'))
       .concat(`&select=`, (queryParams.select || ''))
       .concat('&order_by=', (queryParams.order_by || '')))
       .pipe(map((res: any) => {
         return res;
       }));
   }
}
