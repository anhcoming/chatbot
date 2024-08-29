import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { InvoiceServiceConfig } from 'src/app/services/inv-service-config.service';
import { AppMessageResponse, InvService_Type, AppStatusCode } from 'src/app/shared/constants/app.constants';
import { ResApi } from 'src/app/viewModels/res-api';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PagingInvoiceService, PagingInvoiceServices, Paging } from 'src/app/viewModels/paging';
import { InvoiceServiceGroup } from 'src/app/services/inv-service-group.service';
import { InvoiceService } from 'src/app/services/inv-service.service';
import { ProjectService } from 'src/app/services/project.service';
import { TowerService } from 'src/app/services/tower.service';
import { ZoneService } from 'src/app/services/zone.service';
import { DbApartment } from 'src/app/viewModels/resident/resident';
import { ServiceConfigDetailComponent } from '../service-config-detail/service-config-detail.component';
import { InvoiceServiceConfigDetail } from 'src/app/viewModels/invoice/invoice';

@Component({
  selector: 'app-add-inv-service-config',
  templateUrl: './add-inv-service-config.component.html',
  styleUrls: ['./add-inv-service-config.component.scss']
})
export class AddInvServiceConfigComponent implements OnInit {
  public id: any;
  today = new Date().toISOString().split('T')[0];
  TypeServiceConfigCheck: boolean = false;
  public filterParam: PagingInvoiceService;
  public filterParamService: PagingInvoiceServices;
  public dataServiceGroup: any;
  public dataService: any;
  public listServiceConfigDetail: any = [];
  dataFormInvServiceGroup: any;
  public dataServoiceConfig: any;
  public dataProject: any;
  public dataZone: any;
  public dataTower: any;

  public loading = [false];
  public invService_Type = InvService_Type;


