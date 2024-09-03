import { Component, OnInit,Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { fadeInUp400ms } from '../../../../../@vex/animations/fade-in-up.animation';
import { stagger60ms } from '../../../../../@vex/animations/stagger.animation';
import { scaleIn400ms } from '../../../../../@vex/animations/scale-in.animation';
import { fadeInRight400ms } from '../../../../../@vex/animations/fade-in-right.animation';

import icClose from '@iconify/icons-ic/twotone-close';
import icBubbleChart from '@iconify/icons-ic/twotone-bubble-chart';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { SistemaService } from 'src/app/core/services/sistema.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { UtilsService } from 'src/app/core/funciones/utils.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Session } from 'src/app/core/models/session.model';
import { SbotonesAccesoComponent } from '../sbotones-acceso/sbotones-acceso.component';


@Component({
  selector: 'vex-sacceso-registro',
  templateUrl: './sacceso-registro.component.html',
  styleUrls: ['./sacceso-registro.component.scss'],
  animations: [
    stagger60ms,
    fadeInUp400ms,
    scaleIn400ms,
    fadeInRight400ms,
  ]
})
export class SaccesoRegistroComponent implements OnInit {

  form: FormGroup;
  dataUsuario: Session;
  layoutCtrl = new FormControl('layoutCtrl');
  tituloForm: any;

  //icons
  icClose=icClose;
  icBubbleChart = icBubbleChart;

  //Configuración
  datosPerfil: any;
  loadingOpciones = false;

  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['correlativo', 'opcion','botones'];

  //Paginación
  pagina = 1;
  totalRegistros = 0;
  totalPaginas = 0;
  pageIndex = 0;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  totalRegistrosPorPagina: any = 10;
  Param1Filt: any;
  Param2Filt: any;
  numeracion = 0;
  filtro = [
    {valor:'50'},
    {valor:'100'},
    {valor:'150'},
    {valor:'200'}];

  constructor(
    private dialogRef: MatDialogRef<SaccesoRegistroComponent>,
    private formBuilder: FormBuilder,
    private storageService: StorageService,
    private sistemasService: SistemaService,
    private dialog: MatDialog,
    private utilsService: UtilsService,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) { 
    this.dataUsuario = this.storageService.getCurrentSession();
    this.datosPerfil = this.data;
  }

  ngOnInit(): void {
    this.tituloForm = "Accesos del Sistema" + " - Perfil: "+this.datosPerfil.nombre;
    this.form = this.formBuilder.group({
    });
    this.listaOpciones(this.pagina);
  }

  listaOpciones(pagina) {
    this.loadingOpciones = true;
    this.pagina = pagina;
    this.numeracion = this.totalRegistrosPorPagina * (this.pagina - 1);
    let numRegistros = this.totalRegistrosPorPagina;
    let numPagina = this.pagina;
    this.sistemasService.listaOpciones(
      this.dataUsuario.idsistema,
      null,
      numRegistros,
      numPagina
      ).subscribe(response =>{
        response.dato.forEach((row) => {
          this.form.addControl("group-" + row.idopcion, this.formBuilder.group({
            activecheck: [false],
            idacceso:[]
          }));
          
          this.sistemasService.verificarAcceso(
            this.datosPerfil.idperfil,
            row.idopcion,
            ).subscribe(responseVerifica =>{
              if (responseVerifica.dato?.idacceso > 0){
                this.form.get("group-" + row.idopcion).get("activecheck").setValue(true);
                //this.form.get("group-" + row.idopcion).get("idacceso").setValue(responseVerifica.dato?.idacceso);
                row.rowAcceso = responseVerifica.dato?.idacceso;
              } else {
                this.form.get("group-" + row.idopcion).get("activecheck").setValue(false);
                //this.form.get("group-" + row.idopcion).get("idacceso").setValue(0);
              }
              //totalVerifica
            }, error => {
              //this.utilsService.abrirMensajeToken(null, null, null, error);
              this.form.get("group-" + row.idopcion).get("activecheck").setValue(false);
              //this.form.get("group-" + row.idopcion).get("idacceso").setValue(0);
              row.rowAcceso = 0;
            });
        });

      this.dataSource.data = response.dato;
      //console.log("DATA",response.dato);
      this.totalRegistros = response.totalFilas;
      this.totalPaginas = response.totalPages;
      if(this.totalPaginas == 1){
        this.dataSource.paginator = this.paginator;
        this.pageIndex = 0;
      }
      this.loadingOpciones = false;
    }, error => {
      this.loadingOpciones = false;
      this.utilsService.abrirMensajeToken(null, null, null, error);
    });
  }

  /*varifica(opcion) {
    var valor = this.form.get("group-" + opcion).get("idacceso").value;
    if (valor > 0){
      return true;
    } else {
      return false;
    }
  }*/

  isSelectedCheck(event:MatCheckboxChange,row): void {
    var valorSelect = 0;
    if (event.checked) {
      valorSelect = 1;
    }
    this.sistemasService.procesaAcceso(
      this.datosPerfil.idperfil,
      row.idopcion,
      valorSelect
      ).subscribe(response =>{
        if (valorSelect == 1){
          row.rowAcceso = response.dato.idacceso;
        } else {
          row.rowAcceso = 0;
        }
      }, error => {
        this.utilsService.abrirMensajeToken(null, null, null, error);
      });
  }

  gestionarBotones(row) {
    const dialogRef = this.dialog.open(SbotonesAccesoComponent, {
      width: '450px',
      disableClose: true,
      data: row
    });
    dialogRef.afterClosed().subscribe((result) => {
    });
  }
  //Paginacion
  listarPorPagina(event) {
    this.pagina = event.pageIndex + 1;
    this.listaOpciones(this.pagina);
  }

  cerrarVentana(valor) {
    this.dialogRef.close(valor);
  }

}
