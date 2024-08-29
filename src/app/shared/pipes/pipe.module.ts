import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterPipe } from './filter.pipe';
import { ShortNamePipe } from './short-name.pipe';
import { CurrencyFormat } from './custom-currency.pipe';
import {
  TypeCashPipe, BidpackageJobStatusPipe, TypeAcceptCashPipe,
  TypeCashAdvancePipe, TypePaymentMethodPipe, TypePaymentStatusPipe,
  ProgressReportTypePipe, TypeContractChildPipe
} from './type-common.pipe';

@NgModule({
  declarations: [FilterPipe, ShortNamePipe, TypePaymentStatusPipe,
    TypeCashAdvancePipe, TypeCashPipe, TypePaymentMethodPipe, TypeAcceptCashPipe,
    ProgressReportTypePipe, BidpackageJobStatusPipe, TypeContractChildPipe, CurrencyFormat],
  imports: [CommonModule],
  exports: [FilterPipe, ShortNamePipe, TypePaymentStatusPipe,
    TypeCashAdvancePipe, TypeCashPipe, TypePaymentMethodPipe, TypeAcceptCashPipe,
    ProgressReportTypePipe, BidpackageJobStatusPipe, TypeContractChildPipe, CurrencyFormat]
})

export class PipeModule { }
