import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CommonService } from 'src/app/services/common.service';
import { ResidentService } from 'src/app/services/resident.service';
import { AppMessageResponse, AppStatusCode, Gender, RelationshipOption, StatusOption, Staying } from 'src/app/shared/constants/app.constants';
import { Paging } from 'src/app/viewModels/paging';
import { DatePipe } from '@angular/common';
import { ResApi } from 'src/app/viewModels/res-api';
import  ObjectId from 'bson-objectid';
import { CardRequestService } from 'src/app/services/card-request.service';
import { CardManagersService } from 'src/app/services/card-managers.service';

@Component({
  selector: 'app-resident-card',
  templateUrl: './resident-card.component.html',
  styleUrls: ['./resident-card.component.scss']
})
export class ResidentCardComponent {
  fResidentCard: any;
  lstResidentNumberCard : any;
  public text : string = '';
  lstResident: any;
  public nameFile : string ='';
  isImageSelected: boolean = false;
  public uploadedImageUrl: string = '';
  public statusOption = StatusOption;
  public staying = Staying;
  public filterCountry : Paging;
  public filterResident : Paging;
  public filterActive : Paging;
  public filterParrams : Paging;
  public lstCountry : any;
  public lstCardResident : any;
  public lstCardActive : any;
  public ResidentCard : any;
  public Resident : any;
  public id :any;
  public Idc : any;
  public towerId: any;
  public apartmentId: any;
  public residentId: any;
  public loading = [false];
  public relationshipOption = RelationshipOption;
  public Gender: any[]=[];
  public gender: any[]=[];
  isLoading : boolean = false;
  isCard : boolean = false;
  constructor(
    private readonly cardmanagerService : CardManagersService,
    private readonly countriesService : CommonService,
    private readonly messageService : MessageService,
    private http: HttpClient,
    private readonly fb : FormBuilder,
    private config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    public datePipe : DatePipe
  ){
    this.filterCountry = new Object as Paging;
    this.filterResident = new Object as Paging;
    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 1000;
    this.filterParrams.groupCard = 1;
    this.filterActive = new Object as Paging;
    this.filterActive.page = 1;
    this.filterActive.page_size = 1000;
    this.filterActive.groupCard = 1;
    this.lstResident = [...this.config.data.lstResident];
    this.ResidentCard = this.config.data.ResidentCard;
    this.Idc = this.config.data.Idc;
    this.id = this.config.data.Id;
    this.lstCardResident = this.config.data.lstCardResident;
    this.isLoading = this.config.data.isLoading;
    this.isCard = this.config.data.isCard;
    this.towerId = this.config.data.towerId;
    this.apartmentId = this.config.data.apartmentId;
  }

