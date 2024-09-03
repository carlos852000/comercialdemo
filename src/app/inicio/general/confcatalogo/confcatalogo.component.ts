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
import icReturn from '@iconify/icons-ic/baseline-keyboard-return';
import icViewCompact from '@iconify/icons-ic/twotone-view-compact';

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
import { MatTabChangeEvent } from '@angular/material/tabs';
import { GcatalogoRegistroComponent } from './gcatalogo-registro/gcatalogo-registro.component';

@Component({
  selector: 'vex-confcatalogo',
  templateUrl: './confcatalogo.component.html',
  styleUrls: ['./confcatalogo.component.scss'],
  animations: [
    stagger60ms,
    fadeInUp400ms,
    scaleIn400ms,
    fadeInRight400ms,
  ]
})
export class ConfcatalogoComponent implements OnInit {

  validandoPermiso = false;
  accesoFormulario = false;
  moduloOpcion = "modconfcatalogo";
  itemPrincipal = "General";
  dataUsuario: Session;

  form: FormGroup;
  layoutCtrl = new FormControl('layoutCtrl');

  //icons
  icMoreVert = icMoreVert;
  icMenu = icMenu;
  icBubbleChart = icBubbleChart;
  icAdd = icAdd;
  icEdit = icEdit;
  icViewCompact = icViewCompact;
  icDelete = icDelete;
  icSearch = icSearch;
  icReturn = icReturn;

  dataSource = new MatTableDataSource<any>([]);
  dataSourceDetalle = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['correlativo', 'catalogo', 'accion'];
  displayedColumnItems: string[] = ['correlativo', 'nombre', 'accion'];

  loadingCatalogo = false;
  loadingItems = false;
  habilitaBtnReg = false;
  spinBtnReg = false;

  //Paginación
  pagina = 1;
  paginaItems = 1;
  totalRegistros = 0;
  totalPaginas = 0;
  totalRegistrosItem = 0;
  totalPaginasItem = 0;
  pageIndex = 0;
  pageIndexItem = 0;
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
  btnItems:any = false;

  idCatalogo : any = 0;

  //Tab
  selectTab = 0;
  labelTab: string = ''
  txtCatalogo: string = ''
  tabPrincipal = true;
  tabSecundario = false;
  rowDetalle: any = [];

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
        this.listaCatalogos(this.pagina);
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
      nombre: [''],
      filtroBusk: this.totalRegistrosPorPagina,
    });
    this.listaCatalogos(this.pagina);
  }

  listaCatalogos(pagina) {
    this.loadingCatalogo = true;
    this.pagina = pagina;
    this.numeracion = this.totalRegistrosPorPagina * (this.pagina - 1);
    let numRegistros = this.totalRegistrosPorPagina;
    let numPagina = this.pagina;
    this.generalService.listaCatalogodetalle(
      this.form.get('nombre').value,
      this.idCatalogo,
      1,
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
      this.loadingCatalogo = false;
    }, error => {
      this.loadingCatalogo = false;
      this.utilsService.abrirMensajeToken(null, null, null, error);
    });
  }

  verItems(row) {
    this.rowDetalle = null;
    this.selectTab = 1;
    this.paginaItems = 1;
    this.tabSecundario = true;
    this.tabPrincipal = false;
    this.labelTab = "Listado de Items";
    this.txtCatalogo = " - "+row.descripcion;
    this.listarxTipoInformacion(row,this.paginaItems);
  }

  listarxTipoInformacion(row,pagina) {
    this.loadingItems = true;
    this.paginaItems = pagina;
    this.rowDetalle = row;
    this.numeracion = this.totalRegistrosPorPagina * (this.pagina - 1);
    let numRegistros = this.totalRegistrosPorPagina;
    let numPagina = this.paginaItems;
    this.generalService.listaCatalogodetalle(
      null,
      row.idcatalogo,
      2,
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

  crearItem(){
    var data = {
      datosItem: null,
      idCatalogo : this.rowDetalle.idcatalogo,
      abreviaturaCatalogo : this.rowDetalle.abreviatura,
    }
    this.gestionarItem(data);
  }

  actualizarItem(row) {
    var data = {
      datosItem: row,
      idCatalogo : this.rowDetalle.idcatalogo,
      abreviaturaCatalogo : this.rowDetalle.abreviatura,
    }
    this.gestionarItem(data);
  }

  gestionarItem(datos){
    const dialogRef = this.dialog.open(GcatalogoRegistroComponent, {
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

  eliminarItem(row) {
    var mensaje = "¿Desea eliminar esta información?";
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      disableClose: true,
      width: '350px',
      data: {content: mensaje}
    });
    const sub = dialogRef.componentInstance.onSi.subscribe(data => {
      this.habilitaBtnReg = true;
      this.spinBtnReg = true;
      this.generalService.eliminaCatalogoDetalle(
        row.idcatalogodetalle
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

  onTabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.selectTab=tabChangeEvent.index;
    //this.buscarSolicitud();
  }

  regresarCatalogo() {
    this.selectTab = 0;
    this.rowDetalle = null;
    this.tabSecundario = false;
    this.tabPrincipal = true;
    this.labelTab = ""
    this.txtCatalogo = "";
    this.listaCatalogos(this.pagina);
  }

  //Paginacion
  listarPorPagina(event) {
    this.pagina = event.pageIndex + 1;
    this.listaCatalogos(this.pagina);
  }

  listarPorPaginaDetalle(event) {
    this.paginaItems = event.pageIndex + 1;
    this.listarxTipoInformacion(this.rowDetalle,this.paginaItems);
  }

  cambiaFiltroBusk() {
    this.totalRegistrosPorPagina = this.form.get('filtroBusk').value;
    localStorage.setItem('filtroCM', this.form.get('filtroBusk').value);
    this.listaCatalogos(this.pagina);
  }

  //ValidaBotones
  validaBotones(idacceso) {
    this.permisosService.validaAccesoBoton(idacceso,"btnitems").subscribe(responseBoton =>{
      if (responseBoton.dato.permiso == 1) {
        this.btnItems = true;
      } 
    });
  }

}
