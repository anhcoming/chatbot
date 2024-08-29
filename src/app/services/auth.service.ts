import { Injectable } from '@angular/core';
import { StorageService } from '../shared/services/storage.service';
import { ReqLoginModel } from '../view-models/auth/req-login-model';
import { DataService } from '../shared/services/data.service';
import { ApiConstant } from '../shared/constants/api.constants';
import { map } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { StorageData } from '../shared/constants/app.constants';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private urlState = new BehaviorSubject<any>({});
  public redirectUrl = this.urlState.asObservable();

  constructor(
    private readonly dataService: DataService,
    private readonly storeService: StorageService,
    private readonly cookieService: CookieService
    ) { }

    login (reqData: ReqLoginModel) {
      return this.dataService.post(ApiConstant.Login, {...reqData})
      .pipe(map((res: any) => {

        return res;
      }));
    }

    logout() {
      this.clearStoreData();
    }

    setStoreData(dataUser: any) {

      this.cookieService.set(StorageData.accessToken, dataUser.accessToken);
      this.storeService.set(StorageData.userId, dataUser.id);
      this.storeService.set(StorageData.phone, dataUser.phone || '');
      this.storeService.set(StorageData.avatar, dataUser.avata || '');
      this.storeService.set(StorageData.email, dataUser.email || '');
      this.storeService.set(StorageData.unitName, dataUser.unitName || '');
      this.storeService.set(StorageData.fullName, dataUser.fullName || '');
      this.storeService.set(StorageData.departmentId, dataUser.departmentId || 0);
      this.storeService.set(StorageData.companyId, dataUser.companyId || 0);
      this.storeService.set(StorageData.listMenus, JSON.stringify(dataUser.listMenus) || '');
      let menuList = [
        {
          "MenuId": 6,
          "Code": "CATEGORY",
          "Name": "Quản lí dữ liệu",
          "MenuParent": 0,
          "Url": "/#",
          "Icon": "pi pi-fw pi-globe",
          "ActiveKey": "111111111",
          "Status": null,
          "IsSpecialFunc": null,
          "SubSystem": 0,
          "listMenus": [
            {
              "MenuId": 6,
              "Code": "CATEGORY",
              "Name": "Biểu đồ thống kê",
              "MenuParent": 0,
              "Url": "/",
              "Icon": "pi pi-fw pi-globe",
              "ActiveKey": "111111111",
              "Status": null,
              "IsSpecialFunc": null,
              "SubSystem": 0,
              "listMenus": [],
              "redirect": false
            },
            {
              "MenuId": 6,
              "Code": "CATEGORY",
              "Name": "Thu thập dữ liệu",
              "MenuParent": 0,
              "Url": "demo/uploadData",
              "Icon": "pi pi-fw pi-globe",
              "ActiveKey": "111111111",
              "Status": null,
              "IsSpecialFunc": null,
              "SubSystem": 0,
              "listMenus": [],
              "redirect": false
            },
            {
              "MenuId": 6,
              "Code": "CATEGORY",
              "Name": "Chuyển đổi định dạng",
              "MenuParent": 0,
              "Url": "demo/chuyendoidinhdang",
              "Icon": "pi pi-fw pi-globe",
              "ActiveKey": "111111111",
              "Status": null,
              "IsSpecialFunc": null,
              "SubSystem": 0,
              "listMenus": [],
              "redirect": false
            },
            {
              "MenuId": 6,
              "Code": "CATEGORY",
              "Name": "Tìm kiếm dữ liệu",
              "MenuParent": 0,
              "Url": "demo/elasticsearch",
              "Icon": "pi pi-fw pi-globe",
              "ActiveKey": "111111111",
              "Status": null,
              "IsSpecialFunc": null,
              "SubSystem": 0,
              "listMenus": [],
              "redirect": false

            },
            {
              "MenuId": 6,
              "Code": "CATEGORY",
              "Name": "Hỏi đáp chuyên ngành",
              "MenuParent": 0,
              "Url": "demo/hoidapchuyennganh",
              "Icon": "pi pi-fw pi-globe",
              "ActiveKey": "111111111",
              "Status": null,
              "IsSpecialFunc": null,
              "SubSystem": 0,
              "listMenus": [],
              "redirect": false

            },
            {
              "MenuId": 6,
              "Code": "CATEGORY",
              "Name": "OpenMetadata",
              "MenuParent": 0,
              "Url": "demo/open-metadata",
              "Icon": "pi pi-fw pi-globe",
              "ActiveKey": "111111111",
              "Status": null,
              "IsSpecialFunc": null,
              "SubSystem": 0,
              "listMenus": [],
              "redirect": false

            },
            {
              "MenuId": 6,
              "Code": "CATEGORY",
              "Name": "Minio",
              "MenuParent": 0,
              "Url": "http://210.86.230.107:9001",
              "Icon": "pi pi-fw pi-globe",
              "ActiveKey": "111111111",
              "Status": null,
              "IsSpecialFunc": null,
              "SubSystem": 0,
              "listMenus": [],
              "redirect": true
            },
            {
              "MenuId": 6,
              "Code": "CATEGORY",
              "Name": "Milvus",
              "MenuParent": 0,
              "Url": "http://210.86.230.107:8000",
              "Icon": "pi pi-fw pi-globe",
              "ActiveKey": "111111111",
              "Status": null,
              "IsSpecialFunc": null,
              "SubSystem": 0,
              "listMenus": [],
              "redirect": true

            },
            {
              "MenuId": 6,
              "Code": "CATEGORY",
              "Name": "Dremio",
              "MenuParent": 0,
              "Url": "http://210.86.230.107:9047",
              "Icon": "pi pi-fw pi-globe",
              "ActiveKey": "111111111",
              "Status": null,
              "IsSpecialFunc": null,
              "SubSystem": 0,
              "listMenus": [],
              "redirect": true

            },
          ]
        },
        {
          "MenuId": 7,
          "Code": "CATEGORY",
          "Name": "Quản lí hệ thống",
          "MenuParent": 0,
          "Url": "/#  ",
          "Icon": "pi pi-fw pi-globe",
          "ActiveKey": "111111111",
          "Status": null,
          "IsSpecialFunc": null,
          "SubSystem": 0,
          "listMenus": [
            {
              "MenuId": 6,
              "Code": "CATEGORY",
              "Name": "Người dùng hệ thống",
              "MenuParent": 0,
              "Url": "/system/user-role/list",
              "Icon": "pi pi-fw pi-globe",
              "ActiveKey": "111111111",
              "Status": null,
              "IsSpecialFunc": null,
              "SubSystem": 0,
              "listMenus": [],
              "redirect": false
            },
            {
              "MenuId": 6,
              "Code": "CATEGORY",
              "Name": "Chức năng",
              "MenuParent": 0,
              "Url": "/system/function/list",
              "Icon": "pi pi-fw pi-globe",
              "ActiveKey": "111111111",
              "Status": null,
              "IsSpecialFunc": null,
              "SubSystem": 0,
              "listMenus": [],
              "redirect": false
            },
            {
              "MenuId": 6,
              "Code": "CATEGORY",
              "Name": "Nhóm quyền người dùng",
              "MenuParent": 0,
              "Url": "/system/function-role/list",
              "Icon": "pi pi-fw pi-globe",
              "ActiveKey": "111111111",
              "Status": null,
              "IsSpecialFunc": null,
              "SubSystem": 0,
              "listMenus": [],
              "redirect": false
            }
          ]
        }
        
      ]
      // this.storeService.set(StorageData.listMenus, JSON.stringify(menuList) || '');

    }

    // {
    //   "MenuId": 6,
    //   "Code": "CATEGORY",
    //   "Name": "Xử lý text",
    //   "MenuParent": 0,
    //   "Url": "demo/xulytext",
    //   "Icon": "pi pi-fw pi-globe",
    //   "ActiveKey": "111111111",
    //   "Status": null,
    //   "IsSpecialFunc": null,
    //   "SubSystem": 0,
    //   "listMenus": []
    // },
    // {
    //   "MenuId": 6,
    //   "Code": "CATEGORY",
    //   "Name": "Xử lý PDF",
    //   "MenuParent": 0,
    //   "Url": "demo/xulypdf",
    //   "Icon": "pi pi-fw pi-globe",
    //   "ActiveKey": "111111111",
    //   "Status": null,
    //   "IsSpecialFunc": null,
    //   "SubSystem": 0,
    //   "listMenus": []
    // },

    clearStoreData() {
      this.cookieService.deleteAll();
      this.storeService.clear();
    }

    getAccessToken() {
      return this.cookieService.get(StorageData.accessToken);
    }

    setUrlRedirect (url: string) {
      this.urlState.next(url);
    }
  
    getUrlRedirect () : string {
      let resUrl = '';
  
      this.redirectUrl.subscribe((res) => { resUrl = res });
  
      return resUrl;
    }

    getUrlUserInfo(id: number) {
      return this.dataService.get(ApiConstant.AccountInfo + id)
      .pipe(map((res: any) => {
        return res;
      }));
    }

    changePassword(reqData: any){
      var userId = this.storeService.get(StorageData.userId);
      var url = ApiConstant.ChangeUserPassword + userId;
      return this.dataService.put(url, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
    }

    changeUserInfo(id: number, param: any) {
      return this.dataService.put(ApiConstant.changInfoUserv2 + id, param)
      .pipe(map((res: any) => {
        return res;
      }));
    }
}
