import { Injectable } from '@angular/core';
import { StorageData, StorageOption } from '../constants/app.constants';
import { DataService } from './data.service';
import { StorageService } from './storage.service';
import { ApiConstant } from '../constants/api.constants';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  
    constructor(private _dataService: DataService, private _storageService: StorageService){}

    getUserSesions(){
        var userId = this._storageService.get(StorageData.userId);
        var url = ApiConstant.GetSessionList + userId;
        return this._dataService.get(url).pipe(
            map((res: any) => {
                return res;
            })
        ); 
    };

    getChatSessionDetail(id: number){
        var url = ApiConstant.GetChatSession + id;
        return this._dataService.get(url).pipe(
            map((res: any) => {
                return res;
            })
        );
    };

    CreateChatSession(request: any){
        var url = ApiConstant.CreateChatSession;
        return this._dataService.post(url, request).pipe(
            map((res: any) => {
                return res;
            })
        );
    };

    CreateQuestion(request: any){
        var url = ApiConstant.CreateQuestionChatBot;
        return this._dataService.post(url, request).pipe(
            map((res: any) => {
                return res;
            })
        );
    };

    UpdateQuestion(id: number,request: any){
        var url = ApiConstant.UpdateQuestionChatBot + id;
        return this._dataService.put(url, request).pipe(
            map((res: any) => {
                return res;
            })
        );
    }

}
