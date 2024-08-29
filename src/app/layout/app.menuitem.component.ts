import { ChangeDetectorRef, Component, Host, HostBinding, Input, Output, OnDestroy, OnInit, EventEmitter } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { MenuService } from './app.menu.service';
import { LayoutService } from './service/app.layout.service';
import { StorageService } from '../shared/services/storage.service';
import { StorageData } from '../shared/constants/app.constants';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: '[app-menuitem]',
    template: `
        <ng-container>
            <div *ngIf="root && item.visible !== false" class="layout-menuitem-root-text">{{item.Name}}</div>
			<a *ngIf="(!item.Url && !item.listMenu) && item.visible !== false" [attr.href]="item.url" (click)="itemClick($event)"
			   [ngClass]="item.class" [attr.target]="item.target" tabindex="0" pRipple>
				<i [ngClass]="item.Icon" class="layout-menuitem-icon"></i>
				<span class="layout-menuitem-text">{{item.Name}}</span>
				<i class="pi pi-fw pi-angle-down layout-submenu-toggler" *ngIf="item.listMenus"></i>
			</a>
			<a *ngIf="(item.Url) && item.visible !== false && item.redirect === false" (click)="itemClick($event)" [ngClass]="item.class" 
			   [routerLink]="item.Url" routerLinkActive="active-route" [routerLinkActiveOptions]="item.routerLinkActiveOptions||{ paths: 'exact', queryParams: 'ignored', matrixParams: 'ignored', fragment: 'ignored' }"
               [fragment]="item.fragment" [queryParamsHandling]="item.queryParamsHandling" [preserveFragment]="item.preserveFragment" 
               [skipLocationChange]="item.skipLocationChange" [replaceUrl]="item.replaceUrl" [state]="item.state" [queryParams]="item.queryParams"
               [attr.target]="item.target" tabindex="0" pRipple>
				<i [ngClass]="item.Icon" class="layout-menuitem-icon"></i>
				<span class="layout-menuitem-text">{{item.Name}}</span>
			</a>

            <a *ngIf="item.redirect === true" target="_blank" [href]="item.Url" [ngClass]="item.class" pRipple>
				<i [ngClass]="item.Icon" class="layout-menuitem-icon"></i>
				<span class="layout-menuitem-text">{{item.Name}}</span>
			</a>

			<ul *ngIf="item.listMenus && item.visible !== false" [@children]="submenuAnimation">
				<ng-template ngFor let-child let-i="index" [ngForOf]="item.listMenus">
					<li app-menuitem [item]="child" [index]="i" [parentKey]="key" [class]="child.badgeClass"></li>
				</ng-template>
			</ul>
		</ng-container>
    `,
    animations: [
        trigger('children', [
            state('collapsed', style({
                height: '0'
            })),
            state('expanded', style({
                height: '*'
            })),
            transition('collapsed <=> expanded', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
        ])
    ]
})
export class AppMenuitemComponent implements OnInit, OnDestroy {

    @Input() item: any;

    @Input() index!: number;

    @Input() @HostBinding('class.layout-root-menuitem') root!: boolean;

    @Input() parentKey!: string;
    @Output() eventEmitter: EventEmitter<any> = new EventEmitter();
    active = false;

    menuSourceSubscription: Subscription;

    menuResetSubscription: Subscription;

    key: string = "";
    public Menu: any[] = [];
    public menuItem: any;
    public Items: any;
    constructor(public layoutService: LayoutService, private cd: ChangeDetectorRef, public router: Router, public storeService: StorageService, private menuService: MenuService) {
        this.menuSourceSubscription = this.menuService.menuSource$.subscribe(value => {
            Promise.resolve(null).then(() => {
                if (value.routeEvent) {
                    this.active = (value.key === this.key || value.key.startsWith(this.key + '-')) ? true : false;
                }
                else {
                    if (value.key !== this.key && !value.key.startsWith(this.key + '-')) {
                        this.active = false;
                    }
                }
            });
        });

        this.menuResetSubscription = this.menuService.resetSource$.subscribe(() => {
            this.active = false;
        });

        this.router.events.pipe(filter(event => event instanceof NavigationEnd))
            .subscribe(params => {
                if (this.item.routerLink) {
                    this.updateActiveStateFromRoute();
                }
            });
    }

    ngOnInit() {
        this.key = this.parentKey ? this.parentKey + '-' + this.index : String(this.index);
        if (this.item.routerLink) {
            this.updateActiveStateFromRoute();
        }
        this.getListMenu()
    }
    getListMenu() {
        const items = JSON.parse(this.storeService.get(StorageData.listMenus));
        this.Menu.push(items)
    }
    updateActiveStateFromRoute() {
        let activeRoute = this.router.isActive(this.item.routerLink[0], { paths: 'exact', queryParams: 'ignored', matrixParams: 'ignored', fragment: 'ignored' });
        if (activeRoute) {
            this.menuService.onMenuStateChange({ key: this.key, routeEvent: true });
        }
    }
    itemClick(event: Event) {
        // avoid processing disabled items
        if (this.item.disabled) {
            event.preventDefault();
            return;
        }
        // execute command
        if (this.item.command) {
            this.item.command({ originalEvent: event, item: this.item });
        }
        // toggle active state
        if (this.item.listMenus) {
            this.active = !this.active;
        }
        this.menuService.onMenuStateChange({ key: this.key });
        
        this.onItemChange()
    }
    get submenuAnimation() {
        return this.root ? 'expanded' : (this.active ? 'expanded' : 'collapsed');
    }
    @HostBinding('class.active-menuitem') 
    get activeClass() {
        return this.active && !this.root;
    }
    ngOnDestroy() {
        if (this.menuSourceSubscription) {
            this.menuSourceSubscription.unsubscribe();
        }
        if (this.menuResetSubscription) {
            this.menuResetSubscription.unsubscribe();
        }
    }
    onItemChange(): void {
        this.Menu[0].map((item: any) => {
            item.listMenus.map((items: any) => {
                if(items.MenuId == this.item.MenuId){
                    this.menuItem = [{label: item.Name},{label: this.item.Name}]
                }
                items.listMenus.map((i: any) => {
                    if(i.MenuId == this.item.MenuId){
                        this.menuItem = [{label: item.Name},{label: items.Name},{label: this.item.Name}]
                    }
                })
            })
        })
        if (this.item) {
            if(!this.menuItem){
                this.menuItem = [{label: this.item.Name}]
                localStorage.setItem('itemMenu', JSON.stringify(this.menuItem));
                this.menuService.setData(JSON.stringify(this.menuItem))
            }else{
                localStorage.setItem('itemMenu', JSON.stringify(this.menuItem));
                this.menuService.setData(JSON.stringify(this.menuItem))
            }
        }else{
            this.menuItem = [{label: 'Dashboard'}]
            localStorage.setItem('itemMenu', JSON.stringify(this.menuItem));
            this.menuService.setData(JSON.stringify(this.menuItem))
        }
    }
}
