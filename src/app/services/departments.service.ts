import { Injectable } from '@angular/core';
import { DataService } from '../shared/services/data.service';
import { Paging } from '../viewModels/paging';
import { ApiConstant } from '../shared/constants/api.constants';
import { map } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DepartmentsServices {

    constructor(private readonly dataService: DataService) { }

    getDropDown() {
        return this.dataService.get(ApiConstant.RestfulDepartment + "Dropdown")
            .pipe(map((res: any) => {
                return res;
            }));
    }

    getDepartmentById(id: number) {
        return this.dataService.get(ApiConstant.RestfulDepartment + id)
            .pipe(map((res: any) => {
                return res;
            }));
    }

    getListDepartment(request: any) {
        const paging = {
            page: request.page || 1,
            page_size: request.page_size || 10,
            KeyWord: request.search
        }
        return this.dataService.post(ApiConstant.RestfulDepartment + "GetList", paging)
            .pipe(map((res: any) => {
                return res;
            }));
    }

    createDepartment(request: any) {
        return this.dataService.post(ApiConstant.RestfulDepartment, request)
            .pipe(map((res: any) => {
                return res;
            }));
    }

    updateDepartment(id: number, request: any) {
        return this.dataService.put(ApiConstant.RestfulDepartment + id, request)
            .pipe(map((res: any) => {
                return res;
            }));
    }

    deleteDepartment(id: number) {
        return this.dataService.delete(ApiConstant.RestfulDepartment, id.toString())
            .pipe(map((res: any) => {
                return res;
            }));
    }
}