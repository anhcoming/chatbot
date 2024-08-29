import { Injectable } from '@angular/core';
import { DataService } from '../shared/services/data.service';
import { Paging } from '../viewModels/paging';
import { ApiConstant } from '../shared/constants/api.constants';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private readonly dataService: DataService) { }
  getListNotificationByPaging(queryParams: Paging) {
    return this.dataService.get(ApiConstant.GetNotificationByPaging
      .concat(`?page=`, '' + (queryParams.page || 1))
      .concat(`&page_size=`, '' +  (queryParams.page_size || 15))
      .concat(`&query=`, (queryParams.query || '1=1'))
      .concat(`&ProjectId=`, (queryParams.ProjectId || '-1'))
      .concat(`&TowerId=`, (queryParams.TowerId || '-1'))
      .concat(`&ZoneId=`, (queryParams.ZoneId || '-1'))
      .concat(`&dateStart`,(queryParams.dateStart || ''))
      .concat(`&dateEnd`,(queryParams.dateEnd || ''))
      .concat(`&select=`, (queryParams.select || ''))
      .concat(`&type=`,'' + (queryParams.type || -1))
      .concat('&order_by=', (queryParams.order_by || '')))
      .pipe(map((res: any) => {
        return res;
      }));
  }
  createNotification(reqData: any) {
    return this.dataService.post(ApiConstant.CreateNotification, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  updateNotification(id: number, reqData: any) {
    return this.dataService.put(ApiConstant.UpdateNotificationById + id, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  deleteNotificationById(id: number) {
    return this.dataService.delete(ApiConstant.DeleteNotificationById, id.toString())
      .pipe(map((res: any) => {
        return res;
      }));
  }
  deletesListNotification(Idc: number, reqData: any) {
    return this.dataService.post(ApiConstant.DeleteLstNotification.concat(Idc.toString()) , reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  getNotificationById(id: number) {
    return this.dataService.get(ApiConstant.GetNotificationById + id)
      .pipe(map((res: any) => {
        return res;
      }));
  }
}
