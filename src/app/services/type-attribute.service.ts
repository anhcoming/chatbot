import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { ApiConstant } from '../shared/constants/api.constants';
import { DataService } from '../shared/services/data.service';

@Injectable({
  providedIn: 'root'
})
export class TypeAttributeService {

  constructor(private readonly dataService: DataService) { }

  createTypeAttribute(reqData: any) {
    return this.dataService.post(ApiConstant.CreateTypeAttribute, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  updateTypeAttributeById(id: number, reqData: any) {
    return this.dataService.put(ApiConstant.ApiTypeAttributeById + id, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  deleteTowerById(id: number) {
    return this.dataService.delete(ApiConstant.DeleteTowerById, id.toString() )
      .pipe(map((res: any) => {
        return res;
      }));
  }
  getTypeAttributeById(id: number) {
    return this.dataService.get(ApiConstant.ApiTypeAttributeById + id)
      .pipe(map((res: any) => {
        return res;
      }));
  }
}