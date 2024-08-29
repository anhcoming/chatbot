import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { TypePayment } from 'src/app/shared/constants/app.constants';

@Component({
  selector: 'app-construction-unit',
  templateUrl: './construction-unit.component.html',
  styleUrls: ['./construction-unit.component.scss']
})
export class ConstructionUnitComponent {
  fDepositAdditional : any;
  methodPayment  = TypePayment;
  loading = [false];

  id : any;

  constructor(
    private readonly fb : FormBuilder,
    private ref : DynamicDialogRef,
  ){
    this.fDepositAdditional = this.fb.group({
      Code : [''],
    
    })
  }

  ngOnInit(){

  }
  onSubmit(){}
  onBack(){
    this.ref.close();
  }
}
