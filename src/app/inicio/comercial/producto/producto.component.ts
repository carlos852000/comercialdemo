import { Component, OnInit, ViewChild } from "@angular/core";

import { stagger60ms } from "src/@vex/animations/stagger.animation";
import { fadeInUp400ms } from "src/@vex/animations/fade-in-up.animation";
import { scaleIn400ms } from "src/@vex/animations/scale-in.animation";
import { fadeInRight400ms } from "src/@vex/animations/fade-in-right.animation";

import icMoreVert from "@iconify/icons-ic/twotone-more-vert";
import icMenu from "@iconify/icons-ic/twotone-menu";
import icBubbleChart from "@iconify/icons-ic/twotone-bubble-chart";
import icAdd from "@iconify/icons-ic/twotone-add";
import icEdit from "@iconify/icons-ic/twotone-edit";
import icDelete from "@iconify/icons-ic/twotone-delete";
import icSearch from "@iconify/icons-ic/twotone-search";

import { UtilsService } from "src/app/core/funciones/utils.service";
import { FormGroup, FormBuilder, Validators, FormControl,} from "@angular/forms";
import { PermisoService } from "src/app/core/services/permisos.service";
import { StorageService } from "src/app/core/services/storage.service";
import { Session } from "src/app/core/models/session.model";

import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmationComponent } from "src/app/shared/confirmation/confirmation.component";
import { MatTableDataSource } from "@angular/material/table";
import { Constantes } from "src/app/core/constants/constantes";
import { MatPaginator } from "@angular/material/paginator";
import { ProductoService } from "src/app/core/services/producto.service";

import { GeneralService } from 'src/app/core/services/general.service';

@Component({
  selector: "vex-producto",
  templateUrl: "./producto.component.html",
  styleUrls: ["./producto.component.scss"],
  animations: [stagger60ms, fadeInUp400ms, scaleIn400ms, fadeInRight400ms],
})
export class ProductoComponent implements OnInit {
  //PermisosFormulario
  validandoPermiso = false;
  accesoFormulario = false;

  //recibidoDePadre: string; // esta variable contiene los datos para el hijo
  moduloOpcion = "modarchproductos";
  itemPrincipal = "Achivo";
  dataUsuario: Session;

  form: FormGroup;
  layoutCtrl = new FormControl("layoutCtrl");

  //icons
  icMoreVert = icMoreVert;
  icMenu = icMenu;
  icBubbleChart = icBubbleChart;
  icAdd = icAdd;
  icEdit = icEdit;
  icDelete = icDelete;
  icSearch = icSearch;

  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = [
    "correlativo",
    "producto",
    "uMedida",
    "marca",
    "pCosto",
    "pVenta",
    "cantidad",
    "accion",
  ];

  loadingProductos = false;
  habilitaBtnReg = false;
  spinBtnReg = false;

  //Botones
  btnNuevo: any = false;
  btnModificar: any = false;
  btnEliminar: any = false;

  //General
  datosProducto:any;
  datosConfiguracion: any;

  //Paginación
  pagina = 1;
  totalRegistros = 0;
  totalPaginas = 0;
  pageIndex = 0;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  totalRegistrosPorPagina: any = localStorage.getItem("filtroCM") == null? 100 : localStorage.getItem("filtroCM");
  Param1Filt: any;
  Param2Filt: any;
  dataEntrante: any;
  numeracion = 0;
  filtro = [
    { valor: "50" },
    { valor: "100" },
    { valor: "150" },
    { valor: "200" },
  ];

  verFormulario: any;

  constructor(
    private formBuilder: FormBuilder,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    private storageService: StorageService,
    private permisosService: PermisoService,
    private productoService: ProductoService,
    private generalService: GeneralService,
    private utilsService: UtilsService
  ) {
    this.dataUsuario = this.storageService.getCurrentSession();
  }

  ngAfterContentInit(): void {
    this.validandoPermiso = true;
    this.verFormulario = false;
    this.permisosService
      .validaPermisosForms(this.dataUsuario.idperfil, this.moduloOpcion)
      .subscribe(
        (response) => {
          if (response.dato.permiso == 1) {
            this.validaBotones(response.dato.idacceso);
            this.accesoFormulario = true;
            this.listaProductos(this.pagina);
            this.obtieneDatosConfiguracion();
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
      //codigobarra: [""],
      nombres: [""],
      filtroBusk: this.totalRegistrosPorPagina,
    });
  }

  obtieneDatosConfiguracion() {
    this.generalService.verificaConfiguracion().subscribe(response =>{
      this.datosConfiguracion = response.dato;
    }, error => {
      this.utilsService.abrirMensajeToken(null, null, null, error);
    });
  }

  listaProductos(pagina) {
    this.loadingProductos = true;
    this.datosProducto = null;
    this.pagina = pagina;
    this.numeracion = this.totalRegistrosPorPagina * (this.pagina - 1);
    let numRegistros = this.totalRegistrosPorPagina;
    let numPagina = this.pagina;
    this.productoService
      .listaProducto(
        null,
        this.form.get("nombres").value,
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
          this.loadingProductos = false;
        },
        (error) => {
          this.loadingProductos = false;
          this.utilsService.abrirMensajeToken(null, null, null, error);
        }
      );
  }

  crearProducto() {
    this.datosProducto = null;
    this.gestionarProducto();
  }

  actualizarProducto(row) {
    this.datosProducto = row;
    this.gestionarProducto();
  }

  gestionarProducto() {
    this.verFormulario = true;
  }
  
  eliminarProducto(row) {
    var mensaje = "¿Desea eliminar esta información?";
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      disableClose: true,
      width: "350px",
      data: { content: mensaje },
    });
    const sub = dialogRef.componentInstance.onSi.subscribe((data) => {
      this.habilitaBtnReg = true;
      this.spinBtnReg = true;
      this.productoService.eliminaProducto(row.idproducto).subscribe(
        (response) => {
          this.habilitaBtnReg = false;
          this.spinBtnReg = false;
          this.snackbar.open(response.mensaje, null, {
            duration: Constantes.SNACKBAR_TIME,
            horizontalPosition: "end",
            verticalPosition: "top",
          });
          this.listaProductos(this.pagina);
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

  //FUNCIONES GENERALES
  irBandejaPrincipal() {
    this.verFormulario = false;
    this.datosProducto = null;
    this.listaProductos(this.pagina);
  }

  //Paginacion
  listarPorPagina(event) {
    this.pagina = event.pageIndex + 1;
    this.listaProductos(this.pagina);
  }

  cambiaFiltroBusk() {
    this.totalRegistrosPorPagina = this.form.get("filtroBusk").value;
    localStorage.setItem("filtroCM", this.form.get("filtroBusk").value);
    this.listaProductos(this.pagina);
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
  }
}
