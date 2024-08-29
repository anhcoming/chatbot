import { Injectable } from '@angular/core';
import { DataService } from '../shared/services/data.service';
import { Paging } from '../viewModels/paging';
import { ApiConstant } from '../shared/constants/api.constants';
import { Observable, map } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class NotebookService {

  constructor(private readonly dataService: DataService) { }

  getListNotebookByPaging(queryParams: Paging) {
    return this.dataService.get(ApiConstant.GetNotebookByPaging
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

  createNotebook(reqData: any) {
    return this.dataService.post(ApiConstant.CreateNotebook, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  updateNotebook(id: number, reqData: any) {
    return this.dataService.put(ApiConstant.UpdateNotebookById + id, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  deleteNotebookById(idc:number,id: number) {
    return this.dataService.delete(ApiConstant.DeleteNotebookById,idc + '/' + id.toString())
      .pipe(map((res: any) => {
        return res;
      }));
  }
  deletesListNotebook(Idc: number,typeN:number, reqData: any) {
    return this.dataService.post(ApiConstant.DeleteLstNotebook.concat(Idc.toString()+ '/' + typeN.toString()) , reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  getNotebookById(idc:number ,id: number, typeN: number) {
    return this.dataService.get(ApiConstant.GetNotebookById +idc+ '/' + id + '/' + typeN)
      .pipe(map((res: any) => {
        return res;
      }));
  }
}
