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
import { TiendaService } from 'src/app/core/services/tienda.service';
import { GeneralService } from 'src/app/core/services/general.service';
import { GrubrosRegistroComponent } from './grubros-registro/grubros-registro.component';
import { MatTabChangeEvent } from '@angular/material/tabs';
import icReturn from '@iconify/icons-ic/baseline-keyboard-return';
import { GrubrosUnidadMedidaComponent } from './grubros-unidad-medida/grubros-unidad-medida.component';
import { GrubrosCaracteristicasComponent } from './grubros-caracteristicas/grubros-caracteristicas.component';
import icViewCompact from '@iconify/icons-ic/twotone-view-compact';
import { GrubrosCaracteristicasDetalleComponent } from './grubros-caracteristicas-detalle/grubros-caracteristicas-detalle.component';


@Component({
  selector: 'vex-confrubros',
  templateUrl: './confrubros.component.html',
  styleUrls: ['./confrubros.component.scss'],
  animations: [
    stagger60ms,
    fadeInUp400ms,
    scaleIn400ms,
    fadeInRight400ms,
  ]
})
export class ConfrubrosComponent implements OnInit {

  //PermisosFormulario
  validandoPermiso = false;
  accesoFormulario = false;
  moduloOpcion = "modconfrubros";
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
  icReturn = icReturn;
  icViewCompact = icViewCompact;

  dataSource = new MatTableDataSource<any>([]);
  dataSourceDetalle = new MatTableDataSource<any>([]);
  dataSourceDetalleItems = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['correlativo', 'rubro', 'accion'];
  displayedColumnsUnidadMedida: string[] = ['correlativo', 'nombre','cantidad','accion'];
  displayedColumnsCaracteristicas: string[] = ['correlativo', 'nombre','accion'];
  displayedColumnsCaracteristicasItem: string[] = ['correlativo', 'nombre','accion'];

  loadingRubros = false;
  loadingItems = false;
  loadingItemsCaract = false;
  habilitaBtnReg = false;
  spinBtnReg = false;

  //Paginación
  pagina = 1;
  paginaItems = 1;
  paginaItemsCaract = 1;
  totalRegistros = 0;
  totalRegistrosItem = 0;
  totalRegistrosItemCaract = 0;
  totalPaginas = 0;
  totalPaginasItem = 0;
  totalPaginasItemCaract = 0;
  pageIndex = 0;
  pageIndexItem = 0;
  pageIndexItemCaract = 0;
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

  //Tab
  selectTab = 0;
  labelTab: string = ''
  txtRubro: string = ''
  tabPrincipal = true;
  tabSecundario = false;
  tabItems = false;
  rowDetalle: any = [];
  rowDetalleItem: any = [];

