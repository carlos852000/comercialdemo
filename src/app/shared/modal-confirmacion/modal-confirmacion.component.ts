import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'vex-modal-confirmacion',
  templateUrl: './modal-confirmacion.component.html',
  styleUrls: ['./modal-confirmacion.component.scss']
})
export class ModalConfirmacionComponent implements OnInit {

  dialogTitle: string;
  dialogContent: string;
  // onSi = new EventEmitter();
  // onNo = new EventEmitter();
  constructor(
    public matDialogRef: MatDialogRef<ModalConfirmacionComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
  ) { 
    this.dialogTitle = _data.titulo;
    this.dialogContent = _data.mensaje;
  }

  ngOnInit(): void {
  }
  confirmarNo(): void {
    this.matDialogRef.close(false);
  }
  confirmarSi(): void {
    this.matDialogRef.close(true);
  }

}
