import { Injectable } from '@angular/core';
import { DataService } from '../shared/services/data.service';
import { Paging } from '../viewModels/paging';
import { ApiConstant } from '../shared/constants/api.constants';
import { Observable, map } from 'rxjs';
import { StorageService } from '../shared/services/storage.service';
import { StorageData } from '../shared/constants/app.constants';


@Injectable({
    providedIn: 'root'
})
export class ChatSessionService {

    constructor(private dataService: DataService, private _storageService: StorageService) { }

    getListAddressByPaging(queryParams: Paging) {
        return this.dataService.get(ApiConstant.GetZoneByPaging
            .concat(`?page=`, '' + (queryParams.page || 1))
            .concat(`&page_size=`, '' + (queryParams.page_size || 15))
            .concat(`&query=`, (queryParams.query || '1=1'))
            .concat(`&select=`, (queryParams.select || ''))
            .concat('&order_by=', (queryParams.order_by || '')))
            .pipe(map((res: any) => {
                return res;
            }));
    }

    createAddress(reqData: any) {
        return this.dataService.post(ApiConstant.CreateZone, reqData)
            .pipe(map((res: any) => {
                return res;
            }));
    }
    updateChatSession(id: number, reqData: any) {
        var url = ApiConstant.RestfulChatSession + id.toString();
        return this.dataService.put(url, reqData)
            .pipe(map((res: any) => {
                return res;
            }));
    }

    storageChatSession(id: number, reqData: any) {
        var url = ApiConstant.RestfulChatSession + "storage/" + id.toString();
        return this.dataService.put(url, reqData)
            .pipe(map((res: any) => {
                return res;
            }));
    }

    getChatStorages(){
        var userId = this._storageService.get(StorageData.userId);
        var url = ApiConstant.RestfulChatSession + "storages/" + userId;
        return this.dataService.get(url).pipe(
            map((res: any) => {
                return res;
            })
        );
    }

    deleteChatSession(id: number) {
        return this.dataService.delete(ApiConstant.RestfulChatSession, id.toString())
            .pipe(map((res: any) => {
                return res;
            }));
    }

    getMessages(id: number) {
        var url = ApiConstant.RestfulChatSession + id.toString();
        return this.dataService.get(url).pipe(
            map((res: any) => {
                return res;
            })
        );
    }

    exportDocx(id: number) {
        var url = ApiConstant.RestfulChatSession + "export_docx/" + id;
        return this.dataService.get_download(url).pipe(
            map((res: any) => {
                return res;
            })
        );
    }

    getHistory() {
        var userId = this._storageService.get(StorageData.userId);
        var url = ApiConstant.RestfulChatSession + "histories/" + userId;
        return this.dataService.get(url).pipe(
            map((res: any) => {
                return res;
            })
        );
    }
}
