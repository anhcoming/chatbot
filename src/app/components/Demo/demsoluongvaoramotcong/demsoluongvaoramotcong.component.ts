import { Component, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-demsoluongvaoramotcong',
  templateUrl: './demsoluongvaoramotcong.component.html',
  styleUrls: ['./demsoluongvaoramotcong.component.scss']
})
export class DemsoluongvaoramotcongComponent {
  @ViewChild("SelectFile") SelectFile: any;
  public pdfPath: SafeUrl | null = null;
  public file: any;

  constructor(
    private sanitizer: DomSanitizer,
  ) {
  }

  openDialogFile() {
    this.SelectFile.nativeElement.click();
  }

  onInputFileChange(e: any) {
    const file = e.target.files[0];
    this.file = file;
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const url = e.target.result;
        this.pdfPath = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      };
      reader.readAsDataURL(file);
    }
  }

  deletePDF() {
    this.file = null;
    this.pdfPath = null;
    this.SelectFile.nativeElement.value = '';
  }

  processPDF() {
    // Xử lý file PDF ở đây
  }
}
