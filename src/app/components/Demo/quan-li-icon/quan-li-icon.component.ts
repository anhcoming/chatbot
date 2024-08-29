import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { IconManageService } from 'src/app/services/icon-manage.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-quan-li-icon',
  templateUrl: './quan-li-icon.component.html',
  styleUrls: ['./quan-li-icon.component.scss']
})
export class QuanLiIconComponent {
  search: string = '';
  isInputEmpty: boolean = true;
  listIcon = [];
  visible: boolean = false;
  itemIcon: any;
  nameIcon: string = '';
  totalElements: number = 0;
  pageIndex: number = 1;
  pageSize: number = 10;

  constructor(
    private readonly iconManageService: IconManageService,
    private readonly messageService: MessageService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.getListIconTopic();
  }

  getListIconTopic() {
    const param = {
      page: this.pageIndex,
      page_size: this.pageSize,
      keyWord: this.search
    };

    this.iconManageService.getListIcon(param).subscribe(res => {
      if (res.meta.status_code === 200) {
        this.listIcon = res.data;
        this.totalElements = res.metadata || 0
      } else {
        this.messageService.add({ severity: 'danger', summary: 'Lấy danh sách icon thất bại', detail: '' });
        console.log(res.meta.status_message);
      }
    });
  }

  onSearch(event: any) {
    this.getListIconTopic();
  }

  onClearInput() {}

  onDelete(item: any) {
    this.visible = true;
    this.itemIcon = item;
    this.nameIcon = item.name;
  }

  onHideModal() {
    this.visible = false;
  }

  onSubmit() {
    this.iconManageService.removeIcon(this.itemIcon.id).subscribe(res => {
      console.log(res);
      if (res.meta.status_code === 200) {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message });
        this.getListIconTopic();
        this.visible = false;
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message });
        this.visible = false;
      }
    });
  }

  onPageChange(e: any) {
    this.pageIndex = e.page + 1;
    this.pageSize = e.rows;
    this.getListIconTopic();
  }
}
