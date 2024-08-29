import { Injectable } from '@angular/core';
import { DataService } from '../shared/services/data.service';
import { ApiConstant } from '../shared/constants/api.constants';
import { map } from 'rxjs';
import { Paging } from '../viewModels/paging';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  constructor(private readonly dataService: DataService) { }
  getListNewsByPaging(queryParams: Paging) {
    return this.dataService.get(ApiConstant.GetNewsByPaging
      .concat(`?page=`, '' + (queryParams.page || 1))
      .concat(`&page_size=`, '' +  (queryParams.page_size || 15))
      .concat(`&query=`, (queryParams.query || '1=1'))
      .concat(`&ProjectId=`, (queryParams.ProjectId || '-1'))
      .concat(`&TowerId=`, (queryParams.TowerId || '-1'))
      .concat(`&ZoneId=`, (queryParams.ZoneId || '-1'))
      .concat(`&ApartmentId=`, (queryParams.ZoneId || '-1'))
      .concat(`&dateStart=`,(queryParams.dateStart || ''))
      .concat(`&dateEnd=`,(queryParams.dateEnd || ''))
      .concat(`&select=`, (queryParams.select || ''))
      .concat(`&type=`,'' + (queryParams.type || -1))
      .concat(`&status=`,'' + (queryParams.type || -1))
      .concat('&order_by=', (queryParams.order_by || '')))
      .pipe(map((res: any) => {
        return res;
      }));
  }
  createNews(reqData: any) {
    return this.dataService.post(ApiConstant.CreateNews, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  updateNews(id: number, reqData: any) {
    return this.dataService.put(ApiConstant.UpdateNewsById + id, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  deleteNewsById(idc:number,id: number) {
    return this.dataService.delete(ApiConstant.DeleteNewsById,idc+ '/' + id.toString())
      .pipe(map((res: any) => {
        return res;
      }));
  }
  deletesListNews(Idc: number,typeN:number, reqData: any) {
    return this.dataService.post(ApiConstant.DeleteLstNews.concat(Idc.toString()+ '/' + typeN.toString()) , reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  getNewsById(idc:number ,id: number, typeN: number) {
    return this.dataService.get(ApiConstant.GetNewsById +idc+ '/' + id + '/' + typeN)
      .pipe(map((res: any) => {
        return res;
      }));
  }
}
