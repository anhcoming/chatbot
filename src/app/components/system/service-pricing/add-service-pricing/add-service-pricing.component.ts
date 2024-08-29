import { Component, Input, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CompanyService } from 'src/app/services/company.service';
import { FunctionService } from 'src/app/services/function.service';
import { RoleService } from 'src/app/services/role.service';
import { ServicePricingService } from 'src/app/services/service-pricing.service';
import { AppMessageResponse, AppStatusCode, StorageData } from 'src/app/shared/constants/app.constants';
import { StorageService } from 'src/app/shared/services/storage.service';
import { Paging } from 'src/app/viewModels/paging';
import { ResApi } from 'src/app/viewModels/res-api';
import { DbFunction, ServicePricing } from 'src/app/viewModels/service-pricing/service-pricing';

@Component({
  selector: 'app-add-service-pricing',
  templateUrl: './add-service-pricing.component.html',
  styleUrls: ['./add-service-pricing.component.scss']
})
export class AddServicePricingComponent {
  ServicePricing: ServicePricing;
  @Input() isView!: boolean;

  Action: any;
  submitted = false;
  public Idc: any;
  listFunctions: any[] = [];
  public Id: any;
   fServicePricing: any ;
  public data: any;
  public filterParrams : Paging ;
  public loading = [false];

  public lstServicePricing: any;
  userId: any;

  constructor(
    private readonly messageService: MessageService,
    private readonly companyService: CompanyService,
    private readonly storeService : StorageService,
    private readonly confirmationService: ConfirmationService,
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private router: Router,
    private servicePricingService: ServicePricingService,
    private roleService: RoleService,
    private functionService: FunctionService) {
      this.Action = {
        Check: false,
    };
    this.ServicePricing = new ServicePricing();
    this.ServicePricing.listFunction = new Array<DbFunction>();

    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 100;

    this.lstServicePricing = [];
    
    this.data = {};
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.Id =  params.get('id');
    });
    
    if(this.Id)
      this.getServicePricingById(this.Id);

    this.fServicePricing = this.fb.group({
      Id: [0],
      CreatedById: this.userId,
      UpdatedById: this.userId,
      COmpanyId: this.Idc,
      Code: ['' , Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(150)])],
      Name: ['' , Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(150)])],
      listFunctions: [],
    });
    this.GetlistFunctions();
    this.getCompanyId();
    this.getUserId();
  }
  getUserId() {
    this.userId = this.storeService.get(StorageData.userId); 
  }
  getCompanyId() {
    this.Idc = this.storeService.get(StorageData.companyId); 
  }
  setFormGroup() {
    if(!this.Id) {
        this.Id = 0
      }
    this.fServicePricing = this.fb.group({
      Id: this.Id,
      CreatedById: this.userId,
      UpdatedById: this.userId,
      CompanyId: this.Idc,
      Code: this.lstServicePricing.Code, 
      Name: this.lstServicePricing.Name,
      listFunctions: this.lstServicePricing.listFunctions
    })
  }

  getServicePricingById(id: number) {
    this.servicePricingService.getServicePricingById(this.Id).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstServicePricing = res.data;
        this.setFormGroup();
        
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
  markAllAsDirty() {
    Object.keys(this.fServicePricing.controls).forEach(key => {
      const control = this.fServicePricing.get(key);
      if (control.enabled && control.invalid) {
        control.markAsDirty();
      }
    });
  }
  onSubmit() {
    if(this.fServicePricing.invalid){
      this.markAllAsDirty()
    }else{
      this.submitted = true;
      const reqData = Object.assign({}, this.fServicePricing.value);
      let listFunctions: any[] = [];
      this.listFunctions.forEach(item => {
          let newFunc = new DbFunction();
          newFunc.FunctionId = item.FunctionId;
          newFunc.Status = item.Check == true ? 1 : 99;
          listFunctions.push(newFunc);
      });

      reqData.listFunctions = listFunctions;
      if(!this.Id) {
        this.Id = 0;
      }
      this.setFormGroup();
      if (this.Id > 0) {
        this.servicePricingService.updateServicePricing(this.Id, reqData).subscribe((res: ResApi) => {
          this.loading[0] = false;
          if(res.meta.error_code == AppStatusCode.StatusCode200) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.CreatedSuccess });

            setTimeout(() => {this.onReturnPage('/system/service-pricing/list')}, 1500);
          }
          else {
            this.loading[0] = false
            this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
          }
        },
        () => {
          this.loading[0] = false
          this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest }) },
        () => {this.loading[0] = false} 
        )
      }
      else {
        this.servicePricingService.createServicePricing(reqData).subscribe((res: ResApi) => {
          this.loading[0] = false;
          if(res.meta.error_code == AppStatusCode.StatusCode200) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.CreatedSuccess });

            setTimeout(() => {this.onReturnPage('/system/service-pricing/list')}, 1500);
          }
          else {
            this.loading[0] = false
            this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
          }
        },
        () => {
          this.loading[0] = false
          this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest }) },
        () => {this.loading[0] = false} 
        ) 
      }
    }
  }

GetlistFunctions() {
  this.functionService.getTreeFunction(0).subscribe(
    (res: any) => {
      this.loading[0] = false;
      if (res?.meta?.error_code == AppStatusCode.StatusCode200) {
        this.listFunctions = res["data"];
        if (!this.Id) {
          this.listFunctions = this.listFunctions.map(item => {
            return {
              ...item,
              Space: "",
              Check: false,
            }
          });

          this.listFunctions = [...this.listFunctions];
        }
        else {
          for (let i = 0; i < this.listFunctions.length; i++) {
              for (let j = 0; j < this.lstServicePricing.listFunctions.length; j++) {
                  if (this.listFunctions[i].FunctionId == this.lstServicePricing.listFunctions[j].FunctionId) {
                      this.listFunctions[i].Check = this.lstServicePricing.listFunctions[j].Status == "1" ? true : false;
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
              item.Check = this.Action.Check;
              break;
          
          default:
              break;
      }

      if (item.IsParamRoute) {
          if (item.Check ) {
              item.Full = true;
          }
          else {
              item.Full = false;
          }
      }
      else {
          if (item.Check) {
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
      this.listFunctions[i].Check = this.listFunctions[i].Full;
  }

  if (this.listFunctions.filter(l => l.Check == false || l.Check == undefined).length > 0) {
      this.Action.Check = false;
  }
  else {
      this.Action.Check = true;
  }
}
onBack(event: Event) {
  let isShow = true;

  if (isShow) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: !(this.Id > 0) ? 'Hủy thêm mới gói dịch vụ' : 'Hủy sửa gói dịch vụ:  <b>"' + this.lstServicePricing.Name+'"</b>',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xác nhận',
      rejectLabel: 'Hủy bỏ',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.router.navigate(['/system/service-pricing/list']);
      },
      reject: () => {
          return;
      }
    });
  } else {
    this.router.navigate(['/commons/service-pricing/list']);
  }
}



}