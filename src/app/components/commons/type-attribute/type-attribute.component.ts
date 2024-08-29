import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService, ConfirmationService } from 'primeng/api';
import { CommonService } from 'src/app/services/common.service';
import { ProvincesService } from 'src/app/services/provinces.service';
import { AppStatusCode, AppMessageResponse } from 'src/app/shared/constants/app.constants';
import { Paging } from 'src/app/viewModels/paging';
import { Provinces } from 'src/app/viewModels/provinces/provinces';
import { ResApi } from 'src/app/viewModels/res-api';
import { TypeAttribute } from 'src/app/viewModels/type-attribute/type-attribute';

@Component({
  selector: 'app-type-attribute',
  templateUrl: './type-attribute.component.html',
  styleUrls: ['./type-attribute.component.scss']
})
export class TypeAttributeComponent implements OnInit {
  public filterParrams : Paging ;
  public lstProvinces!: Array<Provinces>;
  public lstTypeAttribute: Array<TypeAttribute>;
  public first = 0;
  public rows = 10;
  search: string = '';
  isInputEmpty: boolean = true;
  data = [];
  public loading = [false];
  public isLoadingTable: boolean = false;
  positions = [];
  departments = [];

  constructor(
    private readonly commonService: CommonService,
    private readonly messageService: MessageService,
    private readonly provincesService: ProvincesService,
    private readonly confirmationService: ConfirmationService,
    private modalService: NgbModal,
    private readonly fb: FormBuilder,
    //private readonly customerService: CustomerService
  ) {
    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 100;

    this.lstProvinces = new Array<Provinces>();
    this.lstTypeAttribute = new Array<TypeAttribute>();

  }

  ngOnInit() {
    this.getListTypeAttributeByPaging();
}
getListTypeAttributeByPaging() {
  this.isLoadingTable = false;

  this.commonService.getListTypeAttributeByPaging(this.filterParrams).subscribe((res: ResApi) => {
    this.isLoadingTable = false;

    if(res.meta.error_code == AppStatusCode.StatusCode200) {
      this.lstTypeAttribute = res.data;
      
    }
    else {
      this.lstTypeAttribute = [];
      this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
    }
    
  },
  () => {
    this.isLoadingTable = false;

    this.lstTypeAttribute = [];
    this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest });
  })
}

  onSearch(event: any) {
    const searchValue = event.target.value.toLowerCase().trim();
    this.filterParrams.query = `Name.ToLower().Contains("${searchValue}") OR Code.ToLower().Contains("${searchValue}")`;
    this.getListTypeAttributeByPaging();
  }
  onClearInput() {
    this.search = '';
    this.isInputEmpty = true;
    this.filterParrams.query = `Name.ToLower().Contains("${this.search}") OR Code.ToLower().Contains("${this.search}")`;
    this.getListTypeAttributeByPaging();
  }

}
