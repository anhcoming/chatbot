import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { VehicleService } from 'src/app/services/vehicle.service';
import { Paging } from 'src/app/viewModels/paging';
import  ObjectId from 'bson-objectid';
import { CardRequestService } from 'src/app/services/card-request.service';
import { ResApi } from 'src/app/viewModels/res-api';
import { CardManagersService } from 'src/app/services/card-managers.service';
import { AppStatusCode } from 'src/app/shared/constants/app.constants';

@Component({
  selector: 'app-car-card',
  templateUrl: './car-card.component.html',
  styleUrls: ['./car-card.component.scss']
})
export class CarCardComponent {
  fCarCard: any;
  public filterParrams: Paging;
  public filterActive: Paging;
  public uploadedImageUrl : string = '';
  id : any;
  carId: any;
  public lstCardVehicle : any;
  public lstCardActive : any;
  public loading = [false];
  isImageSelected : boolean = false;
  public lstVehicle : any;
  public lstCardManager : any;
  public CarCard : any;
  public towerId : any;
  public apartmentId : any;
  public lstResidentCards : any;
  isLoading : boolean = false;
  isCard : boolean = false;
  
  constructor(
    private readonly cardmanagerService : CardManagersService,
    private readonly fb : FormBuilder,
    private config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private http : HttpClient,
  ){
    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 1000;
    this.filterParrams.groupCard = 2;
    this.filterParrams.vehicleId = 2;
    this.filterActive = new Object as Paging;
    this.filterActive.page = 1;
    this.filterActive.page_size = 1000;
    this.filterActive.groupCard = 2;
    this.filterActive.vehicleId = 2;
    this.fCarCard = this.fb.group({
      VehicleOwner : [null, Validators.required],
      ResidentId : [null],
      ResidentCardIntegratedId : [null],
      ResidentObjectId : [null, Validators.required],
      CardId : [null],
      VehicleId : [null, Validators.required],
      VehiclePlate: [null, Validators.required],
      VehicleName: [null],
      VehicleColor: [null],
      VehicleDescription: [null],
      Image: [null]
    })
    this.lstResidentCards = this.config.data.lstResidentCards;
    this.lstCardManager = this.config.data.lstCardManager;
    this.lstVehicle = this.config.data.lstVehicle;
    this.isLoading = this.config.data.isLoading;
    this.towerId = this.config.data.towerId;
    this.apartmentId = this.config.data.apartmentId;
    this.CarCard = this.config.data.CarCard;
    this.isCard = this.config.data.isCard;
    this.carId = this.config.data.CarId;
    this.id = this.config.data.Id;
  } 
  ngOnInit() {
    if(this.CarCard) 
      this.setFormGroup()
    this.getCardManager()
    this.GetCardActiveByPage()
  }
  Imagenull(){}
  onBack(){this.ref.close()}
  markAllAsDirty() {
    Object.keys(this.fCarCard.controls).forEach(key => {
      const control = this.fCarCard.get(key);
      if (control.enabled && control.invalid) {
        control.markAsDirty();
      }
    });
  }
  onSubmit() {
    if(this.fCarCard.invalid){
      this.markAllAsDirty();
    }
    else{
      const { id, ...itemCarCard } = Object.assign({}, this.fCarCard.getRawValue());
      if(this.carId) {
        itemCarCard.Id = this.carId;
      }
      else{
        const objectId = new ObjectId();
        itemCarCard.id = objectId.toHexString();
      }
      itemCarCard.ResidentId = this.lstResidentCards.filter((item: any) => item.Id = itemCarCard.ResidentObjectId)[0].ResidentId;
      itemCarCard.CardOwner = this.lstResidentCards.filter((item: any) => item.Id = itemCarCard.ResidentObjectId)[0].FullName;
      if(itemCarCard.CardId)
        itemCarCard.CardNumber = this.lstResidentCards.filter((item: any) => item.Id = itemCarCard.CardId)[0].CardNumber;
      console.log(itemCarCard);
      
      this.ref.close(itemCarCard);
    }
  }
  onFileSelected(event:any){}
  onClick(event: any) {
    console.log(event.value);
    
  }
  setFormGroup(){
    if(this.CarCard?.ResidentId){
      this.CarCard.ResidentObjectId = this.lstResidentCards.filter((i: any) => i.ResidentId == this.CarCard.ResidentId)[0].Id;
    }
    console.log(this.CarCard);
    this.fCarCard = this.fb.group({
      ResidentObjectId : this.CarCard.ResidentObjectId,
      Id : this.CarCard.Id,
      ResidentCardIntegratedId : this.CarCard.ResidentCardIntegratedId,
      VehicleOwner : this.CarCard.VehicleOwner,
      ResidentId : this.CarCard.ResidentId,
      CardId : this.CarCard.CardId,
      CardOwner : this.CarCard.CardOwner,
      VehicleId : this.CarCard.VehicleId,
      VehiclePlate: this.CarCard.VehiclePlate,
      VehicleName: this.CarCard.VehicleName,
      VehicleColor: this.CarCard.VehicleColor,
      VehicleDescription: this.CarCard.VehicleDescription,
      Image: this.CarCard.Image,
    })
    if(this.isLoading == false){
      Object.keys(this.fCarCard.controls).forEach(key => {
        const control = this.fCarCard.get(key);
        control.disable();
      });
      const control = this.fCarCard.get('CardId');
      control.enable();
      const CardIntegratedId = this.fCarCard.get('ResidentCardIntegratedId');
      CardIntegratedId.enable();
    }
  }
  getCardManager() {
    this.filterParrams.TowerId = this.towerId;
    this.cardmanagerService.getListCardEmptyByPaging(this.filterParrams).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200){
        this.lstCardVehicle = res.data.Results;
      }
    })
  }
  GetCardActiveByPage() {
    this.filterActive.ApartmentId = this.apartmentId;
    this.filterActive.ResidentId = this.fCarCard.get('ResidentId').value;
    this.cardmanagerService.getListCardActiveByPage(this.filterActive).subscribe((res: ResApi) => {
      if(res.meta.error_code = AppStatusCode.StatusCode200) {
        this.lstCardActive = res.data.Results;
      }
    })
  }
}
