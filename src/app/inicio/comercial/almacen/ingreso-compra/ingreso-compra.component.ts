import { Component, OnInit, ViewChild, Output, EventEmitter, } from "@angular/core";

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
import { GeneralService } from 'src/app/core/services/general.service';
import { ParametroService } from "src/app/core/services/parametro.service";
import { MovimientosService } from "src/app/core/services/movimientos.service";
import icReturn from '@iconify/icons-ic/baseline-keyboard-return';

@Component({
  selector: 'vex-ingreso-compra',
  templateUrl: './ingreso-compra.component.html',
  styleUrls: ['./ingreso-compra.component.scss'],
  animations: [stagger60ms, fadeInUp400ms, scaleIn400ms, fadeInRight400ms],
})
export class IngresoCompraComponent implements OnInit {

  @Output() verBandejaPrincipal = new EventEmitter();
  
  validandoPermiso = false;
  accesoFormulario = false;

  moduloOpcion = "modmantmercaderia";
  itemPrincipal = "Mantenimiento";
  dataUsuario: Session;

  constSistema = Constantes;
  
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
  icReturn = icReturn;

  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = [
    "correlativo",
    "numero",
    "proveedor",
    "datos",
    "estado",
    "importe",
    "accion",
  ];

  //General
  datosIngreso:any;

  //Botones
  btnNuevo: any = false;
  btnModificar: any = false;
  btnEliminar: any = false;

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

  verBandeja: any;
  verFormulario: any;

  loadingIngresos = false;
  habilitaBtnReg = false;
  spinBtnReg = false;

  //Estados
  estadoEnproceso: any = 0;

  constructor(
    private formBuilder: FormBuilder,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    private storageService: StorageService,
    private permisosService: PermisoService,
    private movimientosService: MovimientosService,
    private generalService: GeneralService,
    private parametroService: ParametroService,
    private utilsService: UtilsService
  ) {
    this.dataUsuario = this.storageService.getCurrentSession();
  }

  ngAfterContentInit(): void {
    this.validandoPermiso = true;
    this.verBandeja = true;
    this.verFormulario = false;
    this.permisosService
      .validaPermisosForms(this.dataUsuario.idperfil, this.moduloOpcion)
      .subscribe(
        (response) => {
          if (response.dato.permiso == 1) {
            this.validaBotones(response.dato.idacceso);
            this.accesoFormulario = true;
            this.listaIngresos(this.pagina);
            //this.obtieneDatosConfiguracion();
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
      numIngreso: [""],
      numCompra: [""],
      filtroBusk: this.totalRegistrosPorPagina,
    });
    //ESTADOS DE MOVIMIENTOS
    this.parametroService.verificarParametroxAbreviatura(Constantes.EST_ENPROCESO).subscribe(
      (response) => {
        if (response.resultado == 1) {
          this.estadoEnproceso = response.dato.idparametro;
        }
      },
      (error) => {
        this.utilsService.abrirMensajeToken(null, null, null, error);
      }
    );
  }

  listaIngresos(pagina) {
    this.loadingIngresos = true;
    this.datosIngreso = null;
    this.pagina = pagina;
    this.numeracion = this.totalRegistrosPorPagina * (this.pagina - 1);
    let numRegistros = this.totalRegistrosPorPagina;
    let numPagina = this.pagina;
    this.movimientosService
      .listMovimientos(
        null,
        this.form.get("numIngreso").value,
        this.form.get("numCompra").value,
        numRegistros,
        numPagina,
        'INGXCOMPRAS'
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
          this.loadingIngresos = false;
        },
        (error) => {
          this.loadingIngresos = false;
          this.utilsService.abrirMensajeToken(null, null, null, error);
        }
      );
  }

  ingresarCompra() {
    this.verBandeja = false;
    this.verFormulario = true;
  }

  editarMovimiento(row) {
    this.datosIngreso = row;
    this.ingresarCompra();
  }

  eliminarMovimiento(row){
    var mensaje = "¿Desea eliminar esta información?";
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      disableClose: true,
      width: "350px",
      data: { content: mensaje },
    });
    const sub = dialogRef.componentInstance.onSi.subscribe((data) => {
      this.habilitaBtnReg = true;
      this.spinBtnReg = true;
      this.movimientosService.eliminarMovimiento(row.idmovimiento).subscribe(
        (response) => {
          this.habilitaBtnReg = false;
          this.spinBtnReg = false;
          this.snackbar.open(response.mensaje, null, {
            duration: Constantes.SNACKBAR_TIME,
            horizontalPosition: "end",
            verticalPosition: "top",
          });
          this.listaIngresos(this.pagina);
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
    this.verBandejaPrincipal.emit();
  }

  irBandeja() {
    this.verBandeja = true;
    this.verFormulario = false;
    this.datosIngreso = null;
    this.listaIngresos(this.pagina);
  }

  //Paginacion
  listarPorPagina(event) {
    this.pagina = event.pageIndex + 1;
    this.listaIngresos(this.pagina);
  }

  cambiaFiltroBusk() {
    this.totalRegistrosPorPagina = this.form.get("filtroBusk").value;
    localStorage.setItem("filtroCM", this.form.get("filtroBusk").value);
    this.listaIngresos(this.pagina);
  }

  //ValidaBotones
  validaBotones(idacceso) {
    this.permisosService
      .validaAccesoBoton(idacceso, "btnINGRESO-COMPRA-NUEVO")
      .subscribe((responseBoton) => {
        if (responseBoton.dato.permiso == 1) {
          this.btnNuevo = true;
        }
      });
    this.permisosService
      .validaAccesoBoton(idacceso, "btnINGRESO-COMPRA-EDITAR")
      .subscribe((responseBoton) => {
        if (responseBoton.dato.permiso == 1) {
          this.btnModificar = true;
        }
      });
    this.permisosService
      .validaAccesoBoton(idacceso, "btnINGRESO-COMPRA-ELIMINAR")
      .subscribe((responseBoton) => {
        if (responseBoton.dato.permiso == 1) {
          this.btnEliminar = true;
        }
      });
  }

  llenaCeros(value, length) {
    return (value.toString().length < length) ? this.llenaCeros("0" + value, length) : value;
  }

}
