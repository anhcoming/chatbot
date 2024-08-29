import { Injectable } from '@angular/core';
import { ApiConstant } from '../shared/constants/api.constants';
import { map } from 'rxjs';
import { Paging } from '../viewModels/paging';
import { DataService } from '../shared/services/data.service';
@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(
    private readonly dataService: DataService
    ) { }
  getListCompanyByPaging(queryParams: Paging) {
    return this.dataService.get(ApiConstant.GetCompanyByPaging
      .concat(`?page=`, '' + (queryParams.page || 1))
      .concat(`&page_size=`, '' +  (queryParams.page_size || 15))
      .concat(`&query=`, (queryParams.query || '1=1'))
      .concat(`&select=`, (queryParams.select || ''))
      .concat(`&dateStart=`, (queryParams.DateStart || ''))
      .concat(`&dateEnd=`, (queryParams.DateEnd || ''))
      .concat('&order_by=', (queryParams.order_by || '')))
      .pipe(map((res: any) => {
        return res;
      }));
  }  createCompany(reqData: any) {
    return this.dataService.post(ApiConstant.CreateCompany, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  updateCompany(id: number, reqData: any) {
    return this.dataService.put(ApiConstant.ApiCompanyById + id, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  deleteCompany(id: number) {
    return this.dataService.delete(ApiConstant.ApiCompanyById, id.toString())
      .pipe(map((res: any) => {
        return res;
      }));
  }
  deletesCompany(reqData: any) {
    return this.dataService.post(ApiConstant.DeletesCompany, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  getCompany(id: number) {
     return this.dataService.get(ApiConstant.ApiCompanyById + id)
    .pipe(map((res: any) => {
      return res;
    }));
 }

}
