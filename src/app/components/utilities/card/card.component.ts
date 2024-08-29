import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { CardService } from 'src/app/services/card.service';
import { ProjectService } from 'src/app/services/project.service';
import { TypeCardService } from 'src/app/services/type-card.service';
import { VehicleService } from 'src/app/services/vehicle.service';
import { GroupCard, AppStatusCode, AppMessageResponse, CardStatus } from 'src/app/shared/constants/app.constants';
import { StorageService } from 'src/app/shared/services/storage.service';
import { Card } from 'src/app/viewModels/card/card';
import { Paging } from 'src/app/viewModels/paging';
import { ResApi } from 'src/app/viewModels/res-api';
import { Vehicle } from 'src/app/viewModels/vehicle/vehicle';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  public lstCard: Array<Card>;
  public lstVehicle: Array<Vehicle>;
  public lstCardStatus = CardStatus;
  public filterParrams : Paging;
  public isLoadingTable: boolean = false;
  public loading = [false];
  filterText : string = '';
  public filter_cardNumber = '';

  constructor(
    private readonly projectService: ProjectService,
    private readonly typeCardService: TypeCardService,
    private readonly vehicleService: VehicleService,
    private readonly messageService: MessageService,
    private readonly storeService: StorageService,
    private readonly cardService: CardService,
    private readonly confirmationService: ConfirmationService,
    private readonly fb: FormBuilder,
    private route: ActivatedRoute, 
    private router: Router
  ) {
    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 100;
    this.filterParrams.query = '';

    this.lstCard = new Array<Card>();
    this.lstVehicle = new Array<Vehicle>();
  }

  ngOnInit() {
    this.getCardByPaging();
  }

  getCardByPaging() {
    this.isLoadingTable = true;

    this.cardService.getListCardByPaging(this.filterParrams, 0, this.filter_cardNumber).subscribe((res: ResApi) => {
      this.isLoadingTable = false;

      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstCard = res.data.Results;
      }
      else {
        this.lstCard = new Array<Card>();
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    },
    () => {
      this.isLoadingTable = false;
  
      this.lstCard = [];
      this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest });
    })
  }

  onSearch(event: any) {
    // this.filter_cardNumber = event.target.value.toLowerCase().trim();
    this.filterParrams.query = `CardNumber.ToLower().Contains("${this.filterText}") OR ConfigCardName.ToLower().Contains("${this.filterText}")`;
    this.getCardByPaging();
  }

  onDelete(item: Card) {
    this.confirmationService.confirm({
      message: 'Bạn có muốn xóa thẻ: '+ item.CardNumber +' không?',
      header: 'XÓA THẺ',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.cardService.deleteCardById(0, item.Id).subscribe(
          (res: any) => {
            this.loading[0] = false;
            if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
              this.lstCard = this.lstCard.filter(s => s.Id !== item.Id);
              this.messageService.add({ severity: 'success', summary: 'Success', detail: res.meta.error_message || AppMessageResponse.DeletedSuccess });
            } else {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
              return;
            }
          }
        );
      },
      reject: (type: any) => {
          return;
      }
    });
  }

  getCardStatusName(cardStatus: string) {
    return this.lstCardStatus.find(s => s.code == cardStatus)?.name || '';
  }
}
