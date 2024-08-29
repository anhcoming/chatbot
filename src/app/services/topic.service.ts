import { Injectable } from '@angular/core';
import { DataService } from '../shared/services/data.service';
import { Paging } from '../viewModels/paging';
import { ApiConstant } from '../shared/constants/api.constants';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TopicService {

  constructor(private readonly dataService: DataService) { }

  getTopicByPaing(request: any){
    return this.dataService.post(ApiConstant.GetTopicByPaging, request)
     .pipe(map((res: any) => {
        return res;
      }));
  }

  getTopicById(id: number){
    const url = ApiConstant.RestfulTopicById + id.toString();
    return this.dataService.get(url)
     .pipe(map((res: any) => {
        return res;
      }));
  }

  createNewTopic(request: any){
    return this.dataService.post(ApiConstant.CreateNewTopic, request)
     .pipe(map((res: any) => {
        return res;
      }));
  }

  updateTopic(id: number ,request: any){
    const url = ApiConstant.RestfulTopicById + id;
    return this.dataService.put(url, request)
     .pipe(map((res: any) => {
        return res;
      }));
  }

  deleteTopic(id: number){
    return this.dataService.delete(ApiConstant.RestfulTopicById, id.toString())
     .pipe(map((res: any) => {
        return res;
      }));
  }
}