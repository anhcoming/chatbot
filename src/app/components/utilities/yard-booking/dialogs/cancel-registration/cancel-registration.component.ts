import { Component } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { StorageService } from 'src/app/shared/services/storage.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-cancel-registration',
  templateUrl: './cancel-registration.component.html',
  styleUrls: ['./cancel-registration.component.scss']
})
export class CancelRegistrationComponent {
  public fPay: any;
  public id: any;
  constructor(
    private readonly messageService: MessageService,
    private readonly fb: FormBuilder,
    private config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private readonly storeService : StorageService,
  ){
    this.fPay = fb.group({

    })
    this.id = this.config.data.id;
  }
  ngOnInit(): void {
    console.log(this.id);
    
  }
  onSubmit() {
    this.ref.close();
  }
}
