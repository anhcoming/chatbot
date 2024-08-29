import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UtilitiesServiceService } from 'src/app/services/utilities-service.service';
import { docmainImage } from 'src/app/shared/constants/api.constants';
import { AppMessageResponse, AppStatusCode, IsShow, IsStatus, StorageData, TypeViewApp } from 'src/app/shared/constants/app.constants';
import { StorageService } from 'src/app/shared/services/storage.service';
import { Paging } from 'src/app/viewModels/paging';
import { ResApi } from 'src/app/viewModels/res-api';
import { UtilitiesService } from 'src/app/viewModels/utilities-service/ultilities-service';

@Component({
  selector: 'app-utilities-service',
  templateUrl: './utilities-service.component.html',
  styleUrls: ['./utilities-service.component.scss']
})
export class UtilitiesServiceComponent {
  public fSearch: FormGroup;
  public filterParrams: Paging;
  public isLoadingTable: boolean = false;
  public lstService : any[] = [];
  lstTypeService = TypeViewApp;
  public loading = [false];
  search: string = '';
  public data = [];
  isInputEmpty: boolean = true;
  userId: any;
  Idc: any;
  public docmainImage = docmainImage;
  constructor(
    private readonly utilitiesService : UtilitiesServiceService,
    private readonly storeService: StorageService,
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService,
    private readonly fb: FormBuilder
  ) {
    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 1000;

    this.fSearch = fb.group({
      Type : [''],
    });
  }

  ngOnInit() {

    this.getListUtilitiesService();
    this.getCompanyId();
    this.getUserId();
  }
  getCompanyId() {
    this.Idc = this.storeService.get(StorageData.companyId);
  }
  getUserId() {
    this.userId = this.storeService.get(StorageData.userId);
  }

  ShowTypeDocument(Type : any) {
		let data = TypeViewApp.filter(x => x.value == Type)[0];
		return data != undefined ? data.label : "";
	}
  ShowStatus(Type : any) {
		let data = IsShow.filter(x => x.value == Type)[0];
		return data != undefined ? data.label : "";
	}

  getListUtilitiesService() {
    let filterUtilities = new Object as Paging;
    this.utilitiesService.getListUtilitiesServiceByPaging(filterUtilities).subscribe((res: ResApi) => {
      if(res.meta.error_code = AppStatusCode.StatusCode200) {
        this.isLoadingTable = false;
        this.data = res.data;
        this.lstService = [...this.data]
      } else {
        this.lstService = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })
  }
  onSelect(event: any) {
    if (event.value == null) {
      this.lstService = [...this.data];
      this.filterParrams.query = '1=1';
    } else {
      this.lstService = this.data.filter((i: any) => i.Type == event.value);
      this.filterParrams.query = `Type=${event.value}`
    }
  }
  onSearch(event: any) {
    const searchValue = event.target.value.toLowerCase().trim();
    this.filterParrams.query = `Name.ToLower().Contains("${searchValue}") OR CardList.ToLower().Contains("${searchValue}")`;
    this.getListUtilitiesService();
  }
  onDelete(id: number) {
  
    this.confirmationService.confirm({
      message: 'Bạn có muốn xóa chức năng <b>' +this.lstService.filter((i: any) => i.Id == id)[0].Name+' </b> này không?',
      header: 'XÓA CHỨC NĂNG',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xác nhận',
      rejectLabel: 'Hủy bỏ',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.messageService.add({severity: 'error', summary:'Error', detail: 'Phần này không được xóa nhé ^_- !'});
        return;
        // this.utilitiesService.deleteUtilitiesServiceById(id).subscribe(
        //   (res: any) => {
        //     this.loading[0] = false;
        //     if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
        //       this.lstService = this.lstService.filter(s => s.Id !== id);
        //       this.messageService.add({ severity: 'success', summary: 'Success', detail: res.meta.error_message || AppMessageResponse.CreatedSuccess });
  
              
        //       //return;
        //     } else {
        //       this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
        //       return;
        //     }
        //   }
        // );
        
      },
      reject: (type: any) => {
          return;
      }
    });
  }
}
