import { Component, OnInit } from '@angular/core';
import { domainFileTemplate } from 'src/app/shared/constants/app.constants';
@Component({
  selector: 'app-tower-upload',
  templateUrl: './tower-upload.component.html',
  styleUrls: ['./tower-upload.component.scss']
})
export class TowerUploadComponent implements OnInit {

  domainFileTemplate = domainFileTemplate;

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  

  exportExcel() {
    
  }
  onSubmit() {

  }

}
