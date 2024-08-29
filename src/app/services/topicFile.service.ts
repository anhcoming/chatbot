import { Injectable } from '@angular/core';
import { DataService } from '../shared/services/data.service';
import { Paging } from '../viewModels/paging';
import { ApiConstant } from '../shared/constants/api.constants';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TopicFileService {

  constructor(private readonly dataService: DataService) { }

  getTopicFiles(id: number){
    return this.dataService.get(ApiConstant.RestfulTopicFile + id)
     .pipe(map((res: any) => {
        return res;
      }));
  }

  deleteTopicFile(request: any){
    return this.dataService.post(ApiConstant.RestfulTopicFile + "removeEmdding", request)
     .pipe(map((res: any) => {
        return res;
      }));
  }

  embeddingFiles(request: any){
    return this.dataService.post(ApiConstant.RestfulTopicFile + "embedding", request)
     .pipe(map((res: any) => {
        return res;
      }));
  }

  uploadFiles(request: any){
    return this.dataService.post(ApiConstant.UploadTopicFiles, request)
     .pipe(map((res: any) => {
        return res;
      }));
  }
}