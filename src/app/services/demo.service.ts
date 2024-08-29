import { Injectable } from '@angular/core';
import { ApiConstant } from '../shared/constants/api.constants';
import { map } from 'rxjs';
import { Paging } from '../viewModels/paging';
import { DataService } from '../shared/services/data.service';
@Injectable({
  providedIn: 'root'
})
export class DemoService {

  constructor(
    private readonly dataService: DataService
    ) { }

  uploadFile(reqData: FormData) {
    return this.dataService.post(ApiConstant.RestfulDemo + "elastic/_upload", reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }

  ask(reqData: any){
    return this.dataService.post(ApiConstant.RestfulDemo + "Gpt_1.0/ask", reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }

  elasticSearch(reqData: any){
    return this.dataService.post(ApiConstant.RestfulDemo + "elastic/_search", reqData)
    .pipe(map((res: any) => {
      return res;
    }));
  }

  downloadSourceFile(reqData: any){
    return this.dataService.download(ApiConstant.RestfulDemo + "elastic/_download", reqData)
    .pipe(map((res: any) => {
      return res;
    }));
  }
}
