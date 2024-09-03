import { Component, OnInit, ViewChild } from '@angular/core';
import { fadeInUp400ms } from '../../../../@vex/animations/fade-in-up.animation';
import { stagger60ms } from '../../../../@vex/animations/stagger.animation';
import { scaleIn400ms } from '../../../../@vex/animations/scale-in.animation';
import { fadeInRight400ms } from '../../../../@vex/animations/fade-in-right.animation';

import icMoreVert from '@iconify/icons-ic/twotone-more-vert';
import icMenu from '@iconify/icons-ic/twotone-menu';
import icBubbleChart from '@iconify/icons-ic/twotone-bubble-chart';
import icAdd from '@iconify/icons-ic/twotone-add';
import icEdit from '@iconify/icons-ic/twotone-edit';
import icDelete from '@iconify/icons-ic/twotone-delete';
import icSearch from '@iconify/icons-ic/twotone-search';
import icMoney from '@iconify/icons-ic/round-attach-money';
import icDni from '@iconify/icons-ic/sharp-person-pin';
import icPhone from '@iconify/icons-ic/twotone-phone';
import icpCodigo from '@iconify/icons-ic/baseline-barcode';

import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PermisoService } from 'src/app/core/services/permisos.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { Session } from 'src/app/core/models/session.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationComponent } from 'src/app/shared/confirmation/confirmation.component';
import { UtilsService } from 'src/app/core/funciones/utils.service';
import { GeneralService } from 'src/app/core/services/general.service';
import { Constantes } from 'src/app/core/constants/constantes';

@Component({
  selector: 'vex-confsistemas',
  templateUrl: './confsistemas.component.html',
  styleUrls: ['./confsistemas.component.scss'],
  animations: [
    stagger60ms,
    fadeInUp400ms,
    scaleIn400ms,
    fadeInRight400ms,
  ]
})
export class ConfsistemasComponent implements OnInit {

  validandoPermiso = false;
  accesoFormulario = false;
  moduloOpcion = "modconfsistema";
  itemPrincipal = "General";
  dataUsuario: Session;

  form01: FormGroup;
  form02: FormGroup;
  layoutCtrl = new FormControl('layoutCtrl');

  //icons
  icMoreVert = icMoreVert;
  icMenu = icMenu;
  icBubbleChart = icBubbleChart;
  icAdd = icAdd;
  icEdit = icEdit;
  icDelete = icDelete;
  icSearch = icSearch;
  icMoney = icMoney;
  icNum = icDni;
  icPhone = icPhone;
  icpCodigo = icpCodigo;

  //Configuración
  idConfiguracion : any = '';
  rowConfiguracion : any = null;
  habilitaBtnReg = false;
  habilitaBtnReg2 = false;
  spinBtnReg = false;
  lstRubros:any = [];

  lstNumero = [
    {'id':10,'name':'10'},
    {'id':30,'name':'30'},
    {'id':50,'name':'50'},
  ]

  tipoEntradaNumero = 'onlynumero';
  tipoEntradaMoneda = 'numero';

  //Botones
  btnRegistro:any = false;

  constructor(
    private formBuilder: FormBuilder,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    private storageService: StorageService,
    private permisosService: PermisoService,
    private generalService: GeneralService,
    private utilsService: UtilsService,
  ) { 
    this.dataUsuario = this.storageService.getCurrentSession();
  }

  ngAfterContentInit(): void {
    this.validandoPermiso = true;
    this.permisosService.validaPermisosForms(this.dataUsuario.idperfil, this.moduloOpcion).subscribe(response => {
      if (response.dato.permiso == 1) {
        this.validaBotones(response.dato.idacceso);
        this.accesoFormulario = true;
      } else {
        this.validandoPermiso = false;
      }
    }, error => {
      this.validandoPermiso = false;
      this.utilsService.abrirMensajeToken(null, null, null, error);
    });
  }

