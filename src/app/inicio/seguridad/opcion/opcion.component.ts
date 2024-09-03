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

import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PermisoService } from 'src/app/core/services/permisos.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { Session } from 'src/app/core/models/session.model';
import { SistemaService } from 'src/app/core/services/sistema.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationComponent } from 'src/app/shared/confirmation/confirmation.component';
import { UtilsService } from 'src/app/core/funciones/utils.service';
import { MatTableDataSource } from '@angular/material/table';
import { Constantes } from 'src/app/core/constants/constantes';
import { MatPaginator } from '@angular/material/paginator';
import { SopcionRegistroComponent } from './sopcion-registro/sopcion-registro.component';
import { SbotonBandejaComponent } from './sboton-bandeja/sboton-bandeja.component';

@Component({
  selector: 'vex-opcion',
  templateUrl: './opcion.component.html',
  styleUrls: ['./opcion.component.scss'],
  animations: [
    stagger60ms,
    fadeInUp400ms,
    scaleIn400ms,
    fadeInRight400ms,
  ]
})
export class OpcionComponent implements OnInit {

  //PermisosFormulario
  validandoPermiso = false;
  accesoFormulario = false;
  moduloOpcion = "modsegopcion";
  itemPrincipal = "Seguridad";
  dataUsuario: Session;

  form: FormGroup;
  layoutCtrl = new FormControl('layoutCtrl');

  //icons
  icMoreVert = icMoreVert;
  icMenu = icMenu;
  icBubbleChart = icBubbleChart;
  icAdd = icAdd;
  icEdit = icEdit;
  icDelete = icDelete;
  icSearch = icSearch;

  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['correlativo', 'perfil', 'accion'];

  loadingOpciones = false;
  habilitaBtnReg = false;
  spinBtnReg = false;

  //Paginación
  pagina = 1;
  totalRegistros = 0;
  totalPaginas = 0;
  pageIndex = 0;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  totalRegistrosPorPagina: any = localStorage.getItem("filtroCM") == null ? 100 : localStorage.getItem("filtroCM");
  Param1Filt: any;
  Param2Filt: any;
  numeracion = 0;
  filtro = [
    {valor:'50'},
    {valor:'100'},
    {valor:'150'},
    {valor:'200'}];

  //Botones
  btnNuevo:any = false;
  btnSubir:any = false;
  btnBajar:any = false;
  btnModificar:any = false;
  btnEliminar:any = false;
  btnBotones:any = false;

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
    this.permisosService.validaPermisosForms(this.dataUsuario.idperfil, this.moduloOpcion).subscribe(response => {
      if (response.dato.permiso == 1) {
        this.validaBotones(response.dato.idacceso);
        this.accesoFormulario = true;
        this.listaOpciones(this.pagina);
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
      nombreOpcion: [''],
      filtroBusk: this.totalRegistrosPorPagina,
    });
  }

  listaOpciones(pagina) {
    this.loadingOpciones = true;
    this.pagina = pagina;
    this.numeracion = this.totalRegistrosPorPagina * (this.pagina - 1);
    let numRegistros = this.totalRegistrosPorPagina;
    let numPagina = this.pagina;
    this.sistemasService.listaOpciones(
      this.dataUsuario.idsistema,
      this.form.get('nombreOpcion').value,
      numRegistros,
      numPagina
      ).subscribe(response =>{
      this.dataSource.data = response.dato;
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

  crearOpcion() {
    var data = {
      datosOpcion: null
    }
    this.gestionarOpcion(data);
  }

  actualizarOpcion(row) {
    var data = {
      datosOpcion: row
    }
    this.gestionarOpcion(data);
  }

  gestionarOpcion(datos){
    const dialogRef = this.dialog.open(SopcionRegistroComponent, {
      width: '650px',
      disableClose: true,
      data: datos
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == "OK"){
        this.listaOpciones(this.pagina);
      }
    });
  }

  ordenarOpcion(row,valor) {
    this.habilitaBtnReg = true;
    this.sistemasService.ordenarOpcion(
      row.idopcion,
      valor
    ).subscribe(response =>{
      this.habilitaBtnReg = false;
      this.snackbar.open(response.mensaje, null, {
        duration: Constantes.SNACKBAR_TIME,
        horizontalPosition: 'end',
        verticalPosition: 'top',
      });
      this.listaOpciones(this.pagina);
    }, error => {
      this.habilitaBtnReg = false;
      this.utilsService.abrirMensajeToken(null, null, null, error);
    });
  }

  gestionarBotones(row) {
    const dialogRef = this.dialog.open(SbotonBandejaComponent, {
      width: '650px',
      disableClose: true,
      data: row
    });
    dialogRef.afterClosed().subscribe((result) => {
    });
  }

  eliminarOpcion(row) {
    var mensaje = "¿Desea eliminar esta información?";
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      disableClose: true,
      width: '350px',
      data: {content: mensaje}
    });
    const sub = dialogRef.componentInstance.onSi.subscribe(data => {
      this.habilitaBtnReg = true;
      this.spinBtnReg = true;
      this.sistemasService.eliminaOpcion(
        row.idopcion
      ).subscribe(response =>{
        this.habilitaBtnReg = false;
        this.spinBtnReg = false;
        this.snackbar.open(response.mensaje, null, {
          duration: Constantes.SNACKBAR_TIME,
          horizontalPosition: 'end',
          verticalPosition: 'top',
        });
        this.listaOpciones(this.pagina);
        dialogRef.close();
      }, error => {
        this.habilitaBtnReg = false;
        this.spinBtnReg = false;
        this.utilsService.abrirMensajeToken(null, null, null, error);
      });
    });
  }

  //Paginacion
  listarPorPagina(event) {
    this.pagina = event.pageIndex + 1;
    this.listaOpciones(this.pagina);
  }

  cambiaFiltroBusk() {
    this.totalRegistrosPorPagina = this.form.get('filtroBusk').value;
    localStorage.setItem('filtroCM', this.form.get('filtroBusk').value);
    this.listaOpciones(this.pagina);
  }

  //ValidaBotones
  validaBotones(idacceso) {
    this.permisosService.validaAccesoBoton(idacceso,"btnNuevo").subscribe(responseBoton =>{
      if (responseBoton.dato.permiso == 1) {
        this.btnNuevo = true;
      } 
    });
    this.permisosService.validaAccesoBoton(idacceso,"btnSubir").subscribe(responseBoton =>{
      if (responseBoton.dato.permiso == 1) {
        this.btnSubir = true;
      } 
    });
    this.permisosService.validaAccesoBoton(idacceso,"btnBajar").subscribe(responseBoton =>{
      if (responseBoton.dato.permiso == 1) {
        this.btnBajar = true;
      } 
    });
    this.permisosService.validaAccesoBoton(idacceso,"btnModificar").subscribe(responseBoton =>{
      if (responseBoton.dato.permiso == 1) {
        this.btnModificar = true;
      } 
    });
    this.permisosService.validaAccesoBoton(idacceso,"btnEliminar").subscribe(responseBoton =>{
      if (responseBoton.dato.permiso == 1) {
        this.btnEliminar = true;
      } 
    });
    this.permisosService.validaAccesoBoton(idacceso,"btnBotones").subscribe(responseBoton =>{
      if (responseBoton.dato.permiso == 1) {
        this.btnBotones = true;
      } 
    });
  }

}
