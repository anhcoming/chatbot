import { Injectable } from '@angular/core';
import { ApiConstant } from '../shared/constants/api.constants';
import { DataService } from '../shared/services/data.service';
import { map } from 'rxjs';
import { Paging } from '../viewModels/paging';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  constructor(private readonly dataService: DataService) { }
  getListDocumentByPaging(queryParams: Paging) {
    return this.dataService.get(ApiConstant.GetDocumentByPaging
      .concat(`?page=`, '' + (queryParams.page || 1))
      .concat(`&page_size=`, '' +  (queryParams.page_size || 15))
      .concat(`&query=`, (queryParams.query || '1=1'))
      .concat(`&select=`, (queryParams.select || ''))
      .concat('&order_by=', (queryParams.order_by || '')))
      .pipe(map((res: any) => {
        return res;
      }));
  }
  createDocument(reqData: any) {
    return this.dataService.post(ApiConstant.CreateDocument, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  updateDocument(id: number, reqData: any) {
    return this.dataService.put(ApiConstant.UpdateDocumentById + id, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  deleteDocumentById(id: number ) {
    return this.dataService.delete(ApiConstant.DeleteDocumentById, id.toString())
      .pipe(map((res: any) => {
        return res;
      }));
  }
  getDocumentById(id: number) {
    return this.dataService.get(ApiConstant.GetDocumentById + id)
      .pipe(map((res: any) => {
        return res;
      }));
  }

}

