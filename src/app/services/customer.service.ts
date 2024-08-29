import { Injectable } from '@angular/core';
import { ApiConstant } from '../shared/constants/api.constants';
import { map } from 'rxjs';
import { Paging } from '../viewModels/paging';
import { DataService } from '../shared/services/data.service';
@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(
    private readonly dataService: DataService
    ) { }
  getListCustomerByPaging(queryParams: Paging) {
    return this.dataService.get(ApiConstant.GetCustomerByPaging
      .concat(`?page=`, '' + (queryParams.page || 1))
      .concat(`&page_size=`, '' +  (queryParams.page_size || 15))
      .concat(`&query=`, (queryParams.query || '1=1'))
      .concat('&order_by=', (queryParams.order_by || '')))
      .pipe(map((res: any) => {
        return res;
      }));
  }
  
  createAccountCustomer(idc: number, reqData: any) {
    return this.dataService.post(ApiConstant.CreateAccountCustomer + idc, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  createCustomer(reqData: any) {
    return this.dataService.post(ApiConstant.CreateCustomer, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  updateCustomer(id: number, reqData: any) {
    return this.dataService.put(ApiConstant.UpdateCustomerById + id, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  deleteCustomer(id: number) {
    return this.dataService.delete(ApiConstant.DeleteCustomerById, id.toString())
      .pipe(map((res: any) => {
        return res;
      }));
  }
  getCustomer(id: number) {
     return this.dataService.get(ApiConstant.GetCustomerById + id)
    .pipe(map((res: any) => {
      return res;
    }));
 }
 deletesListCountries(Idc: number, reqData: any) {
  return this.dataService.post(ApiConstant.DeleteListWard.concat(Idc.toString()) , reqData)
    .pipe(map((res: any) => {
      return res;
    }));
}
}