  ngOnInit(): void {
    this.form01 = this.formBuilder.group({
      empresa: ['', [Validators.required,Validators.maxLength(250)]],
      direccion: ['', [Validators.required,Validators.maxLength(250)]],
      ruc: ['', [Validators.required,Validators.maxLength(12)]],
      igv: ['', [Validators.required,Validators.maxLength(5)]],
      telefono: ['', [Validators.required,Validators.maxLength(10)]],
      valdolar: ['', [Validators.required,Validators.maxLength(5)]],
      facelectronica: ['1'],
    });
    this.form02 = this.formBuilder.group({
      rubro: ['', Validators.required],
      generacodigointerno: ['1'],
      diasNovedad: ['', Validators.required],
      permitirDctosVentas: ['1'],
      gestionarPrecioTienda: ['1'],
      gestionarPrecioGrupo: ['1'],
      gestionarStock: ['1'],
      enviarCorreoCliente: ['1'],
      desagregarProductos: ['1'],
      mostrarnprodventas: ['', Validators.required],
      mostrarnprodmovimientos: ['', Validators.required],
      mostraretiqsinstock: ['1'],
      etiquetasinstock: ['', [Validators.required,Validators.maxLength(50)]],
      mostraretiqstockmin: ['1'],
      etiquetastockmin: ['', [Validators.required,Validators.maxLength(50)]],
      mostraretiqconstock: ['1'],
      etiquetaconstock: ['', [Validators.required,Validators.maxLength(50)]],
    });
    this.cargaInicial();
  }

  cargaInicial() {
    this.habilitaBtnReg = true;
    this.generalService.listaRubro(null,1000,1).subscribe(responseDetalle =>{
      this.lstRubros = responseDetalle.dato;
      this.generalService.verificaConfiguracion().subscribe(response =>{
        if (response.dato){
          this.rowConfiguracion = response.dato;
          this.idConfiguracion = this.rowConfiguracion.idconfiguracion;
          this.form01.controls.empresa.setValue(this.rowConfiguracion.empresa);
          this.form01.controls.direccion.setValue(this.rowConfiguracion.direccion);
          this.form01.controls.ruc.setValue(this.rowConfiguracion.ruc);
          this.form01.controls.igv.setValue(this.rowConfiguracion.igv);
          this.form01.controls.telefono.setValue(this.rowConfiguracion.telefono);
          this.form01.controls.valdolar.setValue(this.rowConfiguracion.cambiodolar);
          this.form01.controls.facelectronica.setValue(this.rowConfiguracion.indicadorfactelectronica.toString());

          this.form02.controls.rubro.setValue(this.rowConfiguracion.idrubro);
          this.form02.controls.generacodigointerno.setValue(this.rowConfiguracion.codigoproductointerno?.toString());
          this.form02.controls.diasNovedad.setValue(this.rowConfiguracion?.diasnovedad);
          this.form02.controls.permitirDctosVentas.setValue(this.rowConfiguracion.indicadordctsventas?.toString());
          this.form02.controls.gestionarPrecioTienda.setValue(this.rowConfiguracion.indicadorprecioporlocal?.toString());
          this.form02.controls.gestionarPrecioGrupo.setValue(this.rowConfiguracion.indicadorprecioporgrupos?.toString());
          this.form02.controls.gestionarStock.setValue(this.rowConfiguracion.gestionarstock?.toString());
          this.form02.controls.enviarCorreoCliente.setValue(this.rowConfiguracion.indicadorenviarcorreocliente?.toString());
          this.form02.controls.desagregarProductos.setValue(this.rowConfiguracion.indicadordesagregarproducto?.toString());
          this.form02.controls.mostrarnprodventas.setValue(this.rowConfiguracion.nummostrarprodventas);
          this.form02.controls.mostrarnprodmovimientos.setValue(this.rowConfiguracion.nummostrarprodcompras);
          this.form02.controls.mostraretiqsinstock.setValue(this.rowConfiguracion.indicadoretiquetaprodsinstock?.toString());
          this.form02.controls.etiquetasinstock.setValue(this.rowConfiguracion.etiquetaprodsinstock);
          this.form02.controls.mostraretiqstockmin.setValue(this.rowConfiguracion.indicadoretiquetaprodconstockmin?.toString());
          this.form02.controls.etiquetastockmin.setValue(this.rowConfiguracion.etiquetaprodconstockmin);
          this.form02.controls.mostraretiqconstock.setValue(this.rowConfiguracion.indicadoretiquetaprodconstock?.toString());
          this.form02.controls.etiquetaconstock.setValue(this.rowConfiguracion.etiquetaprodconstock);
          this.validaEtiquetas(1,this.rowConfiguracion.indicadoretiquetaprodsinstock);
          this.validaEtiquetas(2,this.rowConfiguracion.indicadoretiquetaprodconstockmin);
          this.validaEtiquetas(3,this.rowConfiguracion.indicadoretiquetaprodconstock);
          this.habilitaBtnReg = false;
          this.habilitaBtnReg2 = false;
        } else {
          this.habilitaBtnReg = false;
          this.habilitaBtnReg2 = true;
        }
      }, error => {
        this.habilitaBtnReg = true;
        this.habilitaBtnReg2 = true;
        this.utilsService.abrirMensajeToken(null, null, null, error);
      });
    }, error => {
      this.habilitaBtnReg = true;
      this.habilitaBtnReg2 = true;
      this.utilsService.abrirMensajeToken(null, null, null, error);
    });
    
  }

