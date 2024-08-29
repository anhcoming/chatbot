import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { ApiConstant } from '../shared/constants/api.constants';
import { DataService } from '../shared/services/data.service';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  constructor(private readonly dataService: DataService) { }

  createCountrie(reqData: any) {
    return this.dataService.post(ApiConstant.CreateCountry, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  updateCountrieById(id: number, reqData: any) {
    return this.dataService.put(ApiConstant.ApiCountryById + id, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  deleteCountrieById(id: number) {
    return this.dataService.delete(ApiConstant.DeleteCountryById, id.toString() )
      .pipe(map((res: any) => {
        return res;
      }));
  }
  getCountrieById(id: number) {
    return this.dataService.get(ApiConstant.ApiCountryById + id)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  deletesListCountries(Idc: number, reqData: any) {
    return this.dataService.post(ApiConstant.DeleteListCountries.concat(Idc.toString()) , reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }
}
