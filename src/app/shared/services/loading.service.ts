import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
let scrollPosition = 0;
const iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
@Injectable()
export class LoaderService {
  constructor(private spinner: NgxSpinnerService, ) {}
    show() {
      this.spinner.show(undefined,
        {
          type: 'ball-triangle-path',
          size: 'medium',
          bdColor: 'rgba(0, 0, 0, 0.8)',
          color: '#fff',
          fullScreen: true
        });

        // setTimeout(this.hide, 20000);
    }
    hide(): void {
      this.spinner.hide();
    }

    enable() {
        scrollPosition = window.pageYOffset;
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.top = `-${scrollPosition}px`;
    }

    disable() {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollPosition);
    }
}
