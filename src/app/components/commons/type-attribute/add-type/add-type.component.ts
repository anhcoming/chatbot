import { Component } from '@angular/core';
import { ListAttributeItem, TypeAttribute } from 'src/app/viewModels/type-attribute/type-attribute';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AddTypeAttributeComponent } from '../add-type-attribute/add-type-attribute.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { TypeAttributeService } from 'src/app/services/type-attribute.service';
import { AppMessageResponse, AppStatusCode, StorageData } from 'src/app/shared/constants/app.constants';
import { ResApi } from 'src/app/viewModels/res-api';


@Component({
  selector: 'app-add-type',
  templateUrl: './add-type.component.html',
  styleUrls: ['./add-type.component.scss']
})
export class AddTypeComponent {
  public isLoadingTable: boolean = false;
  public lstTypeAttribute: Array<TypeAttribute>;
  public listAttributeItem: Array<ListAttributeItem>;
  fType : any;
  dataType : any;
  public currentdate = new Date();
  public loading = [false];
  Id : any;
  id : any;
  Idc: any;
  userId: any;
  constructor(
    public readonly typeattributeService : TypeAttributeService,
    public ref: DynamicDialogRef,
    public dialogService : DialogService,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private readonly storeService: StorageService,
    private readonly route: ActivatedRoute,
    private router: Router,
    private readonly fb: FormBuilder,
  ){
    this.lstTypeAttribute = new Array<TypeAttribute>();
    this.listAttributeItem = new Array<ListAttributeItem>();
    this.dataType = {};
  }

  ngOnInit(): void {

    if(this.id)
      this.getTypeById(this.id);
    this.getCompanyId();
    this.getUserId();
    this.fType = this.fb.group({
      Id:  [0],
      Status: [1],
      CreatedById: this.userId,
      UpdatedById: this.userId,
      TypeAttribuiteParentId: [null],
      CreatedAt: this.currentdate,
      UpdatedAt: this.currentdate,
      CompanyId: [0],
      Code: ['', Validators.compose([Validators.required,Validators.minLength(3),Validators.maxLength(50)])],
      IsUpdate: [true],
      IsDelete: [true],
      Name: ['' , Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(150)])],
      listAttributeItem: this.listAttributeItem,
    });
  }
  getUserId() {
    this.userId = this.storeService.get(StorageData.userId); 
  }
  getCompanyId() {
    this.Idc = this.storeService.get(StorageData.companyId); 
  }


  onSubmit() {
    if(this.id == null) {
      const reqData = Object.assign({}, this.fType.value);
      reqData.listAttributeItem=this.listAttributeItem;
      console.log(reqData.ListAttributeItem)
      this.loading[0] = true;
      
      this.typeattributeService.createTypeAttribute(reqData).subscribe(
        (res: any) => {
          this.loading[0] = false;
          if (res?.meta?.error_code == AppStatusCode.StatusCode200) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.meta?.error_message || AppMessageResponse.CreatedSuccess });
            
            setTimeout(() => {this.onReturnPage('/category/customer/list')}, 1000);
          } 
          else { 
            this.messageService.add({ severity: 'warn', summary: 'Warn', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
          }
        },
        () => {
          this.loading[0] = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest });
        },
        () => {
          this.loading[0] = false;
        }
      );
    }else{

      const reqData = Object.assign({}, this.fType.value);
      reqData.listAttributeItem=this.listAttributeItem;
      console.log(reqData.ListAttributeItem)
      this.loading[0] = true;

      this.typeattributeService.updateTypeAttributeById(this.id, reqData).subscribe(
        (res: any) => {
          this.loading[0] = false;
          if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: res.meta.error_message || AppMessageResponse.CreatedSuccess });

            setTimeout(() => {this.onReturnPage('/category/customer/list')}, 1500);
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
          }
        },
        () => {
          this.loading[0] = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest });
        },
        () => {
          this.loading[0] = false;
        }
      );
    }
  }
  formGroup(){
    this.fType = this.fb.group({
      Id : this.dataType.Id,
      Name : this.dataType.Id,
      Status: this.dataType.Status,
      Code : this.dataType.Code,
      CreatedAt : this.dataType.CreatedAt,
      UpdatedAt : this.currentdate,
      CreatedById : this.dataType.CreatedById,
      UpdatedById : this.dataType.UpdatedById,
      listAttributeItem: this.dataType.listAttributeItem,
      IsUpdate : this.dataType.IsUpdate,
      IsDelete : this.dataType.IsDelete,
    })
  }
  getTypeById(id: number) {
    this.typeattributeService.getTypeAttributeById(id).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.dataType = res.data;
        this.formGroup();
        this.listAttributeItem = res.data.listAttributeItem;
  
      }else{
        this.dataType = [];
        this.messageService.add({severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest});
      }
    })
  }
  onReturnPage(url: string) : void {
    this.router.navigate([url]);
  }
  onOpenConfigDialog(id: number) {
    this.ref = this.dialogService.open(AddTypeAttributeComponent, {
      header: !(id > 0) ? 'Thêm mới thuộc tính' : 'Cập nhật loại thuộc tính',
      width: '60%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true
    });
  
    this.ref.onClose.subscribe((data: ListAttributeItem) => {
      console.log(data);
      if (data) {
        this.listAttributeItem =  [...this.listAttributeItem, data];

        // this.listApartmentMaps.push(data);
      }
    });
  }
  onDelete(index:number){

  }
  onBack(event: Event){
    let isShow = true;//this.layoutService.getIsShow();
  
    if (isShow) {
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: "Chưa hoàn tất thêm mới loại hình,Bạn có muốn Hủy?",
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Xác nhận',
        rejectLabel: 'Hủy bỏ',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
        accept: () => {
          this.router.navigate(['commons/type-attributes/list']);
        },
        reject: () => {
            return;
        }
      });
    } else {
      this.router.navigate(['commons/type-attribute/list']);
    }
  }
}
