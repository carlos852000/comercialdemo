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
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'vex-sopcion-registro',
  templateUrl: './sopcion-registro.component.html',
  styleUrls: ['./sopcion-registro.component.scss']
})
export class SopcionRegistroComponent implements OnInit {

  dataUsuario: Session;
  form: FormGroup;
  tituloForm: any;
  btnRegistro: any;

  //icons
  icClose=icClose;
  icMenu = icMenu;

  //Configuración
  idOpcion : any = 0;
  idOpcionPadre : any = 0;
  tipoAccion : any = 0;
  datosOpcion: any;
  habilTipoEnlace = true;
  habilitaBtnReg = false;
  spinBtnReg = false;
  itemEnlace = false;
  itemIcono = false;
  listaOpcionPadre: any = [];
  lstDestino = [
    {'id':1,'name':'En la misma página'},
    {'id':2,'name':'En una nueva página'},
  ]
  lsVerOpcion = [
    {'id':1,'name':'Mostrar en el Sistema'},
    {'id':0,'name':'Ocultar del Menú'},
  ]
  lstIconosMenu = Constantes.ICONOS_MENU;

  constructor(
    private dialogRef: MatDialogRef<SopcionRegistroComponent>,
    private authService: AuthService,
    private snackbar: MatSnackBar,
    private storageService: StorageService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private sistemasService: SistemaService,
    private utilsService: UtilsService,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) { 
    this.dataUsuario = this.storageService.getCurrentSession();
    this.datosOpcion = this.data?.datosOpcion;
  }

  ngOnInit(): void {
    this.CargaInicial();
    if (this.datosOpcion){
      this.tituloForm = "Editar Opción";
      this.btnRegistro = "Actualizar";
      this.idOpcion = this.datosOpcion.idopcion;
      this.idOpcionPadre = this.datosOpcion.idpadre;
      this.tipoAccion = 2;
    } else {
      this.tituloForm = "Registrar Opción";
      this.btnRegistro = "Registrar";
      this.tipoAccion = 1;
    }
    this.form = this.formBuilder.group({
      nombre: [this.data.datosOpcion?.nombre, [Validators.required,Validators.maxLength(250)]],
      opcionPadre: [this.data.datosOpcion?.idopcionpadre, [Validators.required]],
      habilitador: '',
      icono: [this.data.datosOpcion?.icono, [Validators.required]],
      abreviatura: [this.data.datosOpcion?.abreviatura, [Validators.required,Validators.maxLength(50)]],
      enlace: [this.data.datosOpcion?.enlace, [Validators.required,Validators.maxLength(250)]],
      destino: [this.data.datosOpcion?.destino, [Validators.required]],
      veropcion: [this.data.datosOpcion?.verOpcion, [Validators.required]],
    });
    this.detectaCambios(0);
  }

  CargaInicial() {
    this.habilitaBtnReg = true;
    this.sistemasService.listarMenu(this.dataUsuario.idmodulo,0,1,this.dataUsuario.token).subscribe(responseMenu =>{
      this.listaOpcionPadre = responseMenu.dato;
      this.habilitaBtnReg = false;
    });
  }
  
  RegistrarOpcion() {
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

      var habilitador = 0;
      if (this.form.get('habilitador').value){
        habilitador = 1;
      } else {
        habilitador = 0;
      }
      this.habilitaBtnReg = true;
      this.spinBtnReg = true;
      this.sistemasService.procesaOpcion(
        this.tipoAccion,
        this.idOpcion,
        this.dataUsuario.idmodulo,
        this.idOpcionPadre,
        this.form.get('opcionPadre').value,
        habilitador,
        this.form.get('icono').value,
        this.form.get('nombre').value,
        this.form.get('abreviatura').value,
        this.form.get('enlace').value,
        this.form.get('destino').value,
        this.form.get('veropcion').value,
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

  detectaCambios(valor) {
    //CARGA INICIAL
    if (valor == 0){
      if (this.datosOpcion){
        //Cuando es nivel 1 y modificar
        if ((this.datosOpcion.nivel == 1) && (this.tipoAccion = 2)){
          this.form.get("opcionPadre").disable();
          this.form.get("enlace").disable();
          this.form.get("icono").enable();
          this.form.get("habilitador").setValue(true);
          this.itemEnlace = false;
          this.itemIcono = true;
        }
        //Cuando es nivel 2 y modificar
        if ((this.datosOpcion.nivel == 2) && (this.tipoAccion = 2)){
          this.form.get("opcionPadre").enable();
          this.form.get("enlace").enable();
          this.form.get("icono").disable();
          this.form.get("habilitador").setValue(false);
          this.itemEnlace = true;
          this.itemIcono = false;
        }
      } else {
        //Cuando es nuevo
        if (this.tipoAccion = 1){
          this.form.get("opcionPadre").disable();
          this.form.get("enlace").disable();
          this.form.get("icono").enable();
          this.form.get("habilitador").setValue(true);
          this.itemEnlace = false;
          this.itemIcono = true;
        }
      }
    }

    //SI SE ACTIVA EL CHECK
    if (valor == 1){
      this.form.get("opcionPadre").disable();
      this.form.get("enlace").disable();
      this.form.get("icono").enable();
      this.form.get("habilitador").setValue(true);
      this.form.get("icono").setValue('');
      this.form.get("opcionPadre").setValue('');
      this.itemEnlace = false;
      this.itemIcono = true;
    }

    //SI SE DESACTIVA EL CHECK
    if (valor == 2){
      this.form.get("opcionPadre").enable();
      this.form.get("enlace").enable();
      this.form.get("icono").disable();
      this.form.get("habilitador").setValue(false);
      this.itemEnlace = true;
      this.itemIcono = false;
    }
    
  }

  desHabilTipoEnlace(event:MatCheckboxChange){
    if (event.checked) {
      this.detectaCambios(1);
    } else {
      this.detectaCambios(2);
    }
    
  }

  cerrarVentana(valor) {
    this.dialogRef.close(valor);
  }

}
