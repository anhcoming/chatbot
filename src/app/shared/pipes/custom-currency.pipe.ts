import { CurrencyPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customCurrency'
})

export class CurrencyFormat {
  transform(value: number,
      currencySign: string = '',
      decimalLength: number = 0, 
      chunkDelimiter: string = '.', 
      decimalDelimiter:string = ',',
      chunkLength: number = 3): string {
        if(value == undefined) return '';

      // value /= 100;

      let result = '\\d(?=(\\d{' + chunkLength + '})+' + (decimalLength > 0 ? '\\D' : '$') + ')';
      let num = value.toFixed(Math.max(0, ~~decimalLength));

      return currencySign+(decimalDelimiter ? num.replace('.', decimalDelimiter) : num).replace(new RegExp(result, 'g'), '$&' + chunkDelimiter);
  }
}
