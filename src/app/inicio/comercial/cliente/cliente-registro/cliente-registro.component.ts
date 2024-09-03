import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';

import icClose from '@iconify/icons-ic/twotone-close';
import icMenu from '@iconify/icons-ic/twotone-menu';
import icPerson from '@iconify/icons-ic/twotone-person';
import icMail from '@iconify/icons-ic/twotone-mail';
import icDni from '@iconify/icons-ic/sharp-person-pin';
import icSearch from '@iconify/icons-ic/twotone-search';
import icPhone from '@iconify/icons-ic/twotone-phone';

import { ConfirmationComponent } from 'src/app/shared/confirmation/confirmation.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Constantes } from 'src/app/core/constants/constantes';
import { SistemaService } from 'src/app/core/services/sistema.service';
import { UtilsService } from 'src/app/core/funciones/utils.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { Session } from 'src/app/core/models/session.model';
import { GeneralService } from 'src/app/core/services/general.service';
import { ClienteService } from 'src/app/core/services/cliente.service';
import { enumTipoMensaje } from '../../../../core/enum/enum-tipo-mensaje.enum';

@Component({
  selector: 'vex-cliente-registro',
  templateUrl: './cliente-registro.component.html',
  styleUrls: ['./cliente-registro.component.scss']
})
export class ClienteRegistroComponent implements OnInit {

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
  icPhone = icPhone;

  //Configuración
  idCliente : any = 0;
  idPersona : any = 0;
  tipoAccion : any = 0;
  datosCliente: any;
  listaTipoDocumentos : any;
  habilitaItems : any = false;

  //Loads
  loadingClientes = false;
  loadTipoDocumentos = false;
  habilitaBtnReg = false;
  spinBtnReg = false;

  tipoEntradaNumero = 'onlynumero';

  constructor(
    private dialogRef: MatDialogRef<ClienteRegistroComponent>,
    private snackbar: MatSnackBar,
    private storageService: StorageService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private generalService: GeneralService,
    private clienteService: ClienteService,
    private utilsService: UtilsService,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) { 
    this.dataUsuario = this.storageService.getCurrentSession();
    this.datosCliente = this.data.datosCliente;
  }

