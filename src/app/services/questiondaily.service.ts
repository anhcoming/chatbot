import { Injectable } from '@angular/core';
import { DataService } from '../shared/services/data.service';
import { Paging } from '../viewModels/paging';
import { ApiConstant } from '../shared/constants/api.constants';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuestiondailyService {

  constructor(private readonly dataService: DataService) { }
  getListQuestionByPaging(queryParams: Paging) {
    return this.dataService.get(ApiConstant.GetQuestionByPaging
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
  createQuestion(reqData: any) {
    return this.dataService.post(ApiConstant.CreateQuestion, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  updateQuestion(id: number, reqData: any) {
    return this.dataService.put(ApiConstant.UpdateQuestionById + id, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  deleteQuestionById(id: number) {
    return this.dataService.delete(ApiConstant.DeleteQuestionById, id.toString())
      .pipe(map((res: any) => {
        return res;
      }));
  }
  deletesListQuestion(Idc: number, reqData: any) {
    return this.dataService.post(ApiConstant.DeleteLstQuestion.concat(Idc.toString()) , reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  getQuestionById(id: number) {
    return this.dataService.get(ApiConstant.GetQuestionById + id)
      .pipe(map((res: any) => {
        return res;
      }));
  }
}
