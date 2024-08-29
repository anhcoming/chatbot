import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {ShareService} from "../../service/share.service";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {
  hideCurrentPass: boolean = true;
  hideNewPass: boolean = true;
  hideConfirmPass: boolean = true;

  formGroup!: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private shareService:ShareService
  ) { }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.formGroup = this.fb.group({
      CurrentPassword: ['', Validators.required],
      NewPassword: ['', Validators.required],
      ConfirmPassword: ['', Validators.required]
    });
  }

  markAllAsDirty() {
    if (this.formGroup != null) {
      Object.keys(this.formGroup?.controls).forEach(key => {
        const control = this.formGroup?.get(key);
        if (control?.enabled && control?.invalid) {
          control.markAsDirty();
        }
      });
    }
  }

  get isMobile(){
      return this.shareService.isMobile.getValue()
  }

  onSubmit() {
    if (this.formGroup?.invalid) {
      this.markAllAsDirty();
      return;
    }

    console.log("abc");
  }

}
