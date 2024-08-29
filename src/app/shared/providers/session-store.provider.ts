import { Injectable } from '@angular/core';
import { SessionService } from '../services/session.service';

@Injectable({
    providedIn: 'root'
})
export class SessionStorageProvider {
    constructor() { }

    public get(key: string): any {
      return sessionStorage.getItem(key);
    }
    public set(key: string, value: string): void {
      sessionStorage.setItem(key, value);
    }
    public delete(key: string): void {
      sessionStorage.removeItem(key);
    }

    public clearAll(): void {
      sessionStorage.clear();
    }
  }
