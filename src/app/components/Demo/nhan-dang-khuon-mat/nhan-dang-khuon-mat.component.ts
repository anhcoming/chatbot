import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DemoService } from 'src/app/services/demo.service';
import { DataService } from 'src/app/shared/services/data.service';



@Component({
  selector: 'app-nhan-dang-khuon-mat',
  templateUrl: './nhan-dang-khuon-mat.component.html',
  styleUrls: ['./nhan-dang-khuon-mat.component.scss']
})
export class NhanDangKhuonMatComponent {
  private urlSearch = "api/demo/elastic/_search";
  private urlDownload = "api/demo/elastic/_download";
  searchTxt: string = '';
  results: any = [];
  visible: boolean = false;
  uploadedFiles: any[] = [];
  selectedSite: string = "minio";
  items: any;

  constructor(private http: HttpClient,
    private _dataService: DataService,
    private messageService: MessageService,
    private _demoService: DemoService
  ) {

    this.items = [
      {
        label: 'Minio',
        command: () => {
          this.selectedSite = "minio"
        }
      },
      {
        label: 'Aws-s3',
        command: () => {
          this.selectedSite = "aws-s3"
        }
      }
    ]
  }

  getSourceName(source: string){
    switch(source){
      case "minio":
        return "Local"
      case "aws-s3":
        return "Amazon S3"
      default:
        return "Không xác định"
    }
  }


  downloadFile(fileName: string, bucketName: string, site: string) {
    var param = {
      fileName: fileName,
      bucket: bucketName,
      site: site
    }

    console.log(param);

    this._demoService.downloadSourceFile(param).subscribe((response) => {
   
      const url = window.URL.createObjectURL(response as Blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }, (errors: any) => {
      this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: "Vui lòng thử lại với một nguồn khác!" });
    });
  }

  showDialog() {
    this.visible = true;
  }

  onSearch() {
    var data: any = {
      "query": {
        "match": {
          "content": this.searchTxt
        }
      },
      "highlight": {
        "fragment_size": 25,
        "fields": {
          "content": {}
        }
      }
    }

    if (this.searchTxt.includes('"') || this.searchTxt.includes("'")) {
      data = {
        "query": {
          "match_phrase": {
            "content": this.searchTxt
          }
        },
        "highlight": {
          "fragment_size": 50,
          "fields": {
            "content": {}
          }
        }
      }
    }

    this._demoService.elasticSearch(data).subscribe((data: any) => {
      this.results = data;

    });

    // this._dataService.post(this.urlSearch, data).subscribe((data: any) => {
    //   this.results = data;

    // });
  }
}
