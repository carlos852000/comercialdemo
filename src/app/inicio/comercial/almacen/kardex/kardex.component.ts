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
import { ProductoService } from "src/app/core/services/producto.service";

@Component({
  selector: 'vex-kardex',
  templateUrl: './kardex.component.html',
  styleUrls: ['./kardex.component.scss'],
  animations: [stagger60ms, fadeInUp400ms, scaleIn400ms, fadeInRight400ms],
})
export class KardexComponent implements OnInit {

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
    "producto",
    "uMedida",
    "marca",
    "pCosto",
    "pVenta",
    "cantidad",
    "accion",
  ];

  //General
  datosProducto:any;

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
 
   loadingProductos = false;
   habilitaBtnReg = false;
   spinBtnReg = false;

  constructor(
    private formBuilder: FormBuilder,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    private storageService: StorageService,
    private permisosService: PermisoService,
    private movimientosService: MovimientosService,
    private generalService: GeneralService,
    private parametroService: ParametroService,
    private productoService: ProductoService,
    private utilsService: UtilsService
  ) {
    this.dataUsuario = this.storageService.getCurrentSession();
  }

  ngOnInit(): void {
    this.verBandeja = true;
    this.verFormulario = false;
    this.accesoFormulario = true;
    this.form = this.formBuilder.group({
      nombres: [""],
      filtroBusk: this.totalRegistrosPorPagina,
    });
    this.listaProductos(this.pagina);
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

  verKardex(row) {
    this.datosProducto = row;
    this.verBandeja = false;
    this.verFormulario = true;
  }

  //FUNCIONES GENERALES
  irBandejaPrincipal() {
    this.verBandejaPrincipal.emit();
  }

  irBandeja() {
    this.verBandeja = true;
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

}
