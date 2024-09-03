import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';

import icClose from '@iconify/icons-ic/twotone-close';
import icMenu from '@iconify/icons-ic/twotone-menu';
import icPerson from '@iconify/icons-ic/twotone-person';
import icMail from '@iconify/icons-ic/twotone-mail';
import icDni from '@iconify/icons-ic/sharp-person-pin';
import icSearch from '@iconify/icons-ic/twotone-search';

import { ConfirmationComponent } from 'src/app/shared/confirmation/confirmation.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Constantes } from 'src/app/core/constants/constantes';
import { SistemaService } from 'src/app/core/services/sistema.service';
import { UtilsService } from 'src/app/core/funciones/utils.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { Session } from 'src/app/core/models/session.model';
import { GeneralService } from 'src/app/core/services/general.service';
import { TiendaService } from 'src/app/core/services/tienda.service';

@Component({
  selector: 'vex-susuario-registro',
  templateUrl: './susuario-registro.component.html',
  styleUrls: ['./susuario-registro.component.scss']
})
export class SusuarioRegistroComponent implements OnInit {

  dataUsuario: Session;
  form: FormGroup;
  tituloForm: any;
  btnRegistro: any;

  //icons
  icClose=icClose;
  icMenu = icMenu;
  icPerson = icPerson;
  icMail = icMail;
  icDni = icDni;
  icSearch = icSearch;

  //Configuración
  idUsuario : any = 0;
  idPersona : any = 0;
  tipoAccion : any = 0;
  datosUsuario: any;
  listaTipoDocumentos : any;
  muestraFormulario = false;
  
  habilitaCboTienda = false;
  lstTienda: any[];

  //Loads
  loadTipoDocumentos = false;
  habilitaBtnReg = false;
  spinBtnReg = false;

  tipoEntradaNumero = 'onlynumero';

  constructor(
    private dialogRef: MatDialogRef<SusuarioRegistroComponent>,
    private snackbar: MatSnackBar,
    private storageService: StorageService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private tiendaService: TiendaService,
    private generalService: GeneralService,
    private sistemasService: SistemaService,
    private utilsService: UtilsService,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) { 
    this.dataUsuario = this.storageService.getCurrentSession();
    this.datosUsuario = this.data.datosUsuario;
  }

  ngOnInit(): void {
    if (this.datosUsuario){
      this.tituloForm = "Editar Usuario";
      this.btnRegistro = "Actualizar";
      this.idUsuario = this.datosUsuario.idusuario;
      this.idPersona = this.datosUsuario.idpersona;
      this.muestraFormulario = true;
      this.tipoAccion = 2;
    } else {
      this.tituloForm = "Registrar Usuario";
      this.btnRegistro = "Registrar";
      this.muestraFormulario = false;
      this.tipoAccion = 1;
    }
    this.CargaInicial();
    this.form = this.formBuilder.group({
      tipoDocumentobusk: [this.datosUsuario?.idtipodocumento, Validators.required],
      numDNI: [this.datosUsuario?.numerodocumento, [Validators.required,Validators.maxLength(8)]],
      tipoDocumentobuskAlt: [{ value: this.datosUsuario?.idtipodocumento, disabled: true }, [Validators.required]],
      numDNIAlt: [{ value: this.datosUsuario?.numerodocumento, disabled: true }, [Validators.required,Validators.maxLength(8)]],
      //tipoDocumentobuskAlt: [this.datosUsuario?.idtipodocumento, Validators.required],
      //numDNIAlt: [this.datosUsuario?.numerodocumento, [Validators.required,Validators.maxLength(8)]],
      nombres: [this.datosUsuario?.nombre, [Validators.required,Validators.maxLength(250)]],
      apellidopaterno: [this.datosUsuario?.apellidopaterno, [Validators.required,Validators.maxLength(250)]],
      apellidomaterno: [this.datosUsuario?.apellidomaterno, [Validators.required,Validators.maxLength(250)]],
      sexo: [this.datosUsuario?.sexo.toString()? this.datosUsuario?.sexo.toString():'1'],
      email: [this.datosUsuario?.email, [Validators.required,Validators.maxLength(150), Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],
      tienda: [this.datosUsuario?.idtienda, Validators.required],
    });
  }

  CargaInicial() {
    this.listarTiendas();
    this.loadTipoDocumentos = true;
    this.generalService.listaCatalogo('TDOC',0).subscribe(response =>{
      this.loadTipoDocumentos = false;
      this.listaTipoDocumentos = response.dato;
    }, error => {
      this.loadTipoDocumentos = false;
      this.utilsService.abrirMensajeToken(null, null, null, error);
    });
  }

  listarTiendas() {
    this.habilitaCboTienda = true;
    this.tiendaService.listaTienda(null, 1000, 1).subscribe(response => {
      if (response.resultado == 1) {
        this.lstTienda = response.dato;
      }
      this.habilitaCboTienda = false;
    }, error => {
      this.habilitaCboTienda = false;
      this.utilsService.abrirMensajeToken(null, null, null, error);
    });
  }

  buscaUsuario() {
    var tipoDoc = this.form.get('tipoDocumentobusk').value;
    var numDoc = this.form.get('numDNI').value;
    this.form.controls.tipoDocumentobuskAlt.setValue(this.form.get('tipoDocumentobusk').value);
    this.form.controls.numDNIAlt.setValue(this.form.get('numDNI').value);
    if (tipoDoc && numDoc){
      this.habilitaBtnReg = true;
      this.spinBtnReg = true;
      this.sistemasService.buscaDatosUsuario(
        tipoDoc,numDoc
      ).subscribe(response =>{
        this.habilitaBtnReg = false;
        this.spinBtnReg = false;
        this.muestraFormulario = true;
      }, error => {
        this.habilitaBtnReg = false;
        this.spinBtnReg = false;
        this.muestraFormulario = false;
        this.utilsService.abrirMensajeToken(null, null, null, error);
      });
    } else {
      this.muestraFormulario = false;
      this.form.markAllAsTouched();
      return;
    }
  }

  RegistrarUsuario() {
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
      this.sistemasService.procesaUsuario(
        this.tipoAccion,
        this.dataUsuario.idsistema,
        this.dataUsuario.idperfil,
        this.idUsuario,
        this.idPersona,
        this.form.get('tipoDocumentobusk').value,
        this.form.get('numDNI').value,
        this.form.get('apellidopaterno').value,
        this.form.get('apellidomaterno').value,
        this.form.get('nombres').value,
        this.form.get('sexo').value,
        this.form.get('email').value,
        this.form.get('tienda').value,
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
