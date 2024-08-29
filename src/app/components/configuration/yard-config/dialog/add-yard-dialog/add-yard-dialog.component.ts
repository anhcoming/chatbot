import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApartmentService } from 'src/app/services/apartment.service';
import { ResidentService } from 'src/app/services/resident.service';
import { TowerService } from 'src/app/services/tower.service';
import { StatusOption, Staying, Role, RelationshipOption, AppStatusCode, AppMessageResponse, IsStatus, StorageData } from 'src/app/shared/constants/app.constants';
import { Apartment } from 'src/app/viewModels/apartment/apartment';
import { DbApartment } from 'src/app/viewModels/customer/customer';
import { Paging } from 'src/app/viewModels/paging';
import { HttpClient} from '@angular/common/http';
import { ResApi } from 'src/app/viewModels/res-api';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { StorageService } from 'src/app/shared/services/storage.service';


@Component({
  selector: 'app-add-yard-dialog',
  templateUrl: './add-yard-dialog.component.html',
  styleUrls: ['./add-yard-dialog.component.scss'],
})
export class AddYardDialogComponent {
  fBooking: any
  public itemCheck: any;
  public id : any
  public Ida : any
  public Item : any
  public timeRanger : any[] = [];
  public isStatus = IsStatus;
  public ProjectId : any
  public FloorId : any
  public ApartmentName : string | undefined
  public lstCustomer : Array<DbApartment>;
  public lstResiden: any
  public lstTower: any
  public lstYard: any;
  public uploadedImageUrl: any;
  public imgName = '';
  public lstApartment: Array<Apartment>;
  public StatusOption: any[] = [];
  public RelationshipOption: any[] = [];
  public Staying: any[] = [];
  public Role: any[] = [];
  public filterParrams: Paging;
  public loading = [false];
  public statusOption = StatusOption;
  public staying = Staying;
  public role = Role;
  public Editor = ClassicEditor;
  public timeSlot: any[]=[];
  public progressive: any[]=[];
  public Time: any[]=[];
  public isDeposit: boolean = true;
  public isFee: boolean = true;
  public isFeeCheck: boolean = false;
  public isDepositCheck: boolean = false;
  public isTimeCheck: boolean = false;
  public relationshipOption = RelationshipOption;
  public service = RelationshipOption;
  public Name: any;
  public TimeStart: any;
  public TimeEnd: any;
  public DateStart: any;
  public DateEnd: any;
  public Price: any;
  public listYardTypeSettings: any[]=[];
  public listYardSettings: any;
  public listCancelSettings: any[]=[];
  public listCancelSetting: any[]=[];
  public CancelNotPay : any[]=[];
  public CancelPay : any[]=[];
  userId: any;
  Idc: any;
  public isPayDeposit: boolean = false;
  public isPayYard : boolean = false;
  public isPayFee: boolean = false;
  public isPay: boolean = false;
  constructor(
    private readonly http: HttpClient,
    private readonly messageService: MessageService,
    private readonly fb: FormBuilder,
    private config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private readonly storeService : StorageService,
  ){
    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 1000;
    this.lstCustomer = new Array<DbApartment>();
    this.lstApartment = new Array<Apartment>();
    this.listYardSettings = this.config.data.listYardSettings;
    this.Ida = this.config.data.Ida;
    this.id = this.config.data.Id;
  }
  ngOnInit(): void {
    this.fBooking = this.fb.group({
      Name: [null, Validators.required],
      Image: [null, Validators.required],
      Status: [null, Validators.required],
      Address: [null, Validators.required],
      PriceDeposit: [null, Validators.required],//So tien dat coc
      IsDeposit: [],//Dat coc
      NoteDeposit: [],//ghi chu tien coc
      ContentDeposit: [],//Mo ta tien coc
      IsFee: [],//Phu phi
      PriceFee: [null, Validators.required],//So tien phu phi
      NoteFee: [],//Ghi chu phu phi
      ContentFee: [],//Mo ta phu phi
      Regulations: [null, Validators.required],//Quy dinh san
      BookEditing: [null, Validators.required],
      Type: [''],
      DateStart: [''],
      DateEnd: [''],
      listYardTypeSettings: []
    });
    if(!this.Ida){
      this.Ida = 0
    }
    if(this.Ida) {
      this.setFormGroup()
    }
  }
  getUserId() {
    this.userId = this.storeService.get(StorageData.userId);
  }
  getCompanyId() {
    this.Idc = this.storeService.get(StorageData.companyId);
  }

