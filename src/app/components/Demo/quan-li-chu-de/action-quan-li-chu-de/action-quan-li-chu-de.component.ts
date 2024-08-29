import { map } from 'rxjs';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TopicFileService } from 'src/app/services/topicFile.service';
import { FileUpload } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-action-quan-li-chu-de',
  templateUrl: './action-quan-li-chu-de.component.html',
  styleUrls: ['./action-quan-li-chu-de.component.scss']
})
export class ActionQuanLiChuDeComponent {
  @ViewChild('fileUpload') fileUpload!: FileUpload;
  @Output() onUpload: EventEmitter<any> = new EventEmitter();
  isLoadingTable: any;
  listDatas: any;
  visible: boolean = false;
  topicId: number = -1;
  selectedTopics: any[] = [];
  deleteVisible: boolean = false;
  totalFile: number  = 0;
  deleteList: any = [];
  public units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  uploadedFiles: any = [];
  embedding: boolean = false;
  deletingFile: boolean = false;
  uploading: boolean = false;
  search: string = '';
  isInputEmpty: boolean = true;
  isPermission: boolean = true;

  constructor(
    private readonly _topicFileService: TopicFileService,
    private readonly activeRoute: ActivatedRoute,
    private readonly messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.topicId = parseInt(this.activeRoute.snapshot.params['id']);
    this.getTopicFiles();
  }

  customeUpload(event: any){
    if (this.uploading){
      return;
    }

    const formData = new FormData();

    for (let i = 0; i < event.files.length; i++) {
      const file = event.files[i];
      formData.append('UploadFiles', file, file.name);
    } 
    formData.append('TopicId', this.topicId.toString());
    this.uploading = true;
    this._topicFileService.uploadFiles(formData).subscribe((res: any) => {
      if (res.meta.status_code === 200){
        this.getTopicFiles();
        this.uploadedFiles = event.files;

        console.log(this.uploadedFiles, '---uploadedFiles');
        
        this.fileUpload.clear();
        this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Tải File lên thành công.' });
        this.visible = false;
      }else{
        this.messageService.add({ severity: 'success', summary: 'Thất bại', detail: res.meta.status_message });
      }
      this.uploading = false;
    }, error => {
      this.uploading = false;
      this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: error });
    });
  }

  embeddingFiles(){
    let filter = this.selectedTopics.filter(t => t.embeddingStatus !== 1);
    
    let request = {
      FileIds: filter?.map(item => item.id) || [],
      FilePaths:filter?.map(item => item.path) || [],
      TopicId: this.topicId
    }

    this.selectedTopics.forEach((topic) => {
      if (topic.embeddingStatus !== 1)
        topic.Embedding = true;
      else 
        topic.Embedding = false;
    });
    this.embedding = true;
    this._topicFileService.embeddingFiles(request).subscribe((res: any) => {
      if (res.meta.status_code === 200){
        
        this.disabledAction();
        this.getTopicFiles();
        this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Embedding File thành công.' });
      }else {
        this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: res.meta.status_message });

      }

      this.embedding = false;

    }, (error) => {
      console.error(error);
      this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: error });
      this.embedding = false;
    });
  }
  
  disabledAction(){
    this.selectedTopics = [];
    this.deleteList = [];
  }

  caculateFileSize(bytes: number){
    let index = 0;
    while (bytes >= 1024 && index < this.units.length - 1){
      bytes /= 1024;
      index++;
    }

    return `${bytes.toFixed(2)} ${this.units[index]}`;
  }

  
  checkFileExtension(type: string){
    switch(type){
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return 0;
      case 'application/pdf':
        return 1;
      default: 
        return -1;
    }
  }

  getTopicFiles(){
    console.log(this.search, '----search');
    
    this._topicFileService.getTopicFiles(this.topicId).subscribe((res: any) => {

      if (res.meta.status_code === 200){
        this.listDatas = res.data;
        this.totalFile = this.listDatas?.length || 0;
        this.isPermission = true;
      }else{
        this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: res.meta.status_message });
        this.isPermission = false;
      }
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: error });
    });
  }

  onUploadComplete(event:any){
  }

  onUploadNewFiles(){
    if (!this.isPermission) {
      this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Bạn không có quyền thêm mới file chủ đề!' });
      return;
    }
    this.visible = true;
    this.uploadedFiles = null;
  }

  removeFile(index: number) {
    this.fileUpload.files.splice(index, 1);
  }

  onDeleteCheckBoxFile() {
    this.deleteList = [...this.selectedTopics];
    this.deleteVisible = true;
  }

  confrimDelete(){
    const request = {
      FileNames: this.deleteList.map((item: any) => item.name),
      FileIds: this.deleteList.map((item: any) => item.id),
      TopicId: this.topicId
    };
    this.deletingFile = true;
    this._topicFileService.deleteTopicFile(request).subscribe((res: any) => {
      if (res.meta.status_code === 200){
        this.getTopicFiles();
        this.deleteVisible = false;
        this.disabledAction();
        this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Xóa File thành công.' });
      }else{
        this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: res.meta.status_message });
        console.error(res.meta.status_message);
      }

    this.deletingFile = false;
    }, (error) => {
      console.error(error);
      this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: error });
      this.deletingFile = false;
    });
  }

  onClearInput() {
    this.search = '';
  }

  onSearch(event: any) {
    this.getTopicFiles();
  }
}
