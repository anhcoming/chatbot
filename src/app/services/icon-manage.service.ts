import { Injectable } from '@angular/core';
import { DataService } from '../shared/services/data.service';
import { ApiConstant } from '../shared/constants/api.constants';
import { map } from 'rxjs';
import { Paging } from '../viewModels/paging';

@Injectable({
    providedIn: 'root'
})

export class IconManageService {
    constructor(private readonly dataService: DataService) { }

    getListIcon(param: any) {
        return this.dataService.post(ApiConstant.getListIcon, param)
            .pipe(map((res: any) => {
                return res;
            }));
    }

    getIconById(id: any) {
        return this.dataService.get(ApiConstant.getDetailIcon + id)
            .pipe(map((res: any) => {
                return res;
            }));
    }

    createNewIcon(param: any) {
        return this.dataService.post(ApiConstant.createNewIcon, param)
        .pipe(map((res: any) => {
            return res;
        }));
    }

    updateIcon(param: any, id: any) {
        return this.dataService.put(ApiConstant.getDetailIcon + id, param)
        .pipe(map((res: any) => {
            return res;
        }));
    }

    removeIcon(id: string) {
        return this.dataService.delete(ApiConstant.getDetailIcon, id)
        .pipe(map((res: any) => {
            return res;
        }));
    }
}

