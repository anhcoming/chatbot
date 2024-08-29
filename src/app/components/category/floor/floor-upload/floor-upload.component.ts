import { Component } from '@angular/core';
import { domainFileTemplate } from 'src/app/shared/constants/app.constants';

@Component({
  selector: 'app-floor-upload',
  templateUrl: './floor-upload.component.html',
  styleUrls: ['./floor-upload.component.scss']
})
export class FloorUploadComponent {

  omainFileTemplates = domainFileTemplate;

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  

  exportExcel() {
    
  }
  onSubmit() {

  }

}