  markAllAsDirty() {
    Object.keys(this.fBooking.controls).forEach(key => {
      const control = this.fBooking.get(key);
      if (control.enabled && control.invalid) {
        control.markAsDirty();
      }
    });
  }
  onSubmit() {
    if(this.fBooking.invalid){
      this.markAllAsDirty();
      this.markItemAsDirty();
    }else{
      if(this.fBooking.invalid){
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'Vui lòng nhập đầy đủ thông tin!'})
        return
      }
      const listYardSettings = Object.assign({}, this.fBooking.value);
      listYardSettings.IsDeposit = this.isDeposit;
      listYardSettings.IsFee = this.isFee;
      listYardSettings.Type = this.itemCheck;
      listYardSettings.Image = this.imgName;
      listYardSettings.DateStart = this.DateStart;
      listYardSettings.DateEnd = this.DateEnd;
      listYardSettings.IsPayDeposit = this.isPayDeposit;
      listYardSettings.IsPayFee = this.isPayFee;
      listYardSettings.IsPayYard = this.isPayYard;
      if(this.isFee == false ) {
        listYardSettings.PriceFee = 0
      }
      if(this.Time.length){
        this.Time.map((item: any) => {
          if(item.Price) {
            item.Name = `${item.TimeStart}-${item.TimeEnd}`;
            let HourStart = null;
            let HourEnd = null;

            if( ( Number(item.NoTimeStart)/10 )% 2 === 0 ) {
              HourStart = ( Number(item.NoTimeStart));
            } else{
              HourStart = Number(item.NoTimeStart) + 20 ;
            }

            if( ( Number(item.NoTimeEnd)/10 ) % 2 === 0 ) {
              HourEnd = Number(item.NoTimeEnd);
            } else{
              HourEnd = Number(item.NoTimeEnd) + 20;
            }
            item.NoTimeStart = HourStart;
            item.NoTimeEnd = HourEnd;

            this.listYardTypeSettings.push(item) ;
          }
        });
      }
      if(this.timeSlot.length ){
        this.timeSlot.map((item: any) => {
          if(item.Price) {
            item.Name = `${item.TimeStart}-${item.TimeEnd}`;
            let HourStart = null;
            let HourEnd = null;

            if( ( Number(item.NoTimeStart)/10 )% 2 === 0 ) {
              HourStart = ( Number(item.NoTimeStart));
            } else{
              HourStart = Number(item.NoTimeStart) + 20 ;
            }

            if( ( Number(item.NoTimeEnd)/10 ) % 2 === 0 ) {
              HourEnd = Number(item.NoTimeEnd);
            } else{
              HourEnd = Number(item.NoTimeEnd) + 20;
            }
            item.NoTimeStart = HourStart;
            item.NoTimeEnd = HourEnd;
            this.listYardTypeSettings.push(item) ;
          }
        });
      }
      if(this.progressive.length){
        this.progressive.map((item: any) => {
          if(item.Price) {
            if( item.TimeStart && item.TimeEnd ) {
              item.Name = `${item.TimeStart}-${item.TimeEnd}`;
              if(parseInt(item.TimeStart) > parseInt(item.TimeEnd)) {
                item.TimeEnd = item.TimeStart;
                item.NoTimeEnd = item.NoTimeStart;
              }
            }else{
              if( item.TimeStart ) {
                item.Name = `${item.TimeStart}`;
              }
              if( item.TimeEnd ) {
                item.Name = `${item.TimeEnd}`;
                item.TimeStart = item.TimeEnd;
                item.NoTimeStart = item.NoTimeEnd;
                item.TimeEnd = '';
                item.NoTimeEnd = 0;
              }
            }
            let HourStart = null;
            let HourEnd = null;

            if( ( Number(item.NoTimeStart)/10 )% 2 === 0 ) {
              HourStart = ( Number(item.NoTimeStart));
            } else{
              HourStart = Number(item.NoTimeStart);
            }

            if( ( Number(item.NoTimeEnd)/10 ) % 2 === 0 ) {
              HourEnd = Number(item.NoTimeEnd);
            } else{
              HourEnd = Number(item.NoTimeEnd);
            }
            item.NoTimeStart = HourStart;
            item.NoTimeEnd = HourEnd;

            this.listYardTypeSettings.push(item) ;
          }
        });
      }
      if(this.CancelNotPay.length){
        this.listCancelSettings = this.listCancelSettings.concat(this.CancelNotPay);
      }
      if(this.CancelPay.length){
        this.listCancelSettings = this.listCancelSettings.concat(this.CancelPay);
      }
      listYardSettings.listYardCancelSettings = this.listCancelSettings;
      listYardSettings.listYardTypeSettings = this.listYardTypeSettings;
      console.log(listYardSettings);


