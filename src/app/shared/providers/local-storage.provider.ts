import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LocalStorageProvider {
    constructor() { }

    public get(key: string): any {
      return localStorage.getItem(key);
    }
    public set(key: string, value: string): void {
      localStorage.setItem(key, value);
    }
    public delete(key: string): void {
      localStorage.removeItem(key);
    }

    public clearAll(): void {
      localStorage.clear();
    }
  }
