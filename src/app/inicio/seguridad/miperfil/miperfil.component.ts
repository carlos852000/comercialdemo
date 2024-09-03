import { Component, OnInit } from '@angular/core';
import { fadeInUp400ms } from '../../../../@vex/animations/fade-in-up.animation';
import { stagger60ms } from '../../../../@vex/animations/stagger.animation';
import { scaleIn400ms } from '../../../../@vex/animations/scale-in.animation';
import { fadeInRight400ms } from '../../../../@vex/animations/fade-in-right.animation';

import icMoreVert from '@iconify/icons-ic/twotone-more-vert';
import icMenu from '@iconify/icons-ic/twotone-menu';
import icBubbleChart from '@iconify/icons-ic/twotone-bubble-chart';
import icDni from '@iconify/icons-ic/sharp-person-pin';

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
import icPerson from '@iconify/icons-ic/twotone-person';
import icMail from '@iconify/icons-ic/twotone-mail';
import { ActualizaClaveComponent } from './actualiza-clave/actualiza-clave.component';


@Component({
  selector: 'vex-miperfil',
  templateUrl: './miperfil.component.html',
  styleUrls: ['./miperfil.component.scss'],
  animations: [
    stagger60ms,
    fadeInUp400ms,
    scaleIn400ms,
    fadeInRight400ms,
  ]
})
export class MiperfilComponent implements OnInit {

  //PermisosFormulario
  validandoPermiso = false;
  itemPrincipal = "Inicio";
  dataUsuario: Session;

  form: FormGroup;
  layoutCtrl = new FormControl('layoutCtrl');

  //icons
  icDni = icDni;
  icPerson = icPerson;
  icMail = icMail;
  icMoreVert = icMoreVert;
  /*icMenu = icMenu;*/
  icBubbleChart = icBubbleChart;

  //Configuración
  idSistema : any = 0;
  habilitaBtnReg = false;
  spinBtnReg = false;

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

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      tipoDocumento: [{value:this.dataUsuario.tipodocumento,disabled: true}],
      numDNI: [{value:this.dataUsuario.numerodocumento,disabled: true}],
      apellidoPaterno: [{value:this.dataUsuario.apellidopaterno,disabled: true}],
      apellidoMaterno: [{value:this.dataUsuario.apellidomaterno,disabled: true}],
      nombre: [{value:this.dataUsuario.nombres,disabled: true}],
      email: [this.dataUsuario.email, [Validators.required,Validators.maxLength(150), Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],
    });
  }

  ActualizarDatos() {
    this.form.markAllAsTouched();
    if (this.form.invalid){
      this.snackbar.open('Existe información requerida por registrar.', null, {
        duration: Constantes.SNACKBAR_TIME,
        horizontalPosition: 'end',
        verticalPosition: 'top',
      });
      return;
    }
    var mensaje = "¿Desea actualizar su información?";
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      disableClose: true,
      width: '350px',
      data: {content: mensaje}
    });
    const sub = dialogRef.componentInstance.onSi.subscribe(data => {
      this.habilitaBtnReg = true;
      this.spinBtnReg = true;
      this.sistemasService.actualizaDatosUsuario(
        this.form.get('email').value
      ).subscribe(response =>{
        this.habilitaBtnReg = false;
        this.spinBtnReg = false;
        this.dataUsuario.email = this.form.get('email').value;
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

  CambiarClave(){
    const dialogRef = this.dialog.open(ActualizaClaveComponent, {
      width: '450px',
      disableClose: true,
      data: null
    });
    dialogRef.afterClosed().subscribe((result) => {

    });
  }

}
