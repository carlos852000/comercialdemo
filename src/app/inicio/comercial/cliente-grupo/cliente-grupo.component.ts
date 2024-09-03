import { Component, OnInit, ViewChild } from "@angular/core";
import { fadeInUp400ms } from "../../../../@vex/animations/fade-in-up.animation";
import { stagger60ms } from "../../../../@vex/animations/stagger.animation";
import { scaleIn400ms } from "../../../../@vex/animations/scale-in.animation";
import { fadeInRight400ms } from "../../../../@vex/animations/fade-in-right.animation";

import icMoreVert from "@iconify/icons-ic/twotone-more-vert";
import icMenu from "@iconify/icons-ic/twotone-menu";
import icBubbleChart from "@iconify/icons-ic/twotone-bubble-chart";
import icAdd from "@iconify/icons-ic/twotone-add";
import icEdit from "@iconify/icons-ic/twotone-edit";
import icDelete from "@iconify/icons-ic/twotone-delete";
import icSearch from "@iconify/icons-ic/twotone-search";
import icReturn from '@iconify/icons-ic/baseline-keyboard-return';

import {FormGroup,FormBuilder,Validators,FormControl} from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { PermisoService } from "src/app/core/services/permisos.service";
import { StorageService } from "src/app/core/services/storage.service";
import { Session } from "src/app/core/models/session.model";
import { SistemaService } from "src/app/core/services/sistema.service";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmationComponent } from "src/app/shared/confirmation/confirmation.component";
import { UtilsService } from "src/app/core/funciones/utils.service";
import { MatTableDataSource } from "@angular/material/table";
import { Constantes } from "src/app/core/constants/constantes";
import { MatPaginator } from "@angular/material/paginator";
import { ClienteGrupoRegistroComponent } from "./cliente-grupo-registro/cliente-grupo-registro.component";
import { ClienteService } from "src/app/core/services/cliente.service";
import { MatTabChangeEvent } from "@angular/material/tabs";
import { ClienteBuscarComponent } from "../cliente/cliente-buscar/cliente-buscar.component";

@Component({
  selector: 'vex-cliente-grupo',
  templateUrl: './cliente-grupo.component.html',
  styleUrls: ['./cliente-grupo.component.scss'],
  animations: [stagger60ms, fadeInUp400ms, scaleIn400ms, fadeInRight400ms],
})
export class ClienteGrupoComponent implements OnInit {

  //PermisosFormulario
  validandoPermiso = false;
  accesoFormulario = false;
  moduloOpcion = "archgrupoclientes";
  itemPrincipal = "Archivo";
  dataUsuario: Session;

  form: FormGroup;
  form02: FormGroup;
  layoutCtrl = new FormControl("layoutCtrl");

  //icons
  icMoreVert = icMoreVert;
  icMenu = icMenu;
  icBubbleChart = icBubbleChart;
  icAdd = icAdd;
  icEdit = icEdit;
  icDelete = icDelete;
  icSearch = icSearch;
  icReturn = icReturn;

  dataSource = new MatTableDataSource<any>([]);
  dataSourceDetalle = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ["correlativo", "grupo", "accion"];
  displayedColumnsClientes: string[] = ['correlativo', 'nombre','datos','accion'];

  loadingGrupoClientes = false;
  loadingClientes = false;
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

  //Tab
  selectTab = 0;
  labelTab: string = ''
  txtGrupo: string = ''
  tabPrincipal = true;
  tabSecundario = false;
  rowDetalle: any = [];

  //Botones
  btnNuevo: any = false;
  btnModificar: any = false;
  btnEliminar: any = false;
  btnClientes: any = false;

  constructor(
    private formBuilder: FormBuilder,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    private storageService: StorageService,
    private permisosService: PermisoService,
    private clienteService: ClienteService,
    private utilsService: UtilsService
  ) {
    this.dataUsuario = this.storageService.getCurrentSession();
  }