  //Botones
  btnNuevo:any = false;
  btnModificar:any = false;
  btnEliminar:any = false;
  btnUnidadesMedida:any = false;
  btnCaracteristica:any = false;

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
        this.listaRubros(this.pagina);
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
      nombrerubro: [''],
      filtroBusk: this.totalRegistrosPorPagina,
    });
  }

  listaRubros(pagina) {
    this.loadingRubros = true;
    this.pagina = pagina;
    this.numeracion = this.totalRegistrosPorPagina * (this.pagina - 1);
    let numRegistros = this.totalRegistrosPorPagina;
    let numPagina = this.pagina;
    this.generalService.listaRubro(
      this.form.get('nombrerubro').value,
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
      this.loadingRubros = false;
    }, error => {
      this.loadingRubros = false;
      this.utilsService.abrirMensajeToken(null, null, null, error);
    });
  }

  crearRubro() {
    var data = {
      datosRubro: null
    }
    this.gestionarRubro(data);
  }

  actualizarRubro(row) {
    var data = {
      datosRubro: row
    }
    this.gestionarRubro(data);
  }

  gestionarRubro(datos){
    const dialogRef = this.dialog.open(GrubrosRegistroComponent, {
      width: '650px',
      disableClose: true,
      data: datos
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == "OK"){
        this.listaRubros(this.pagina);
      }
    });
  }

  unidadMedida(row) {
    this.rowDetalle = null;
    this.rowDetalleItem = null;
    this.selectTab = 1;
    this.paginaItems = 1;
    this.tabSecundario = true;
    this.tabPrincipal = false;
    this.tabItems = false;
    this.labelTab = "Listado de Unidades de Medida";
    this.txtRubro = " - "+row.descripcion;
    this.listarxTipoInformacion(row,this.paginaItems);
  }

  crearUMedida() {
    var data = {
      datosUMedida: null,
      idrubro : this.rowDetalle.idrubro
    }
    this.gestionarUMedida(data);
  }

  actualizarUMedida(row) {
    var data = {
      datosUMedida: row,
      idrubro : this.rowDetalle.idrubro
    }
    this.gestionarUMedida(data);
  }

  gestionarUMedida(datos){
    const dialogRef = this.dialog.open(GrubrosUnidadMedidaComponent, {
      width: '650px',
      disableClose: true,
      data: datos
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == "OK"){
        this.listarxTipoInformacion(this.rowDetalle,this.paginaItems);
      }
    });
  }

  caracteristicas(row) {
    this.rowDetalle = null;
    this.rowDetalleItem = null;
    this.selectTab = 2;
    this.paginaItems = 1;
    this.tabSecundario = true;
    this.tabPrincipal = false;
    this.tabItems = false;
    this.labelTab = "Listado de Características"
    this.txtRubro = " - "+row.descripcion;
    this.listarxTipoInformacion(row,this.paginaItems);
  }

  crearCaracteristica() {
    var data = {
      datosCaracteristica: null,
      idrubro : this.rowDetalle.idrubro
    }
    this.gestionarCaracteristica(data);
  }

  actualizarCaracteristica(row) {
    var data = {
      datosCaracteristica: row,
      idrubro : this.rowDetalle.idrubro
    }
    this.gestionarCaracteristica(data);
  }

  gestionarCaracteristica(datos){
    const dialogRef = this.dialog.open(GrubrosCaracteristicasComponent, {
      width: '650px',
      disableClose: true,
      data: datos
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == "OK"){
        this.listarxTipoInformacion(this.rowDetalle,this.paginaItems);
      }
    });
  }

  listarxTipoInformacion(row,pagina) {
    this.loadingItems = true;
    this.paginaItems = pagina;
    this.rowDetalle = row;
    this.numeracion = this.totalRegistrosPorPagina * (this.paginaItems - 1);
    let numRegistros = this.totalRegistrosPorPagina;
    let numPagina = this.paginaItems;
    if (this.selectTab == 1) {
      this.generalService.listaUnidadMedida(
        this.rowDetalle.idrubro,
        null,
        numRegistros,
        numPagina
        ).subscribe(response =>{
        this.dataSourceDetalle.data = response.dato;
        this.totalRegistrosItem = response.totalFilas;
        this.totalPaginasItem = response.totalPages;
        if(this.totalPaginasItem == 1){
          this.dataSourceDetalle.paginator = this.paginator;
          this.pageIndexItem = 0;
        }
        this.loadingItems = false;
      }, error => {
        this.loadingItems = false;
        this.utilsService.abrirMensajeToken(null, null, null, error);
      });
    } else {
      if (this.selectTab == 2) {
        this.generalService.listaCaracteristicas(
          this.rowDetalle.idrubro,
          null,
          numRegistros,
          numPagina
          ).subscribe(response =>{
          this.dataSourceDetalle.data = response.dato;
          this.totalRegistrosItem = response.totalFilas;
          this.totalPaginasItem = response.totalPages;
          if(this.totalPaginasItem == 1){
            this.dataSourceDetalle.paginator = this.paginator;
            this.pageIndexItem = 0;
          }
          this.loadingItems = false;
        }, error => {
          this.loadingItems = false;
          this.utilsService.abrirMensajeToken(null, null, null, error);
        });
      }
    }
    
  }

  eliminarRubro(row) {
    var mensaje = "¿Desea eliminar esta información?";
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      disableClose: true,
      width: '350px',
      data: {content: mensaje}
    });
    const sub = dialogRef.componentInstance.onSi.subscribe(data => {
      this.habilitaBtnReg = true;
      this.spinBtnReg = true;
      this.generalService.eliminaRubro(
        row.idrubro
      ).subscribe(response =>{
        this.habilitaBtnReg = false;
        this.spinBtnReg = false;
        this.snackbar.open(response.mensaje, null, {
          duration: Constantes.SNACKBAR_TIME,
          horizontalPosition: 'end',
          verticalPosition: 'top',
        });
        this.listaRubros(this.pagina);
        dialogRef.close();
      }, error => {
        this.habilitaBtnReg = false;
        this.spinBtnReg = false;
        this.utilsService.abrirMensajeToken(null, null, null, error);
      });
    });
  }

  eliminarUnidadMedida(row) {
    var mensaje = "¿Desea eliminar esta información?";
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      disableClose: true,
      width: '350px',
      data: {content: mensaje}
    });
    const sub = dialogRef.componentInstance.onSi.subscribe(data => {
      this.habilitaBtnReg = true;
      this.spinBtnReg = true;
      this.generalService.eliminaUnidadMedida(
        row.idrubrounidadmedida
      ).subscribe(response =>{
        this.habilitaBtnReg = false;
        this.spinBtnReg = false;
        this.snackbar.open(response.mensaje, null, {
          duration: Constantes.SNACKBAR_TIME,
          horizontalPosition: 'end',
          verticalPosition: 'top',
        });
        this.listarxTipoInformacion(this.rowDetalle,this.paginaItems);
        dialogRef.close();
      }, error => {
        this.habilitaBtnReg = false;
        this.spinBtnReg = false;
        this.utilsService.abrirMensajeToken(null, null, null, error);
      });
    });
  }

  eliminarCaracteristica(row) {
    var mensaje = "¿Desea eliminar esta información?";
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      disableClose: true,
      width: '350px',
      data: {content: mensaje}
    });
    const sub = dialogRef.componentInstance.onSi.subscribe(data => {
      this.habilitaBtnReg = true;
      this.spinBtnReg = true;
      this.generalService.eliminaCaracteristica(
        row.idrubrocaracteristica
      ).subscribe(response =>{
        this.habilitaBtnReg = false;
        this.spinBtnReg = false;
        this.snackbar.open(response.mensaje, null, {
          duration: Constantes.SNACKBAR_TIME,
          horizontalPosition: 'end',
          verticalPosition: 'top',
        });
        this.listarxTipoInformacion(this.rowDetalle,this.paginaItems);
        dialogRef.close();
      }, error => {
        this.habilitaBtnReg = false;
        this.spinBtnReg = false;
        this.utilsService.abrirMensajeToken(null, null, null, error);
      });
    });
  }

  verItemsCaracteristicas(row) {
    this.rowDetalleItem = null;
    this.selectTab = 3;
    this.paginaItemsCaract = 1;
    this.tabPrincipal = false;
    this.tabSecundario = false;
    this.tabItems = true;
    this.labelTab = "Listado de Características - Items"
    this.txtRubro = this.txtRubro + " - "+row.descripcion;
    this.listaItemsCaratceristicas(row,this.paginaItemsCaract);
  }

  listaItemsCaratceristicas(row,pagina) {
    this.loadingItemsCaract = true;
    this.paginaItemsCaract = pagina;
    this.rowDetalleItem = row;
    this.numeracion = this.totalRegistrosPorPagina * (this.paginaItemsCaract - 1);
    let numRegistros = this.totalRegistrosPorPagina;
    let numPagina = this.paginaItemsCaract;
    this.generalService.listaCaracteristicasDetalle(
      this.rowDetalleItem.idrubrocaracteristica,
      null,
      numRegistros,
      numPagina
      ).subscribe(response =>{
      this.dataSourceDetalleItems.data = response.dato;
      this.totalRegistrosItemCaract = response.totalFilas;
      this.totalPaginasItemCaract = response.totalPages;
      if(this.totalPaginasItemCaract == 1){
        this.dataSourceDetalleItems.paginator = this.paginator;
        this.pageIndexItemCaract = 0;
      }
      this.loadingItemsCaract = false;
    }, error => {
      this.loadingItemsCaract = false;
      this.utilsService.abrirMensajeToken(null, null, null, error);
    });
  }

  crearCaracteristicaDetalle() {
    var data = {
      datosCaracteristicaDetalle: null,
      idrubroCaracteristica : this.rowDetalleItem.idrubrocaracteristica
    }
    this.gestionarCaracteristicaDetalle(data);
  }

  actualizarCaracteristicaDetalle(row) {
    var data = {
      datosCaracteristicaDetalle: row,
      idrubroCaracteristica : this.rowDetalleItem.idrubrocaracteristica
    }
    this.gestionarCaracteristicaDetalle(data);
  }

  gestionarCaracteristicaDetalle(datos){
    const dialogRef = this.dialog.open(GrubrosCaracteristicasDetalleComponent, {
      width: '650px',
      disableClose: true,
      data: datos
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == "OK"){
        this.listaItemsCaratceristicas(this.rowDetalleItem,this.paginaItemsCaract);
      }
    });
  }

  eliminarCaracteristicaDetalle(row) {
    var mensaje = "¿Desea eliminar esta información?";
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      disableClose: true,
      width: '350px',
      data: {content: mensaje}
    });
    const sub = dialogRef.componentInstance.onSi.subscribe(data => {
      this.habilitaBtnReg = true;
      this.spinBtnReg = true;
      this.generalService.eliminaCaracteristicaDetalle(
        row.idrubrocaracteristicadetalle
      ).subscribe(response =>{
        this.habilitaBtnReg = false;
        this.spinBtnReg = false;
        this.snackbar.open(response.mensaje, null, {
          duration: Constantes.SNACKBAR_TIME,
          horizontalPosition: 'end',
          verticalPosition: 'top',
        });
        this.listaItemsCaratceristicas(this.rowDetalleItem,this.paginaItemsCaract);
        dialogRef.close();
      }, error => {
        this.habilitaBtnReg = false;
        this.spinBtnReg = false;
        this.utilsService.abrirMensajeToken(null, null, null, error);
      });
    });
  }

  onTabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.selectTab=tabChangeEvent.index;
    //this.buscarSolicitud();
  }

  regresarRubro() {
    this.selectTab = 0;
    this.rowDetalle = null;
    this.tabSecundario = false;
    this.tabPrincipal = true;
    this.labelTab = ""
    this.txtRubro = "";
    this.listaRubros(this.pagina);
  }

  regresarCaracteristicas() {
    /*this.selectTab = 2;
    this.rowDetalle = null;
    this.tabSecundario = false;
    this.tabPrincipal = true;
    this.labelTab = ""
    this.txtRubro = "";
    this.listaRubros(this.pagina);*/


    //this.rowDetalle = null;
    this.selectTab = 2;
    //this.paginaItems = 1;
    this.tabSecundario = true;
    this.tabPrincipal = false;
    this.tabItems = false;
    this.labelTab = "Listado de Características"
    this.txtRubro = " - "+this.rowDetalle.descripcion;
    this.listarxTipoInformacion(this.rowDetalle,this.paginaItems);
    //this.caracteristicas(this.rowDetalle);

  }
  
  //Paginacion
  listarPorPagina(event) {
    this.pagina = event.pageIndex + 1;
    this.listaRubros(this.pagina);
  }

  listarPorPaginaDetalle(event) {
    this.paginaItems = event.pageIndex + 1;
    this.listarxTipoInformacion(this.rowDetalle,this.paginaItems);
  }

  listarPorPaginaDetalleTems(event) {
    this.paginaItemsCaract = event.pageIndex + 1;
    this.listaItemsCaratceristicas(this.rowDetalleItem,this.paginaItemsCaract);
  }

  cambiaFiltroBusk() {
    this.totalRegistrosPorPagina = this.form.get('filtroBusk').value;
    localStorage.setItem('filtroCM', this.form.get('filtroBusk').value);
    this.listaRubros(this.pagina);
  }

  //ValidaBotones
  validaBotones(idacceso) {
    this.permisosService.validaAccesoBoton(idacceso,"btnnuevo").subscribe(responseBoton =>{
      if (responseBoton.dato.permiso == 1) {
        this.btnNuevo = true;
      } 
    });
    this.permisosService.validaAccesoBoton(idacceso,"btneditar").subscribe(responseBoton =>{
      if (responseBoton.dato.permiso == 1) {
        this.btnModificar = true;
      } 
    });
    this.permisosService.validaAccesoBoton(idacceso,"btneliminar").subscribe(responseBoton =>{
      if (responseBoton.dato.permiso == 1) {
        this.btnEliminar = true;
      } 
    });
    this.permisosService.validaAccesoBoton(idacceso,"btnUnidadesMedida").subscribe(responseBoton =>{
      if (responseBoton.dato.permiso == 1) {
        this.btnUnidadesMedida = true;
      } 
    });
    this.permisosService.validaAccesoBoton(idacceso,"btnCaracteristica").subscribe(responseBoton =>{
      if (responseBoton.dato.permiso == 1) {
        this.btnCaracteristica = true;
      } 
    });
  }


}
