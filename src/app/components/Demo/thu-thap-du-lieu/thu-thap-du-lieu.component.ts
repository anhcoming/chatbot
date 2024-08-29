import { Component, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { DemoService } from 'src/app/services/demo.service';
import { DataService } from 'src/app/shared/services/data.service';

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

@Component({
  selector: 'app-thu-thap-du-lieu',
  templateUrl: './thu-thap-du-lieu.component.html',
  styleUrls: ['./thu-thap-du-lieu.component.scss']
})
export class ThuThapDuLieuComponent {
  @ViewChild('fileUpload') fileUpload!: FileUpload;
  public units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  sites = [
    { name: "Local", value: "minio" },
    { name: "Amazon S3", value: "aws-s3" }
  ]

  selectedSite: string = "minio";

  private urlUpload = "api/demo/elastic/_upload";
  public uploadedFiles: any = [];

  constructor(
    private _dataService: DataService,
    private messageService: MessageService,
    private readonly _demoService: DemoService,
  ) { }

  removeFile(index: number) {
    this.fileUpload.files.splice(index, 1);
  }

  customeUpload(event: any) {
  
    for (let i = 0; i < event.files.length; i++) {
      const formData = new FormData();
      const file = event.files[i];
      formData.append('Site', this.selectedSite);
      formData.append('File', file);

      this._demoService.uploadFile(formData).subscribe((res: any) => {
          this.uploadedFiles.push(file);
          this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Tải File lên thành công.' });
      }, (err) => {
        console.error(err);
      });
    }

    this.fileUpload.clear();

  }

  // onUpload(event: any) {
  //   const xhr = event.originalEvent;
  //   if (xhr.status === 200) {
  //     // Upload success
  //     for (let file of event.files) {
  //       this.uploadedFiles.push({
  //         'file': file,
  //         'status': 'Thành công'
  //       });
  //     }
  //     this.messageService.add({ severity: 'info', summary: 'Tải File thành công', detail: '' });

  //   } else {
  //     // Upload failed
  //     for (let file of event.files) {
  //       this.uploadedFiles.push({
  //         'file': file,
  //         'status': 'Thất bại'
  //       });
  //     }
  //     this.messageService.add({ severity: 'error', summary: 'Tải File thất bại', detail: '' });

  //   }

  // }

  caculateFileSize(bytes: number) {
    let index = 0;
    while (bytes >= 1024 && index < this.units.length - 1) {
      bytes /= 1024;
      index++;
    }

    return `${bytes.toFixed(2)} ${this.units[index]}`;
  }

  checkFileExtension(type: string) {
    switch (type) {
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return 0;
      case 'application/pdf':
        return 1;
      default:
        return -1;
    }
  }

}
