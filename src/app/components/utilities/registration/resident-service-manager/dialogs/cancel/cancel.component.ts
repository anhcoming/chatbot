import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CommonService } from 'src/app/services/common.service';
import { AppMessageResponse, AppStatusCode, Gender, RelationshipOption, StatusOption, Staying } from 'src/app/shared/constants/app.constants';
import { Paging } from 'src/app/viewModels/paging';
import { Countries } from 'src/app/viewModels/countries/countries';
import { ResApi } from 'src/app/viewModels/res-api';
import { DatePipe } from '@angular/common';
import  ObjectId from 'bson-objectid';
import { CardRequestService } from 'src/app/services/card-request.service';
import { env } from 'process';

@Component({
  selector: 'app-cancel',
  templateUrl: './cancel.component.html',
  styleUrls: ['./cancel.component.scss']
})
export class CancelComponent {
  public Idr :any;
  public loading = [false];
  constructor(
    private readonly commonService : CommonService,
    private readonly cardrequestService : CardRequestService,
    private readonly messageService : MessageService,
    private  http : HttpClient,
    private readonly fb : FormBuilder,
    private config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    public datePipe : DatePipe
  ){

    this.Idr = this.config.data.Idr;
  }
  ngOnInit() {
    
  }
  onSubmit() {
    this.ref.close();
  }
}
