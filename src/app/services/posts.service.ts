import { Injectable } from '@angular/core';
import { DataService } from '../shared/services/data.service';
import { ApiConstant } from '../shared/constants/api.constants';
import { Paging } from '../viewModels/paging';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
    constructor(private readonly dataService: DataService) { }
    getListPostsByPaging(queryParams: Paging) {
      return this.dataService.get(ApiConstant.GetPostsByPaging
        .concat(`?page=`, '' + (queryParams.page || 1))
        .concat(`&page_size=`, '' +  (queryParams.page_size || 15))
        .concat(`&query=`, (queryParams.query || '1=1'))
        .concat(`&ProjectId=`, (queryParams.ProjectId || '-1'))
        .concat(`&TowerId=`, (queryParams.TowerId || '-1'))
        .concat(`&ZoneId=`, (queryParams.ZoneId || '-1'))
        .concat(`&ApartmentId=`, (queryParams.ZoneId || '-1'))
        .concat(`&dateStart=`,(queryParams.dateStart || ''))
        .concat(`&dateEnd=`,(queryParams.dateEnd || ''))
        .concat(`&select=`, (queryParams.select || ''))
        .concat(`&type=`,'' + (queryParams.type || -1))
        .concat(`&status=`,'' + (queryParams.type || -1))
        .concat('&order_by=', (queryParams.order_by || '')))
        .pipe(map((res: any) => {
          return res;
        }));
    }
    createPosts(reqData: any) {
      return this.dataService.post(ApiConstant.CreatePosts, reqData)
        .pipe(map((res: any) => {
          return res;
        }));
    }
    updatePosts(id: number, reqData: any) {
      return this.dataService.put(ApiConstant.UpdatePostsById + id, reqData)
        .pipe(map((res: any) => {
          return res;
        }));
    }
    deletePostsById(idc:number,id: number) {
      return this.dataService.delete(ApiConstant.DeletePostsById, idc + '/' + id.toString())
        .pipe(map((res: any) => {
          return res;
        }));
    }
    deletesListPosts(Idc: number,typeN:number, reqData: any) {
      return this.dataService.post(ApiConstant.DeleteLstPosts.concat(Idc.toString()+ '/' + typeN.toString()) , reqData)
        .pipe(map((res: any) => {
          return res;
        }));
    }
    getPostsById(idc:number ,id: number, typeN: number) {
      return this.dataService.get(ApiConstant.GetPostsById + idc+ '/' + id + '/' + typeN)
        .pipe(map((res: any) => {
          return res;
        }));
    }
}
