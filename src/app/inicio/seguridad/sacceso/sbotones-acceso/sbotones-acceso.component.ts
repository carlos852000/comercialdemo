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

import { MatCheckboxChange } from '@angular/material/checkbox';
import { UtilsService } from 'src/app/core/funciones/utils.service';
import { Session } from 'src/app/core/models/session.model';
import { SistemaService } from 'src/app/core/services/sistema.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { ConfirmationComponent } from 'src/app/shared/confirmation/confirmation.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Constantes } from 'src/app/core/constants/constantes';

@Component({
  selector: 'vex-sbotones-acceso',
  templateUrl: './sbotones-acceso.component.html',
  styleUrls: ['./sbotones-acceso.component.scss'],
  animations: [
    stagger60ms,
    fadeInUp400ms,
    scaleIn400ms,
    fadeInRight400ms,
  ]
})
export class SbotonesAccesoComponent implements OnInit {

  form: FormGroup;
  dataUsuario: Session;
  tituloForm: any;
  datosOpcion: any;

  //icons
  icClose=icClose;
  icBubbleChart = icBubbleChart;

  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['correlativo', 'boton'];

  loadingBotones = false;

  constructor(
    private dialogRef: MatDialogRef<SbotonesAccesoComponent>,
    private storageService: StorageService,
    private formBuilder: FormBuilder,
    private sistemasService: SistemaService,
    private utilsService: UtilsService,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) { 
    this.datosOpcion = this.data;
    this.dataUsuario = this.storageService.getCurrentSession();
  }

  ngOnInit(): void {
    this.tituloForm = this.datosOpcion.nombre;
    this.form = this.formBuilder.group({
    });
    this.listaBotones();
  }

  listaBotones() {
    this.loadingBotones = true;
    this.sistemasService.listaBotones(
      this.datosOpcion.idopcion
      ).subscribe(response =>{
        response.dato.forEach((row) => {
          this.form.addControl("group-" + row.idopcionboton, this.formBuilder.group({
            activecheck: [false],
          }));
          this.sistemasService.verificarAccesoBoton(
            this.datosOpcion.rowAcceso,
            row.idopcionboton,
            ).subscribe(responseVerifica =>{
              if (responseVerifica.dato?.idaccesoboton > 0){
                this.form.get("group-" + row.idopcionboton).get("activecheck").setValue(true);
              } else {
                this.form.get("group-" + row.idopcionboton).get("activecheck").setValue(false);
              }
              //totalVerifica
            }, error => {
              //this.utilsService.abrirMensajeToken(null, null, null, error);
              this.form.get("group-" + row.idopcionboton).get("activecheck").setValue(false);
            });
        });
      this.dataSource.data = response.dato;
      this.loadingBotones = false;
    }, error => {
      this.loadingBotones = false;
      this.utilsService.abrirMensajeToken(null, null, null, error);
    });
  }

  isSelectedCheck(event:MatCheckboxChange,Valor): void {
    var valorSelect = 0;
    if (event.checked) {
      valorSelect = 1;
    }
    this.sistemasService.procesaAccesoBoton(
      this.datosOpcion.rowAcceso,
      Valor,
      valorSelect
      ).subscribe(response =>{
      }, error => {
        this.utilsService.abrirMensajeToken(null, null, null, error);
      });
  }

  cerrarVentana(valor) {
    this.dialogRef.close(valor);
  }

}
