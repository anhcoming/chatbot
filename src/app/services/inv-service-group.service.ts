import { Injectable } from '@angular/core';
import { DataService } from '../shared/services/data.service';
import { Paging, PagingInvoiceService } from '../viewModels/paging';
import { ApiConstant } from '../shared/constants/api.constants';
import { Observable, map } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class InvoiceServiceGroup {
 
  // public apiLink='https://localhost:7038/api/cms/InvService/ServiceGroup/';  
  public apiLink=ApiConstant.InvoiceSericeGroup;

  constructor(private readonly dataService: DataService) { }

  getListInvoiceByPaging(queryParams: PagingInvoiceService) {
    return this.dataService.post(this.apiLink+'GetPage',queryParams)
    .pipe(map((res: any) => {
      return res;
    }));
  }

  createInvoice(reqData: any) {
    return this.dataService.post(this.apiLink+'Save', reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  updateInvoice(reqData: any) {
    return this.dataService.post(this.apiLink+'Save', reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  deleteInvoice(ID: any) {
    return this.dataService.post(this.apiLink+'Delete?id='+ID)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  getInvoiceByID(ID: number) {
    return this.dataService.post(this.apiLink+'Get?id='+ID)
      .pipe(map((res: any) => {
        return res;
      }));
  }
}
