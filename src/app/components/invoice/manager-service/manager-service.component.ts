import { Component,OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApartmentService } from 'src/app/services/apartment.service';
import { FloorService } from 'src/app/services/floor.service';
import { ProjectService } from 'src/app/services/project.service';
import { TowerService } from 'src/app/services/tower.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { Apartment } from 'src/app/viewModels/apartment/apartment';
import { Customer } from 'src/app/viewModels/customer/customer';
import { Floor } from 'src/app/viewModels/floor/floor';
import { Paging,PagingContractService } from 'src/app/viewModels/paging';
import { Project } from 'src/app/viewModels/project/project';
import { DbTower } from 'src/app/viewModels/tower/db-tower';
import { ResApi } from 'src/app/viewModels/res-api';
import { InvoiceContractServiceService } from 'src/app/services/inv-contract-service.service';
import { InvoiceContractService } from 'src/app/services/inv-contract.service';

@Component({
  selector: 'app-manager-service',
  templateUrl: './manager-service.component.html',
  styleUrls: ['./manager-service.component.scss']
})
export class ManagerServiceComponent implements OnInit{
  fSearch: any;
  public filterParrams : PagingContractService;
  public lstCustomerGroup: any[];
  public lstCustomerType: any[];
  public lstProject : any[];
  public lstCustomer : any[];
  public lstApartment: any[];
  public lstTower : any[];
  public lstFloor :any[];
  public lstContractService: any[];
  isLoadingTable: boolean = false;
  isInputEmpty : boolean = true;
  public lstContract : any[] | undefined;
  constructor(
    private readonly floorService: FloorService,
    private readonly apartmentService: ApartmentService,
    private readonly projectService: ProjectService,
    private readonly storeService: StorageService,
    private readonly towerService: TowerService,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private readonly invoiceContractServiceService: InvoiceContractServiceService,
    private readonly invoiceContractService: InvoiceContractService,
    private readonly fb: FormBuilder,
  )
  {
    this.lstCustomerGroup=[];
    this.lstCustomerType=[];
    this.lstProject=[];
    this.lstCustomer=[];
    this.lstApartment=[];
    this.lstTower=[];
    this.lstFloor=[];
    this.lstContractService=[];
    this.filterParrams = new Object as PagingContractService;
    this.filterParrams.keyword = "";
    this.filterParrams.pageIndex = 1;
    this.filterParrams.pageSize=1000;
    this.filterParrams.ApartmentId=0;
    this.filterParrams.Code="";
    this.filterParrams.CustomerId=0;
    this.filterParrams.FloorId=0;
    this.filterParrams.ProjectId=0;
    this.filterParrams.TowerId=0;
  }

  ngOnInit() {
    this.getPageContractService();
  }
  onSelectByCustomerGroupId(event:any){}
  onSelectByCustomerTypeId(event:any){}
  onSelectTower(event:any){}
  onSelectFloor(event:any){}
  onSelecApartment(event:any){}
  onSelectContract(event:any){}
  onSearch(event:any){}
  getPageContractService(){
    this.invoiceContractServiceService.getListInvoiceByPaging(this.filterParrams).subscribe((res: ResApi) => {
      if(res.meta) {
        this.lstContractService=res.data.Items;
        }
      else {
        this.lstContractService=[];
      }
    }) ;
  }
}

