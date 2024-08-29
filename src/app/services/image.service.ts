import { Injectable } from '@angular/core';
import { ApiConstant } from '../shared/constants/api.constants';
import { DataService } from '../shared/services/data.service';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private readonly dataService: DataService) { }
  uploadImage(reqData: any) {
    return this.dataService.post(ApiConstant.CreateImage, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
}
