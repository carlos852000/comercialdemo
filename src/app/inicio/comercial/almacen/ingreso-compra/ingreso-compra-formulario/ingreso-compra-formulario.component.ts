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
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, } from "@angular/material/core";
import { TiendaService } from "src/app/core/services/tienda.service";
import { ComprasService } from "src/app/core/services/compras.service";
import { FuncionesService } from "src/app/core/services/funciones.service";
import { ParametroService } from "src/app/core/services/parametro.service";
import { MovimientosService } from "src/app/core/services/movimientos.service";

@Component({
  selector: 'vex-ingreso-compra-formulario',
  templateUrl: './ingreso-compra-formulario.component.html',
  styleUrls: ['./ingreso-compra-formulario.component.scss'],
  animations: [stagger60ms, fadeInUp400ms, scaleIn400ms, fadeInRight400ms],
})
export class IngresoCompraFormularioComponent implements OnInit {

  @Input() datosIngreso: any;
  @Output() verBandejaIngreso = new EventEmitter();

  constSistema = Constantes;

  validandoPermiso = true;
  accesoFormulario = true;
  itemPrincipal = "Mantenimiento";
  dataUsuario: Session;

  dataSourceAgregados = new MatTableDataSource<any>([]);
  displayedColumnsAgregados: string[] = [
    "correlativo",
    "producto",
    "umedida",
    "proveedor",
    "marca",
    "pcostoHist",
    "pventa",
    "cantidad",
    "total",
    "accion",
  ];

  titulo: any;
  tituloInput: any;
  formBusqueda: FormGroup;
  formIngreso: FormGroup;
  layoutCtrl = new FormControl("layoutCtrl");
  btnRegistro: any;
  tituloForm: any;

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

  loadingIngreso = false;
  loadingProductosAgregados = false;
  resultado = 0;

  lstUnidadMedida: any[];
  lstTipoDocumento: any[];
  lstProveedor: any[];
  lstTienda: any[];

  //Configuración
  idIngreso: any = 0;
  idIngresoRegistrado: any = null;
  tipoAccion: any = 0;
  minFecha: any;
  nummostrarprodcompras: any = 0;
  total: any =0;
  incluyeIGV: any = 0;
  montosinigv: any = 0;
  montoconigv: any = 0;

  habilitaBtnReg = false;
  spinBtnReg = false;
  habilitaCboTDocumentos = false;
  deshabilitaItems = false;
  flujoIngreso = false;
  
  tipoEntradaNumero = 'onlynumero';
  tipoEntradaMoneda = 'numero';

  //Estados
  estadoEnproceso: any = 0;
  estadoRegistrado: any = 0;

  constructor(
    private formBuilder: FormBuilder,
    private dateAdapter: DateAdapter<Date>,
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
    this.dateAdapter.setLocale("es-ES");
    this.minFecha = new Date().toISOString();
    this.dataUsuario = this.storageService.getCurrentSession();
  }

  ngOnInit(): void {
    //ESTADOS DE MOVIMIENTOS
    this.accesoFormulario = false;
    this.parametroService.verificarParametroxAbreviatura(Constantes.EST_ENPROCESO).subscribe(
      (response) => {
        if (response.resultado == 1) {
          this.estadoEnproceso = response.dato.idparametro;
          this.cargaFormulario();
        }
      },
      (error) => {
        this.utilsService.abrirMensajeToken(null, null, null, error);
      }
    );
  }

  cargaFormulario() {
    this.accesoFormulario = false;
    if (this.datosIngreso) {
      this.tituloForm = "Editar Ingreso de Mercadería x Orden de Compra";
      this.btnRegistro = "Ingresar Mercadería";
      this.idIngreso = this.datosIngreso.idmovimiento;
      this.idIngresoRegistrado = this.idIngreso;
      this.tipoAccion = 2;
      this.flujoIngreso = true;
      if (this.datosIngreso.idestadomovimiento !== this.estadoEnproceso){
        this.deshabilitaItems = true;
      }
      this.listarTipoDocumentos();
      this.listarProductosAgregados();
    } else {
      this.tituloForm = "Registrar Ingreso de Mercadería x Orden de Compra";
      this.btnRegistro = "Buscar";
      this.tipoAccion = 1;
    }
    this.formBusqueda = this.formBuilder.group({
      nroCompra: [null, [Validators.maxLength(10), Validators.required],],
    });
    this.formIngreso = this.formBuilder.group({
      fechaentrega: [{value:null,disabled:true},],
      proveedor: [{value:this.datosIngreso?.representante,disabled:true}, [Validators.required]],
      tienda: [{value:this.dataUsuario.tienda,disabled:true}, [Validators.required]],
      recibe: [{value:this.datosIngreso?.tiendadestino,disabled:true}, [Validators.required]],
      referenciacompra: [{value:this.datosIngreso?.referencia,disabled: true}, [Validators.required]],
      referencia: [{value:this.datosIngreso?.referenciamovimiento,disabled: this.deshabilitaItems}, [Validators.required, Validators.maxLength(250)]],
      tipodocumento: [this.datosIngreso?.idtipodocumento, Validators.required],
      nrodocumento: [{value:this.datosIngreso?.nrodocumento,disabled: this.deshabilitaItems}, [Validators.required, Validators.maxLength(250)]],
      incluyeIGV: [this.datosIngreso?.montoigv],
      monto: [this.datosIngreso?.montosinigv],
      igv: [this.datosIngreso?.montoigv],
      total: [this.datosIngreso?.montototal],
    });
    if (this.tipoAccion==2){
      this.formIngreso.controls.fechaentrega.setValue(this.funcionesService.formatearFechaBD(this.datosIngreso?.fechamovimiento));
    }
    this.accesoFormulario = true;
  }