  ngAfterContentInit(): void {
    this.validandoPermiso = true;
    this.permisosService
      .validaPermisosForms(this.dataUsuario.idperfil, this.moduloOpcion)
      .subscribe(
        (response) => {
          if (response.dato.permiso == 1) {
            this.validaBotones(response.dato.idacceso);
            this.accesoFormulario = true;
            this.listaGrupoClientes(this.pagina);
          } else {
            this.validandoPermiso = false;
          }
        },
        (error) => {
          this.validandoPermiso = false;
          this.utilsService.abrirMensajeToken(null, null, null, error);
        }
      );
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nombre: [""],
      filtroBusk: this.totalRegistrosPorPagina,
    });
    this.form02 = this.formBuilder.group({
      nombre: [""],
      filtroBusk: this.totalRegistrosPorPagina,
    });
  }

  listaGrupoClientes(pagina) {
    this.loadingGrupoClientes = true;
    this.pagina = pagina;
    this.numeracion = this.totalRegistrosPorPagina * (this.pagina - 1);
    let numRegistros = this.totalRegistrosPorPagina;
    let numPagina = this.pagina;
    this.clienteService
      .listarClientesGrupos(
        this.form.get("nombre").value,
        numRegistros,
        numPagina
      )
      .subscribe(
        (response) => {
          this.dataSource.data = response.dato;
          this.totalRegistros = response.totalFilas;
          this.totalPaginas = response.totalPages;
          if (this.totalPaginas == 1) {
            this.dataSource.paginator = this.paginator;
            this.pageIndex = 0;
          }
          this.loadingGrupoClientes = false;
        },
        (error) => {
          this.loadingGrupoClientes = false;
          this.utilsService.abrirMensajeToken(null, null, null, error);
        }
      );
  }

  crearGrupo() {
    var data = {
      datosGrupo: null,
    };
    this.gestionarGrupo(data);
  }

  actualizarGrupo(row) {
    var data = {
      datosGrupo: row,
    };
    this.gestionarGrupo(data);
  }

  gestionarGrupo(datos) {
    const dialogRef = this.dialog.open(ClienteGrupoRegistroComponent, {
      width: "650px",
      disableClose: true,
      data: datos,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == "OK") {
        this.listaGrupoClientes(this.pagina);
      }
    });
  }

  eliminarGrupo(row) {
    var mensaje = "¿Desea eliminar esta información?";
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      disableClose: true,
      width: "350px",
      data: { content: mensaje },
    });
    const sub = dialogRef.componentInstance.onSi.subscribe((data) => {
      this.habilitaBtnReg = true;
      this.spinBtnReg = true;
      this.clienteService.eliminaClienteGrupos(row.idclientegrupo).subscribe(
        (response) => {
          this.habilitaBtnReg = false;
          this.spinBtnReg = false;
          this.snackbar.open(response.mensaje, null, {
            duration: Constantes.SNACKBAR_TIME,
            horizontalPosition: "end",
            verticalPosition: "top",
          });
          this.listaGrupoClientes(this.pagina);
          dialogRef.close();
        },
        (error) => {
          this.habilitaBtnReg = false;
          this.spinBtnReg = false;
          this.utilsService.abrirMensajeToken(null, null, null, error);
        }
      );
    });
  }

  gestionarClientes(row) {
    this.rowDetalle = null;
    this.selectTab = 1;
    this.paginaItems = 1;
    this.tabSecundario = true;
    this.tabPrincipal = false;
    this.labelTab = "Listado de Clientes";
    this.txtGrupo = " - "+row.nombre;
    this.listarClientes(row,this.paginaItems);
  }

  listarClientes(row,pagina) {
    this.loadingClientes = true;
    this.paginaItems = pagina;
    this.rowDetalle = row;
    this.numeracion = this.totalRegistrosPorPagina * (this.paginaItems - 1);
    let numRegistros = this.totalRegistrosPorPagina;
    let numPagina = this.paginaItems;
    this.clienteService.listarClientesGruposDetalle(
      this.rowDetalle.idclientegrupo,
      this.form02.get("nombre").value,
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
      this.loadingClientes = false;
    }, error => {
      this.loadingClientes = false;
      this.utilsService.abrirMensajeToken(null, null, null, error);
    });
  }

  crearCliente() {
    const dialogRef = this.dialog.open(ClienteBuscarComponent, {
      width: "650px",
      disableClose: true,
      data: this.rowDetalle,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.mensaje == "OK") {
        this.clienteService.procesaClienteGruposDetalle(
          this.rowDetalle.idclientegrupo,
          result?.idCliente
          ).subscribe(
          (response) => {
            this.snackbar.open(response.mensaje, null, {
              duration: Constantes.SNACKBAR_TIME,
              horizontalPosition: "end",
              verticalPosition: "top",
            });
            this.listarClientes(this.rowDetalle,this.pagina);
            dialogRef.close();
          },
          (error) => {
            this.utilsService.abrirMensajeToken(null, null, null, error);
          }
        );
      }
    });
  }

  eliminarCliente(row) {
    var mensaje = "¿Desea eliminar esta información?";
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      disableClose: true,
      width: "350px",
      data: { content: mensaje },
    });
    const sub = dialogRef.componentInstance.onSi.subscribe((data) => {
      this.habilitaBtnReg = true;
      this.spinBtnReg = true;
      this.clienteService.eliminaClienteGruposDetalle(row.idclientegrupodet).subscribe(
        (response) => {
          this.habilitaBtnReg = false;
          this.spinBtnReg = false;
          this.snackbar.open(response.mensaje, null, {
            duration: Constantes.SNACKBAR_TIME,
            horizontalPosition: "end",
            verticalPosition: "top",
          });
          this.listarClientes(this.rowDetalle,this.pagina);
          dialogRef.close();
        },
        (error) => {
          this.habilitaBtnReg = false;
          this.spinBtnReg = false;
          this.utilsService.abrirMensajeToken(null, null, null, error);
        }
      );
    });
  }

  onTabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.selectTab=tabChangeEvent.index;
    //this.buscarSolicitud();
  }

  regresarGrupo() {
    this.selectTab = 0;
    this.rowDetalle = null;
    this.tabSecundario = false;
    this.tabPrincipal = true;
    this.labelTab = ""
    this.txtGrupo = "";
    this.listaGrupoClientes(this.pagina);
  }

  //Paginacion
  listarPorPagina(event) {
    this.pagina = event.pageIndex + 1;
    this.listaGrupoClientes(this.pagina);
  }

  listarPorPaginaDetalle(event) {
    this.paginaItems = event.pageIndex + 1;
    this.listarClientes(this.rowDetalle,this.paginaItems);
  }

  cambiaFiltroBusk() {
    this.totalRegistrosPorPagina = this.form.get('filtroBusk').value;
    localStorage.setItem('filtroCM', this.form.get('filtroBusk').value);
    this.listaGrupoClientes(this.pagina);
  }

  cambiaFiltroBuskSec() {
    this.totalRegistrosPorPagina = this.form.get('filtroBusk').value;
    localStorage.setItem('filtroCM', this.form.get('filtroBusk').value);
    this.listarClientes(this.rowDetalle,this.pagina);
  }

  //ValidaBotones
  validaBotones(idacceso) {
    this.permisosService
      .validaAccesoBoton(idacceso, "btnnuevo")
      .subscribe((responseBoton) => {
        if (responseBoton.dato.permiso == 1) {
          this.btnNuevo = true;
        }
      });
    this.permisosService
      .validaAccesoBoton(idacceso, "btneditar")
      .subscribe((responseBoton) => {
        if (responseBoton.dato.permiso == 1) {
          this.btnModificar = true;
        }
      });
    this.permisosService
      .validaAccesoBoton(idacceso, "btneliminar")
      .subscribe((responseBoton) => {
        if (responseBoton.dato.permiso == 1) {
          this.btnEliminar = true;
        }
      });
    this.permisosService
      .validaAccesoBoton(idacceso, "btnclientes")
      .subscribe((responseBoton) => {
        if (responseBoton.dato.permiso == 1) {
          this.btnClientes = true;
        }
      });
      
  }
}