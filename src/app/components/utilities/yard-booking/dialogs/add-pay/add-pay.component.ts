import { Component } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { StorageService } from 'src/app/shared/services/storage.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-pay',
  templateUrl: './add-pay.component.html',
  styleUrls: ['./add-pay.component.scss']
})

export class AddPayComponent {
  public fPay: any;
  public totalPrice: any;
  constructor(
    private readonly messageService: MessageService,
    private readonly fb: FormBuilder,
    private config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private readonly storeService : StorageService,
  ){
    this.fPay = fb.group({

    })
    this.totalPrice = this.config.data.totalPrice;
  }
  ngOnInit(): void {
    console.log(this.totalPrice);
    
  }
  onSubmit() {
    this.ref.close();
  }
}
