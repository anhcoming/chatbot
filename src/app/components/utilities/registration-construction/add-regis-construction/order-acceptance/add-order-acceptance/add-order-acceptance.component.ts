import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentStatus, StatusMethod, StorageData } from 'src/app/shared/constants/app.constants';
import { StorageService } from 'src/app/shared/services/storage.service';

@Component({
  selector: 'app-add-order-acceptance',
  templateUrl: './add-order-acceptance.component.html',
  styleUrls: ['./add-order-acceptance.component.scss']
})
export class AddOrderAcceptanceComponent {
  fOrderAcceptance : any;
  id : any;
  public currentDate = new Date();
  public lstStatusPayment = DocumentStatus;
  public lstStatusMethod = StatusMethod;
  loading  = [false];
  Idc: any;
  userID: any;
  public listAttactment: any;
  constructor(
    private readonly fb : FormBuilder,
    private readonly http : HttpClient,
    private readonly storeService : StorageService,
    private router: Router,
    private readonly route: ActivatedRoute,
  ){
   this.listAttactment = [];
  }

  ngOnInit(){
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
    });
    this.getCompanyId();
    this.getUserId();

    this.fOrderAcceptance = this.fb.group({
      Id : [''],
      CreatedById : this.userID,
      UpdatedById : this.userID,
      CompanyId : this.Idc,
      DateReg : [''],
      DateReal : [this.currentDate],
      PaymentStatus: [''],
      NoteConfirm : [''],
      PriceDeposit : [''],
      PriceFee : [''],
      PriceExtra : [''],
      PricePay : [''],
      PaymentMethod : [''],
      Note : [''],
      listAttactments : [],
    })
    this.fOrderAcceptance.get('DateReal').disable();
  }
  getCompanyId() {
    this.Idc = this.storeService.get(StorageData.companyId);
  }
  getUserId() {
    this.userID = this.storeService.get(StorageData.userId);
  }
  onSubmit(){}
  onFileSelected(event: any) {
    const file: File = event.target.files[0]; // Lấy file từ sự kiện event
    if (file) {
      const formData: FormData = new FormData();
      formData.append('file', file, file.name); // Gắn file vào FormData
  
      // Gửi yêu cầu POST tới API endpoint hỗ trợ việc upload file
      this.http.post('https://i-apigw.cnttvietnam.com.vn/api/upload/uploadMultifile', formData)
        .subscribe(
          (response: any) => {
            
            // Lấy đường dẫn đã upload từ phản hồi của server
            const uploadedFileName = response.data;

            for(let i = 0; i < uploadedFileName.length; i++) {
              const fileName = uploadedFileName[i];

              // let itemFile = new ListAttactment();
              let itemFile : any;
              itemFile.Name = fileName;
              itemFile.Url = fileName;

              this.listAttactment.push(itemFile);
            }
            console.log('Upload thành công:', response);
          
          },
          (error) => {
            // Xử lý lỗi nếu có
            console.error('Lỗi upload:', error); 
          }
        );
    }
  }

  onBack(event:any){
    this.router.navigate(['/utilities/order-acceptance/list']);
  }
}
