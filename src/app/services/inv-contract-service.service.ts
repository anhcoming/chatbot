import { Injectable } from '@angular/core';
import { DataService } from '../shared/services/data.service';
import { Paging, PagingInvoiceContract,PagingContractService } from '../viewModels/paging';
import { ApiConstant } from '../shared/constants/api.constants';
import { Observable, map } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class InvoiceContractServiceService {
 
  public apiLink='https://localhost:7038/api/cms/InvContract/ContractService/';
  // public apiLink=ApiConstant.InvoiceContractService;

  constructor(private readonly dataService: DataService) { }

  getListInvoiceByPaging(queryParams: PagingContractService) {
    return this.dataService.post(this.apiLink+'GetPage',queryParams)
    .pipe(map((res: any) => {
      return res;
    }));
  }

  createInvoice(reqData: any) {
    return this.dataService.post(this.apiLink+'Create', reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  updateInvoice(reqData: any) {
    return this.dataService.post(this.apiLink+'Update', reqData)
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
