import { Component, OnInit, Output, EventEmitter, Inject, ViewChild, Input } from "@angular/core";

import { fadeInUp400ms } from "../../../../../../@vex/animations/fade-in-up.animation";
import { stagger60ms } from "../../../../../../@vex/animations/stagger.animation";
import { scaleIn400ms } from "../../../../../../@vex/animations/scale-in.animation";
import { fadeInRight400ms } from "../../../../../../@vex/animations/fade-in-right.animation";

import icMoreVert from "@iconify/icons-ic/twotone-more-vert";
import icMenu from "@iconify/icons-ic/twotone-menu";
import icBubbleChart from "@iconify/icons-ic/twotone-bubble-chart";
import icAdd from "@iconify/icons-ic/twotone-add";
import icEdit from "@iconify/icons-ic/twotone-edit";
import icDelete from "@iconify/icons-ic/twotone-delete";
import icSearch from "@iconify/icons-ic/twotone-search";
import icMoney from '@iconify/icons-ic/round-attach-money';
import icDni from '@iconify/icons-ic/sharp-person-pin';
import icpCodigo from '@iconify/icons-ic/baseline-barcode';
import icReceipt from '@iconify/icons-ic/twotone-receipt';
import icReturn from '@iconify/icons-ic/baseline-keyboard-return';

import { FormGroup, FormBuilder, Validators, FormControl, } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, } from "@angular/material/dialog";
import { Session } from "src/app/core/models/session.model";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ConfirmationComponent } from "src/app/shared/confirmation/confirmation.component";
import { StorageService } from "src/app/core/services/storage.service";
import { PermisoService } from "src/app/core/services/permisos.service";
import { UtilsService } from "src/app/core/funciones/utils.service";
import { ProductoService } from "src/app/core/services/producto.service";
import { MatTableDataSource } from "@angular/material/table";
import { Constantes } from "src/app/core/constants/constantes";
import { GeneralService } from "src/app/core/services/general.service";
import { ProveedorService } from "src/app/core/services/proveedor.service";
import { TiendaService } from "src/app/core/services/tienda.service";
import { ComprasService } from "src/app/core/services/compras.service";
import { FuncionesService } from "src/app/core/services/funciones.service";
import { ParametroService } from "src/app/core/services/parametro.service";
import { MovimientosService } from "src/app/core/services/movimientos.service";
import { MatPaginator } from "@angular/material/paginator";

@Component({
  selector: 'vex-kardex-bandeja',
  templateUrl: './kardex-bandeja.component.html',
  styleUrls: ['./kardex-bandeja.component.scss'],
  animations: [stagger60ms, fadeInUp400ms, scaleIn400ms, fadeInRight400ms],
})
export class KardexBandejaComponent implements OnInit {

  @Input() datosProducto: any;
  @Output() verBandejaProducto = new EventEmitter();

  constSistema = Constantes;

  validandoPermiso = true;
  accesoFormulario = true;
  itemPrincipal = "Mantenimiento";
  dataUsuario: Session;

  dataSource = new MatTableDataSource<any>([]);
  dataSourceTienda = new MatTableDataSource<any>([]);
  displayedColumns: string[] = [
    "correlativo",
    "fecha",
    "tipomovimiento",
    "documento",
    "simbolo",
    "cantidad",
    "actual",
  ];

  displayedColumnsTienda: string[] = [
    "tienda",
    "cantidad",
    "cantidadunidad",
  ];

  formBusqueda: FormGroup;
  layoutCtrl = new FormControl("layoutCtrl");

  //icons
  icMoreVert = icMoreVert;
  icMenu = icMenu;
  icBubbleChart = icBubbleChart;
  icReturn = icReturn;
  icAdd = icAdd;
  icEdit = icEdit;
  icDelete = icDelete;
  icSearch = icSearch;
  icMoney = icMoney;
  icNum = icDni;
  icpCodigo = icpCodigo;
  icReceipt = icReceipt;

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

  loading = false;
  loadingTienda = false;
  resultado = 0;

  constructor(
    private formBuilder: FormBuilder,
    private snackbar: MatSnackBar,
    private storageService: StorageService,
    private permisosService: PermisoService,
    private dialog: MatDialog,
    private generalService: GeneralService,
    private productoService: ProductoService,
    private movimientosService: MovimientosService,
    private tiendaService: TiendaService,
    private funcionesService: FuncionesService,
    private proveedorService: ProveedorService,
    private parametroService: ParametroService,
    private utilsService: UtilsService,
  ) { 
    this.dataUsuario = this.storageService.getCurrentSession();
  }

  ngOnInit(): void {
    this.accesoFormulario = true;
    this.listarKardexTienda();
    this.listarKardex(this.pagina);

  }

  listarKardexTienda(){
    this.loadingTienda = true;
    this.movimientosService.listarKardexxProductoTienda(
      this.datosProducto.idproducto).subscribe(response =>{
      this.dataSourceTienda.data = response.dato;
      this.loadingTienda = false;
    },
    (error) => {
      this.loadingTienda = false;
      this.utilsService.abrirMensajeToken(null, null, null, error);
    });
  }

  listarKardex(pagina){
    this.loading = true;
    this.pagina = pagina;
    this.numeracion = this.totalRegistrosPorPagina * (this.pagina - 1);
    let numRegistros = this.totalRegistrosPorPagina;
    let numPagina = this.pagina;
    this.movimientosService.listarKardexxProducto(
      this.datosProducto.idproducto,
      numRegistros,
      numPagina,).subscribe(response =>{
      this.dataSource.data = response.dato;
      this.loading = false;
    },
    (error) => {
      this.loading = false;
      this.utilsService.abrirMensajeToken(null, null, null, error);
    });
  }

  llenaCeros(value, length) {
    return (value.toString().length < length) ? this.llenaCeros("0" + value, length) : value;
  }

  //FUNCIONES GEENRALES
  regresar() {
    this.verBandejaProducto.emit();
  }
}
