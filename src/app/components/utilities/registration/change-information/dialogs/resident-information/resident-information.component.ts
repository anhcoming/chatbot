import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CommonService } from 'src/app/services/common.service';
import { AppMessageResponse, AppStatusCode, Gender, RelationshipOption, StatusOption, Staying } from 'src/app/shared/constants/app.constants';
import { Paging } from 'src/app/viewModels/paging';
import { Countries } from 'src/app/viewModels/countries/countries';
import { ResApi } from 'src/app/viewModels/res-api';
import { DatePipe } from '@angular/common';
import  ObjectId from 'bson-objectid';
import { CardRequestService } from 'src/app/services/card-request.service';

@Component({
  selector: 'app-resident-information',
  templateUrl: './resident-information.component.html',
  styleUrls: ['./resident-information.component.scss']
})
export class ResidentInformationComponent {
  fResidentInfo: any;
  public text : string = '';
  nameFile : string = '';
  public lstStatus: any;
  public itemResidentMoveIn: any;
  public filterCountries : Paging;
  public lstLocation : any;
  public lstCountry : Array<Countries>;;
  public uploadedImageUrl: any;
  public imgName = ''
  public id :any;
  public Idr :any;
  public Country :any;
  public lstResidentMoveIn :any;
  public staying = Staying;
  isImageSelected : boolean = false;
  isLoading : boolean = false;
  public statusOption = StatusOption;
  public loading = [false];
  public relationshipOption = RelationshipOption;
  public gender : any[]=[];
  public Gender : any[]=[];
  constructor(
    private readonly commonService : CommonService,
    private readonly cardrequestService : CardRequestService,
    private readonly messageService : MessageService,
    private  http : HttpClient,
    private readonly fb : FormBuilder,
    private config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    public datePipe : DatePipe
  ){
    this.filterCountries = new Object as Paging;
    this.filterCountries.page = 1;
    this.filterCountries.order_by = 'Id';
    this.filterCountries.page_size = 100;
    this.lstCountry = new Array<Countries>();
    this.fResidentInfo = this.fb.group({
      FullName: [null , Validators.compose([ Validators.required, Validators.minLength(6), Validators.maxLength(150)])],
      Gender: [null],
      DateOfBirth: [null],
      NationalId: new FormControl(83),
      Phone: [null, Validators.pattern('[0-9\s]*')],
      Email: [null],
      StatusResident: [null],
      IdentityNumber: [null],
      IdentityPlace: [null],
      IdentityDateSign: [null],
      IdentityDateExpired: [null],
      DateArrival: [null],
      DateLeave: [null],
      RelationId: [null,  Validators.required],
      StatusTemporaty: [null],
      TemporatyNumber: [null],
      DateStayFrom: [null],
      DateStayTo: [null],
      Image: [null],
    })

    this.Idr = this.config.data.Idr;
    this.id = this.config.data.Id;
    this.lstResidentMoveIn = this.config.data.Lst;
    this.isLoading = this.config.data.isLoading;
    this.gender = [...Gender.map(item => ({...item, checked: false}))];
  }
  ngOnInit() {
    this.getListCountriesByPaging();
    if(this.lstResidentMoveIn){
      this.setFormGroup()
    }
  }
  getListCountriesByPaging() {
    this.commonService.getListCountrieByPaging(this.filterCountries).subscribe((res: ResApi) => {
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.Country = res.data;
        this.lstCountry = [...this.Country];
      }
      else {
        this.lstCountry = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    },
    () => {
      this.lstCountry = [];
      this.messageService.add({ severity: 'error', summary: 'Error', detail: AppMessageResponse.BadRequest });
    })
  }
  setFormGroup() {
    const Resident = this.lstResidentMoveIn;
    if(Resident?.Image){
      this.isImageSelected = true;
    }
    this.uploadedImageUrl = `http://i-apigw.cnttvietnam.com.vn/uploads/images/${Resident.Image}`;
    
    this.fResidentInfo = this.fb.group({
      FullName: Resident.FullName,
      Gender: Resident.Gender,
      ResidentId: Resident.ResidentId,
      DateOfBirth: Resident.DateOfBirth ? new Date(Resident.DateOfBirth) : '',
      NationalId: Resident.NationalId ? Resident.NationalId : '' ,
      Phone: Resident.Phone ,
      Email: Resident.Email ,
      StatusResident: Resident.StatusResident ,
      IdentityNumber: Resident.IdentityNumber ,
      IdentityPlace: Resident.IdentityPlace ,
      IdentityDateSign: Resident.IdentityDateSign ? new Date(Resident.IdentityDateSign) : '',
      IdentityDateExpired: Resident.IdentityDateExpired ? new Date(Resident.IdentityDateExpired) : '',
      DateArrival: Resident.DateArrival ? new Date(Resident.DateArrival ) : '',
      DateLeave: Resident.DateLeave ? new Date(Resident.DateLeave) : '',
      RelationId: Resident.RelationId ,
      StatusTemporaty: Resident.StatusTemporaty ,
      TemporatyNumber: Resident.TemporatyNumber ,
      DateStayFrom: Resident.DateStayFrom ? new Date(Resident.DateStayFrom) : '',
      DateStayTo: Resident.DateStayTo ? new Date(Resident.DateStayTo) : '',
      Image: Resident.Image,
    })
    if(this.isLoading == false){
      Object.keys(this.fResidentInfo.controls).forEach(key => {
        const control = this.fResidentInfo.get(key);
        control.disable();
      });
    }
    this.gender.map((item: any) => {
      if(item.Code == this.fResidentInfo.get('Gender').value){
        item.checked = true;
      }else{
        item.checked = false;
      }
    })
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
  checkGender(event: any) {
    this.gender.map((item: any) => {
      if(item.Code === event.value){
        item.checked = true;
      }else{
        item.checked = false;
      }
    })
  }
  onBack(){this.ref.close();}
  markAllAsDirty() {
    Object.keys(this.fResidentInfo.controls).forEach(key => {
      const control = this.fResidentInfo.get(key);
      if (control.enabled && control.invalid) {
        control.markAsDirty();
      }
    });
  }
  onSubmit() {
    if(this.fResidentInfo.invalid){
      this.markAllAsDirty();
    }
    else{
      const ResidentMoveIns  = this.fResidentInfo.value;
      if (ResidentMoveIns.StatusTemporaty !== 2) {
        delete ResidentMoveIns.TemporatyNumber;
        delete ResidentMoveIns.DateStayFrom;
        delete ResidentMoveIns.DateStayTo;
      }
    
      ResidentMoveIns.Image = this.imgName;
      ResidentMoveIns.genderName = this.gender.filter(item => item.Code == ResidentMoveIns.Gender)[0]?.Name;
      this.itemResidentMoveIn = { ...ResidentMoveIns };
    
      this.itemResidentMoveIn.DateOfBirth = this.datePipe.transform(this.itemResidentMoveIn.DateOfBirth, 'yyyy/MM/dd');
      this.itemResidentMoveIn.IdentityDateSign = this.datePipe.transform(this.itemResidentMoveIn.IdentityDateSign, 'yyyy/MM/dd');
      this.itemResidentMoveIn.IdentityDateExpired = this.datePipe.transform(this.itemResidentMoveIn.IdentityDateExpired, 'yyyy/MM/dd');
      this.itemResidentMoveIn.DateArrival = this.datePipe.transform(this.itemResidentMoveIn.DateArrival, 'yyyy/MM/dd');
      this.itemResidentMoveIn.DateLeave = this.datePipe.transform(this.itemResidentMoveIn.DateLeave, 'yyyy/MM/dd');
      this.itemResidentMoveIn.DateStayFrom = this.datePipe.transform(this.itemResidentMoveIn.DateStayFrom, 'yyyy/MM/dd');
      this.itemResidentMoveIn.DateStayTo = this.datePipe.transform(this.itemResidentMoveIn.DateStayTo, 'yyyy/MM/dd');
      this.itemResidentMoveIn.change = true;
      console.log(this.itemResidentMoveIn);
      
      this.ref.close(this.itemResidentMoveIn);
    }
  }
  fetchMore() {
    this.filterCountries.page ++;
    this.filterCountries.page_size = 50;
    this.commonService.getListCountrieByPaging(this.filterCountries).subscribe((res: ResApi) => {
      if (res.meta.error_code == AppStatusCode.StatusCode200) {
        this.Country = [...this.Country.concat(res.data)];
        this.lstCountry = [...this.Country];
      }
      else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
      }
    })
  }
}

