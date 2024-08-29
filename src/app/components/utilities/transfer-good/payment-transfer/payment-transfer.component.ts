import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CompanyService } from 'src/app/services/company.service';
import { StorageData } from 'src/app/shared/constants/app.constants';
import { StorageService } from 'src/app/shared/services/storage.service';

@Component({
  selector: 'app-payment-transfer',
  templateUrl: './payment-transfer.component.html',
  styleUrls: ['./payment-transfer.component.scss']
})
export class PaymentTransferComponent {
  fPayment : FormGroup;
  itemPayment!: any[];
  goodId : any;
  public loading  = [false];
  id: any;
  userId: any;
  Idc: any;
  constructor(
    private readonly companyService: CompanyService,
    private readonly storeService : StorageService,
    public ref: DynamicDialogRef,
    public dialogService : DialogService,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private readonly route: ActivatedRoute,
    private router: Router,
    private readonly fb: FormBuilder,
  ){
    this.fPayment = this.fb.group({
      Id:  [0],
      Status: [0],
      CreatedById: this.userId,
      UpdatedById: this.userId,
      TypeAttribuiteParentId: [null],
      CompanyId: [0],
      Name: ['' , Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(150)])],
      Payment : [''],
      DatePayment: [''],
      Debt: [''],
    });
  }

  ngOnInit(): void {

    this.fPayment = this.fb.group({
      Id:  [0],
      Status: [0],
      CreatedById: this.userId,
      UpdatedById: this.userId,
      TypeAttribuiteParentId: [null],
      CompanyId: [0],
      Name: ['' , Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(150)])],
      Payment : [''],
      DatePayment: [''],
      Debt: [''],
    });
  }
  onBack(){
    this.ref.close();
  }
  onSubmit(){

  }
  getUserId() {
    this.userId = this.storeService.get(StorageData.userId); 
  }
  getCompanyId() {
    this.Idc = this.storeService.get(StorageData.companyId); 
  }
}
