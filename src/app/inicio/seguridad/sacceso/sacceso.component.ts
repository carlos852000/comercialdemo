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
import { SaccesoRegistroComponent } from './sacceso-registro/sacceso-registro.component';

@Component({
  selector: 'vex-sacceso',
  templateUrl: './sacceso.component.html',
  styleUrls: ['./sacceso.component.scss'],
  animations: [
    stagger60ms,
    fadeInUp400ms,
    scaleIn400ms,
    fadeInRight400ms,
  ]
})
export class SaccesoComponent implements OnInit {

  //PermisosFormulario
  validandoPermiso = false;
  accesoFormulario = false;
  moduloOpcion = "modsegacceso";
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

  loadingPerfiles = false;
  habilitaBtnReg = false;
  spinBtnReg = false;

  //Paginación
  pagina = 1;
  totalRegistros = 0;
  totalPaginas = 0;
  pageIndex = 0;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  totalRegistrosPorPagina: any = localStorage.getItem("filtroCM") == null ? 10 : localStorage.getItem("filtroCM");
  Param1Filt: any;
  Param2Filt: any;
  numeracion = 0;
  filtro = [
    {valor:'50'},
    {valor:'100'},
    {valor:'150'},
    {valor:'200'}];

  //Botones
  btnAcciones:any = false;

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
        this.listaPerfiles(this.pagina);
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
      nombreperfil: [''],
      filtroBusk: this.totalRegistrosPorPagina,
    });
  }

  listaPerfiles(pagina) {
    this.loadingPerfiles = true;
    this.pagina = pagina;
    this.numeracion = this.totalRegistrosPorPagina * (this.pagina - 1);
    let numRegistros = this.totalRegistrosPorPagina;
    let numPagina = this.pagina;
    this.sistemasService.listaPerfiles(
      this.dataUsuario.idsistema,
      this.form.get('nombreperfil').value,
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
      this.loadingPerfiles = false;
    }, error => {
      this.loadingPerfiles = false;
      this.utilsService.abrirMensajeToken(null, null, null, error);
    });
  }

  verAccesos(row) {
    const dialogRef = this.dialog.open(SaccesoRegistroComponent, {
      width: '750px',
      disableClose: true,
      data: row
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == "OK"){
        this.listaPerfiles(this.pagina);
      }
    });
  }

  //Paginacion
  listarPorPagina(event) {
    this.pagina = event.pageIndex + 1;
    this.listaPerfiles(this.pagina);
  }

  cambiaFiltroBusk() {
    this.totalRegistrosPorPagina = this.form.get('filtroBusk').value;
    localStorage.setItem('filtroCM', this.form.get('filtroBusk').value);
    this.listaPerfiles(this.pagina);
  }

  //ValidaBotones
  validaBotones(idacceso) {
    this.permisosService.validaAccesoBoton(idacceso,"btnAcciones").subscribe(responseBoton =>{
      if (responseBoton.dato.permiso == 1) {
        this.btnAcciones = true;
      } 
    });
  }


}
