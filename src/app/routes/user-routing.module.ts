import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserInfoComponent } from '../components/user/user-info/user-info.component';
import { UserChangepassComponent } from '../components/user/user-changepass/user-changepass.component';

const routes: Routes = [
  {
    path: 'user-info/:id',
    component: UserInfoComponent,
  },
  {
    path: 'user-changepass/:id',
    component: UserChangepassComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
