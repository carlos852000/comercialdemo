import {Component, Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { enumTipoMensaje } from 'src/app/core/enum/enum-tipo-mensaje.enum';

@Component({
  selector: 'vex-modal-general',
  templateUrl: './modal-general.component.html',
  styleUrls: ['./modal-general.component.scss']
})
export class ModalGeneralComponent implements OnInit {

  loading = false ; 
  dialogTitle: string;
  dialogContent: string;
  tipoMensaje = 1;
  enumTipoMensaje = enumTipoMensaje;

  constructor( public matDialogRef: MatDialogRef<ModalGeneralComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
              private fb: FormBuilder) {
     
                this.dialogTitle = _data.titulo;
                this.dialogContent = _data.mensaje;
                this.tipoMensaje = _data.tipoMensaje;
               }
  ngOnInit(): void {
  }

}
