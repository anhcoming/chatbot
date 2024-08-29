import { Injectable } from '@angular/core';
import { DataService } from '../shared/services/data.service';
import { Paging } from '../viewModels/paging';
import { ApiConstant } from '../shared/constants/api.constants';
import { Observable, map } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class NotebookCategoryService {
  constructor(private readonly dataService: DataService) { }
  getListNotebookCategoryByPaging(queryParams: Paging) {
    return this.dataService.get(ApiConstant.GetNotebookCategoryByPaging
      .concat(`?page=`, '' + (queryParams.page || 1))
      .concat(`&page_size=`, '' + (queryParams.page_size || 15))
      .concat(`&query=`, (queryParams.query || '1=1'))
      .concat(`&select=`, (queryParams.select || ''))
      .concat('&order_by=', (queryParams.order_by || '')))
      .pipe(map((res: any) => {
        return res;
      }));
  }
  createNotebookCategory(reqData: any) {
    return this.dataService.post(ApiConstant.CreateNotebookCategory, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  updateNotebookCategory(id: number, reqData: any) {
    return this.dataService.put(ApiConstant.UpdateNotebookCategoryById + id, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  deleteNotebookCategoryById(id: number) {
    return this.dataService.delete(ApiConstant.DeleteNotebookCategoryById, id.toString())
      .pipe(map((res: any) => {
        return res;
      }));
  }
  deletesListCate(Idc: number, reqData: any) {
    return this.dataService.put(ApiConstant.DeleteListNotebookCategory.concat(Idc.toString()) , reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  getNotebookCategoryById(id: number) {
    return this.dataService.get(ApiConstant.GetNotebookCategoryById + id)
      .pipe(map((res: any) => {
        return res;
      }));
  }
}