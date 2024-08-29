import { Component, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FunctionService } from 'src/app/services/function.service';
import { RoleService } from 'src/app/services/role.service';
import { ServicePricingService } from 'src/app/services/service-pricing.service';
import { AppStatusCode, AppMessageResponse } from 'src/app/shared/constants/app.constants';
import { Company, DbFunction } from 'src/app/viewModels/company/company';
import { Paging } from 'src/app/viewModels/paging';
import { ResApi } from 'src/app/viewModels/res-api';
@Component({
  selector: 'app-dialogs-pricing',
  templateUrl: './dialogs-pricing.component.html',
  styleUrls: ['./dialogs-pricing.component.scss']
})
export class DialogsPricingComponent {
  CompanyPricing: Company;
  @Input() isView!: boolean;
  item: any;
  Action: any;
  submitted = false;
  ServicePricingId: any;
  public id: any;
  lstPricing: any;
  listFunctions: any[] = [];
  public Id: any;
   fServicePricing: any ;
  public data: any;
  public filterParrams : Paging ;
  public loading = [false];
  public lstServicePricing: any;
  
  constructor(
    private readonly messageService: MessageService,
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private router: Router,
    private servicePricingService: ServicePricingService,
    private roleService: RoleService,
    public dialogService: DialogService,
    private functionService: FunctionService,
    private config: DynamicDialogConfig,
    public ref: DynamicDialogRef) {
      this.Action = {
          View: false,
          Create: false,
          Update: false,
          Delete: false,
          Import: false,
          Export: false,
          Print: false,
          Other: false,
          Menu: false
    };
    this.CompanyPricing = new Company();
    this.CompanyPricing.listFunction = new Array<DbFunction>();

    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 100;

    this.lstServicePricing = [];
    
    this.data = [];
    this.ServicePricingId = this.config.data.servicePricingId;
  }
  ngOnInit(): void {
    
    this.id = this.ServicePricingId

    if(this.id) {
      this.getServicePricingById({ value: this.id })
    }else{
      this.getListServicePricing();
    }

    this.fServicePricing = this.fb.group({
      
      ServicePricingId: [''],
      listFunctions: [],
    });
  }
  // setFormGroup() {
  //   this.fServicePricing = this.fb.group({
  //     ServicePricingId: this.lstServicePricing.ServicePricingId,
  //     CreatedById: this.userId,
  //     UpdatedById: this.userId,
  //     Code: this.lstServicePricing.Code, 
  //     Name: this.lstServicePricing.Name,
  //     listFunctions: this.lstServicePricing.listFunctions
  //   })
  // }

  getListServicePricing( ) {
    this.servicePricingService.getListServicePricingByPaging(this.filterParrams).subscribe((res: ResApi) =>{
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstPricing = res.data;
        
      }
    })
  }
  getServicePricingById(event: any) {
    this.servicePricingService.getServicePricingById(event.value).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstServicePricing = res.data;
        this.GetlistFunctions(event.value);
        this.getListServicePricing()
      }
      else {
        this.lstServicePricing = [];
        this.messageService.add({severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest})
      }
    })
  } 
  onReturnPage(url: string) : void {
    this.router.navigate([url]);
  }
  onSubmit(){

    this.submitted = true;
    // const reqData = Object.assign({}, this.fServicePricing.listFunctions);
    let listFunctions: any[] = [];
    this.listFunctions.forEach(item => {
        let newFunc = new DbFunction();
        newFunc.FunctionId = item.FunctionId;
        newFunc.Status = "";
        newFunc.ActiveKey = '1111111111';
        newFunc.Status += item.View == true ? 1 : 99;
        listFunctions.push(newFunc);
    });    
    // reqData.listFunctions = listFunctions;
    this.ref.close(listFunctions);
  }

  GetlistFunctions(id: any) {
    this.functionService.getTreeFunction(0).subscribe(
      (res: any) => {
        this.loading[0] = false;
        if (res?.meta?.error_code == AppStatusCode.StatusCode200) {
          this.listFunctions = res["data"];
          console.log(this.listFunctions);
          
          if (!id) {
            this.listFunctions = this.listFunctions.map(item => {
              return {
                ...item,
                Space: "",
                View: false,
              }
            });
            this.listFunctions = [...this.listFunctions];
          }
          else {
            for (let i = 0; i < this.listFunctions.length; i++) {
                for (let j = 0; j < this.lstServicePricing.listFunctions.length; j++) {
                    if (this.listFunctions[i].FunctionId == this.lstServicePricing.listFunctions[j].FunctionId) {
                        this.listFunctions[i].View = this.lstServicePricing.listFunctions[j].Status == "1" ? true : false;
                        break;
                    }
                }
            }
            this.changeCell();
          }
        }
      },
    );
  }
  changeCell() {
    this.changeAction(2);
    this.changeFull(undefined);
  }
  changeAction(cs: any) {
    this.listFunctions.forEach(item => {
        switch (cs) {
            case 1:
                item.View = this.Action.View;
                break;
            
            default:
                break;
        }

        if (item.IsParamRoute) {
            if (item.View ) {
                item.Full = true;
            }
            else {
                item.Full = false;
            }
        }
        else {
            if (item.View) {
                item.Full = true;
            }
            else {
                item.Full = false;
            }
        }
    });
  }
  changeFull(i: any) {
    if (i != undefined) {
        this.listFunctions[i].View = this.listFunctions[i].Full;
    }

    if (this.listFunctions.filter(l => l.View == false || l.View == undefined).length > 0) {
        this.Action.View = false;
    }
    else {
        this.Action.View = true;
    }
  }
  onBack() {
    this.ref.close()
  }

}