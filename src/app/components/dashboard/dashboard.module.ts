import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { ChartModule } from 'primeng/chart';
import { DashboardsRoutingModule } from '../../routes/dashboard-routing.module';
import { AppLayoutModule } from 'src/app/layout/app.layout.module';

@NgModule({
    imports: [
        CommonModule,
        AppLayoutModule,
        ChartModule,
        DashboardsRoutingModule
    ],
    declarations: [DashboardComponent]
})
export class DashboardModule { }
