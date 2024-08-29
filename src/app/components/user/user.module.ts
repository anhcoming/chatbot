import { NgModule } from '@angular/core';
import { AppLayoutModule } from 'src/app/layout/app.layout.module';
import { CommonModule } from '@angular/common';
import { UserInfoComponent } from './user-info/user-info.component';
import { UserChangepassComponent } from './user-changepass/user-changepass.component';
import { UserRoutingModule } from 'src/app/routes/user-routing.module';



@NgModule({
  declarations: [
    UserInfoComponent,
    UserChangepassComponent
  ],
  imports: [
    CommonModule,
    AppLayoutModule,
    UserRoutingModule,
  ],
  providers: [
   
  ]
})
export class UserModule { }