  ngOnInit(): void {
    this.CargaInicial();
    this.form = this.formBuilder.group({
      tipoDocumento: [this.data.datosCliente?.idtipodocumento, [Validators.required,Validators.maxLength(250)]],
      dni: [this.data.datosCliente?.numerodocumento, [Validators.required,Validators.maxLength(250)]],
      apellidopaterno: [this.data.datosCliente?.apellidopaterno, [Validators.required,Validators.maxLength(250)]],
      apellidomaterno: [this.data.datosCliente?.apellidomaterno, [Validators.required,Validators.maxLength(250)]],
      nombres: [this.data.datosCliente?.nombre, [Validators.required,Validators.maxLength(250)]],
      ruc: [this.data.datosCliente?.ruc, [Validators.maxLength(12)]],
      empresa: [this.data.datosCliente?.nombreempresa, [Validators.maxLength(250)]],
      direccion: [this.data.datosCliente?.direccionCliente, [Validators.maxLength(250)]],
      telefono: [this.data.datosCliente?.telefonoCliente, [Validators.maxLength(250)]],
      sexo: [this.data.datosCliente?.sexo?.toString()? this.data.datosCliente?.sexo?.toString():'1'],
      email: [this.data.datosCliente?.emailCliente, [Validators.maxLength(150), Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],
      observacion: [this.data.datosCliente?.observacion, [Validators.maxLength(250)]],
    });
    if (this.datosCliente){
      this.tituloForm = "Editar Cliente";
      this.btnRegistro = "Actualizar";
      this.idCliente = this.datosCliente.idcliente;
      this.tipoAccion = 2;
    } else {
      this.tituloForm = "Registrar Cliente";
      this.btnRegistro = "Registrar";
      this.tipoAccion = 1;
      this.deshabilitaItems(1);
    }
    
  }

  CargaInicial() {
    this.loadTipoDocumentos = true;
    this.generalService.listaCatalogo('TDOC',0).subscribe(response =>{
      this.loadTipoDocumentos = false;
      this.listaTipoDocumentos = response.dato;
    }, error => {
      this.loadTipoDocumentos = false;
      this.utilsService.abrirMensajeToken(null, null, null, error);
    });
  }

  RegistrarCliente() {
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
      this.clienteService.procesaCliente(
        this.tipoAccion,
        this.idCliente,
        this.idPersona,
        this.form.get('tipoDocumento').value,
        this.form.get('dni').value,
        this.form.get('apellidopaterno').value,
        this.form.get('apellidomaterno').value,
        this.form.get('nombres').value,
        this.form.get('ruc').value,
        this.form.get('empresa').value,
        this.form.get('direccion').value,
        this.form.get('telefono').value,
        this.form.get('sexo').value,
        this.form.get('email').value,
        this.form.get('observacion').value,
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

  calculaDNI() {
    this.idCliente = 0;
    this.idPersona = 0;
    var numDNI = null;
    if (this.form.get('dni').value){
      numDNI = (this.form.get('dni').value).length;
    }
    if (numDNI == 8){
      var tipoDoc = this.form.get('tipoDocumento').value;
      var numDoc = this.form.get('dni').value;
      if (tipoDoc && numDoc){
        this.loadingClientes = true;
        this.clienteService.buscaDatosCliente(
          tipoDoc,numDoc
        ).subscribe(response =>{
          if ((response.resultado == 0) || (response.resultado == 1) || (response.resultado == 2)){
            if (response.resultado == 0){
              this.idCliente = response.dato.idcliente;
              this.idPersona = response.dato.idpersona;
              this.form.controls.empresa.setValue(response.dato.nombreempresa);
              this.form.controls.direccion.setValue(response.dato.direccionCliente);
              this.form.controls.telefono.setValue(response.dato.telefonoCliente);
              this.form.controls.ruc.setValue(response.dato.ruc);
              this.form.controls.email.setValue(response.dato.emailCliente);
              this.form.controls.observacion.setValue(response.dato.observacion);
            }
            if (response.resultado == 1){
              this.idPersona = response.dato.idpersona;
              this.form.controls.direccion.setValue(response.dato.direccion);
              this.form.controls.telefono.setValue(response.dato.telefono);
              this.form.controls.email.setValue(response.dato.email);
            }
            if ((response.resultado == 0) || (response.resultado == 1)){
              this.form.controls.apellidopaterno.setValue(response.dato.apellidopaterno);
              this.form.controls.apellidomaterno.setValue(response.dato.apellidomaterno);
              this.form.controls.nombres.setValue(response.dato.nombre);
              this.form.controls.sexo.setValue(response.dato.sexo.toString());
            }
            
            this.loadingClientes = false;
            this.deshabilitaItems(2);
          } else {
            this.deshabilitaItems(1);
            this.loadingClientes = false;
          }
        }, error => {
          this.deshabilitaItems(1);
          this.loadingClientes = false;
          this.utilsService.abrirMensajeToken(null, null, null, error);
        });
      } else {
        this.deshabilitaItems(1);
        this.loadingClientes = false;
        this.utilsService.abrirMensajeToken('Información', 'Debe seleccionar el tipo de Documento', enumTipoMensaje.ERROR, null);
      }
    } else {
      this.cleanDatos();
      this.deshabilitaItems(1);
    }
  }

  deshabilitaItems(valor) {
    if (valor == 1) {
      this.form.get('apellidopaterno').disable();
      this.form.get('apellidomaterno').disable();
      this.form.get('nombres').disable();
      this.form.get('empresa').disable();
      this.form.get('direccion').disable();
      this.form.get('telefono').disable();
      this.form.get('ruc').disable();
      this.form.get('email').disable();
      this.form.get('observacion').disable();
      this.form.get('sexo').disable();
      this.habilitaBtnReg =true;
    } else {
      if (valor == 2){
        this.form.get('apellidopaterno').enable();
        this.form.get('apellidomaterno').enable();
        this.form.get('nombres').enable();
        this.form.get('empresa').enable();
        this.form.get('direccion').enable();
        this.form.get('telefono').enable();
        this.form.get('ruc').enable();
        this.form.get('email').enable();
        this.form.get('observacion').enable();
        this.form.get('sexo').enable();
        this.habilitaBtnReg =false;
      }
    }
  }

  cleanDatos() {
    this.form.controls.apellidopaterno.setValue("");
    this.form.controls.apellidomaterno.setValue("");
    this.form.controls.nombres.setValue("");
    this.form.controls.empresa.setValue("");
    this.form.controls.direccion.setValue("");
    this.form.controls.telefono.setValue("");
    this.form.controls.ruc.setValue("");
    this.form.controls.email.setValue("");
    this.form.controls.observacion.setValue("");
    this.form.controls.sexo.setValue("1");
  }

  cerrarVentana(valor) {
    this.dialogRef.close(valor);
  }

}
