import { Component, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ApartmentService } from 'src/app/services/apartment.service';
import { FloorService } from 'src/app/services/floor.service';
import { ProjectService } from 'src/app/services/project.service';
import { CustomerService } from 'src/app/services/customer.service';
import { TowerService } from 'src/app/services/tower.service';
import { Customer, DbApartment } from 'src/app/viewModels/customer/customer';
import { Paging } from 'src/app/viewModels/paging';
import { ResApi } from 'src/app/viewModels/res-api';
import { AppMessageResponse, AppStatusCode, StorageData } from 'src/app/shared/constants/app.constants';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { StatusOption, Staying, Role, RelationshipOption } from 'src/app/shared/constants/app.constants';
import { DatePipe } from '@angular/common';
import { Apartment } from 'src/app/viewModels/apartment/apartment';
import { StorageService } from 'src/app/shared/services/storage.service';

@Component({
  selector: 'app-dialogs-customer',
  templateUrl: './dialogs-customer.component.html',
  styleUrls: ['./dialogs-customer.component.scss']
})
export class DialogsCustomerComponent  {
  fCustomer: any
  public id : any
  public ProjectId : any
  public FloorId : any
  public ApartmentName : string | undefined
  public lstCustomer : Array<DbApartment>;
  public lstProject!: any[] 
  public lstRoleApart!: any[]
  public lstTower!: any[]
  public lstFloor!: any[]
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
  userId: any;
  Idc: any;
  constructor(
    private readonly projectService: ProjectService,
    private readonly towerService: TowerService,
    private readonly floorService: FloorService,
    private readonly apartmentService: ApartmentService,
    private readonly customerService: CustomerService,
    private readonly messageService: MessageService,
    private router: Router,
    private readonly route: ActivatedRoute,
    private readonly fb: FormBuilder,
    public ref: DynamicDialogRef,
    private readonly storeService : StorageService,
    public datePipe : DatePipe
  ){
    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 1000;
    this.lstCustomer = new Array<DbApartment>();
    this.lstApartment = new Array<Apartment>();
    
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id =  params.get('id');
    }); 
    
    this.getListTower();
    this.getListApartment();
    // this.getListZone();

    // if(this.id)
    //   this.getFloorById(this.id);

      this.fCustomer = this.fb.group({
        TowerId: ['' , Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(150)])],
        ApartmentId: ['',Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(150)])],
        Id:  ["89836af5-202d-4c5c-b05c-fed6efa100c2"],
        apartment: [''],
        CreatedById: this.userId,
        UpdatedById: this.userId,
        CompanyId: [1],
        DateStart: [''],
        DateEnd: [''],
        Type: [''],
        RelationshipId: [''],
        Status: [''],
        ResidentStatus: [''],
        DateRent: [''],
        RegistrationNo: [''],
        RegistrationStart: [''],
        RegistrationEnd: [''],
      });
    }
    getUserId() {
      this.userId = this.storeService.get(StorageData.userId); 
    }
    getCompanyIdId() {
      this.Idc = this.storeService.get(StorageData.companyId); 
    }
  onSubmit(){

    const itemApartmentMap = Object.assign({}, this.fCustomer.value);
    // itemApartmentMap.ProjectId = this.lstApartment.filter(i => i.ProjectId == this.ProjectId).ProjectId;  
    
    itemApartmentMap.ProjectId = this.ProjectId;
    itemApartmentMap.FloorId = this.FloorId;
    itemApartmentMap.apartment = this.ApartmentName;
    
    itemApartmentMap.DateStart = this.datePipe.transform(itemApartmentMap.DateStart, 'yyyy/MM/dd');
    itemApartmentMap.DateEnd = this.datePipe.transform(itemApartmentMap.DateEnd, 'yyyy/MM/dd');
    itemApartmentMap.DateRent = this.datePipe.transform(itemApartmentMap.DateEnd, 'yyyy/MM/dd');
    itemApartmentMap.RegistrationStart = this.datePipe.transform(itemApartmentMap.RegistrationStart, 'yyyy/MM/dd');
    itemApartmentMap.RegistrationEnd = this.datePipe.transform(itemApartmentMap.RegistrationEnd, 'yyyy/MM/dd');

    this.ref.close(itemApartmentMap);

    // this.ref.close(itemApartmentMap);
  }

  onBack() {
    this.ref.close();
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
  onChaneProject() {
    this.ProjectId = this.lstApartment.filter(i => i.Id === this.fCustomer.value.ApartmentId)[0].ProjectId;
    this.FloorId = this.lstApartment.filter(i => i.Id === this.fCustomer.value.ApartmentId)[0].FloorId;
    this.ApartmentName = this.lstApartment.filter(i => i.Id === this.fCustomer.value.ApartmentId)[0].Name;
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
}
