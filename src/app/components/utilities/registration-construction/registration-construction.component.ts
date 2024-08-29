import { HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { OrderconstructionService } from 'src/app/services/orderconstruction.service';
import { ProjectService } from 'src/app/services/project.service';
import { AppMessageResponse, AppStatusCode, ListOrder, ListOrderStatus, OrderConstructionStatus, OrderStatus, StatusPayment, StorageData } from 'src/app/shared/constants/app.constants';
import { StorageService } from 'src/app/shared/services/storage.service';
import { OrderConstruction } from 'src/app/viewModels/orderconstruction/orderconstruction';
import { Paging } from 'src/app/viewModels/paging';
import { ResApi } from 'src/app/viewModels/res-api';

@Component({
  selector: 'app-registration-construction',
  templateUrl: './registration-construction.component.html',
  styleUrls: ['./registration-construction.component.scss']
})
export class RegistrationConstructionComponent {
  fSearch : any
  menuItems : MenuItem[] = []
  lstOrder: any;
  public selectedContructs : any;
  lstOrderStatus: any;
  public filterParrams : Paging;
  idFrozen : boolean = true;
  public lstConstruction : Array<OrderConstruction>;
  public search : string = '';
  loading = [false];
  isLoadingTable : boolean = false;
  Idc: any;
  userId: any;
  id: any;
 fullURL: string = window.location.href;


  constructor(
    private readonly projectService : ProjectService,
    private readonly constructionService : OrderconstructionService,
    private readonly fb : FormBuilder,
    private readonly confirmationService : ConfirmationService,
    private readonly storeService : StorageService,
    private readonly router : Router,
    private readonly route: ActivatedRoute,
    private readonly messageService : MessageService,
  ){
    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 100;
    this.lstConstruction = new Array<OrderConstruction>;
    this.fSearch = this.fb.group({
      DateStart : [''],
      DateEnd : [''],
      Type: [''],
    })

    this.menuItems = [{
      label: 'Xóa mục đã chọn', 
      icon: 'pi pi-fw pi-trash',
      command: () => {
        this.onDeletes();
    }}];
  }
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
    });

    console.log(this.fullURL);
   

    this.getCompanyId();
    this.getUserId();
    this.getLstOrderConstructionByPaging();
    this.setData();
    this.setDataStatus();
  }

  
  getCompanyId() {
    this.Idc = this.storeService.get(StorageData.companyId); 
  }
  getUserId() {
    this.userId = this.storeService.get(StorageData.userId); 
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

  onNew(){
    this.filterParrams.query = `OrderStatus=1`;
    this.getLstOrderConstructionByPaging();
  }
  onNew2(){
    this.filterParrams.query = `OrderStatus=2`;
    this.getLstOrderConstructionByPaging();
  }
  onNew3(){
    this.filterParrams.query = `OrderStatus=3`;
    this.getLstOrderConstructionByPaging();
  }
  onNew4(){
    this.filterParrams.query = `OrderStatus=4`;
    this.getLstOrderConstructionByPaging();
  }
  onNew5(){
    this.filterParrams.query = `OrderStatus=5`;
    this.getLstOrderConstructionByPaging();
  }
  onNew6(){
    this.filterParrams.query = `OrderStatus=6`;
    this.getLstOrderConstructionByPaging();
  }
  onNew7(){
    this.filterParrams.query = `1=1`;
    this.getLstOrderConstructionByPaging();
  }

  getLstOrderConstructionByPaging() {
    this.isLoadingTable = true;

    this.constructionService.getOrderConstructionByPaging(this.filterParrams).subscribe((res: ResApi) => {
      this.isLoadingTable = false;

      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstConstruction = res.data;
      }
      else {
        this.lstConstruction = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    },
    () => {
      this.isLoadingTable = false;
      this.lstConstruction = [];
      this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest });
    })
  }


  onSelect(){

  }

  onSelectOrder(event:any){

  }
  onSelectOrderStatus(event:any){

  }
  setData() {
    this.lstOrder = ListOrder.map(item => ({ Name : item.label, Id: item.value }));
    return this.lstOrder[0].value
  }

  setDataStatus() {
    this.lstOrderStatus = ListOrderStatus.map(item => ({ Name : item.label, Id: item.value }));
    return this.lstOrderStatus[0].value
  }


  btnReset() {
    this.router.navigateByUrl('/utilities/construction/list').then(() => {
      window.location.reload();
    });
  }
  onSearch(event:any){
    this.filterParrams.query =  `Code.ToLower().Contains("${this.search}")`;
    this.getLstOrderConstructionByPaging();
  }


  ShowStatusConstruction(Type:any){
    let data = OrderConstructionStatus.filter(x => x.value == Type)[0];
    return data != undefined ? data.label : "";
  }
  ShowStatusDeposit(Idc:number){
    let data = StatusPayment.filter(x => x.Id == Idc)[0];
    return data != undefined ? data.Name : "";
  }
  


  onDelete(id: string) {
  
    this.confirmationService.confirm({
      message: 'Bạn có muốn xóa đơn đăng ký thi công <b>' +this.lstConstruction.filter((i: any) => i.Id == id)[0].Code+' </b> này không?',
      header: 'XÓA ĐƠN ĐĂNG KÝ THI CÔNG',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xác nhận',
      rejectLabel: 'Hủy bỏ',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.constructionService.deleteOrderConstructionById(this.Idc, id).subscribe(
          (res: any) => {
            this.loading[0] = false;
            if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
              this.lstConstruction = this.lstConstruction.filter((s:any) => s.Id !== id);
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
        if(!this.selectedContructs) {
          this.messageService.add({severity: 'warn', summary: 'Warn', detail: 'Không có mục nào được chọn!'})
        }
        this.constructionService.deletesListOrderConstruction(this.Idc,this.selectedContructs).subscribe(
          (res: any) => {
            this.loading[0] = false;
            if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
              this.selectedContructs.map((item: any) => {
                this.lstConstruction = this.lstConstruction.filter((s: { Id: string; }) => s.Id !== item.Id);
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
