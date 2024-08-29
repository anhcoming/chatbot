import { Injectable } from '@angular/core';
import { ApiConstant } from '../shared/constants/api.constants';
import { map } from 'rxjs';
import { Paging } from '../viewModels/paging';
import { DataService } from '../shared/services/data.service';
@Injectable({
  providedIn: 'root'
})
export class ResidentService {

  constructor(
    private readonly dataService: DataService
    ) { }
  getListResidentByPaging(queryParams: Paging) {
    return this.dataService.get(ApiConstant.GetResidentByPaging
      .concat(`?page=`, '' + (queryParams.page || 1))
      .concat(`&page_size=`, '' +  (queryParams.page_size || 1000))
      .concat(`&query=`, (queryParams.query || '1=1'))
      .concat(`&ProjectId=`, (queryParams.ProjectId || '-1'))
      .concat(`&TowerId=`, (queryParams.TowerId || '-1'))
      .concat(`&FloorId=`, (queryParams.FloorId || '-1'))
      .concat(`&ApartmentId=`, (queryParams.ApartmentId || '-1'))
      .concat(`&type=`, (queryParams.type || '-1'))
      .concat(`&status=`, (queryParams.status || '-1'))
      .concat(`&residentStatus=`, (queryParams.residentStatus || '-1'))
      .concat('&order_by=', (queryParams.order_by || '')))
      .pipe(map((res: any) => {
      return res;
    }));
  }
  
  createAccountResident(idr: number, reqData: any) {
    return this.dataService.post(ApiConstant.CreateAccountResident + idr, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  createResident(reqData: any) {
    return this.dataService.post(ApiConstant.CreateResident, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  updateResident(id: number, reqData: any) {
    return this.dataService.put(ApiConstant.UpdateResidentById + id, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  deleteResident(id: number) {
    return this.dataService.delete(ApiConstant.DeleteResidentById, id.toString())
      .pipe(map((res: any) => {
        return res;
      }));
  }
  deletesResident(idc: number, reqData:any) {
    return this.dataService.post(ApiConstant.DeletesResident+ idc.toString(), reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  getResident(id: number) {
     return this.dataService.get(ApiConstant.GetResidentById + id)
    .pipe(map((res: any) => {
      return res;
    }));
  }
  GetRegisterApartment(id: number) {
     return this.dataService.get(ApiConstant.RegisterApartment + id)
    .pipe(map((res: any) => {
      return res;
    }));
  }
  GetRegisterApartmentCard(id: number) {
     return this.dataService.get(ApiConstant.RegisterApartmentCard + id)
    .pipe(map((res: any) => {
      return res;
    }));
  }
  GetResidentCard(queryParams: Paging) {
    return this.dataService.get(ApiConstant.GetResidentCard
      .concat(`?residentId=`, '' + (queryParams.ResidentId || 1)))
      .pipe(map((res: any) => {
      return res;
    }));
  }
  AccessApartment(idc: any, id: number, idam: any) {
    return this.dataService.post(ApiConstant.AccessResident.concat(idc.toString() + '/' + id.toString() + '/' + idam.toString()))
      .pipe(map((res: any) => {
        return res;
      }));
  }
}
