import { Component, OnInit } from '@angular/core';
import { fadeInUp400ms } from '../../../../@vex/animations/fade-in-up.animation';
import { stagger60ms } from '../../../../@vex/animations/stagger.animation';
import { scaleIn400ms } from '../../../../@vex/animations/scale-in.animation';
import { fadeInRight400ms } from '../../../../@vex/animations/fade-in-right.animation';

import icMoreVert from '@iconify/icons-ic/twotone-more-vert';
import icMenu from '@iconify/icons-ic/twotone-menu';
import icBubbleChart from '@iconify/icons-ic/twotone-bubble-chart';

import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PermisoService } from 'src/app/core/services/permisos.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { SistemaService } from 'src/app/core/services/sistema.service';
import { Session } from 'src/app/core/models/session.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationComponent } from 'src/app/shared/confirmation/confirmation.component';
import { UtilsService } from 'src/app/core/funciones/utils.service';
import { Constantes } from 'src/app/core/constants/constantes';


@Component({
  selector: 'vex-sistema',
  templateUrl: './sistema.component.html',
  styleUrls: ['./sistema.component.scss'],
  animations: [
    stagger60ms,
    fadeInUp400ms,
    scaleIn400ms,
    fadeInRight400ms,
  ]
})
export class SistemaComponent implements OnInit {

  //PermisosFormulario
  validandoPermiso = false;
  accesoFormulario = false;
  moduloOpcion = "modsegsistema";
  itemPrincipal = "Seguridad";
  dataUsuario: Session;

  form: FormGroup;
  layoutCtrl = new FormControl('layoutCtrl');

  //icons
  icMoreVert = icMoreVert;
  icMenu = icMenu;
  icBubbleChart = icBubbleChart;

  //Configuración
  idSistema : any = 0;
  habilitaBtnReg = false;
  spinBtnReg = false;

  //Botones
  btnRegistrar:any = false;

  constructor(
    private formBuilder: FormBuilder,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    private storageService: StorageService,
    private permisosService: PermisoService,
    private sistemasService: SistemaService,
    private utilsService: UtilsService,
  ) {
    this.dataUsuario = this.storageService.getCurrentSession();
  }

  ngAfterContentInit(): void {
    this.validandoPermiso = true;
    this.btnRegistrar = false;
    this.permisosService.validaPermisosForms(this.dataUsuario.idperfil,this.moduloOpcion).subscribe(response =>{
      if (response.dato.permiso == 1) {
        this.validaBotones(response.dato.idacceso);
        this.accesoFormulario = true;
        this.obtieneDatosSistema();
      } else {
        this.validandoPermiso = false;
      }
    }, error => {
      this.validandoPermiso = false;
      this.utilsService.abrirMensajeToken(null, null, null, error);
    });
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nombre: ['', Validators.required],
      abreviatura: ['', Validators.required],
      version: ['', Validators.required],
      enlace: ['', Validators.required],
    });
  }

  obtieneDatosSistema() {
    this.sistemasService.verificaSistema().subscribe(response =>{
      if (response.resultado == 1) {
        this.idSistema = response.dato.idsistema;
        this.form.get("nombre").setValue(response.dato.nombre);
        this.form.get("abreviatura").setValue(response.dato.abreviatura);
        this.form.get("version").setValue(response.dato.version);
        this.form.get("enlace").setValue(response.dato.enlace);
      }
    }, error => {
      this.utilsService.abrirMensajeToken(null, null, null, error);
    });
  }

  RegistrarSistema() {
    this.form.markAllAsTouched();
    if (this.form.invalid){
      this.snackbar.open('Existe información requerida por registrar.', null, {
        duration: Constantes.SNACKBAR_TIME,
        horizontalPosition: 'end',
        verticalPosition: 'top',
      });
      return;
    }
    var mensaje = "¿Desea registrar esta información?";
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      disableClose: true,
      width: '350px',
      data: {content: mensaje}
    });
    const sub = dialogRef.componentInstance.onSi.subscribe(data => {
      this.habilitaBtnReg = true;
      this.spinBtnReg = true;
      this.sistemasService.procesaSistema(
        this.idSistema,
        this.form.get('nombre').value,
        this.form.get('abreviatura').value,
        this.form.get('version').value,
        this.form.get('enlace').value
      ).subscribe(response =>{
        this.habilitaBtnReg = false;
        this.spinBtnReg = false;
        this.snackbar.open(response.mensaje, null, {
          duration: Constantes.SNACKBAR_TIME,
          horizontalPosition: 'end',
          verticalPosition: 'top',
        });
        dialogRef.close();
      }, error => {
        this.utilsService.abrirMensajeToken(null, null, null, error);
      });
    });
  }

  //ValidaBotones
  validaBotones(idacceso) {
    this.permisosService.validaAccesoBoton(idacceso,"BtnRegistrar").subscribe(responseBoton =>{
      if (responseBoton.dato.permiso == 1) {
        this.btnRegistrar = true;
      } 
    });
  }

}
