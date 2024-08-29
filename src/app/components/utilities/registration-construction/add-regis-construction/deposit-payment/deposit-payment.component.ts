import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-deposit-payment',
  templateUrl: './deposit-payment.component.html',
  styleUrls: ['./deposit-payment.component.scss']
})
export class DepositPaymentComponent {
  fPayment: any;
  id : any;
  loading = [false]
  constructor(
    private readonly fb : FormBuilder,
    public ref : DynamicDialogRef,
  ){
    this.fPayment = this.fb.group({
      Name : [''],
      Payment : [''],
      DatePayment : [''],
      Money : [''],
    })
  }
  onSubmit(){}
  onBack(){
    this.ref.close();
  }
}
