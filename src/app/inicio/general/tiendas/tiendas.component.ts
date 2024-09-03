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
import { StiendaRegistroComponent } from './stienda-registro/stienda-registro.component';

@Component({
  selector: 'vex-tiendas',
  templateUrl: './tiendas.component.html',
  styleUrls: ['./tiendas.component.scss'],
  animations: [
    stagger60ms,
    fadeInUp400ms,
    scaleIn400ms,
    fadeInRight400ms,
  ]
})
export class TiendasComponent implements OnInit {

  //PermisosFormulario
  validandoPermiso = false;
  accesoFormulario = false;
  moduloOpcion = "modconftiendas";
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
  displayedColumns: string[] = ['correlativo', 'tienda', 'tipo', 'datos', 'accion'];

  loadingTiendas = false;
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
  btnModificar:any = false;
  btnEliminar:any = false;

  constructor(
    private formBuilder: FormBuilder,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    private storageService: StorageService,
    private permisosService: PermisoService,
    private tiendaService: TiendaService,
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
        this.listaTienda(this.pagina);
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
      nombretienda: [''],
      filtroBusk: this.totalRegistrosPorPagina,
    });
  }

  listaTienda(pagina) {
    this.loadingTiendas = true;
    this.pagina = pagina;
    this.numeracion = this.totalRegistrosPorPagina * (this.pagina - 1);
    let numRegistros = this.totalRegistrosPorPagina;
    let numPagina = this.pagina;
    this.tiendaService.listaTienda(
      this.form.get('nombretienda').value,
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
      this.loadingTiendas = false;
    }, error => {
      this.loadingTiendas = false;
      this.utilsService.abrirMensajeToken(null, null, null, error);
    });
  }

  crearTienda() {
    var data = {
      datosTienda: null
    }
    this.gestionarTienda(data);
  }

  actualizarTienda(row) {
    var data = {
      datosTienda: row
    }
    this.gestionarTienda(data);
  }

  gestionarTienda(datos){
    const dialogRef = this.dialog.open(StiendaRegistroComponent, {
      width: '650px',
      disableClose: true,
      data: datos
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == "OK"){
        this.listaTienda(this.pagina);
      }
    });
  }

  eliminarTienda(row) {
    var mensaje = "¿Desea eliminar esta información?";
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      disableClose: true,
      width: '350px',
      data: {content: mensaje}
    });
    const sub = dialogRef.componentInstance.onSi.subscribe(data => {
      this.habilitaBtnReg = true;
      this.spinBtnReg = true;
      this.tiendaService.eliminaTienda(
        row.idtienda
      ).subscribe(response =>{
        this.habilitaBtnReg = false;
        this.spinBtnReg = false;
        this.snackbar.open(response.mensaje, null, {
          duration: Constantes.SNACKBAR_TIME,
          horizontalPosition: 'end',
          verticalPosition: 'top',
        });
        this.listaTienda(this.pagina);
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
    this.listaTienda(this.pagina);
  }

  cambiaFiltroBusk() {
    this.totalRegistrosPorPagina = this.form.get('filtroBusk').value;
    localStorage.setItem('filtroCM', this.form.get('filtroBusk').value);
    this.listaTienda(this.pagina);
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
  }

  obtieneColorPrincipal(valor){
    if (valor == 1) {
      return 'backgroundPrincipal';
    } 
  }

}
