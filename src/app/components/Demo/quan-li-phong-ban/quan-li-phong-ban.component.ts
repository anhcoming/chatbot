import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DepartmentsServices } from 'src/app/services/departments.service';

@Component({
  selector: 'app-quan-li-phong-ban',
  templateUrl: './quan-li-phong-ban.component.html',
  styleUrls: ['./quan-li-phong-ban.component.scss']
})
export class QuanLiPhongBanComponent {
  search: string = '';
  listDatas: any;
  isLoadingTable: any;
  isInputEmpty: boolean = true;
  visible: boolean = false;
  nameDepartment: string = '';
  idDepartment: number = 0;
  totalElements: number = 0;
  pageIndex: number = 1;
  pageSize: number = 10;


  constructor(
    private readonly _departmentService: DepartmentsServices,
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService,
  ) { }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getDepartmentByPaging();
  }

  onClearInput() {
    this.search = '';
    this.isInputEmpty = true;
    this.getDepartmentByPaging();
  }

  getDepartmentByPaging() {
    const request = {
      page: this.pageIndex,
      page_size: this.pageSize,
      search: this.search
    }

    this.isLoadingTable = true;
    this._departmentService.getListDepartment(request).subscribe(res => {
      if (res.meta.status_code === 200) {
        this.listDatas = res.data;
        this.isLoadingTable = false;
        this.totalElements = res.metadata || 0;
      } else {
        this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: res.meta.status_message });
      }
    });
  }

  onSearch(event: any) {
    this.getDepartmentByPaging();
  }

  onDelete(id: number) {
    this.visible = true;
    const target: any = this.listDatas.find((i: any) => i.id == id);

    this.nameDepartment = target?.name;
    this.idDepartment = id;
  }

  onSubmit() {
    this._departmentService.deleteDepartment(this.idDepartment).subscribe((res: any) => {
      if (res.meta.status_code === 200) {
        this.messageService.add({ severity: 'success', summary: 'Xóa thành công', detail: '' });
        this.getDepartmentByPaging();
        this.hideModal();
      } else {
        this.messageService.add({ severity: 'error', summary: 'Có lỗi', detail: '' });
        console.log(res.meta.status_message);
        this.hideModal();
      }
    });
  }

  hideModal() {
    this.visible = false;
  }

  onPageChange(e: any) {
    this.pageIndex = e.page + 1;
    this.pageSize = e.rows;
    this.getDepartmentByPaging();
  }
}
