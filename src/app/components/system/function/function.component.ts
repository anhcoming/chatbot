import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ResApi } from 'src/app/viewModels/res-api';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { AppMessageResponse, AppStatusCode } from 'src/app/shared/constants/app.constants';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Function } from 'src/app/viewModels/function/function';
import { FunctionService } from 'src/app/services/function.service';
import { Paging } from 'src/app/viewModels/paging';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-function',
  templateUrl: './function.component.html',
  styleUrls: ['./function.component.scss']
})
export class FunctionComponent {
  public filterParrams: Paging;
  public lstFunction!: Array<Function>;
  public lstFunctionPerant!: Array<Function>;
  public first = 0;
  public rows = 10;
  search: string = '';
  isInputEmpty: boolean = true;
  data = [];
  deletedIds = [];
  deleting = false;
  type: any;
  public itemFunc: Function;

  public fFunction: FormGroup;

  public lstFunc: any[];

  public filterFunc: Paging;
  public loading = [false];
  public isLoadingTable: boolean = false;
  visible: boolean = false;
  nameRole: string = '';
  idRole: any;
  checked: boolean = true;
  totalElements: number = 0;

  constructor(
    private readonly functionService: FunctionService,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private modalService: NgbModal,
    private readonly fb: FormBuilder,
    //private readonly customerService: CustomerService
  ) {
    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 100;

    this.lstFunction = new Array<Function>();
    this.itemFunc = new Function();

    this.filterFunc = new Object as Paging;

    this.lstFunc = [];

    this.fFunction = fb.group({
      FunctionId: ['', Validators.required],
      Code: ['', Validators.required],
      Url: ['', Validators.required],
      Name: ['', Validators.required],
      Location: ['', Validators.required],
      FunctionPerantId: ['',],
      functionParent: ['',],
      Note: ['',]

    })
  }

  ngOnInit() {
    this.getListFunctionByPaging();
  }
  getListFunctionByPaging() {
    this.isLoadingTable = true;

    this.functionService.getListFunctionByPaging(this.filterParrams).subscribe((res: any) => {
      this.isLoadingTable = false;

      if (res.meta.status_code == AppStatusCode.StatusCode200) {
        this.lstFunction = res.data;
        this.totalElements = res.metadata || 0;
      }
      else {
        this.lstFunction = new Array<Function>();
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.status_message || AppMessageResponse.BadRequest });
      }

    },
      () => {
        this.isLoadingTable = false;

        this.lstFunction = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest });
      })
  }
  onDelete(id: number, index: number) {
    this.visible = true;
    var target: any = this.lstFunction.find((i: any) => i.id == id);
    this.nameRole = target?.name;
    this.idRole = id;
  }

  onSearch(event: any) {
    const searchValue = event.target.value.toLowerCase().trim();
    this.filterParrams.query = `Name.ToLower().Contains("${searchValue}") OR Code.ToLower().Contains("${searchValue}")`;
    this.getListFunctionByPaging();
  }

  onClearInput() {
    this.search = '';
    this.isInputEmpty = true;
    this.filterParrams.query = `Name.ToLower().Contains("${this.search}") OR Code.ToLower().Contains("${this.search}")`;
    this.getListFunctionByPaging();
  }

  closeModal() {
    this.visible = false;
  }

  confirmRemove() {
    this.functionService.deleteFunctionById(this.idRole).subscribe(
      (res: any) => {
        this.loading[0] = false;
        if (res && res.meta && res.meta.status_code == AppStatusCode.StatusCode200) {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: res.meta.status_message || AppMessageResponse.CreatedSuccess });
          this.visible = false;
          this.getListFunctionByPaging();
          //return;
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.status_message || AppMessageResponse.BadRequest });
          this.visible = false;
          return;
        }
      }
    );

  }

  onPageChange(e: any) {
    this.filterParrams.page = e.page + 1;
    this.filterParrams.page_size = e.rows;
    this.getListFunctionByPaging();
  }
}
