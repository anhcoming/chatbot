import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DataService } from 'src/app/shared/services/data.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-chuyen-doi-dinh-dang',
  templateUrl: './chuyen-doi-dinh-dang.component.html',
  styleUrls: ['./chuyen-doi-dinh-dang.component.scss']
})
export class ChuyenDoiDinhDangComponent {
myUploader($event: any) {
throw new Error('Method not implemented.');
}
  public uploadedFiles: any = [];

  constructor(
    private _dataService: DataService,
    private messageService: MessageService
  ) { }


  onUpload(event: any) {
    const xhr = event.originalEvent;
    if (xhr.status === 200) {
      // Upload success
      for (let file of event.files) {
        this.uploadedFiles.push({
          'file': file,
          'status': 'Thành công'
        });
      }



      const byteCharacters = atob(xhr.body.fileContent);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });

      saveAs(blob, xhr.body.fileName);

      // const a = document.createElement('a');
      // a.href = url;
      // a.download = xhr.body.fileDownloadName;
      // document.body.appendChild(a);
      // a.click();
      // document.body.removeChild(a);


      this.messageService.add({ severity: 'info', summary: 'Tải File thành công', detail: '' });

    } else {
      // Upload failed
      for (let file of event.files) {
        this.uploadedFiles.push({
          'file': file,
          'status': 'Thất bại'
        });
      }
      this.messageService.add({ severity: 'error', summary: 'Tải File thất bại', detail: '' });

    }

  }

}
