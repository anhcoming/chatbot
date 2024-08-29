import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MenuChangeEvent } from './api/menuchangeevent';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MenuService {
    private sharedData: any;
    private dataSubject: BehaviorSubject<string>;
    private menuSource = new Subject<MenuChangeEvent>();
    private resetSource = new Subject();
    constructor() {
        this.dataSubject = new BehaviorSubject<string>('');
    }
    
    menuSource$ = this.menuSource.asObservable();
    resetSource$ = this.resetSource.asObservable();

    onMenuStateChange(event: MenuChangeEvent) {
        this.menuSource.next(event);
    }
    getDataObservable() {
        return this.dataSubject.asObservable();
    }

    setData(data: any) {
        this.dataSubject.next(data); // Cập nhật giá trị mới cho BehaviorSubject
    }
}
