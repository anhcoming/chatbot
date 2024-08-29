import { Injectable } from '@angular/core';
import { DataService } from '../shared/services/data.service';
import { ApiConstant } from '../shared/constants/api.constants';
import { map } from 'rxjs';
import { Paging } from '../viewModels/paging';

@Injectable({
  providedIn: 'root'
})
export class ApartmentService {

  constructor(private readonly dataService: DataService) { }
  getListApartmentByPaging(queryParams: Paging) {
    return this.dataService.get(ApiConstant.CreateApartmentByPaging
      .concat(`?page=`, '' + (queryParams.page || 1))
      .concat(`&page_size=`, '' +  (queryParams.page_size || 15))
      .concat(`&query=`, (queryParams.query || '1=1'))
      .concat(`&select=`, (queryParams.select || ''))
      .concat('&order_by=', (queryParams.order_by || '')))
      .pipe(map((res: any) => {
        return res;
      }));
  }
  createApartment(reqData: any) {
    return this.dataService.post(ApiConstant.CreateApartment, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  updateApartment(id: number, reqData: any) {
    return this.dataService.put(ApiConstant.UpdateApartmentById + id, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  deleteApartmentById(idc: number, id: number ) {
    return this.dataService.delete(ApiConstant.DeleteApartmentById.concat(idc.toString(),'/'), id.toString())
      .pipe(map((res: any) => {
        return res;
      }));
  }
  deletesApartment(idc: number, reqData: any ) {
    return this.dataService.post(ApiConstant.DeletesApartment.concat(idc.toString()), reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  getApartmentById(idc: number, id: number) {
    return this.dataService.get(ApiConstant.GetApartmentById.concat(idc.toString() + '/' + id.toString()))
      .pipe(map((res: any) => {
        return res;
      }));
  }
}
