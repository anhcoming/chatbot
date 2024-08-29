import { Injectable } from '@angular/core';
import { DataService } from '../shared/services/data.service';
import { ApiConstant } from '../shared/constants/api.constants';
import { map } from 'rxjs';
import { StorageData } from '../shared/constants/app.constants';
import { StorageService } from '../shared/services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private readonly dataService: DataService,
    private _storageService: StorageService,
  ) { }
  changePassword(idc: number,  reqData: any) {
    return this.dataService.put(ApiConstant.ChangePassword.concat(idc.toString() + '/') , reqData )
      .pipe(map((res: any) => {
        return res
    }))
  }
  newPassword(id: number, reqData: any) {
    return this.dataService.put(ApiConstant.newPassword + id.toString(), reqData)
    .pipe(map((res: any) => {
      return res;
    }))
   }
   getUserById(idc: number, id: number) {
    // return this.dataService.get(ApiConstant.getUserId.concat(idc.toString() ,'/', id.toString()))
    //   .pipe(map((res: any) => {
    //     return res;
    //   }));
  }
  changeInfoUser(reqData : any){
    return this.dataService.put(ApiConstant.changInfoUser,reqData)
    .pipe(map((res:any)  => {
      return res;
    }))
  }

  updateUserInfo(reqData: any){
    var userId = this._storageService.get(StorageData.userId);
    reqData.Id = parseInt(userId);
    var url = ApiConstant.updateUserInfo + userId.toString();
    return this.dataService.put(url, reqData)
    .pipe(map((res:any)  => {
      return res;
    }))
  }

  getUserInfo(){
    var userId = this._storageService.get(StorageData.userId);
    var url = ApiConstant.GetUserInfo + userId.toString();
    return this.dataService.get(url)
    .pipe(map((res:any)  => {
      return res;
    }))
  }
}
