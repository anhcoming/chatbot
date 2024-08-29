import { CookieService } from 'ngx-cookie-service';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CookieProvider {
    constructor(public cookieService: CookieService) { }

    public get(key: string): any {
      return this.cookieService.get(key);
    }
    public set(key: string, value: string, expires?: number | Date, domain?: string): void {
      this.cookieService.set(key, value, expires, '/', domain);
    }
    public delete(key: string): void {
      this.cookieService.delete(key, '/');
    }
    public clearAll(): void {
      this.cookieService.deleteAll();
    }
  }
