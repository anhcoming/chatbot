import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { GroupTopicService } from 'src/app/services/groupTopic.service';


@Component({
  selector: 'app-quan-li-nhom-chu-de',
  templateUrl: './quan-li-nhom-chu-de.component.html',
  styleUrls: ['./quan-li-nhom-chu-de.component.scss']
})
export class QuanLiNhomChuDeComponent {
  listDatas: any;
  isLoadingTable: any;

  search: any;
  isInputEmpty: boolean = true;
  visible: boolean = false;
  nameTopic: string = '';
  idTopic: number = 0;
  totalElements: number = 0;
  pageIndex: number = 1;
  pageSize: number = 10;

  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService,
    private readonly _groupTopicService: GroupTopicService,
  ) {

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getGroupTopicByPaging();
  }

  onClearInput() {
    this.search = '';
    this.isInputEmpty = true;
    this.getGroupTopicByPaging();

  }

  onSearch($event: any) {
    this.getGroupTopicByPaging();
  }



  getGroupTopicByPaging() {
    const request = {
      page: this.pageIndex,
      page_size: this.pageSize,
      search: this.search
    }

    this.isLoadingTable = true;
    this._groupTopicService.getListGroupTopicByPaging(request).subscribe(res => {
      if (res.meta.status_code === 200) {
        this.listDatas = res.data;
        this.isLoadingTable = false;
        this.totalElements = res.metadata || 0;
      } else {
        this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: res.meta.status_message });
      }
    });
  }

  onDelete(id: number) {
    this.visible = true;
    const target: any = this.listDatas.find((i: any) => i.id == id);
    this.nameTopic = target?.name;
    this.idTopic = id
  }

  onHideModal() {
    this.visible = false;
  }

  onSubmit() {
    this._groupTopicService.deleteGroupTopicById(this.idTopic).subscribe((res: any) => {
      if (res.meta.status_code === 200) {
        this.messageService.add({ severity: 'success', summary: 'Xóa thành công', detail: '' });
        this.getGroupTopicByPaging();
        this.visible = false;
      } else {
        this.messageService.add({ severity: 'error', summary: 'Có lỗi', detail: '' });
        console.log(res.meta.status_message);
        this.visible = false;
      }
    });
  }

  onPageChange(e: any) {
    this.pageIndex = e.page + 1;
    this.pageSize = e.rows;
    this.getGroupTopicByPaging();
  }
}
