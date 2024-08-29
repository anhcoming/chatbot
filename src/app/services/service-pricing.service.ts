import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, map } from 'rxjs';
import { ApiConstant } from '../shared/constants/api.constants';
import { DataService } from '../shared/services/data.service';
import { Paging } from '../viewModels/paging';

@Injectable({
  providedIn: 'root'
})
export class ServicePricingService {
  constructor(private readonly dataService: DataService) { }

  getListServicePricingByPaging(queryParams: Paging) {
    return this.dataService.get(ApiConstant.GetServicePricingByPaging
      .concat(`?page=`, '' + (queryParams.page || 1))
      .concat(`&page_size=`, '' +  (queryParams.page_size || 15))
      .concat(`&query=`, (queryParams.query || '1=1'))
      .concat(`&select=`, (queryParams.select || ''))
      .concat('&order_by=', (queryParams.order_by || '')))
      .pipe(map((res: any) => {
        return res;
      }));
  }

  createServicePricing(reqData: any) {
    return this.dataService.post(ApiConstant.CreateServicePricing, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  updateServicePricing(id: number, reqData: any) {
    return this.dataService.put(ApiConstant.ApiById + id, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  deleteServicePricingById(id: number ) {
    return this.dataService.delete(ApiConstant.ApiById, id.toString())
      .pipe(map((res: any) => {
        return res;
      }));
  }
  deletesServicePricing(idc: number , reqData: any) {
    return this.dataService.delete(ApiConstant.ApiById.concat('deletes/') + idc.toString(), reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  getServicePricingById(id: number) {
    return this.dataService.get(ApiConstant.ApiById + id)
      .pipe(map((res: any) => {
        return res;
      }));
  }

}
