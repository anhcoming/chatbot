import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { GroupTopicService } from 'src/app/services/groupTopic.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeUnitService } from 'src/app/services/employee-unit.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmModalComponent } from 'src/app/components/commons/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-cau-hinh-nhan-vien',
  templateUrl: './cau-hinh-nhan-vien.component.html',
  styleUrls: ['./cau-hinh-nhan-vien.component.scss']
})
export class CauHinhNhanVienComponent {
  products: any;
  selectedItems: any;
  isLoadingTable: boolean = false;

  groupTopics: any;
  seletecTopic: any;
  codeEmployee: number = 0;
  userName: string = '';
  dialogRef: DynamicDialogRef | undefined;
  totalElements: number = 0;
  pageIndex: number = 1;
  pageSize: number = 10;

  constructor(
    private readonly _groupTopicSerivice: GroupTopicService,
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService,
    private readonly router: Router,
    private route: ActivatedRoute,
    private employeeUnit: EmployeeUnitService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.codeEmployee = Number(params.get('id'));
    });
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getEmployeeById();
    this.getGroupTopicByPaging();
  }

  getEmployeeById() {
    this.employeeUnit.getGroupTopicByEI(this.codeEmployee).subscribe(res => {
      if (res.meta.status_code === 200) {
        const data = res.data;
        this.userName = data.accountName;
      } else {
        this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: res.meta.status_message });
      }
    });
  }

  getGroupTopicByPaging() {
    const request = {
      page: this.pageIndex,
      page_size: this.pageSize,
      search: ''
    };

    this.isLoadingTable = true;
    this._groupTopicSerivice.getListGroupTopicByPaging(request).subscribe(res => {
      if (res.meta.status_code === 200) {
        this.groupTopics = res.data;
        this.isLoadingTable = false;
        this.totalElements = res.metadata || 0;
      } else {
        this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: res.meta.status_message });
      }
    });
  }

  onBack(event: Event) {
    let isShow = true;

    if (isShow) {
      this.dialogRef = this.dialogService.open(ConfirmModalComponent, {
        header: 'Dừng cấu hình',
        data: {
          content: 'Xác nhận dừng cấu hình chủ đề nhân viên',
          name: '',
          isModalRemove: false
        },
        width: '18%',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000
      });
      this.dialogRef.onClose.subscribe(result => {
        if (result) {
          if (result.confirm) {
            this.router.navigate(['/demo/employee']);
          } else {
            return;
          }
        }
      });
    } else {
      this.router.navigate(['/demo/employee']);
    }
  }

  onSubmit() {
    const idTopicSelected = this.seletecTopic.map((el: any) => el.id);
    const param = {
      Id: this.codeEmployee,
      GroupTopicIds: idTopicSelected
    };

    this.employeeUnit.updateTopicByUserId(this.codeEmployee, param).subscribe(res => {
      if (res.meta.status_code === 200) {
        this.router.navigate(['/demo/employee']);
        setTimeout(() => {
          this.messageService.add({ severity: 'success', summary: 'Thành công', detail: res.meta.status_message });
        }, 600);
      } else {
        this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: res.meta.status_message });
      }
    });
  }

  onPageChange(e: any) {
    this.pageIndex = e.page + 1;
    this.pageSize = e.rows;
    this.getGroupTopicByPaging();
  }
}
