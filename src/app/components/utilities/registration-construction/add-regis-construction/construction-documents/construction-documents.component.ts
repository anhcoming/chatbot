import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DocumentFileType, DocumentStatus } from 'src/app/shared/constants/app.constants';
import { ListAttactments } from 'src/app/viewModels/orderconstruction/orderconstruction';
import  ObjectId from 'bson-objectid';

@Component({
  selector: 'app-construction-documents',
  templateUrl: './construction-documents.component.html',
  styleUrls: ['./construction-documents.component.scss']
})
export class ConstructionDocumentsComponent {
  fConstructDocument : any;
  public listAttactments : Array<ListAttactments>;
  public lstOrderDocument : any;
  public DocumentStatus = DocumentStatus;
  public DocumentFileType = DocumentFileType;
  loading = [false];
  id : any;
  itemDocument : any;
  Idd : any;
  isLoading : boolean = false;
  data: any;

  constructor(
    private http: HttpClient,
    public ref  : DynamicDialogRef,
    private readonly fb : FormBuilder,
    private config: DynamicDialogConfig,
    public datePipe : DatePipe,
  ){
    this.listAttactments = new Array<ListAttactments>();

    this.fConstructDocument = this.fb.group({
      Name : ['',Validators.required],
      Type : ['',Validators.required],
      Quatity : ['',Validators.required],
      StatusProcess : ['',Validators.required],
      listAttactments : undefined,
      Note : undefined,
    })

    this.Idd = this.config.data.Idd;
    this.id = this.config.data.Id;
    this.lstOrderDocument = this.config.data.Lst;
    this.isLoading = this.config.data.isLoading;
    console.log(this.config.data.Id);
    console.log(this.config.data.Idr);
    
  }
  ngOnInit(){
    if(this.lstOrderDocument){
      this.setFormGroup()
    }
  }

  setFormGroup(){
    const Document = this.lstOrderDocument;
    this.listAttactments = Document.listAttactments

      this.fConstructDocument = this.fb.group({
        Name : Document.Name,
        Type : Document.Type,
        Quatity : Document.Quatity,
        StatusProcess : Document.StatusProcess,
        listAttactments : '',
        Note: Document.Note,
      })
  }

  markAllAsDirty() {
    Object.keys(this.fConstructDocument.controls).forEach(key => {
      const control = this.fConstructDocument.get(key);
      if (control.enabled && control.invalid) {
        control.markAsDirty();
      }
    });
  }
  onSubmit() {
    if(this.fConstructDocument.invalid){
      this.markAllAsDirty();
    }
    else{
      const Document  = this.fConstructDocument.value;
      if(this.Idd){
        Document.Id = this.Idd;
      }else{
        const objectId = new ObjectId();
        Document.Id = objectId.toHexString();
      }
      Document.listAttactments = this.listAttactments;
    }
    const Document  = this.fConstructDocument.value;
    if(Document.Id){
      console.log(Document.Id);
      // Document.listAttactments = this.listAttactments;
      this.itemDocument = { ...Document };
      console.log(this.itemDocument)
      this.ref.close(this.itemDocument);
    }
  }


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

              let itemFile = new ListAttactments();
              itemFile.Name = fileName;
              itemFile.Url = fileName;

              this.listAttactments.push(itemFile);
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
  RemoveAttactment(item: ListAttactments){
    this.listAttactments = [...this.listAttactments.filter(s => s.Name != item.Name)];
    this.fConstructDocument.get('listAttactments').setValue('');
  }
  onBack(){
    this.ref.close();
  }

}

