import { Injectable } from '@angular/core';
import { DataService } from '../shared/services/data.service';
import { ApiConstant } from '../shared/constants/api.constants';
import { Paging } from '../viewModels/paging';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CardManagerService {
  constructor(private readonly dataService: DataService) { }
  getListCardManagerByPaging(queryParams: Paging) {
    return this.dataService.get(ApiConstant.GetCardManagerByPaging
      .concat(`?page=`, '' + (queryParams.page || 1))
      .concat(`&page_size=`, '' +  (queryParams.page_size || 15))
      .concat(`&vehicleId=`, '' +  (queryParams.vehicleId || 0))
      .concat(`&groupCard=`, '' +  (queryParams.groupCard || 1)))
      .pipe(map((res: any) => {
        return res;
      }));
  }
}