  constructor(
    private datePipe: DatePipe,
    public dialogService: DialogService,
    private ref: DynamicDialogRef,
    private readonly confirmationService: ConfirmationService,
    private readonly invServiceGroup: InvoiceServiceGroup,
    private readonly invService: InvoiceService,
    private readonly projectService: ProjectService,
    private readonly zoneService: ZoneService,
    private readonly towerService: TowerService,
    private router: Router, private readonly route: ActivatedRoute,
    private readonly fb: FormBuilder,
    private readonly invServiceConfig: InvoiceServiceConfig,
    private readonly messageService: MessageService,) {
    this.dataServoiceConfig = {};
    this.filterParam = new Object as PagingInvoiceService;
    this.filterParam.pageIndex = 1;
    this.filterParam.pageSize = 100;
    this.filterParam.type = 0;
    this.filterParamService = new Object as PagingInvoiceServices;
    this.filterParamService.pageIndex = 1;
    this.filterParamService.pageSize = 100;
    this.filterParamService.type = 0;
    this.filterParamService.InvServiceGroupId = 0;
    this.dataFormInvServiceGroup = this.fb.group({
      id: 0,
      invServiceId: undefined,
      fromDate: undefined,
      toDate: undefined,
      projectId: undefined,
      towerId: undefined,
      zoneId: undefined,
      invServiceGroupId: undefined,
      note: undefined,
      type: undefined,
      typeServiceConfig: undefined,
      values: undefined
    })
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
    });
    if (this.id == null) this.id = 0;
    else
    {
      this.invServiceConfig.getInvoiceByID(this.id).subscribe((res: ResApi) => {
        if (res.meta.error_code == AppStatusCode.StatusCode200) {
          this.dataServoiceConfig = res.data;
          this.dataFormInvServiceGroup = this.fb.group({
            id: this.id,
            invServiceId:  this.dataServoiceConfig.InvServiceId,
            fromDate:  new Date(this.dataServoiceConfig.FromDate),
            toDate:  new Date(this.dataServoiceConfig.ToDate),
            projectId:  this.dataServoiceConfig.ProjectId,
            towerId:  this.dataServoiceConfig.TowerId,
            zoneId:  this.dataServoiceConfig.ZoneId,
            invServiceGroupId:  this.dataServoiceConfig.InvServiceGroupId,
            note:  this.dataServoiceConfig.Note,
            type:  this.dataServoiceConfig.Type,
            typeServiceConfig:  this.dataServoiceConfig.TypeServiceConfig,
            values: undefined
          });
  
          
          this.getInvServiceGroup(this.dataFormInvServiceGroup.value.type);
          this.getInvService(this.dataFormInvServiceGroup.value.invServiceGroupId);
          this.getListTower(this.dataFormInvServiceGroup.value.projectId);
  
          this.listServiceConfigDetail=[];
          if(this.dataServoiceConfig.invServiceConfigDetails!=undefined)
          for (let i = 0; i < this.dataServoiceConfig.invServiceConfigDetails.length; i++) {
            let item = {
              idRow: i+1,
              invServiceConfigId: this.dataServoiceConfig.invServiceConfigDetails[i].InvServiceConfigId,
              isOnePrice:this.dataServoiceConfig.invServiceConfigDetails[i].IsOnePrice ,
              des:  this.dataServoiceConfig.invServiceConfigDetails[i].Des,
              quota:  this.dataServoiceConfig.invServiceConfigDetails[i].Quota,
              price:  this.dataServoiceConfig.invServiceConfigDetails[i].Price,
              surchargePer:  this.dataServoiceConfig.invServiceConfigDetails[i].SurchargePer,
              surchargeValue:  this.dataServoiceConfig.invServiceConfigDetails[i].SurchargeValue,
            }
            this.listServiceConfigDetail.push(item);
          }
        }
        else {
          this.dataServoiceConfig = [];
          this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
        }
      });
    }

    this.getListData();

  }

  onDelete(index: number) {
    this.confirmationService.confirm({
      message: 'Bạn có muốn xóakhông?',
      header: 'XÓA',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.listServiceConfigDetail.splice(index, 1);
        let clone = [...this.listServiceConfigDetail];
        this.dataFormInvServiceGroup.value.values = clone
      },
      reject: (type: any) => {
        return;
      }
    });
  }
  onOpenConfigDialog(index: number) {
    let selectedRow: any = undefined
    if (index >= 0) {
      selectedRow = this.listServiceConfigDetail[index];
      
    }
    this.ref = this.dialogService.open(ServiceConfigDetailComponent, {
      header: index < 0 ? 'Thêm mới' : 'Cập nhật',
      width: '80%',
      height: '90%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
      data: {
        Id: index,
        data: selectedRow
      }
    });

    this.ref.onClose.subscribe((data: any) => {
      if (data) {
        if (data.idRow && data.idRow < 0) {
          data.idRow = this.listServiceConfigDetail.length
          this.listServiceConfigDetail.push(data)
        }
        else {
          // this.listServiceConfigDetail=this.listServiceConfigDetail.map((item: any) => {
          //     if(item.IdRow === data.IdRow) {
          //       return data
          //     }
          //     return item
          //   })
          this.listServiceConfigDetail[index] = data

        }
      }

    });

  }
  getInvServiceGroup(id: number) {
    this.filterParam.type = id;
    this.invServiceGroup.getListInvoiceByPaging(this.filterParam).subscribe((res: ResApi) => {
      if (res.meta) {
        this.dataServiceGroup = res.data.Items;
      }
      else {
      }
    });
  }
  getListData() {
    this.dataProject = [];
    let filter = new Object as Paging;
    this.zoneService.getListZoneByPaging(filter).subscribe((res: ResApi) => {
      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.dataZone = res.data;
      }
      else {
        this.dataZone = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })
    this.projectService.getListByPaging(filter).subscribe((res: ResApi) => {
      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.dataProject = res.data;
      }
      else {
        this.dataProject = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })

  }
  getListTower(projectId: any) {
    
    // this.dataTower = [];
    let filterTower = new Object as Paging;
    filterTower.query = `ProjectId=${projectId}`;
    this.towerService.getListTowerByPaging(filterTower).subscribe((res: ResApi) => {
      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.dataTower = res.data;
      }
      else {
        this.dataTower = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })
  }
  getProject(event: any) {
    this.dataFormInvServiceGroup.get('projectId')?.setValue(event.value);
    let projectId = this.dataFormInvServiceGroup.value.projectId;
    this.getListTower(event.value);
  }
  getZone(event: any) {
    this.dataFormInvServiceGroup.get('zoneId')?.setValue(event.value);
  }
  getTower(event: any) {
    this.dataFormInvServiceGroup.get('towerId')?.setValue(event.value);
  }
  getInvService(id: number) {
    this.filterParamService.InvServiceGroupId = id;
    this.filterParamService.type = parseInt(this.dataFormInvServiceGroup.value.type);
    this.invService.getListInvoiceByPaging(this.filterParamService).subscribe((res: ResApi) => {
      if (res.meta) {
        this.dataService = res.data.Items;
      }
      else {
      }
    });
  }
  getServiceType(event: any) {
    this.getInvServiceGroup(event.value)
    this.dataFormInvServiceGroup.get('type')?.setValue(event.value);
  }
  getServiceGroup(event: any) {
    this.getInvService(event.value)
    this.dataFormInvServiceGroup.get('invServiceGroupId')?.setValue(event.value);
  }
  getService(event: any) {
    this.dataFormInvServiceGroup.get('invServiceId')?.setValue(event.value);
  }
  onBack(event: any) {
    let isShow = true;
    // this.layoutService.getIsShow();

    if (isShow) {
      this.confirmationService.confirm({
        header: "Thông báo",
        target: event.target as EventTarget,
        message: !this.id ? "Chưa hoàn tất thêm mới nhóm dịch vụ, Bạn có muốn Hủy?" : "Chưa hoàn tất sửa nhóm dịch vụ " + this.id + ", Bạn có muốn Hủy?",
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Xác nhận',
        rejectLabel: 'Hủy bỏ',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
        accept: () => {
          this.router.navigate(['/invoice/inv-service-group/list']);
        },
        reject: () => {
          return;
        }
      });
    } else {
      this.router.navigate(['/invoice/inv-service-group/list']);
    }
  }
  onReturnPage(url: string): void {
    this.router.navigate([url]);
  }
  onSubmit() {
    const reqData = Object.assign({}, this.dataFormInvServiceGroup.value);
    console.log(this.TypeServiceConfigCheck);
    reqData.typeServiceConfig = this.TypeServiceConfigCheck;
    reqData.id = this.id;
    reqData.fromDate = this.datePipe.transform(reqData.fromDate, 'yyyy-MM-dd');
    reqData.toDate = this.datePipe.transform(reqData.toDate, 'yyyy-MM-dd');
    reqData.values = this.listServiceConfigDetail;
    this.loading[0] = true;
    this.invServiceConfig.createInvoice(reqData).subscribe(
      (res: any) => {
        this.loading[0] = false;
        if (res?.meta?.error_code == AppStatusCode.StatusCode200) {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.CreatedSuccess });

          setTimeout(() => { this.onReturnPage('/invoice/inv-service-config/list') }, 1000);
        }
        else
          this.messageService.add({ severity: 'warn', summary: 'Warn', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });

      },
      () => {
        this.loading[0] = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest });
      },
      () => {
        this.loading[0] = false;
      }
    );
    
  }
}
