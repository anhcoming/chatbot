import { Injectable } from '@angular/core';
import { DataService } from '../shared/services/data.service';
import { ApiConstant } from '../shared/constants/api.constants';
import { map } from 'rxjs';
import { Paging } from '../viewModels/paging';

@Injectable({
    providedIn: 'root'
})
export class ModelsService {

    constructor(private readonly dataService: DataService) { }

    getListModelsByPaging(request: any) {
        const paging = {
            page: request.page || 1,
            page_size: request.page_size || 10,
            KeyWord: request.search
        }
        return this.dataService.post(ApiConstant.RestfulModels + "GetList", paging)
            .pipe(map((res: any) => {
                return res;
            }));
    }

    getDropdown(){
        return this.dataService.get(ApiConstant.RestfulModels + "Dropdown")
            .pipe(map((res: any) => {
                return res;
            }));
    }

    getModelById(id: number) {
        return this.dataService.get(ApiConstant.RestfulModels + id)
            .pipe(map((res: any) => {
                return res;
            }));
    }

    createModel(request: any) {
        return this.dataService.post(ApiConstant.RestfulModels, request)
        .pipe(map((res: any) => {
            return res;
        }));
    }

    updateModel(id: number, request: any) {
        return this.dataService.put(ApiConstant.RestfulModels + id, request)
        .pipe(map((res: any) => {
            return res;
        }));
    }

    deleteModel(id: number){
        return this.dataService.delete(ApiConstant.RestfulModels, id.toString())
        .pipe(map((res: any) => {
            return res;
        }));
    }

}
