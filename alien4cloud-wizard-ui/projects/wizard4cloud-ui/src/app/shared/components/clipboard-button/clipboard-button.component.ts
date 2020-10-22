import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatTooltip} from "@angular/material/tooltip";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'w4c-clipboard-button',
  templateUrl: './clipboard-button.component.html',
  styleUrls: ['./clipboard-button.component.css']
})
export class ClipboardButtonComponent implements OnInit {

  @Input() value: string;

  @ViewChild('tooltip', {static: false}) manualTooltip: MatTooltip;

  constructor(private translateService: TranslateService) { }

  ngOnInit() {
  }

  copyToClipboard() {
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.value;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    const oldValue = this.manualTooltip.message;
    this.manualTooltip.message = this.translateService.instant("Global.Clipboard.Copied", {value: this.value});
    this.manualTooltip.show(200);
    setTimeout(v => {
      this.manualTooltip.hide();
      this.manualTooltip.message = oldValue;
    }, 2000);
  }

}
