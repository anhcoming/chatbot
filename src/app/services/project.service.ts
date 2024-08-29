import { Injectable } from '@angular/core';
import { DataService } from '../shared/services/data.service';
import { Paging } from '../viewModels/paging';
import { ApiConstant } from '../shared/constants/api.constants';
import { map } from 'rxjs';
import { animate } from '@angular/animations';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private readonly dataService: DataService) { }

  getListByPaging(queryParams: Paging) {
    return this.dataService.get(ApiConstant.GetProjectByPaging
      .concat(`?page=`, '' + (queryParams.page || 1))
      .concat(`&page_size=`, '' +  (queryParams.page_size || 15))
      .concat(`&query=`, (queryParams.query || '1=1'))
      .concat(`&select=`, (queryParams.select || ''))
      .concat('&order_by=', (queryParams.order_by || '')))
      .pipe(map((res: any) => {
        return res;
      }));
  }

  createProject(reqData: any) {
    return this.dataService.post(ApiConstant.CreateProject, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  updateProjectById(id: number, reqData: any) {
    return this.dataService.put(ApiConstant.UpdateProjectById + id, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  deleteProjectById(idc: number, id: number) {
    return this.dataService.delete(ApiConstant.DeleteProjectById.concat(idc.toString(), '/'), id.toString())
      .pipe(map((res: any) => {
        return res;
      }));
  }
  deletesProject(idc: number, reqData: any) {
    return this.dataService.post(ApiConstant.DeletesProject.concat(idc.toString()), reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  getProjectById(idc: number, id: number) {
    return this.dataService.get(ApiConstant.GetProjectById.concat(idc.toString(), '/')+ id.toString())
    .pipe(map((res: any) => {
      return res;
    }));
  }
  ExportExcel(idc: number) {
    return this.dataService.get(ApiConstant.ExportExcelProject + idc.toString())
    .pipe(map((res: any) => {
      return res;
    }));
  }
  
}
