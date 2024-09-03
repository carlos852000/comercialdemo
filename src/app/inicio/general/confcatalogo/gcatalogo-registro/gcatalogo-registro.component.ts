import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';

import icClose from '@iconify/icons-ic/twotone-close';
import icMenu from '@iconify/icons-ic/twotone-menu';

import { ConfirmationComponent } from 'src/app/shared/confirmation/confirmation.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Constantes } from 'src/app/core/constants/constantes';
import { SistemaService } from 'src/app/core/services/sistema.service';
import { UtilsService } from 'src/app/core/funciones/utils.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { Session } from 'src/app/core/models/session.model';
import { GeneralService } from 'src/app/core/services/general.service';

@Component({
  selector: 'vex-gcatalogo-registro',
  templateUrl: './gcatalogo-registro.component.html',
  styleUrls: ['./gcatalogo-registro.component.scss']
})
export class GcatalogoRegistroComponent implements OnInit {

  dataUsuario: Session;
  form: FormGroup;
  tituloForm: any;
  btnRegistro: any;
  
  //icons
  icClose=icClose;
  icMenu = icMenu;

  //Configuración
  idCatalogoDetalle : any = 0;
  idCatalogo : any = 0;
  abrevCatalogo : any = "";
  tipoAccion : any = 0;
  datosItem: any;
  habilitaBtnReg = false;
  spinBtnReg = false;
  verAbreviatura = false;

  constructor(
    private dialogRef: MatDialogRef<GcatalogoRegistroComponent>,
    private snackbar: MatSnackBar,
    private storageService: StorageService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private sistemasService: SistemaService,
    private generalService: GeneralService,
    private utilsService: UtilsService,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) { 
    this.dataUsuario = this.storageService.getCurrentSession();
    this.datosItem = this.data.datosItem;
    this.idCatalogo = this.data.idCatalogo;
    this.abrevCatalogo = this.data.abreviaturaCatalogo;
    if (this.abrevCatalogo == "TCARACTERPROD"){
      this.verAbreviatura = true;
    }
  }

  ngOnInit(): void {
    if (this.datosItem){
      this.tituloForm = "Editar Irem";
      this.btnRegistro = "Actualizar";
      this.idCatalogoDetalle = this.datosItem.idcatalogodetalle;
      this.tipoAccion = 2;
    } else {
      this.tituloForm = "Registrar Item";
      this.btnRegistro = "Registrar";
      this.tipoAccion = 1;
    }
    if (this.verAbreviatura) {
      this.form = this.formBuilder.group({
        catalogo: [this.data.datosItem?.descripcion, [Validators.required,Validators.maxLength(250)]],
        abreviatura: [this.data.datosItem?.abreviatura, [Validators.required,Validators.maxLength(25)]],
      });
    } else {
      this.form = this.formBuilder.group({
        catalogo: [this.data.datosItem?.descripcion, [Validators.required,Validators.maxLength(250)]],
        abreviatura: [this.data.datosItem?.abreviatura, [Validators.maxLength(25)]],
      });
    }
    
  }

  RegistrarItem() {
    this.form.markAllAsTouched();
    if (this.form.invalid){
      this.snackbar.open('Existe información requerida por registrar.', null, {
        duration: Constantes.SNACKBAR_TIME,
        horizontalPosition: 'end',
        verticalPosition: 'top',
      });
      return;
    }
    var mensaje = "¿Desea procesar esta información?";
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      disableClose: true,
      width: '350px',
      data: {content: mensaje}
    });
    const sub = dialogRef.componentInstance.onSi.subscribe(data => {
      this.habilitaBtnReg = true;
      this.spinBtnReg = true;
      this.generalService.procesaCatalogoDetalle(
        this.tipoAccion,
        this.idCatalogoDetalle,
        this.idCatalogo,
        this.form.get('catalogo').value,
        this.form.get('abreviatura').value,
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
