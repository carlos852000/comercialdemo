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
  selector: 'vex-grubros-caracteristicas',
  templateUrl: './grubros-caracteristicas.component.html',
  styleUrls: ['./grubros-caracteristicas.component.scss']
})
export class GrubrosCaracteristicasComponent implements OnInit {

  dataUsuario: Session;
  form: FormGroup;
  tituloForm: any;
  btnRegistro: any;
  
  //icons
  icClose=icClose;
  icMenu = icMenu;

  //Configuración
  idRubro : any = 0;
  idRubroCaracteristica : any = 0;
  idCatalogo : any = 0;
  tipoAccion : any = 0;
  datosRubroCaracteristica: any;
  habilitaBtnReg = false;
  spinBtnReg = false;

  lstCaracteristica: any = [];

  constructor(
    private dialogRef: MatDialogRef<GrubrosCaracteristicasComponent>,
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
    this.datosRubroCaracteristica = this.data.datosCaracteristica;
    this.idRubro = this.data.idrubro;
  }

  ngOnInit(): void {
    this.cargaInicial();
    if (this.datosRubroCaracteristica){
      this.tituloForm = "Editar Caracteristica";
      this.btnRegistro = "Actualizar";
      this.idRubroCaracteristica = this.datosRubroCaracteristica.idrubrocaracteristica;
      this.tipoAccion = 2;
    } else {
      this.tituloForm = "Registrar Caracteristica";
      this.btnRegistro = "Registrar";
      this.tipoAccion = 1;
    }
    this.form = this.formBuilder.group({
      catalogo: [this.data.datosCaracteristica?.idcaracteristica, [Validators.required,Validators.maxLength(5)]],
    });
  }

  cargaInicial() {
    this.habilitaBtnReg = true;
    //OBTIENE EL ID DE LA UNIDAD MEDIDA
    this.generalService.verificaCatalogo('TCARACTERPROD').subscribe(response =>{
      if (response.resultado == 1){
        this.idCatalogo = response.dato.idcatalogo;
        //LISTA EL CATALOGO DETALLE
        this.generalService.listaCatalogo(null,this.idCatalogo).subscribe(responseDetalle =>{
          this.lstCaracteristica = responseDetalle.dato;
          this.habilitaBtnReg = false;
        }, error => {
          this.habilitaBtnReg = true;
          this.utilsService.abrirMensajeToken(null, null, null, error);
        });
      }
    }, error => {
      this.habilitaBtnReg = true;
      this.utilsService.abrirMensajeToken(null, null, null, error);
    });
  }

  RegistrarCaracteristicas() {
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
      this.generalService.procesaCaracteristica(
        this.tipoAccion,
        this.idRubro,
        this.idRubroCaracteristica,
        this.form.get('catalogo').value,
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
