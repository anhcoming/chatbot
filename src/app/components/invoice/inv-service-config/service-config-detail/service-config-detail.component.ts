import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';


@Component({
  selector: 'app-service-config-detail',
  templateUrl: './service-config-detail.component.html',
  styleUrls: ['./service-config-detail.component.scss']
})
export class ServiceConfigDetailComponent implements OnInit {
  check: boolean = false;
  public data: any;
  public dataDetail: any;
  constructor(
    private config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private readonly fb: FormBuilder,

  ) {
    this.dataDetail = this.fb.group({
      idRow: this.config.data.Id,
      invServiceConfigId: undefined,
      isOnePrice: undefined,
      des: undefined,
      quota: undefined,
      price: undefined,
      surchargePer: undefined,
      surchargeValue: undefined,

    })
    this.data = this.config.data.data;
  }

  ngOnInit(): void {
    if (this.data != undefined) {
      this.dataDetail = this.fb.group({
        idRow: this.config.data.Id,
        invServiceConfigId: this.data.invServiceConfigId,
        isOnePrice: this.data.isOnePrice,
        des: this.data.des,
        quota: this.data.quota,
        price: this.data.price,
        surchargePer: this.data.surchargePer,
        surchargeValue: this.data.surchargeValue,
      })
      this.check=this.dataDetail.value.isOnePrice
    }

  }

}
