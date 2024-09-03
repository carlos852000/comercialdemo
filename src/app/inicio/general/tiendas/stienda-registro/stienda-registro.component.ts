import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';

import icClose from '@iconify/icons-ic/twotone-close';
import icMenu from '@iconify/icons-ic/twotone-menu';
import icMail from '@iconify/icons-ic/twotone-mail';

import { ConfirmationComponent } from 'src/app/shared/confirmation/confirmation.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Constantes } from 'src/app/core/constants/constantes';
import { SistemaService } from 'src/app/core/services/sistema.service';
import { UtilsService } from 'src/app/core/funciones/utils.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { Session } from 'src/app/core/models/session.model';
import { TiendaService } from 'src/app/core/services/tienda.service';
import { GeneralService } from 'src/app/core/services/general.service';


@Component({
  selector: 'vex-stienda-registro',
  templateUrl: './stienda-registro.component.html',
  styleUrls: ['./stienda-registro.component.scss']
})
export class StiendaRegistroComponent implements OnInit {

  dataUsuario: Session;
  form: FormGroup;
  tituloForm: any;
  btnRegistro: any;
  lstTipoTiendas:any = [];

  //icons
  icClose=icClose;
  icMenu = icMenu;
  icMail = icMail;

  //Configuración
  idTienda : any = 0;
  tipoAccion : any = 0;
  datosTienda: any;
  habilitaBtnReg = false;
  spinBtnReg = false;

  lsIndicadorCentral = [
    {'id':1,'name':'SI'},
    {'id':0,'name':'NO'},
  ]

  constructor(
    private dialogRef: MatDialogRef<StiendaRegistroComponent>,
    private snackbar: MatSnackBar,
    private storageService: StorageService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private sistemasService: SistemaService,
    private generalService: GeneralService,
    private tiendaService: TiendaService,
    private utilsService: UtilsService,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) { 
    this.dataUsuario = this.storageService.getCurrentSession();
    this.datosTienda = this.data.datosTienda;
  }

  ngOnInit(): void {
    this.cargaInicial();
    if (this.datosTienda){
      this.tituloForm = "Editar Tienda";
      this.btnRegistro = "Actualizar";
      this.idTienda = this.datosTienda.idtienda;
      this.tipoAccion = 2;
    } else {
      this.tituloForm = "Registrar Tienda";
      this.btnRegistro = "Registrar";
      this.tipoAccion = 1;
    }
    this.form = this.formBuilder.group({
      idtipo: [this.data.datosTienda?.idtipo, Validators.required],
      nombre: [this.data.datosTienda?.nombre, [Validators.required,Validators.maxLength(250)]],
      direccion: [this.data.datosTienda?.direccion, [Validators.required,Validators.maxLength(250)]],
      telefono: [this.data.datosTienda?.telefono, [Validators.required,Validators.maxLength(10)]],
      email: [this.data.datosTienda?.email, [Validators.required,Validators.maxLength(150), Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],
      indicadorcentral: [this.data.datosTienda?.indicadorcentral, Validators.required],
    });
  }

  cargaInicial() {
    this.habilitaBtnReg = true;
    this.generalService.listaCatalogo('TTIENDASIST',0).subscribe(response =>{
      this.lstTipoTiendas = response.dato;
      this.habilitaBtnReg = false;
    }, error => {
      this.habilitaBtnReg = true;
      this.utilsService.abrirMensajeToken(null, null, null, error);
    });
  }

  RegistrarTienda() {
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
      this.tiendaService.procesaTienda(
        this.tipoAccion,
        this.idTienda,
        this.form.get('idtipo').value,
        this.form.get('nombre').value,
        this.form.get('telefono').value,
        this.form.get('direccion').value,
        this.form.get('email').value,
        this.form.get('indicadorcentral').value,
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
