import { HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { OrderTransportService } from 'src/app/services/order-transport.service';
import { ProjectService } from 'src/app/services/project.service';
import { AppMessageResponse, AppStatusCode, OrderStatus, StorageData, TypeTransfer } from 'src/app/shared/constants/app.constants';
import { StorageService } from 'src/app/shared/services/storage.service';
import { OrderTransport } from 'src/app/viewModels/order-transport/order-transport';
import { Paging } from 'src/app/viewModels/paging';
import { ResApi } from 'src/app/viewModels/res-api';


@Component({
  selector: 'app-transfer-good',
  templateUrl: './transfer-good.component.html',
  styleUrls: ['./transfer-good.component.scss']
})
export class TransferGoodComponent {
  public filterParrams : Paging ;
  public lstOrderTransport: Array<OrderTransport>;
  public fSearch: FormGroup;
  public menuItems: any;
  public menuCreate : any;
  public selectedTransfer: any;
  public isLoadingTable: boolean = false;
  public loading = [false];
  search!: string;
  public popup: boolean = true;
  public lstTrans : any[];
  id: any;
  Idc: any;
  userId: any;
  
  constructor(
    private readonly projectService : ProjectService,
    private readonly orderTransferService : OrderTransportService,
    private readonly transportService : OrderTransportService,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private readonly fb: FormBuilder,
    private readonly storeService : StorageService,
    private router : Router,
  ){
    this.lstOrderTransport = new Array<OrderTransport>();
    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 100;
    this.lstTrans = []

    this.fSearch = fb.group({
      Type : [''],
      DateStart: [''],
      DateEnd: [''],

    })
    this.menuItems = [{
      label: 'Xóa mục đã chọn', 
      icon: 'pi pi-fw pi-trash',
      command: () => {
        this.onDeletes();
    }}];
    this.menuCreate = [{
      label: 'Chuyển hàng hóa vào', 
      command: () => {
        this.router.navigate(['/utilities/order-transport/create/in']);
    }},
    {
      label: 'Chuyển hàng hóa ra', 
      command: () => {
        this.router.navigate(['/utilities/order-transport/create/out']);
    }}
  ]
  
  }

  ngOnInit() {
    
    this.getListTransfer();
    this.setData();
    this.getCompanyId();
    this.getUserId();
  }

  getCompanyId() {
    this.Idc = this.storeService.get(StorageData.companyId); 
  }
  getUserId() {
    this.userId = this.storeService.get(StorageData.userId); 
  }

  setData() {
    this.lstTrans = TypeTransfer.map(item => ({ Name : item.label, Id: item.value }));
    return TypeTransfer[0].value
  }

  exportExcel() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    
    this.projectService.ExportExcel(this.Idc).subscribe((res: Blob) => {
      const url = window.URL.createObjectURL(res);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'project_data.xlsx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }

  getListTransfer(){
    this.isLoadingTable = true;
    this.transportService.getOrderTransportByPaging(this.filterParrams).subscribe((res: ResApi)=>{
      if(res.meta.error_code = AppStatusCode.StatusCode200){
        this.isLoadingTable = false;
        this.lstOrderTransport = res.data
      } else{
        this.lstOrderTransport = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })
  }

  ShowTypeTransfer(Type : any) {
		let data = TypeTransfer.filter(x => x.value == Type)[0];
		return data != undefined ? data.label : "";
	}
  ShowStatusTransfer(Type:any){
    let data = OrderStatus.filter(x => x.value == Type)[0];
    return data != undefined ? data.label : "";
  }

  toggle(event: any) {
    if(this.popup = true){
      this.popup = false;
    }else{
      this.popup = true
    }
  }
  onSelect(){

  }

  onNew(){
    this.filterParrams.query = `OrderStatus=1`;
    this.getListTransfer();
  }
  onNew2(){
    this.filterParrams.query = `OrderStatus=2`;
    this.getListTransfer();
  }
  onNew3(){
    this.filterParrams.query = `OrderStatus=3`;
    this.getListTransfer();
  }
  onNew4(){
    this.filterParrams.query = `OrderStatus=4`;
    this.getListTransfer();
  }
  onNew5(){
    this.filterParrams.query = `OrderStatus=5`;
    this.getListTransfer();
  }
  onNew6(){
    this.filterParrams.query = `OrderStatus=6`;
    this.getListTransfer();
  }
  onNew7(){
    this.filterParrams.query = `1=1`;
    this.getListTransfer();
  }


  onSelectTransfer(event:any){
    if(event.value == null){
      this.filterParrams.query = '1=1';
      this.getListTransfer();
    } else {
      this.filterParrams.query = `Type=${event.value}`;
      this.getListTransfer();
    }
    this.getListTransfer();
  }

  btnReset() {
    this.router.navigateByUrl('/utilities/order-transport/list').then(() => {
      window.location.reload();
    });
  }
  onSearch(event: any) {
    const searchValue = event.target.value.toLowerCase().trim();
    this.filterParrams.query = `Code.ToLower().Contains("${searchValue}") OR ApartmentName.ToLower().Contains("${searchValue}")`;
    this.getListTransfer();
  }
  onDelete(id: number) {
  
    this.confirmationService.confirm({
      message: 'Bạn có muốn xóa đơn chuyển hàng hóa <b>' +this.lstOrderTransport.filter((i: any) => i.Id == id)[0].Code+' </b> này không?',
      header: 'XÓA ĐƠN CHUYỂN HÀNG HÓA',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xác nhận',
      rejectLabel: 'Hủy bỏ',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.orderTransferService.deleteOrderTransportById(this.Idc, id).subscribe(
          (res: any) => {
            this.loading[0] = false;
            if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
              this.lstOrderTransport = this.lstOrderTransport.filter(s => s.Id !== id);
              this.messageService.add({ severity: 'success', summary: 'Success', detail: res.meta.error_message || AppMessageResponse.CreatedSuccess });
  
              
              //return;
            } else {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
              return;
            }
          }
        );
        
      },
      reject: (type: any) => {
          return;
      }
    });
  }
  onDeletes() {
    this.confirmationService.confirm({
      message: 'Bạn có muốn xóa đơn vận chuyển hàng hóa này không?',
      header: 'XÓA ĐƠN VẬN CHUYỂN HÀNG HÓA',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if(!this.selectedTransfer) {
          this.messageService.add({severity: 'warn', summary: 'Warn', detail: 'Không có mục nào được chọn!'})
        }
        this.orderTransferService.deletesListOrderTransport(this.Idc,this.selectedTransfer).subscribe(
          (res: any) => {
            this.loading[0] = false;
            if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
              this.selectedTransfer.map((item: any) => {
                this.lstOrderTransport = this.lstOrderTransport.filter((s: { Id: number; }) => s.Id !== item.Id);
              })
              this.messageService.add({ severity: 'success', summary: 'Success', detail: res.meta.error_message || AppMessageResponse.CreatedSuccess });              
              //return;
            } else {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
              return;
            }
          }
        );
        
      },
      reject: (type: any) => {
          return;
      }
    });
  }
}

