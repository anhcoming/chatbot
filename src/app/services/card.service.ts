import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { ApiConstant } from '../shared/constants/api.constants';
import { DataService } from '../shared/services/data.service';
import { Paging } from '../viewModels/paging';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  constructor(private readonly dataService: DataService) { }

  getListCardByPaging(queryParams: Paging, projectId: number, card_number: string) {
    return this.dataService.get(ApiConstant.GetCardByPaging
      .concat(`?page=`, '' + (queryParams.page || 1))
      .concat(`&page_size=`, '' +  (queryParams.page_size || 15))
      .concat(`&projectId=`, '' +  (projectId || 0))
      .concat(``, (queryParams.query ? '&queryString=' + queryParams.query : ''))
      .concat(``, (card_number ? '&cardNumber=' + card_number : ''))
      .concat(`&select=`, (queryParams.select || ''))
      .concat('&order_by=', (queryParams.order_by || '')))
      .pipe(map((res: any) => {
        return res;
      }));
  }

  createCard(reqData: any) {
    return this.dataService.post(ApiConstant.CreateCard, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }

  updateCardById(id: string, reqData: any) {
    return this.dataService.put(ApiConstant.UpdateCardById + id, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }

  deleteCardById(idc: number, id: string) {
    return this.dataService.delete(ApiConstant.DeleteCardById, id )
      .pipe(map((res: any) => {
        return res;
      }));
  }

  getCardById(idc: number, id: string) {
    return this.dataService.get(ApiConstant.GetCardById + id)
      .pipe(map((res: any) => {
        return res;
      }));
  }
}
