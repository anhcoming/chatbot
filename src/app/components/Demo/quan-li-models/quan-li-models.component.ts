import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ModelsService } from 'src/app/services/models.service';

@Component({
    selector: 'app-quan-li-models',
    templateUrl: './quan-li-models.component.html',
    styleUrls: ['./quan-li-models.component.scss']
})
export class QuanLiModelsComponent {
    search: string = '';
    isInputEmpty: boolean = true;
    listDatas: any;
    isLoadingTable: any;
    visible: boolean = false;
    nameModel: string = '';
    idModel: any;
    totalElements: number = 0;
    pageIndex: number = 1;
    pageSize: number = 10;
    constructor(
        private readonly _modelService: ModelsService,
        private readonly confirmationService: ConfirmationService,
        private readonly messageService: MessageService,
    ) {

    }

    ngOnInit(): void {
        this.getModelsByPaging();
    }

    onClearInput() {
        this.search = '';
        this.isInputEmpty = true;
        this.getModelsByPaging();
    }

    getModelsByPaging() {
        const request = {
            page: this.pageIndex,
            page_size: this.pageSize,
            search: this.search
        }
        this.isLoadingTable = true;
        this._modelService.getListModelsByPaging(request).subscribe(res => {
            this.listDatas = res.data;
            this.isLoadingTable = false;
            this.totalElements = res.metadata || 0;
        });
    }

    onSearch($event: any) {
        this.getModelsByPaging();
    }

    onDelete(id: number) {
        this.visible = true;
        const target: any = this.listDatas.find((i: any) => i.id == id);
        this.nameModel = target?.name;
        this.idModel = id;
    }

    closeModal() {
        this.visible = false;
    }

    confirmRemove() {
        this._modelService.deleteModel(this.idModel).subscribe((res: any) => {
            if (res.meta.status_code === 200) {
                this.messageService.add({ severity: 'success', summary: 'Xóa thành công', detail: '' });
                this.getModelsByPaging();
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
        this.getModelsByPaging();
    }
}
