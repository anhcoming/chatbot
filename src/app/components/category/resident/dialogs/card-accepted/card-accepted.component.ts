import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { StatusOption, Staying, Role, RelationshipOption, AppStatusCode, AppMessageResponse, StorageData, TypeCard } from 'src/app/shared/constants/app.constants';
import { Paging } from 'src/app/viewModels/paging';
import { ResApi } from 'src/app/viewModels/res-api';
import { ResidentService } from 'src/app/services/resident.service';

@Component({
  selector: 'app-card-accepted',
  templateUrl: './card-accepted.component.html',
  styleUrls: ['./card-accepted.component.scss']
})
export class CardAcceptedComponent {
  fCardAccepted: any
  public filterParrams: Paging
  public Resident : any
  public lstResidentCard : any;
  public loading = [false];
  public isLoadingTable: boolean = false;
  public TypeCard = TypeCard;
  
  constructor(
    private readonly residentService: ResidentService,
    private readonly fb: FormBuilder,
    public dialogService: DialogService,
    private config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
  ){
    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 1000;
    this.Resident = this.config.data.Resident;
  }
  ngOnInit(): void {
    this.getCardResident();
  }
  getCardResident() {
    this.filterParrams.ResidentId = this.Resident;
    this.residentService.GetResidentCard(this.filterParrams).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstResidentCard = res.data;
        this.lstResidentCard.forEach((item: any) => {
          item.CardStatusName = this.TypeCard.filter((items: any) => items.Code == item.CardStatus)[0].Name;
          if(item.GroupCard == 2 ){
            if(item.ResidentCardIntegratedId !== null) {
              item.TypeCardName = "Thẻ xe, thẻ cư dân"
            }else{
              item.TypeCardName = "Thẻ xe"
            }
          }else{
            if(item.ResidentCardIntegratedId !== null) {
              item.TypeCardName = "Thẻ cư dân, thẻ xe"
            }else{
              item.TypeCardName = "Thẻ cư dân"
            }
          }
        })
      }
    })
  }
  
}
