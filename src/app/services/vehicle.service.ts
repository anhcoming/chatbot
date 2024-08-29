import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { ApiConstant } from '../shared/constants/api.constants';
import { DataService } from '../shared/services/data.service';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  constructor(private readonly dataService: DataService) { }

  createVehicle(reqData: any) {
    return this.dataService.post(ApiConstant.CreateVehicle, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }

  updateVehicleById(id: number, reqData: any) {
    return this.dataService.put(ApiConstant.UpdateVehicleById + id, reqData)
      .pipe(map((res: any) => {
        return res;
      }));
  }

  deleteVehicleById(idc: number, id: number) {
    return this.dataService.delete(ApiConstant.DeleteVehicleById.concat(idc.toString(), '/'), id.toString())
      .pipe(map((res: any) => {
        return res;
      }));
  }

  getVehicleById(id: number) {
    return this.dataService.get(ApiConstant.GetVehicleById + id)
      .pipe(map((res: any) => {
        return res;
      }));
  }

  getVehicleActive() {
    return this.dataService.get(ApiConstant.GetVehicleActive)
      .pipe(map((res: any) => {
        return res;
      }));
  }
}
