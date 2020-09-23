import { Component } from '@angular/core';

@Component({
  selector: 'w4c-layout-footer',
  templateUrl: './footer.component.html'
})
export class FooterComponent {
  today: number = Date.now();
}
