import { Injectable } from '@angular/core';
import { DataService } from '../shared/services/data.service';
import { Paging } from '../viewModels/paging';
import { ApiConstant } from '../shared/constants/api.constants';
import { Observable, map } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class OrganizationService {

    constructor(private readonly dataService: DataService) { }

    createOrganization(request: any) {
        return this.dataService.post(ApiConstant.RestfulOrganization, request)
            .pipe(map((res: any) => {
                return res;
            }));
    }

    getTopicByOrganizationId(request: any){
        const _request = {
            page: request.page || 1,
            page_size: request.page_size || 10,
            OrganizationId: request.organizationId,
            KeyWord: request.search
        }
        return this.dataService.post(ApiConstant.RestfulOrganization + "GetTopicByOrg", _request)
            .pipe(map((res: any) => {
                return res;
            }));
    }

    accountCreatedUpdate(id: number, body: any){
        const url = ApiConstant.RestfulOrganization + "accountCreated/" + id.toString();
        return this.dataService.put(url, body)
           .pipe(map((res: any) => {
                return res;
            }));
    }

    getOrganizationById(id: number) {
        const url = ApiConstant.RestfulOrganization + id.toString();
        return this.dataService.get(url)
           .pipe(map((res: any) => {
                return res;
            }));

    }

    deleteOrganization(id: number) {
        return this.dataService.delete(ApiConstant.RestfulOrganization, id.toString())
           .pipe(map((res: any) => {
                return res;
            }));
    }

    updateOrganization(id: number, organization: any) {
        const url = ApiConstant.RestfulOrganization + id.toString();
        return this.dataService.put(url, organization)
           .pipe(map((res: any) => {
                return res;
            }));
    }

    getOrganizationsByPaging(request: any){
        return this.dataService.post(ApiConstant.RestfulOrganization + "GetList", request)
        .pipe(map((res: any) => {
            return res;
        }));
    }

    lockOrganization(id: number){
        return this.dataService.get(ApiConstant.RestfulOrganization + "Lock/" + id.toString())
        .pipe(map((res: any) => {
            return res;
        }));
    }

    unLockOrganization(id: number){
        return this.dataService.get(ApiConstant.RestfulOrganization + "UnLock/" + id.toString())
        .pipe(map((res: any) => {
            return res;
        }));
    }
    creatNewOrganizationAccount(param: any) {
        return this.dataService.post(ApiConstant.urlCreateOrganization, param)
        .pipe(map((res: any) => {
            return res;
        }));
    }

    updateOrganizationAccount(param: any, id: number) {
        return this.dataService.put(ApiConstant.urlCreateOrganization + '/' + id, param)
        .pipe(map((res: any) => {
            return res;
        }));
    }
}
