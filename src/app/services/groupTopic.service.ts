import { Injectable } from '@angular/core';
import { DataService } from '../shared/services/data.service';
import { Paging } from '../viewModels/paging';
import { ApiConstant } from '../shared/constants/api.constants';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupTopicService {
  constructor(private readonly dataService: DataService) { }

  getListGroupTopicByPaging(queryParams: any) {
    const paging = {
      page: queryParams.page || 1,
      page_size: queryParams.page_size || 10,
      KeyWord: queryParams.search
  }
    return this.dataService.post(ApiConstant.RestfulGroupTopic + "GetList", paging)
      .pipe(map((res: any) => {
        return res;
      }));
  }

  getDropdown(){
    return this.dataService.get(ApiConstant.RestfulGroupTopic + "Dropdown")
    .pipe(map((res: any) => {
      return res;
    }));
  }

  createGroupTopic(reqData: any) {
    return this.dataService.post(ApiConstant.RestfulGroupAddTopic, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }

  getTopicByOrganizationId(){
    return this.dataService.get(ApiConstant.RestfulGroupTopic + "GetTopicOfOrg")
     .pipe(map((res: any) => {
        return res;
      }));
  }

  updateGroupTopic(id: number, reqData: any) {
    return this.dataService.put(ApiConstant.RestfulGroupTopic + id, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  deleteGroupTopicById(id: number ) {
    return this.dataService.delete(ApiConstant.RestfulGroupTopic, id.toString())
      .pipe(map((res: any) => {
        return res;
      }));
  }

  getGroupTopicById(id: number) {
    return this.dataService.get(ApiConstant.RestfulGroupTopic + id)
      .pipe(map((res: any) => {
        return res;
      }));
  }

}