  ngOnInit() {
    this.gender = [...Gender]
    this.Gender = this.gender.map(item => ({...item, checked: false}));
    this.getCardResident()
    
    this.getListCountriesByPaging();
    this.fResidentCard = this.fb.group({
      ResidentId: null,
      ResidentObjectId: [null, Validators.required],
      CardId: null,
      ResidentCardIntegratedId: null,
      FullName: null,
      Gender: [{value: null, disabled: true}],
      DateOfBirth: [{value: null, disabled: true}],
      NationalId: [{value: null, disabled: true}],
      Phone: [{value: null, disabled: true}, , Validators.pattern('[0-9\s]*')],
      Email: [{value: null, disabled: true}],
      StatusResident: [{value: null, disabled: true}],
      IdentityNumber: [{value: null, disabled: true}],
      IdentityPlace: [{value: null, disabled: true}],
      IdentityDateSign: [{value: null, disabled: true}],
      IdentityDateExpired: [{value: null, disabled: true}],
      DateArrival: [{value: null, disabled: true}],
      DateLeave: [{value: null, disabled: true}],
      RelationId: [{value: null, disabled: true}],
      StatusTemporaty: [{value: null, disabled: true}],
      TemporatyNumber: [{value: null, disabled: true}],
      DateStayFrom: [{value: null, disabled: true}],
      DateStayTo: [{value: null, disabled: true}],
      Image: [{value: null, disabled: true}],
    })
    if(this.ResidentCard) {
      this.setFormGroup(this.ResidentCard.Id);
    }
  }
  checkGender(event: any) {
    this.Gender.map((item: any) => {
      if(item.Code === event.value){
        item.checked = true;
      }else{
        item.checked = false;
      }
    })
  }
  setFormGroup(event: any) {
    
    if(event?.value == null) {
      this.Resident = this.ResidentCard;
      if(this.Resident?.ResidentId){
        this.Resident.ResidentObjectId = this.lstResident.filter((i: any) => i.ResidentId == this.Resident.ResidentId)[0].Id;
      }
      console.log(this.Resident);
      // if(event){
      //   this.Resident = this.lstResident.filter((i: any) => i.Id == event)[0];
      // }
    }else{
      
      this.Resident = this.lstResident.filter((i: any) => i.Id == event.value)[0];
    }
    if(this.Resident?.Image){
      this.isImageSelected = true;
    }
    this.uploadedImageUrl = `http://i-apigw.cnttvietnam.com.vn/uploads/images/${this.Resident?.Image}`;
    
    this.fResidentCard = this.fb.group({
      CardId: [this.fResidentCard.get('CardId').value ? this.fResidentCard.get('CardId').value : '' || this.ResidentCard?.CardId] ,
      ResidentCardIntegratedId: [this.fResidentCard.get('ResidentCardIntegratedId').value ? this.fResidentCard.get('ResidentCardIntegratedId').value : '' || this.ResidentCard?.ResidentCardIntegratedId] ,
      FullName: [this.Resident?.FullName ],
      CardOwner: [this.Resident?.CardOwner],
      ResidentId: this.Resident?.ResidentId,
      ResidentObjectId: [this.Resident?.ResidentObjectId || this.Resident?.Id ],
      Gender: [{value: this.Resident?.Gender, disabled: true}] ,
      DateOfBirth: [{value: this.Resident?.DateOfBirth ? new Date(this.Resident?.DateOfBirth) : '', disabled: true}] ,
      NationalId: [{value: this.Resident?.NationalId , disabled: true}] ,
      Phone: [{value: this.Resident?.Phone , disabled: true}] ,
      Email: [{value: this.Resident?.Email , disabled: true}] ,
      StatusResident: [{value: this.Resident?.StatusResident , disabled: true}] ,
      IdentityNumber: [{value: this.Resident?.IdentityNumber , disabled: true}] ,
      IdentityPlace: [{value: this.Resident?.IdentityPlace , disabled: true}] ,
      IdentityDateSign: [{value: this.Resident?.IdentityDateSign ? new Date(this.Resident?.IdentityDateSign) : '', disabled: true}] ,
      IdentityDateExpired: [{value: this.Resident?.IdentityDateExpired ? new Date(this.Resident?.IdentityDateExpired) : '', disabled: true}] ,
      DateArrival: [{value: this.Resident?.DateArrival ? new Date(this.Resident?.DateArrival ) : '', disabled: true}] ,
      DateLeave: [{value: this.Resident?.DateLeave ? new Date(this.Resident?.DateLeave) : '', disabled: true}] ,
      RelationId: [{value: this.Resident?.RelationId , disabled: true}] ,
      StatusTemporaty: [{value: this.Resident?.StatusTemporaty , disabled: true}] ,
      TemporatyNumber: [{value: this.Resident?.TemporatyNumber , disabled: true}] ,
      DateStayFrom: [{value: this.Resident?.DateStayFrom ? new Date(this.Resident?.DateStayFrom) : '', disabled: true}] ,
      DateStayTo: [{value: this.Resident?.DateStayTo ? new Date(this.Resident?.DateStayTo) : '', disabled: true}] ,
      Image: [{value: this.Resident?.Image, disabled: true}] ,
    })
    if(this.fResidentCard.get('ResidentId').value) {
      this.GetCardActiveByPage()
    }
  }
  getListCountriesByPaging() {
    this.countriesService.getListCountrieByPaging(this.filterCountry).subscribe((res: ResApi) => {
 
      if(res.meta.error_code == AppStatusCode.StatusCode200) {
        this.lstCountry = res.data;
        
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
  onFileSelected(event: any) {
    const file: File = event.target.files[0]; // Lấy file từ sự kiện event
    if (file) {
      const formData: FormData = new FormData();
      formData.append('image', file, file.name); // Gắn file vào FormData
  
      // Gửi yêu cầu POST tới API endpoint hỗ trợ việc upload file
      this.http.post('https://i-apigw.cnttvietnam.com.vn/api/upload/uploadImage', formData)
        .subscribe(
          (response: any) => {
            this.isImageSelected = true;
            // Lấy đường dẫn ảnh đã upload từ phản hồi của server
            const uploadedImageName = response.data;
            this.nameFile = uploadedImageName[0];
            // this.dataContacts.Icon = uploadedImageName[0]
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
  Imagenull(){}
  onBack(){
    this.ref.close()
  }
  markAllAsDirty() {
    Object.keys(this.fResidentCard.controls).forEach(key => {
      const control = this.fResidentCard.get(key);
      if (control.enabled && control.invalid) {
        control.markAsDirty();
      }
    });
  }
  onSubmit() {
    if(this.fResidentCard.invalid){
      this.markAllAsDirty();
    }
    else{
      // const { StatusTemporaty, ...ResidentCard } = this.lstResident.filter((item: any) => item.Id == this.fResidentCard.get('FullNameId').value)[0];
      const { StatusTemporaty, ...ResidentCard } = this.fResidentCard.getRawValue();
      
      delete ResidentCard.Id;
      if (StatusTemporaty !== 2) {
        delete ResidentCard.TemporatyNumber;
        delete ResidentCard.DateStayFrom;
        delete ResidentCard.DateStayTo;
      }
      const itemCard = { ...ResidentCard };
      if(this.Idc) {
        itemCard.Id = this.Idc;
      }
      else{
        const objectId = new ObjectId();
        itemCard.Id = objectId.toHexString();
      }
      itemCard.genderName = this.Gender.filter(item => item.Code = itemCard.Gender)[0]?.Name;
      itemCard.ResidentId = this.fResidentCard.get('ResidentId').value;
      itemCard.DateOfBirth = this.datePipe.transform(itemCard.DateOfBirth, 'yyyy/MM/dd');
      itemCard.IdentityDateSign = this.datePipe.transform(itemCard.IdentityDateSign, 'yyyy/MM/dd');
      itemCard.IdentityDateExpired = this.datePipe.transform(itemCard.IdentityDateExpired, 'yyyy/MM/dd');
      itemCard.DateArrival = this.datePipe.transform(itemCard.DateArrival, 'yyyy/MM/dd');
      itemCard.DateLeave = this.datePipe.transform(itemCard.DateLeave, 'yyyy/MM/dd');
      itemCard.DateStayFrom = this.datePipe.transform(itemCard.DateStayFrom, 'yyyy/MM/dd');
      itemCard.DateStayTo = this.datePipe.transform(itemCard.DateStayTo, 'yyyy/MM/dd');
      itemCard.CardOwner = this.lstResident.filter((item: any) => item.Id = itemCard.ResidentObjectId)[0].FullName;
      itemCard.CardNumber = this.lstCardResident.filter((item: any) => item.Id = itemCard.CardId)[0]?.CardNumber;
      console.log(itemCard);
      
      this.ref.close(itemCard);
    }
  }
  getCardResident() {
    this.filterParrams.TowerId = this.towerId;
    this.cardmanagerService.getListCardEmptyByPaging(this.filterParrams).subscribe((res: ResApi) => {
      if(res.meta.error_code = AppStatusCode.StatusCode200) {
        this.lstCardResident = res.data.Results;
      }
    })
  }
  GetCardActiveByPage() {
    this.filterActive.ApartmentId = this.apartmentId;
    this.filterActive.ResidentId = this.fResidentCard.get('ResidentId').value;
    this.cardmanagerService.getListCardActiveByPage(this.filterActive).subscribe((res: ResApi) => {
      if(res.meta.error_code = AppStatusCode.StatusCode200) {
        this.lstCardActive = res.data.Results;
      }
    })
  }
}