  validaEtiquetas(Tipo,valor) {
    if (Tipo == 1){
      if (valor == 1){
        //console.log("1-B",this.form02.get('mostraretiqsinstock').value);
        this.form02.get('etiquetasinstock').enable();
      } else {
        //console.log("1-A",this.form02.get('mostraretiqsinstock').value);
        this.form02.get('etiquetasinstock').disable();
        this.form02.controls.etiquetasinstock.setValue("");
      }
    }
    if (Tipo == 2){
      if (valor == 1){
        //console.log("2-B",this.form02.get('mostraretiqstockmin').value);
        this.form02.get('etiquetastockmin').enable();
      } else {
        //console.log("2-A",this.form02.get('mostraretiqstockmin').value);
        this.form02.get('etiquetastockmin').disable();
        this.form02.controls.etiquetastockmin.setValue("");
      }
    }
    if (Tipo == 3){
      if (valor == 1){
        //console.log("3-B",this.form02.get('mostraretiqconstock').value);
        this.form02.get('etiquetaconstock').enable();
      } else {
        //console.log("3-A",this.form02.get('mostraretiqconstock').value);
        this.form02.get('etiquetaconstock').disable();
        this.form02.controls.etiquetaconstock.setValue("");
      }
    }
  }

  registrarParte01() {
    this.form01.markAllAsTouched();
    if (this.form01.invalid){
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
      this.generalService.procesaConfiguracion01(
        this.idConfiguracion,
        this.form01.get('empresa').value,
        this.form01.get('direccion').value,
        this.form01.get('ruc').value,
        this.form01.get('telefono').value,
        this.form01.get('igv').value,
        this.form01.get('valdolar').value,
        this.form01.get('facelectronica').value,
      ).subscribe(response =>{
        this.habilitaBtnReg = false;
        this.spinBtnReg = false;
        this.cargaInicial();
        this.snackbar.open(response.mensaje, null, {
          duration: Constantes.SNACKBAR_TIME,
          horizontalPosition: 'end',
          verticalPosition: 'top',
        });
      }, error => {
        this.habilitaBtnReg = false;
        this.spinBtnReg = false;
        this.utilsService.abrirMensajeToken(null, null, null, error);
      });
    });
  }

  registrarParte02() {
    this.form02.markAllAsTouched();
    if (this.form02.invalid){
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
      this.generalService.procesaConfiguracion02(
        this.idConfiguracion,
        this.form02.get('rubro').value,
        this.form02.get('generacodigointerno').value,
        this.form02.get('diasNovedad').value,
        this.form02.get('permitirDctosVentas').value,
        this.form02.get('gestionarPrecioTienda').value,
        this.form02.get('gestionarPrecioGrupo').value,
        this.form02.get('gestionarStock').value,
        this.form02.get('enviarCorreoCliente').value,
        this.form02.get('desagregarProductos').value,
        this.form02.get('mostrarnprodventas').value,
        this.form02.get('mostrarnprodmovimientos').value,
        this.form02.get('mostraretiqsinstock').value,
        this.form02.get('etiquetasinstock').value,
        this.form02.get('mostraretiqstockmin').value,
        this.form02.get('etiquetastockmin').value,
        this.form02.get('mostraretiqconstock').value,
        this.form02.get('etiquetaconstock').value,
      ).subscribe(response =>{
        this.habilitaBtnReg = false;
        this.spinBtnReg = false;
        this.cargaInicial();
        this.snackbar.open(response.mensaje, null, {
          duration: Constantes.SNACKBAR_TIME,
          horizontalPosition: 'end',
          verticalPosition: 'top',
        });
      }, error => {
        this.habilitaBtnReg = false;
        this.spinBtnReg = false;
        this.utilsService.abrirMensajeToken(null, null, null, error);
      });
    });
  }

  //ValidaBotones
  validaBotones(idacceso) {
    this.permisosService.validaAccesoBoton(idacceso,"btnRegistro").subscribe(responseBoton =>{
      if (responseBoton.dato.permiso == 1) {
        this.btnRegistro = true;
      } 
    });
  }

}
