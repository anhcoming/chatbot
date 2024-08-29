import { Component } from '@angular/core';

@Component({
  selector: 'app-demsoxetrongbai',
  templateUrl: './demsoxetrongbai.component.html',
  styleUrls: ['./demsoxetrongbai.component.scss']
})
export class DemsoxetrongbaiComponent {
  text: string = '';

  deleteText() {
    this.text = '';
  }

  processText() {
  }
}