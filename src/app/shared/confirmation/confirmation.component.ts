import { Component, OnInit, Inject, EventEmitter, ViewEncapsulation, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import icClose from '@iconify/icons-ic/twotone-close';

@Component({
  selector: 'vex-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConfirmationComponent {

  dialogContent = '';

  icClose = icClose;

  onSi = new EventEmitter();
  onNo = new EventEmitter();

  loading = false ; 
  constructor(
    public matDialogRef: MatDialogRef<ConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any)
  {
    this.dialogContent = _data.content;
  }

  onNoClick(): void {
      this.matDialogRef.close();
  }

  onButtonSiClicked(): void {
      // this.loading = true;
      this.loading = true;
      this.onSi.emit('OperacionOk');
      this.matDialogRef.close();
  }

}
