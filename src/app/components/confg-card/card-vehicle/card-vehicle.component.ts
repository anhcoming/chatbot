import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Paging } from 'src/app/viewModels/paging';

@Component({
  selector: 'app-card-vehicle',
  templateUrl: './card-vehicle.component.html',
  styleUrls: ['./card-vehicle.component.scss']
})
export class CardVehicleComponent {
  public lstCard: any
  public filterParrams : Paging;
  public first = 0;
  public rows = 10;
  public isLoadingTable: boolean = false;
  public loading = [false];
  search: string = '';
  isInputEmpty: boolean = true;

  constructor(
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private readonly fb: FormBuilder,
    private route: ActivatedRoute, 
    private router: Router
  ) {
    this.filterParrams = new Object as Paging;
    this.filterParrams.page = 1;
    this.filterParrams.page_size = 10;

  }
  onDelete(id: number ) {
    
    this.confirmationService.confirm({
      message: 'Bạn có muốn xóa khu đô thị này không?',
      header: 'XÓA KHU ĐÔ THỊ',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // this.projectService.deleteProjectById(item.CompanyId, item.Id).subscribe(
        //   (res: any) => {
        //     this.loading[0] = false;
        //     if (res && res.meta && res.meta.error_code == AppStatusCode.StatusCode200) {
        //       this.lstProject = this.lstProject.filter(s => s.Id !== item.Id);
        //       this.messageService.add({ severity: 'success', summary: 'Success', detail: res.meta.error_message || AppMessageResponse.CreatedSuccess });
  
              
        //       //return;
        //     } else {
        //       this.messageService.add({ severity: 'error', summary: 'Error', detail: res?.meta?.error_message || AppMessageResponse.BadRequest });
        //       return;
        //     }
        //   }
        // );
        
      },
      reject: (type: any) => {
          return;
      }
    });
  }
}
