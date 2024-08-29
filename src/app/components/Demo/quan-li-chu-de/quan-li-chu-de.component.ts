import { Component } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { TopicService } from 'src/app/services/topic.service';

@Component({
  selector: 'app-quan-li-chu-de',
  templateUrl: './quan-li-chu-de.component.html',
  styleUrls: ['./quan-li-chu-de.component.scss']
})
export class QuanLiChuDeComponent {
  isInputEmpty: boolean = true
  search: any;
  listDatas: any;
  isLoadingTable: any;
  nameTopic: string = '';
  idTopic: any;
  visible: boolean = false;
  pageIndex: number = 1;
  pageSize: number = 10;
  totalElements: number = 0;

  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly _topicService: TopicService,
  ) {
  }

  ngOnInit(): void {
    this.getTopicByPaging();
  }

  getTopicByPaging() {
    const request = {
      page: this.pageIndex,
      page_size: this.pageSize,
      code: this.search
    }
    this._topicService.getTopicByPaing(request).subscribe((res: any) => {
      if (res.meta.status_code === 200) {
        this.listDatas = res.data;
        this.totalElements = res.metadata || 0;
      } else {
        console.log(res.meta.status_message);
      }
    });
  }


  onDelete(id: number, index: number) {
    this.visible = true;
    const target: any = this.listDatas.find((i: any) => i.id == id);
    this.nameTopic = target?.name;
    this.idTopic = id;
  }

  onSearch($event: any) {
    this.getTopicByPaging();
  }

  onHideModal() {
    this.visible = false;
  }

  onSubmit() {
    this._topicService.deleteTopic(this.idTopic).subscribe((res: any) => {
      if (res.meta.status_code == 200) {
        this.visible = false;
        this.getTopicByPaging();
      } else {
        this.visible = false;
        console.log(res.meta.status_message);
      }
    });
  }

  onPageChange(e: any) {
    this.pageIndex = e.page + 1;
    this.pageSize = e.rows;
    this.getTopicByPaging();
  }
}
