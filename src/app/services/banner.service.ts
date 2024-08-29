import { Injectable } from '@angular/core';
import { DataService } from '../shared/services/data.service';
import { ApiConstant } from '../shared/constants/api.constants';
import { Paging } from '../viewModels/paging';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BannerService {
  constructor(private readonly dataService: DataService) { }
  getListBannerByPaging(queryParams: Paging) {
    return this.dataService.get(ApiConstant.GetBannerByPaging
      .concat(`?page=`, '' + (queryParams.page || 1))
      .concat(`&page_size=`, '' +  (queryParams.page_size || 15))
      .concat(`&query=`, (queryParams.query || '1=1'))
      .concat(`&ProjectId=`, (queryParams.ProjectId || '-1'))
      .concat(`&TowerId=`, (queryParams.TowerId || '-1'))
      .concat(`&ZoneId=`, (queryParams.ZoneId || '-1'))
      .concat(`&dateStart=`,(queryParams.dateStart || ''))
      .concat(`&dateEnd=`,(queryParams.dateEnd || ''))
      .concat(`&select=`, (queryParams.select || ''))
      .concat(`&type=`,'' + (queryParams.type || -1))
      .concat('&order_by=', (queryParams.order_by || '')))
      .pipe(map((res: any) => {
        return res;
      }));
  }
  createBanner(reqData: any) {
    return this.dataService.post(ApiConstant.CreateBanner, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  createImg(reqData: any) {
    return this.dataService.post(ApiConstant.CreateImage, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  updateBanner(id: number, reqData: any) {
    return this.dataService.put(ApiConstant.UpdateBannerById + id, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  deleteBannerById(id: number) {
    return this.dataService.delete(ApiConstant.DeleteBannerById, id.toString())
      .pipe(map((res: any) => {
        return res;
      }));
  }
  deletesListBanner(Idc: number, reqData: any) {
    return this.dataService.post(ApiConstant.DeleteListBanner.concat(Idc.toString()) , reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  getBannerById(id: number) {
    return this.dataService.get(ApiConstant.GetBannerById + id)
      .pipe(map((res: any) => {
        return res;
      }));
  }
}