  listarTipoDocumentos() {
    this.habilitaCboTDocumentos = true;
    let abreviatura = "TEMISION";
    this.generalService.verificaCatalogo(abreviatura).subscribe(response =>{
      if (response.resultado == 1){
        //LISTA EL CATALOGO DETALLE
        this.generalService.listaCatalogo(null,response.dato.idcatalogo).subscribe(responseDetalle =>{
          this.lstTipoDocumento = responseDetalle.dato;
          this.habilitaCboTDocumentos = false;
        }, error => {
          this.habilitaCboTDocumentos = false;
          this.utilsService.abrirMensajeToken(null, null, null, error);
        });
      }
    }, error => {
      this.utilsService.abrirMensajeToken(null, null, null, error);
    });
  }

  buscarCompra() {
    this.formBusqueda.markAllAsTouched();
    if (!this.formBusqueda.get("nroCompra").value) {
      this.snackbar.open("Ingrese información a buscar.", null, {
        duration: Constantes.SNACKBAR_TIME,
        horizontalPosition: "center",
        verticalPosition: "top",
      });
      return;
    }
    this.spinBtnReg = true;
    this.movimientosService.buscarCompra(this.formBusqueda.get("nroCompra").value,).subscribe(response =>{
      this.datosIngreso = response.dato;
      this.cargaFormulario();
      this.spinBtnReg = false;
    },
    (error) => {
      this.spinBtnReg = false;
      this.utilsService.abrirMensajeToken(null, null, null, error);
    });
  }

  listarProductosAgregados(){
    this.loadingProductosAgregados = true;
    this.movimientosService.listMovimientosDetalle(this.datosIngreso.idmovimiento).subscribe(response =>{
      this.dataSourceAgregados.data = response.dato;
      this.loadingProductosAgregados = false;
    },
    (error) => {
      this.loadingProductosAgregados = false;
      this.utilsService.abrirMensajeToken(null, null, null, error);
    });
  }

  registrarIngreso() {
    this.formIngreso.markAllAsTouched();
    if (this.formIngreso.invalid) {
      this.snackbar.open("Existe información requerida por registrar.", null, {
         duration: Constantes.SNACKBAR_TIME,
         horizontalPosition: "center",
         verticalPosition: "top",
      });
      return;
    }
    if (!this.idIngreso){
      this.snackbar.open("Existe un inconveniente en el Ingreso de Mercadería.", null, {
        duration: Constantes.SNACKBAR_TIME,
        horizontalPosition: "end",
        verticalPosition: "top",
      });
      return;
    }
    var mensaje = "¿Desea procesar esta información?";
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      disableClose: true,
      width: "350px",
      data: { content: mensaje },
    });
    const sub = dialogRef.componentInstance.onSi.subscribe((data) => {
      this.habilitaBtnReg = true;
      this.spinBtnReg = true;
      this.movimientosService.registrarMovimiento(
        this.idIngreso,
        this.datosIngreso?.idproveedor,
        this.datosIngreso?.idsucursaldestino,
        this.formIngreso.get("tipodocumento").value,
        this.formIngreso.get("nrodocumento").value,
        this.datosIngreso?.montosinigv,
        this.datosIngreso?.montoigv,
        this.formIngreso.get("referencia").value,
        'INGXCOMPRAS'
        ).subscribe(response =>{
        this.habilitaBtnReg = false;
        this.spinBtnReg = false;
        this.snackbar.open(response.mensaje, null, {
          duration: Constantes.SNACKBAR_TIME,
          horizontalPosition: "end",
          verticalPosition: "top",
        });
        this.regresar();
      },
        (error) => {
          this.habilitaBtnReg = false;
          this.spinBtnReg = false;
          this.utilsService.abrirMensajeToken(null, null, null, error);
        }
      );
    });
    
  }

  eliminarDetalle(row) {
    var mensaje = "¿Desea eliminar esta información?";
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      disableClose: true,
      width: "350px",
      data: { content: mensaje },
    });
    const sub = dialogRef.componentInstance.onSi.subscribe((data) => {
      this.habilitaBtnReg = true;
      this.spinBtnReg = true;
      /*this.movimientosService.eliminaCompraDetalle(row.idcompradetalle).subscribe(
        (response) => {
          this.habilitaBtnReg = false;
          this.spinBtnReg = false;
          this.snackbar.open(response.mensaje, null, {
            duration: Constantes.SNACKBAR_TIME,
            horizontalPosition: "end",
            verticalPosition: "top",
          });
          this.listarProductosAgregados();
          dialogRef.close();
        },
        (error) => {
          this.habilitaBtnReg = false;
          this.spinBtnReg = false;
          this.utilsService.abrirMensajeToken(null, null, null, error);
        }
      );*/
    });
  }

  //FUNCIONES GEENRALES
  regresar() {
    this.verBandejaIngreso.emit();
  }

}
