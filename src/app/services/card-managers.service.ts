import { Injectable } from '@angular/core';
import { DataService } from '../shared/services/data.service';
import { ApiConstant } from '../shared/constants/api.constants';
import { Paging } from '../viewModels/paging';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CardManagersService {
  constructor(private readonly dataService: DataService) { }
  getListCardManagerByPaging(queryParams: Paging) {
    return this.dataService.get(ApiConstant.GetCardManagerByPaging
      .concat(`?page=`, '' + (queryParams.page || 1))
      .concat(`&page_size=`, '' +  (queryParams.page_size || 15))
      .concat(`&towerId=`, '' +  (queryParams.TowerId || ''))
      .concat(`&vehicleId=`, '' +  (queryParams.vehicleId || 0))
      .concat(`&groupCard=`, '' +  (queryParams.groupCard || 1)))
      .pipe(map((res: any) => {
        return res;
      }));
  }
  getListCardEmptyByPaging(queryParams: Paging) {
    return this.dataService.get(ApiConstant.GetCardEmptyByPage
      .concat(`?page=`, '' + (queryParams.page || 1))
      .concat(`&page_size=`, '' +  (queryParams.page_size || 15))
      .concat(`&towerId=`, '' +  (queryParams.TowerId || ''))
      .concat(`&vehicleId=`, '' +  (queryParams.vehicleId || 0))
      .concat(`&groupCard=`, '' +  (queryParams.groupCard || 1)))
      .pipe(map((res: any) => {
        return res;
      }));
  }
  getListCardActiveByPage(queryParams: Paging) {
    return this.dataService.get(ApiConstant.GetCardActiveByPage
      .concat(`?page=`, '' + (queryParams.page || 1))
      .concat(`&page_size=`, '' +  (queryParams.page_size || 15))
      .concat(`&ApartmentId=`, '' +  (queryParams.ApartmentId || ''))
      .concat(`&ResidentId=`, '' +  (queryParams.ResidentId || ''))
      .concat(`&vehicleId=`, '' +  (queryParams.vehicleId || 0))
      .concat(`&groupCard=`, '' +  (queryParams.groupCard || 1)))
      .pipe(map((res: any) => {
        return res;
      }));
  }
  GetCardRegisterApartment(queryParams: Paging) {
    return this.dataService.get(ApiConstant.CardRegisterApartment
      .concat(`?apartmentId=`, (queryParams.ApartmentId || '-1')))
      .pipe(map((res: any) => {
      return res;
    }));
  }
}

