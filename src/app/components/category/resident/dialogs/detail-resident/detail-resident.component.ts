import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { StatusOption, Staying, Role, RelationshipOption, AppStatusCode, AppMessageResponse, StorageData } from 'src/app/shared/constants/app.constants';
import { Apartment } from 'src/app/viewModels/apartment/apartment';
import { Paging } from 'src/app/viewModels/paging';
import { ResApi } from 'src/app/viewModels/res-api';
import { DbApartment, ListAttactments } from 'src/app/viewModels/resident/resident';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-detail-resident',
  templateUrl: './detail-resident.component.html',
  styleUrls: ['./detail-resident.component.scss']
})
export class DetailResidentComponent {
  fResident: any
  public Resident : any
  public listApartmentMaps: Array<DbApartment>;
  public lstResident : any;
  public lstCountry : any;
  public listAttactments : any[] = [];
  Idc : number | undefined;
  public statusOptionName: string | undefined ;
  public stayingName: string | undefined ;
  public roleName: string | undefined ;
  public filterParrams: Paging
  public loading = [false];
  public isLoadingTable: boolean = false;
  public statusOption = StatusOption;
  public staying = Staying;
  public role = Role;
  public relationshipOption = RelationshipOption;
  
  constructor(
    private readonly commonService: CommonService,
    private readonly fb: FormBuilder,
    public dialogService: DialogService,
    private config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
  ){
    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 1000;
    this.listApartmentMaps = [];
    this.lstResident = this.config.data.Resident;
  }
  ngOnInit(): void {
    this.getCountry();
    if(this.lstResident)
      this.setForm();
  }
    setData() {
      this.listApartmentMaps.forEach((apartment: any) => {
        apartment.statusOptionName = this.statusOption.filter(item => item.value === apartment.Status)[0]?.label;
        apartment.stayingName = this.staying.filter(item => item.value === apartment.ResidentStatus)[0]?.label;
        apartment.roleName = this.role.filter(item => item.value === apartment.Type)[0]?.label;
      })
    }

  setFormGroup() {
    this.fResident = this.fb.group({
      Status: [{value: 1, disabled: true}],
      BirthDay: [{value: new Date(this.lstResident.Birthday), disabled: true}],
      FullName: [{value: this.lstResident.FullName, disabled: true}],
      Note: [{value: this.lstResident.Note, disabled: true}],
      Address: [{value: this.lstResident.Address, disabled: true}],
      Email: [{value: this.lstResident.Email, disabled: true}],
      AddressId: [{value: this.lstResident.AddressId, disabled: true}],
      DateId: [{value: new Date(this.lstResident.DateId), disabled: true}],
      DateRent: [{value: new Date(this.lstResident.DateRent), disabled: true}],
      CardId: [{value: this.lstResident.CardId, disabled: true}],
      Phone: [{value: this.lstResident.Phone, disabled: true}],
      CountryId: [{value: this.lstResident.CountryId, disabled: true}],
      Sex: [{value: this.lstResident.Sex, disabled: true}],
      Type: [{value: this.lstResident.Type, disabled: true}],
      IsAccount: [{value: this.lstResident.IsAccount, disabled: true}],
      listAttactments: [{value: this.lstResident.listAttactments, disabled: true}],
      listApartmentMaps: [{value: this.lstResident.listApartmentMaps, disabled: true}],
    });
  }
  setForm() {
    this.listApartmentMaps = this.lstResident.listApartmentMaps;
    this.listAttactments = this.lstResident.listAttactments;
    this.setFormGroup();
    this.setData()
  }
  getCountry() {
    this.commonService.getListCountrieByPaging(this.filterParrams).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstCountry = res.data;
      }
    })
  }
}


