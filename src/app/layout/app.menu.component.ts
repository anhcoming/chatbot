import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { StorageService } from '../shared/services/storage.service';
import { StorageData } from '../shared/constants/app.constants';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {
    public menu: any[] = [];
    public lstMenu: any[] = [];
    model: any[] = [];

    constructor(
        public layoutService: LayoutService,
        public storeService: StorageService,
    ) { }

    ngOnInit() {
        this.getListMenu();
    }
    getListMenu() {
        const items = JSON.parse(this.storeService.get(StorageData.listMenus));
        this.menu.push({listMenus: items})
        this.lstMenu = this.menu[0].listMenus;
    }

    testClick(item: any) {
     
    }
}
