import { MenuItem } from 'primeng/api';
import { Component,Input } from '@angular/core';
import { MenuService } from './app.menu.service';
import { LayoutService } from './service/app.layout.service';
import { StorageService } from '../shared/services/storage.service';
import { StorageData } from '../shared/constants/app.constants';

@Component({
  selector: 'app-app-beadcrumb',
  templateUrl: './app-beadcrumb.component.html'
})
export class AppBeadcrumbComponent {
  @Input() Emiter:any
  public items: any[]=[];
  public home: MenuItem;
  selectedItem: any;
  trimmedUrl: any;
  public menu: any[]=[];
  constructor(
    private menuService: MenuService,
    public layoutService: LayoutService,
    public storeService: StorageService,
    ) {
    this.selectedItem = localStorage.getItem('itemMenu');
    this.home = {} as MenuItem;
    this.items = JSON.parse(this.selectedItem);
  }

  ngOnInit() {
    const items = JSON.parse(this.storeService.get(StorageData.listMenus));
    this.menu.push({listMenus: items})

    var hostHref = window.location.href;
    this.trimmedUrl = hostHref.replace("http://localhost:4200/#", "");

    console.log(this.menu);
    this.items = []
    this.menu.map((item: any) => {
      item.listMenus.map((subItem: any) => {
        if (subItem.listMenus.length) {
          subItem.listMenus.map((nestedItem: any) => {
            if (nestedItem.Url === this.trimmedUrl) {
              this.items.push({ label: item.Name }, { label: subItem.Name }, { label: nestedItem.Name });
              this.items = this.items.filter((item) => item.label !== undefined);
            }
            if(nestedItem.listMenus.length) {
              nestedItem.listMenus.map((items: any) => {
                if(items.Url === this.trimmedUrl) {
                this.items.push({ label: item.Name }, { label: subItem.Name }, { label: nestedItem.Name }, { label: items.Name });
                console.log(this.items);
                
                this.items = this.items.filter((item) => item.label !== undefined);
                }
              })
            }
            
          });
        }
    
        if (subItem.Url === this.trimmedUrl) {
          this.items.push({ label: item.Name }, { label: subItem.Name });
          this.items = this.items.filter((item) => item.label !== undefined);
        }
      });
    
      if (item.Url === this.trimmedUrl) {
        this.items.push({ label: item.Name });
        this.items = this.items.filter((item) => item.label !== undefined);
      }
    });


    this.menuService.getDataObservable().subscribe((data) => {
      if(data){
        this.items = JSON.parse(data);
      } // Cập nhật giá trị từ BehaviorSubject khi có sự thay đổi
    });
    this.home = { icon: 'pi pi-home', routerLink: '/' };
  }
}
