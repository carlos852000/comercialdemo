import {  Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';

import icClose from '@iconify/icons-ic/twotone-close';
import icDni from '@iconify/icons-ic/sharp-person-pin';

import { ConfirmationComponent } from 'src/app/shared/confirmation/confirmation.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Constantes } from 'src/app/core/constants/constantes';
import { SistemaService } from 'src/app/core/services/sistema.service';
import { UtilsService } from 'src/app/core/funciones/utils.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { Session } from 'src/app/core/models/session.model';
import { GeneralService } from 'src/app/core/services/general.service';
import { enumTipoMensaje } from 'src/app/core/enum/enum-tipo-mensaje.enum';

@Component({
  selector: 'vex-actualiza-clave',
  templateUrl: './actualiza-clave.component.html',
  styleUrls: ['./actualiza-clave.component.scss']
})
export class ActualizaClaveComponent implements OnInit {

  dataUsuario: Session;
  form: FormGroup;
  tituloForm: any;

  //icons
  icClose=icClose;
  icDni = icDni;

  //Loads
  habilitaBtnReg = false;
  spinBtnReg = false;

  inputType = 'password';

  constructor( 
    private dialogRef: MatDialogRef<ActualizaClaveComponent>,
    private snackbar: MatSnackBar,
    private storageService: StorageService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private sistemasService: SistemaService,
    private utilsService: UtilsService,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) { 
    this.dataUsuario = this.storageService.getCurrentSession();
  }

  ngOnInit(): void {
    this.tituloForm = "Actualizar Contraseña";
    this.form = this.formBuilder.group({
      clavenum1: ['', [Validators.required]],
      clavenum2: ['', [Validators.required]],
    });
  }

  ActualizaClave() {
    this.form.markAllAsTouched();
    if (this.form.invalid){
      this.snackbar.open('Existe información requerida por registrar.', null, {
        duration: Constantes.SNACKBAR_TIME,
        horizontalPosition: 'end',
        verticalPosition: 'top',
      });
      return;
    }
    var clave01 = this.form.get('clavenum1').value;
    var clave02 = this.form.get('clavenum2').value;

    if (clave01 !== clave02){
      this.snackbar.open('Las contraseñas no coinciden.', null, {
        duration: Constantes.SNACKBAR_TIME,
        horizontalPosition: 'end',
        verticalPosition: 'top',
      });
      this.utilsService.abrirMensaje('Error', 'Las contraseñas no coinciden.', enumTipoMensaje.ERROR);
      return;
    }

    var mensaje = "¿Desea actualizar su contraseña?";
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      disableClose: true,
      width: '350px',
      data: {content: mensaje}
    });
    const sub = dialogRef.componentInstance.onSi.subscribe(data => {
      this.habilitaBtnReg = true;
      this.spinBtnReg = true;
      this.sistemasService.cambiaClave(
        this.dataUsuario.idusuario,
        this.form.get('clavenum1').value
      ).subscribe(response =>{
        this.habilitaBtnReg = false;
        this.spinBtnReg = false;
        this.snackbar.open(response.mensaje, null, {
          duration: Constantes.SNACKBAR_TIME,
          horizontalPosition: 'end',
          verticalPosition: 'top',
        });
        this.cerrarVentana("OK");
      }, error => {
        this.habilitaBtnReg = false;
        this.spinBtnReg = false;
        this.utilsService.abrirMensajeToken(null, null, null, error);
      });
    });
  }

  cerrarVentana(valor) {
    this.dialogRef.close(valor);
  }

}
