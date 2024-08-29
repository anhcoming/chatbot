import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApartmentService } from 'src/app/services/apartment.service';
import { ResidentService } from 'src/app/services/resident.service';
import { TowerService } from 'src/app/services/tower.service';
import { StatusOption, Staying, Role, RelationshipOption, AppStatusCode, AppMessageResponse, StorageData } from 'src/app/shared/constants/app.constants';
import { StorageService } from 'src/app/shared/services/storage.service';
import { Apartment } from 'src/app/viewModels/apartment/apartment';
import { DbApartment } from 'src/app/viewModels/customer/customer';
import { Paging } from 'src/app/viewModels/paging';
import { ResApi } from 'src/app/viewModels/res-api';

@Component({
  selector: 'app-add-apartment-resident',
  templateUrl: './add-apartment-resident.component.html',
  styleUrls: ['./add-apartment-resident.component.scss']
})
export class AddApartmentResidentComponent {
  fCustomer: any
  public id : any
  public Ida : any
  public Item : any
  public ProjectId : any
  public FloorId : any
  public Name : string | undefined
  public lstCustomer : Array<DbApartment>;
  public lstResiden: any 
  public lstTower: any
  public apartment: any[] = [];
  public lstApartment: Array<Apartment>;
  public StatusOption: any[] = [];
  public RelationshipOption: any[] = [];
  public Staying: any[] = [];
  public Role: any[] = [];
  public filterParrams: Paging;
  public loading = [false];
  public statusOption = StatusOption;
  public staying = Staying;
  public role = Role;
  public relationshipOption = RelationshipOption;
  public isSubmit: boolean = false;
  userId: any;
  constructor(
    private readonly residentService: ResidentService,
    private readonly towerService: TowerService,
    private readonly apartmentService: ApartmentService,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private router: Router,
    private readonly storeService : StorageService,
    private readonly route: ActivatedRoute,
    private readonly fb: FormBuilder,
    private config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    public datePipe : DatePipe
  ){
    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 1000;
    this.lstCustomer = new Array<DbApartment>();
    this.lstApartment = new Array<Apartment>();
    this.Ida = this.config.data.Ida;
    this.id = this.config.data.Id;
  }
  ngOnInit(): void {
    if(!this.Ida){
      this.Ida = 0
    }
    
    if(this.id) 
      this.getResidentById(this.id)
    
    this.getListTower();
    this.getListApartment();
    this.fCustomer = this.fb.group({
      TowerId: ['' ,Validators.required],
      ApartmentId: ['',Validators.required],
      Id:  ["89836af5-202d-4c5c-b05c-fed6efa100c2"],
      CreatedById: this.userId,
      UpdatedById: this.userId,
      CompanyId: [1],
      DateStart: ['' ],
      DateEnd: ['' ],
      Type: ['' , Validators.required],
      RelationshipId: [''],
      Status: ['',Validators.required ],
      ResidentStatus: ['',Validators.required ],
      DateRent: ['' ],
      RegistrationNo: [''],
      RegistrationStart: [''],
      RegistrationEnd: [''],
    });
  }
  onSubmit(){
    if (this.fCustomer.invalid) {
      this.markAllAsDirty(); 
    }else{  
      if(this.fCustomer.controls['RelationshipId'].dirty == false){
        const itemApartmentMap = Object.assign({}, this.fCustomer.value);
        // itemApartmentMap.ProjectId = this.lstApartment.filter(i => i.ProjectId == this.ProjectId).ProjectId;  
      
        itemApartmentMap.ProjectId = this.ProjectId;
        itemApartmentMap.FloorId = this.FloorId;
        itemApartmentMap.apartment = this.apartment[0];
        
        itemApartmentMap.DateStart = this.datePipe.transform(itemApartmentMap.DateStart, 'yyyy/MM/dd');
        itemApartmentMap.DateEnd = this.datePipe.transform(itemApartmentMap.DateEnd, 'yyyy/MM/dd');
        itemApartmentMap.DateRent = this.datePipe.transform(itemApartmentMap.DateEnd, 'yyyy/MM/dd');
        itemApartmentMap.RegistrationStart = this.datePipe.transform(itemApartmentMap.RegistrationStart, 'yyyy/MM/dd');
        itemApartmentMap.RegistrationEnd = this.datePipe.transform(itemApartmentMap.RegistrationEnd, 'yyyy/MM/dd');

        this.ref.close(itemApartmentMap);
      }
    }
  }
  markAllAsDirty() {
    Object.keys(this.fCustomer.controls).forEach(key => {
      const control = this.fCustomer.get(key);
      if (control.enabled && control.invalid) {
        control.markAsDirty();
      }
    });
  }
  onBack() {
    this.confirmationService.confirm({
      message: 'Bạn có muốn dừng thêm căn hộ cho cư dân không?',
      header: 'HỦY THÊM CĂN HỘ CHO CƯ DÂN',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xác nhận',
      rejectLabel: 'Hủy bỏ',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.ref.close();
      },
      reject: (type: any) => {
        return;
      }
    });
  }
  getListTower() {
    this.towerService.getListTowerByPaging(this.filterParrams).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstTower = res.data;
      }
      else {
        this.lstTower = [];
        this.messageService.add({severity:'error', summary:'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest});
      }
    })
  }
  checkRelationshipOption() {
    if(this.fCustomer.get('Type').value == 3) {
      const control = this.fCustomer.get('RelationshipId');
      control.markAsDirty();
      return;
    }else{
      const control = this.fCustomer.get('RelationshipId');
      control.markAsPristine();
    }
  }
  setRelationshipOption(event: any) {
    if(event.value = null) {
      const control = this.fCustomer.get('RelationshipId');
      control.markAsDirty();
      return;
    }else{
      const control = this.fCustomer.get('RelationshipId');
      control.markAsPristine();
    }
  }
  onChaneProject() {
    this.fCustomer.get('TowerId').setValue(this.lstApartment.filter(i => i.Id === this.fCustomer.value.ApartmentId)[0]?.TowerId) 
    const control = this.fCustomer.get('TowerId');
    if (control.enabled && control.invalid) {
      control.markAsDirty();
    }
    this.ProjectId = this.lstApartment.filter(i => i.Id === this.fCustomer.value.ApartmentId)[0]?.ProjectId;
    this.FloorId = this.lstApartment.filter(i => i.Id === this.fCustomer.value.ApartmentId)[0]?.FloorId;
    this.Name = this.lstApartment.filter(i => i.Id === this.fCustomer.value.ApartmentId)[0]?.Name;
    this.apartment.push({Name: this.Name});
  }

  getListApartment() {
    this.apartmentService.getListApartmentByPaging(this.filterParrams).subscribe((res: ResApi) => {
      if(res.meta.error_code = AppStatusCode.StatusCode200) {
        this.lstApartment = res.data;
      }
      else{
        this.lstApartment = [];
        this.messageService.add({ severity: 'error', summary:'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest})
      }
    })
  }
  getApartment(event: any) {
    if(!event.value){
      this.filterParrams.query = `1=1`;
    this.getListApartment();
    }
    else{
      this.filterParrams.query = `TowerId=${event.value}`;
      this.getListApartment();
    }
  }

  getResidentById(id: number) {
    this.residentService.getResident(id).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstResiden = res.data;
        
        let ItemResident = this.lstResiden.listApartmentMaps;
        this.Item = ItemResident.filter((i: any) => i.Id == this.Ida)[0]
        if(this.Ida){
          this.setFormGroup()
        }
      }else{
        this.lstResiden = []
      }
    })
  }

  getUserId() {
    this.userId = this.storeService.get(StorageData.userId); 
  }

  setFormGroup() {
    this.fCustomer = this.fb.group({
      TowerId: this.Item.TowerId,
      ApartmentId: this.Item.ApartmentId,
      Id:  this.Item.Id,
      apartment: this.Item.apartment,
      CreatedById: this.Item.CreatedById,
      UpdatedById: this.Item.UpdatedById,
      CompanyId: this.Item.CompanyId,
      DateStart: this.Item.DateStart?  new Date(this.Item.DateStart) : '',
      DateEnd: this.Item.DateEnd ? new Date(this.Item.DateEnd) : '',
      Type: this.Item.Type,
      RelationshipId: this.Item.RelationshipId,
      Status: this.Item.Status,
      ResidentStatus: this.Item.ResidentStatus,
      DateRent: this.Item.DateRent ? new Date(this.Item.DateRent) : '',
      RegistrationNo: this.Item.RegistrationNo,
      RegistrationStart: this.Item.RegistrationStart ? new Date(this.Item.RegistrationStart) : '',
      RegistrationEnd: this.Item.RegistrationEnd ? new Date(this.Item.RegistrationEnd) : '',
    });
  }
  
  
}
