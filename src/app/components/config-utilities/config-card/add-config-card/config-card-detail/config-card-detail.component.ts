import { Component, Input, SimpleChanges, OnChanges, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ConfigCardService } from 'src/app/services/config-card.service';
import { TypeCardService } from 'src/app/services/type-card.service';
import { ConfigCardDetail } from 'src/app/viewModels/config-card/config-card-detail';
import { TypeCard } from 'src/app/viewModels/type-card/type-card';

@Component({
  selector: 'app-config-card-detail',
  templateUrl: './config-card-detail.component.html',
  styleUrls: ['./config-card-detail.component.scss']
})
export class ConfigCardDetailComponent implements OnInit {
  @Output() eventEmitter: EventEmitter<any> = new EventEmitter();
  @Input() lstConfigCardDetail: Array<ConfigCardDetail>;
  @Input() lstTypeCard: Array<TypeCard>;

  constructor(
    private readonly configCardService: ConfigCardService,
    private readonly typeCardService: TypeCardService,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private active_route: ActivatedRoute, 
    private router: Router
  ) {
    this.lstTypeCard = new Array<TypeCard>();
    this.lstConfigCardDetail = new Array<ConfigCardDetail>();

  }

  ngOnInit(): void {
  }

  onDelete(index: number) {
    this.confirmationService.confirm({
      message: 'Bạn có muốn xóa cấu hình kiểu thẻ này không?',
      header: 'XÓA CẤU HÌNH KIỂU THẺ',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        let lst_updated = [];

        for (let i = 0; i < this.lstConfigCardDetail.length; i++) {
          if (index != i) {
            lst_updated.push(this.lstConfigCardDetail[i])
          }
        }

        this.lstConfigCardDetail = [...lst_updated];
        this.eventEmitter.emit(this.lstConfigCardDetail);
      },
      reject: (type: any) => {
          return;
      }
    });
  }

  onChangeCheck(e : any) {
    console.log(this.lstConfigCardDetail)
    this.eventEmitter.emit(this.lstConfigCardDetail);
  }
}