      this.ref.close(listYardSettings);
    }
  }
  markItemAsDirty() {
    if(!this.Time.length){
      const Type = this.fBooking.get('Type');
      Type.markAsDirty();
    }else{
      const Type = this.fBooking.get('Type');
      Type.markAsPristine();
    }
  }
  markDepositAsDirty() {
    if(!this.timeSlot.length){
      const Type = this.fBooking.get('Type');
      Type.markAsDirty();
    }else{
      const Type = this.fBooking.get('Type');
      Type.markAsPristine();
    }
  }
  markFeeAsDirty() {
    if(!this.progressive.length){
      const Type = this.fBooking.get('Type');
      Type.markAsDirty();
    }else{
      const Type = this.fBooking.get('Type');
      Type.markAsPristine();
    }
  }
  onBack() {
    this.ref.close();
  }
  onChaneProject() {
    this.ProjectId = this.lstApartment.filter(i => i.Id === this.fBooking.value.ApartmentId)[0].ProjectId;
    this.FloorId = this.lstApartment.filter(i => i.Id === this.fBooking.value.ApartmentId)[0].FloorId;
    this.ApartmentName = this.lstApartment.filter(i => i.Id === this.fBooking.value.ApartmentId)[0].Name;
  }
  setFormGroup() {
    this.uploadedImageUrl = `http://i-apigw.cnttvietnam.com.vn/uploads/images/${this.listYardSettings.Image}`;
    this.fBooking = this.fb.group({
      Id: this.listYardSettings.Id,
      Name: this.listYardSettings.Name,
      Image: this.listYardSettings.Image,
      Status: this.listYardSettings.Status,
      Address: this.listYardSettings.Address,
      PriceDeposit: this.listYardSettings.PriceDeposit,//So tien dat coc
      IsDeposit: this.listYardSettings.IsDeposit,//Dat coc
      NoteDeposit: this.listYardSettings.NoteDeposit,//ghi chu tien coc
      ContentDeposit: this.listYardSettings.ContentDeposit,//Mo ta tien coc
      IsFee: this.listYardSettings.IsFee,//Phu phi
      PriceFee: this.listYardSettings.PriceFee,//So tien phu phi
      NoteFee: this.listYardSettings.NoteFee,//Ghi chu phu phi
      ContentFee: this.listYardSettings.ContentFee,//Mo ta phu phi
      Regulations: this.listYardSettings.Regulations,//Quy dinh san
      BookEditing: this.listYardSettings.BookEditing,
      Type: this.listYardSettings.Type,
      DateStart: this.listYardSettings.DateStart,
      DateEnd: this.listYardSettings.DateEnd,
      listYardTypeSettings: this.listYardSettings.listYardTypeSettings
    });
    this.itemCheck = this.listYardSettings.Type;
    if(this.itemCheck === 1) {
      this.isTimeCheck = true;
      this.Time = this.listYardSettings.listYardTypeSettings;
    }
    if(this.itemCheck === 2) {
      this.isDepositCheck = true;
      this.timeSlot = this.listYardSettings.listYardTypeSettings;
      for(let i=0; i<this.timeSlot.length ; i++){
        this.timeSlot[i].index = i+1;
      }
    }
    if(this.itemCheck === 3) {
      this.isFeeCheck = true;
      this.progressive = this.listYardSettings.listYardTypeSettings;
      for(let i=0; i<this.progressive.length ; i++){
        this.progressive[i].index = i+1;
      }
    }
    this.listCancelSetting = this.listYardSettings.listYardCancelSettings;
    if(this.listCancelSetting) {
      this.listCancelSetting.map((item: any) => {
        if (item.Type === 1) {
          this.CancelNotPay = this.CancelNotPay.concat(item);
        } else {
          this.CancelPay = this.CancelPay.concat(item);
        }
      })
    }
    this.DateStart = this.listYardSettings.DateStart;
    this.DateEnd = this.listYardSettings.DateEnd;
    this.isFee = this.listYardSettings.IsFee;
    this.isDeposit = this.listYardSettings.IsDeposit;
    this.isPayDeposit = this.listYardSettings.IsPayDeposit;
    this.isPayYard = this.listYardSettings.IsPayYard;
    this.isPayFee = this.listYardSettings.IsPayFee;
    if(this.isDeposit == false){
      this.fBooking.get('PriceDeposit').setValue('0');
      this.fBooking.get('PriceDeposit').disable();
    }
    if(this.isFee == false){
      this.fBooking.get('PriceFee').setValue('0');
      this.fBooking.get('PriceFee').disable();
    }
  }
  onImageSelected(event: any) {
    const file: File = event.target.files[0]; // Lấy file từ sự kiện event
    if (file) {
      const formData: FormData = new FormData();
      formData.append('image', file, file.name); // Gắn file vào FormData

      // Gửi yêu cầu POST tới API endpoint hỗ trợ việc upload file
      this.http.post('https://i-apigw.cnttvietnam.com.vn/api/upload/uploadImage', formData)
        .subscribe(
          (response: any) => {
            // Lấy đường dẫn ảnh đã upload từ phản hồi của server
            const uploadedImageName = response.data;
            this.imgName = uploadedImageName[0];
            console.log('Upload thành công:', response);
            this.uploadedImageUrl = `http://i-apigw.cnttvietnam.com.vn/uploads/images/${uploadedImageName}`;
          },
          (error) => {
            // Xử lý lỗi nếu có
            console.error('Lỗi upload:', error);
          }
        );
    }
  }
  Imagenull(){
    this.uploadedImageUrl = 'null';
  }
  onTime() {
    if(this.itemCheck == 1){
      if(this.isTimeCheck === true){
        this.Time = this.listYardSettings.listYardTypeSettings
      }else{
        this.Time = [{ Name: 'Thuê sân theo giờ', TimeStart: '', TimeEnd: '', Price: null,  Type: 1 }];
        this.timeSlot = [];
        this.progressive = [];
      }
      this.markItemAsDirty();
    }
    if(this.itemCheck == 2){
      if(this.isDepositCheck === true){
        this.timeSlot = this.listYardSettings.listYardTypeSettings
      }else{
        this.Time = [];
        this.timeSlot = [];
        this.progressive = [];
      }
      this.markDepositAsDirty()
    }
    if(this.itemCheck == 3){
      if(this.isFeeCheck === true){
        this.progressive = this.listYardSettings.listYardTypeSettings
      }else{
        this.Time = [];
        this.timeSlot = [];
        this.progressive = [];
      }
      this.markFeeAsDirty()
    }
  }
  onTimeSlot() {
    this.timeSlot.push({ index: this.timeSlot.length + 1, Name: '', TimeStart: '', TimeEnd: '', Price: '', Type: 2 });
    this.markDepositAsDirty()
  }
  onProgressive() {
    this.progressive.push({ index: this.progressive.length + 1, Name: '', TimeStart: '', TimeEnd: '', Price: '', Type: 3 });
    this.markFeeAsDirty()
  }
  onCancelNotPay() {
    this.CancelNotPay.push({ DayStart: null, DayEnd: null, DayPay: null,Refund: null, Type: 1 });
  }
  onCancelPay() {
    this.CancelPay.push({  DayStart: null, DayEnd: null, DayPay: null,Refund: null, Type: 2 });
  }
  onDeposit(){
    if(this.isDeposit == true){
      this.fBooking.get('PriceDeposit').setValue(this.fBooking.get('PriceDeposit').value);
      this.fBooking.get('PriceDeposit').enable();
      this.fBooking.get('NoteDeposit').setValue();
      this.fBooking.get('ContentDeposit').setValue();

    }else{
      this.fBooking.get('PriceDeposit').setValue('0');
      this.fBooking.get('PriceDeposit').disable();
      this.fBooking.get('NoteDeposit').setValue('Không có tiền cọc');
      this.fBooking.get('ContentDeposit').setValue('Không có tiền cọc');
    }
  }
  onFee(){
    if(this.isFee == true){
      this.fBooking.get('PriceFee').setValue();
      this.fBooking.get('PriceFee').enable();
      this.fBooking.get('NoteFee').setValue();
      this.fBooking.get('ContentFee').setValue();

    }else{
      this.fBooking.get('PriceFee').setValue('0');
      this.fBooking.get('PriceFee').disable();
      this.fBooking.get('NoteFee').setValue('Không có phụ phí');
      this.fBooking.get('ContentFee').setValue('Không có phụ phí');
    }
  }
  onTimeStartChange(time: any) {
    // Kiểm tra định dạng chuỗi
    const [hour, minute] = time.split(':');
    const firstChar = hour.charAt(0);
    const parsedHour = parseInt(hour);
    const parsedMinute = parseInt(minute);
    let isCompleteHour = false; // Biến kiểm tra giờ đã nhập đủ hay chưa
    let isCompleteMinute = false; // Biến kiểm tra phút đã nhập đủ hay chưa

    let paddedHour = hour;
    if (parsedHour > 23 ) {
      paddedHour = '00';
    }
    if (firstChar > '2') {
      paddedHour = `0${hour.charAt(0)}`;
      hour == paddedHour
      isCompleteHour = true;
      isCompleteMinute = true;
    }else{
      if (hour == `${parsedHour}_`) {
        isCompleteHour = false; // Đánh dấu giờ đã nhập đủ
      }else{
        isCompleteHour = true;
      }
      if (minute == `_0`) {
        isCompleteMinute = false; // Đánh dấu giờ đã nhập đủ
      }else{
        isCompleteMinute = true;
      }
    }

    if(isCompleteHour) {
      if(isCompleteMinute) {
        const listMinute = [10, 20, 30, 40, 50, 60, 70, 80, 90];
        const updatedMinutes = listMinute.includes(parsedMinute) ? '30' : '00';
        this.Time.map(item => {
          if(`${paddedHour}:${updatedMinutes}` > item.TimeEnd && item.TimeEnd) {
            item.TimeStart = item.TimeEnd;
            item.NoTimeStart = item.NoTimeEnd;
          }else{
            item.TimeStart = `${paddedHour}:${updatedMinutes}`;
            item.NoTimeStart = `${paddedHour}${updatedMinutes}`;
          }
        })
      }
    }
  }
  onTimeEndChange(time: any) {
    // Kiểm tra định dạng chuỗi
    const [hour, minute] = time.split(':');
    const firstChar = hour.charAt(0);
    const parsedHour = parseInt(hour);
    const parsedMinute = parseInt(minute);
    let isCompleteHour = false; // Biến kiểm tra giờ đã nhập đủ hay chưa
    let isCompleteMinute = false; // Biến kiểm tra phút đã nhập đủ hay chưa

    let paddedHour = hour;
    if (parsedHour > 23 ) {
      paddedHour = '00';
    }
    if (firstChar > '2') {
      paddedHour = `0${hour.charAt(0)}`;
      isCompleteHour = true;
      isCompleteMinute = true;
    }else{
      if (hour == `${parsedHour}_`) {
        isCompleteHour = false; // Đánh dấu giờ đã nhập đủ
      }else{
        isCompleteHour = true;
      }
      if (minute == `_0`) {
        isCompleteMinute = false; // Đánh dấu giờ đã nhập đủ
      }else{
        isCompleteMinute = true;
      }
    }

    if(isCompleteHour) {
      if(isCompleteMinute) {
        const listMinute = [10, 20, 30, 40, 50, 60, 70, 80, 90];
        const updatedMinutes = listMinute.includes(parsedMinute) ? '30' : '00';
        this.Time.map(item => {
          if(`${paddedHour}:${updatedMinutes}` < item.TimeStart && item.TimeStart) {
            item.TimeEnd = item.TimeStart;
            item.NoTimeEnd = item.NoTimeStart;
          }else{
            item.TimeEnd = `${paddedHour}:${updatedMinutes}`;
            item.NoTimeEnd = `${paddedHour}${updatedMinutes}`;
          }
        })
      }
    }
  }
  onTimeStartChangeSlot(index: any, time: any) {
    const [hour, minute] = time.split(':');
    const firstChar = hour.charAt(0);
    const parsedHour = parseInt(hour);
    const parsedMinute = parseInt(minute);
    let isCompleteHour = false; // Biến kiểm tra giờ đã nhập đủ hay chưa
    let isCompleteMinute = false; // Biến kiểm tra phút đã nhập đủ hay chưa

    let paddedHour = hour;
    if (parsedHour > 23 ) {
      paddedHour = '00';
    }
    if (firstChar > '2') {
      paddedHour = `0${hour.charAt(0)}`;
      hour == paddedHour
      isCompleteHour = true;
      isCompleteMinute = true;
    }else{
      if (hour == `${parsedHour}_`) {
        isCompleteHour = false; // Đánh dấu giờ đã nhập đủ
      }else{
        isCompleteHour = true;
      }
      if (minute == `_0`) {
        isCompleteMinute = false; // Đánh dấu giờ đã nhập đủ
      }else{
        isCompleteMinute = true;
      }
    }

    if(isCompleteHour) {
      if(isCompleteMinute) {
        const listMinute = [10, 20, 30, 40, 50, 60, 70, 80, 90];
        const updatedMinutes = listMinute.includes(parsedMinute) ? '30' : '00';
        this.timeSlot.map(item => {
          if(item.index == index){
            if(`${paddedHour}:${updatedMinutes}` > item.TimeEnd && item.TimeEnd) {
              item.TimeStart = item.TimeEnd;
              item.NoTimeStart = item.NoTimeEnd;
            }else{
              item.TimeStart = `${paddedHour}:${updatedMinutes}`;
              item.NoTimeStart = `${paddedHour}${updatedMinutes}`;
            }
          }
        })
      }
    }
  }
  onTimeEndChangeSlot(index: any, time: any) {
    // Kiểm tra định dạng chuỗi
    const [hour, minute] = time.split(':');
    const firstChar = hour.charAt(0);
    const parsedHour = parseInt(hour);
    const parsedMinute = parseInt(minute);
    let isCompleteHour = false; // Biến kiểm tra giờ đã nhập đủ hay chưa
    let isCompleteMinute = false; // Biến kiểm tra phút đã nhập đủ hay chưa

    let paddedHour = hour;
    if (parsedHour > 23 ) {
      paddedHour = '00';
    }
    if (firstChar > '2') {
      paddedHour = `0${hour.charAt(0)}`;
      isCompleteHour = true;
      isCompleteMinute = true;
    }else{
      if (hour == `${parsedHour}_`) {
        isCompleteHour = false; // Đánh dấu giờ đã nhập đủ
      }else{
        isCompleteHour = true;
      }
      if (minute == `_0`) {
        isCompleteMinute = false; // Đánh dấu giờ đã nhập đủ
      }else{
        isCompleteMinute = true;
      }
    }

    if(isCompleteHour) {
      if(isCompleteMinute) {
        const listMinute = [10, 20, 30, 40, 50, 60, 70, 80, 90];
        const updatedMinutes = listMinute.includes(parsedMinute) ? '30' : '00';
        this.timeSlot.map(item => {
          if(item.index == index){
            if(`${paddedHour}:${updatedMinutes}` < item.TimeStart && item.TimeStart) {
              item.TimeEnd = item.TimeStart;
              item.NoTimeEnd = item.NoTimeStart;
            }else{
              item.TimeEnd = `${paddedHour}:${updatedMinutes}`;
              item.NoTimeEnd = `${paddedHour}${updatedMinutes}`;
            }
          }
        })
      }
    }
  }
  onTimeStartChangeProgressive(index: any, time: any) {
    this.progressive.map(item => {
      if(item.index == index) {
          item.TimeStart = time;
          item.NoTimeStart = parseInt(time);
      }
    })
    return true;
  }
  onTimeEndChangeProgressive(index: any, time: any){
    this.progressive.map(item => {
      if (item.index == index) {
          item.TimeEnd = time;
          item.NoTimeEnd = parseInt(time);
      }
    });

    return true;
  }
  onDateStart(time: any){
    const [hour, minute] = time.split(':');
    const firstChar = hour.charAt(0);
    const parsedHour = parseInt(hour);
    const parsedMinute = parseInt(minute);
    let isCompleteHour = false; // Biến kiểm tra giờ đã nhập đủ hay chưa
    let isCompleteMinute = false; // Biến kiểm tra phút đã nhập đủ hay chưa

    let paddedHour = hour;
    if (parsedHour > 23 ) {
      paddedHour = '00';
    }
    if (firstChar > '2') {
      paddedHour = `0${hour.charAt(0)}`;
      hour == paddedHour
      isCompleteHour = true;
      isCompleteMinute = true;
    }else{
      if (hour == `${parsedHour}_`) {
        isCompleteHour = false; // Đánh dấu giờ đã nhập đủ
      }else{
        isCompleteHour = true;
      }
      if (minute == `_0`) {
        isCompleteMinute = false; // Đánh dấu giờ đã nhập đủ
      }else{
        isCompleteMinute = true;
      }
    }

    if(isCompleteHour) {
      if(isCompleteMinute) {
        const listMinute = [10, 20, 30, 40, 50, 60, 70, 80, 90];
        const updatedMinutes = listMinute.includes(parsedMinute) ? '30' : '00';
        this.DateStart = `${paddedHour}:${updatedMinutes}`;
      }
    }
  }
  onDateEnd(time: any){
    // Kiểm tra định dạng chuỗi
    const [hour, minute] = time.split(':');
    const firstChar = hour.charAt(0);
    const parsedHour = parseInt(hour);
    const parsedMinute = parseInt(minute);
    let isCompleteHour = false; // Biến kiểm tra giờ đã nhập đủ hay chưa
    let isCompleteMinute = false; // Biến kiểm tra phút đã nhập đủ hay chưa

    let paddedHour = hour;
    if (parsedHour > 23 ) {
      paddedHour = '00';
    }
    if (firstChar > '2') {
      paddedHour = `0${hour.charAt(0)}`;
      hour == paddedHour
      isCompleteHour = true;
      isCompleteMinute = true;
    }else{
      if (hour == `${parsedHour}_`) {
        isCompleteHour = false; // Đánh dấu giờ đã nhập đủ
      }else{
        isCompleteHour = true;
      }
      if (minute == `_0`) {
        isCompleteMinute = false; // Đánh dấu giờ đã nhập đủ
      }else{
        isCompleteMinute = true;
      }
    }

    if(isCompleteHour) {
      if(isCompleteMinute) {
        const listMinute = [10, 20, 30, 40, 50, 60, 70, 80, 90];
        const updatedMinutes = listMinute.includes(parsedMinute) ? '30' : '00';
        this.DateEnd = `${paddedHour}:${updatedMinutes}`;
      }
    }
  }
  onDeleteTimeSlot(index: any) {
    this.timeSlot = this.timeSlot.filter(item => item.index !== index)
  }
  onDeleteProgressive(index: any) {
    this.progressive = this.progressive.filter(item => item.index !== index)
  }
  onPay() {
    if(this.isPayDeposit == false && this.isPayYard == false && this.isPayFee == false) {
      this.isPay = true;
    }else{
      this.isPay = false;
    }
  }
}
