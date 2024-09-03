import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { fadeInUp400ms } from '../../../../../@vex/animations/fade-in-up.animation';
import { stagger60ms } from '../../../../../@vex/animations/stagger.animation';
import { scaleIn400ms } from '../../../../../@vex/animations/scale-in.animation';
import { fadeInRight400ms } from '../../../../../@vex/animations/fade-in-right.animation';

import icClose from '@iconify/icons-ic/twotone-close';
import icAdd from '@iconify/icons-ic/twotone-add';
import icBubbleChart from '@iconify/icons-ic/twotone-bubble-chart';
import icEdit from '@iconify/icons-ic/twotone-edit';
import icDelete from '@iconify/icons-ic/twotone-delete';

import { UtilsService } from 'src/app/core/funciones/utils.service';
import { Session } from 'src/app/core/models/session.model';
import { SistemaService } from 'src/app/core/services/sistema.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { SbotonRegistroComponent } from '../sboton-registro/sboton-registro.component';
import { ConfirmationComponent } from 'src/app/shared/confirmation/confirmation.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Constantes } from 'src/app/core/constants/constantes';


@Component({
  selector: 'vex-sboton-bandeja',
  templateUrl: './sboton-bandeja.component.html',
  styleUrls: ['./sboton-bandeja.component.scss'],
  animations: [
    stagger60ms,
    fadeInUp400ms,
    scaleIn400ms,
    fadeInRight400ms,
  ]
})
export class SbotonBandejaComponent implements OnInit {

  dataUsuario: Session;
  tituloForm: any;
  datosOpcion: any;

  //icons
  icClose=icClose;
  icAdd = icAdd;
  icEdit = icEdit;
  icDelete = icDelete;
  icBubbleChart = icBubbleChart;
  
  loadingBotones = false;
  habilitaBtnReg = false;
  spinBtnReg = false;

  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['correlativo', 'boton', 'accion'];

  constructor(
    private dialogRef: MatDialogRef<SbotonBandejaComponent>,
    private storageService: StorageService,
    private sistemasService: SistemaService,
    private snackbar: MatSnackBar,
    private utilsService: UtilsService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) { 
    this.datosOpcion = this.data;
    this.dataUsuario = this.storageService.getCurrentSession();
  }

  ngOnInit(): void {
    this.tituloForm = this.datosOpcion.nombre;
    this.listaBotones();
    
  }

  listaBotones() {
    this.loadingBotones = true;
    this.sistemasService.listaBotones(
      this.datosOpcion.idopcion
      ).subscribe(response =>{
      this.dataSource.data = response.dato;
      this.loadingBotones = false;
    }, error => {
      this.loadingBotones = false;
      this.utilsService.abrirMensajeToken(null, null, null, error);
    });
  }

  crearBoton() {
    var data = {
      datosBoton: null
    }
    this.gestionarBoton(data);
  }

  actualizarBoton(row) {
    var data = {
      datosBoton: row
    }
    this.gestionarBoton(data);
  }

  gestionarBoton(datos){
    const dialogRef = this.dialog.open(SbotonRegistroComponent, {
      width: '650px',
      disableClose: true,
      data: {
        datos: datos,
        datosOpcion : this.datosOpcion
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == "OK"){
        this.listaBotones();
      }
    });
  }

  eliminarBoton(row) {
    var mensaje = "¿Desea eliminar esta información?";
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      disableClose: true,
      width: '350px',
      data: {content: mensaje}
    });
    const sub = dialogRef.componentInstance.onSi.subscribe(data => {
      this.habilitaBtnReg = true;
      this.spinBtnReg = true;
      this.sistemasService.eliminaBoton(
        row.idopcionboton
      ).subscribe(response =>{
        this.habilitaBtnReg = false;
        this.spinBtnReg = false;
        this.snackbar.open(response.mensaje, null, {
          duration: Constantes.SNACKBAR_TIME,
          horizontalPosition: 'end',
          verticalPosition: 'top',
        });
        this.listaBotones();
        dialogRef.close();
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
