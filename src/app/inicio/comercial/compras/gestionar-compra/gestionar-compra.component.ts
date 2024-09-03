import { Component, OnInit, Output, EventEmitter, Inject, ViewChild, Input } from "@angular/core";

import { fadeInUp400ms } from "../../../../../@vex/animations/fade-in-up.animation";
import { stagger60ms } from "../../../../../@vex/animations/stagger.animation";
import { scaleIn400ms } from "../../../../../@vex/animations/scale-in.animation";
import { fadeInRight400ms } from "../../../../../@vex/animations/fade-in-right.animation";

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
import { Session } from "src/app/core/models/session.model";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, } from "@angular/material/dialog";
import { ConfirmationComponent } from "src/app/shared/confirmation/confirmation.component";
import { StorageService } from "src/app/core/services/storage.service";
import { PermisoService } from "src/app/core/services/permisos.service";
import { UtilsService } from "src/app/core/funciones/utils.service";
import { ProductoService } from "src/app/core/services/producto.service";
import { MatTableDataSource } from "@angular/material/table";
import { Constantes } from "src/app/core/constants/constantes";
import { GeneralService } from "src/app/core/services/general.service";
import { ProveedorService } from "src/app/core/services/proveedor.service";
import { CproveedorRegistroComponent } from '../../proveedor/cproveedor-registro/cproveedor-registro.component';
import { GrubrosUnidadMedidaComponent } from '../../../general/confrubros/grubros-unidad-medida/grubros-unidad-medida.component';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, } from "@angular/material/core";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { TiendaService } from "src/app/core/services/tienda.service";
import { AgregarProductoComponent } from '../agregar-producto/agregar-producto.component';
import { ComprasService } from "src/app/core/services/compras.service";
import { FuncionesService } from "src/app/core/services/funciones.service";
import { ParametroService } from "src/app/core/services/parametro.service";

@Component({
  selector: 'vex-gestionar-compra',
  templateUrl: './gestionar-compra.component.html',
  styleUrls: ['./gestionar-compra.component.scss'],
  animations: [stagger60ms, fadeInUp400ms, scaleIn400ms, fadeInRight400ms],
})
export class GestionarCompraComponent implements OnInit {

  @Input() datosCompras: any;
  @Input() datosConfiguracion: any;
  @Output() verBandejaPrincipal = new EventEmitter();

  constSistema = Constantes;

  validandoPermiso = true;
  accesoFormulario = true;
  itemPrincipal = "Compras";
  dataUsuario: Session;

  dataSource = new MatTableDataSource<any>([]);
  dataSourceAgregados = new MatTableDataSource<any>([]);
  displayedColumns: string[] = [
    "correlativo",
    "producto",
    "umedida",
    "proveedor",
    "marca",
    "pcostoHist",
    "pcosto",
    "pventa",
    "stock",
    "accion",
  ];
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
  formCompra: FormGroup;
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

  loadingCompras = false;
  //loadingComprasDetalle = false;
  loadingProductos = false;
  loadingProductosAgregados = false;
  resultado = 0;

  lstUnidadMedida: any[];
  lstTipoEmision: any[];
  lstProveedor: any[];
  lstTienda: any[];

  //Configuración
  idCompra: any = 0;
  idCompraRegistrado: any = null;
  tipoAccion: any = 0;
  minFecha: any;
  nummostrarprodcompras: any = 0;
  total: any =0;
  incluyeIGV: any = 0;
  montosinigv: any = 0;
  montoconigv: any = 0;
  cuentaVerificaComprasRegistradas: any = 0;

  habilitaBtnReg = false;
  spinBtnReg = false;
  habilitaBtnListProd = false;
  spinBtnListProd = false;

  habilitaCboUM = false;
  habilitaCboTEmision = false;
  habilitaCboProveed = false;
  habilitaCboTienda = false;
  deshabilitaItems = false;

  tipoEntradaNumero = 'onlynumero';
  tipoEntradaMoneda = 'numero';

  //Estados
  estadoCompraEnproceso: any = 0;

  constructor(
    private formBuilder: FormBuilder,
    private dateAdapter: DateAdapter<Date>,
    private snackbar: MatSnackBar,
    private storageService: StorageService,
    private permisosService: PermisoService,
    private dialog: MatDialog,
    private generalService: GeneralService,
    private productoService: ProductoService,
    private compraService: ComprasService,
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
    //ESTADOS DE COMPRAS
    this.accesoFormulario = false;
    this.parametroService.verificarParametroxAbreviatura(Constantes.EST_ENPROCESO).subscribe(
      (response) => {
        if (response.resultado == 1) {
          this.estadoCompraEnproceso = response.dato.idparametro;
          this.cargaFormulario();
          this.listarUnidadMedida();
          this.listarProveedor();
          this.listarTiendas();
          this.listarTipoEmision();
          this.nummostrarprodcompras = this.datosConfiguracion.nummostrarprodcompras;
        }
      },
      (error) => {
        this.utilsService.abrirMensajeToken(null, null, null, error);
      }
    );
  }

  cargaFormulario() {
    this.accesoFormulario = false;
    this.idCompraRegistrado = null;
    if (this.datosCompras) {
      this.tituloForm = "Editar Orden de Compra";
      this.btnRegistro = "Actualizar";
      this.idCompra = this.datosCompras.idcompra;
      this.idCompraRegistrado = this.idCompra;
      this.tipoAccion = 2;
      if (this.datosCompras.idestadocompra !== this.estadoCompraEnproceso){
        this.deshabilitaItems = true;
      }
      this.listarProductosAgregados();
    } else {
      this.tituloForm = "Registrar Orden de Compra";
      this.btnRegistro = "Registrar";
      this.tipoAccion = 1;
      if (this.cuentaVerificaComprasRegistradas == 0){
        this.verificarCompraRegistradaxUsuario();
      }
    }
    this.dataSource.data.length = 0;
    this.formCompra = this.formBuilder.group({
      fechacompra: [null, [Validators.required, Validators.maxLength(10)],],
      fechaentrega: [null, [Validators.required, Validators.maxLength(10)],],
      proveedor: [this.datosCompras?.idproveedor, Validators.required],
      recibe: [this.datosCompras?.idtiendarecepcion, Validators.required],
      tipoemision: [this.datosCompras?.idtipoemision, Validators.required],
      incluyeIGV: [this.datosCompras?.incluidoigv],
      referencia: [{value:this.datosCompras?.referencia,disabled: this.deshabilitaItems}, [Validators.required, Validators.maxLength(250)]],
      nrodocumento: [{value:this.datosCompras?.numerodocumento,disabled: this.deshabilitaItems}, [Validators.required, Validators.maxLength(250)]],
      monto: [this.datosCompras?.montosinigv, [Validators.required]],
      igv: [this.datosCompras?.montoigv, [Validators.required]],
      total: [this.datosCompras?.montototal, [Validators.required]],
      producto: []
    });
    if (this.tipoAccion == 2){
      this.formCompra.controls.fechacompra.setValue(this.funcionesService.formatearFecha(this.funcionesService.formatearFechaBD(this.datosCompras?.fechacompra)));
      this.formCompra.controls.fechaentrega.setValue(this.funcionesService.formatearFecha(this.funcionesService.formatearFechaBD(this.datosCompras?.fechaentrega)));
      this.incluyeIGV = this.formCompra.get("incluyeIGV").value;
    }
    this.accesoFormulario = true;
  }

  listarProveedor() {
    this.habilitaCboProveed = true;
    this.proveedorService.listarProveedores(null, 50, 1).subscribe(
      (response) => {
        if (response.resultado == 1) {
          this.lstProveedor = response.dato;
        }
        this.habilitaCboProveed = false;
      },
      (error) => {
        this.habilitaCboProveed = false;
        this.utilsService.abrirMensajeToken(null, null, null, error);
      }
    );
  }

  listarTiendas() {
    this.habilitaCboTienda = true;
    this.tiendaService.listaTienda(null, 1000, 1).subscribe(response => {
      if (response.resultado == 1) {
        this.lstTienda = response.dato;
      }
      this.habilitaCboTienda = false;
    }, error => {
      this.habilitaCboTienda = false;
      this.utilsService.abrirMensajeToken(null, null, null, error);
    });
  }

  listarUnidadMedida() {
    this.habilitaCboUM = true;
    this.generalService.listaUnidadMedidaxRubro().subscribe(response => {
      this.lstUnidadMedida = response.dato;
      this.habilitaCboUM = false;
    }, error => {
      this.habilitaCboUM = false;
      this.utilsService.abrirMensajeToken(null, null, null, error);
    });
  }

  listarTipoEmision() {
    this.habilitaCboTEmision = true;
    let abreviatura = "TEMISION";
    this.generalService.verificaCatalogo(abreviatura).subscribe(response =>{
      if (response.resultado == 1){
        //LISTA EL CATALOGO DETALLE
        this.generalService.listaCatalogo(null,response.dato.idcatalogo).subscribe(responseDetalle =>{
          this.lstTipoEmision = responseDetalle.dato;
          this.habilitaCboTEmision = false;
        }, error => {
          this.habilitaCboTEmision = false;
          this.utilsService.abrirMensajeToken(null, null, null, error);
        });
      }
    }, error => {
      this.utilsService.abrirMensajeToken(null, null, null, error);
    });
  }

  verificarCompraRegistradaxUsuario() {
    this.compraService
      .verificarComprasxUsuario()
      .subscribe(
        (response) => {
          this.idCompraRegistrado = response.cregistro;
          this.datosCompras = response.dato;
          this.cuentaVerificaComprasRegistradas = 1;
          this.cargaFormulario();
        },
        (error) => {
          this.utilsService.abrirMensajeToken(null, null, null, error);
        }
      );
  }

  verificarCompra() {
    var fechacompra   = this.formCompra.get("fechacompra").value;
    var fechaentrega  = this.formCompra.get("fechaentrega").value;
    var proveedor     = this.formCompra.get("proveedor").value;
    var recibe        = this.formCompra.get("recibe").value;
    var tipoemision   = this.formCompra.get("tipoemision").value;
    //var referencia    = this.formCompra.get("referencia").value;
    if ((fechacompra) && (fechaentrega) && (proveedor) && (recibe) && (tipoemision)) {
      this.compraService
        .procesaPreCompra(
          this.tipoAccion,
          this.idCompra,
          proveedor,
          recibe,
          fechacompra,
          fechaentrega,
          tipoemision,
        )
        .subscribe(
          (response) => {
            this.idCompraRegistrado = response.cregistro;
            this.datosCompras = response.dato;
            this.snackbar.open(response.mensaje, null, {
              duration: Constantes.SNACKBAR_TIME,
              horizontalPosition: "end",
              verticalPosition: "top",
            });
            this.cargaFormulario();
          },
          (error) => {
            this.utilsService.abrirMensajeToken(null, null, null, error);
          }
        );
    }
  }

  buscarProducto() {
    if (!this.formCompra.get("producto").value) {
      this.snackbar.open("Ingrese información a buscar.", null, {
        duration: Constantes.SNACKBAR_TIME,
        horizontalPosition: "end",
        verticalPosition: "top",
      });
      return;
    }
    this.loadingProductos = true;
    this.productoService
      .listaProducto(
        null,
        this.formCompra.get("producto").value,
        this.nummostrarprodcompras,
        1
      )
      .subscribe(
        (response) => {
          this.dataSource.data = response.dato;
          this.loadingProductos = false;
        },
        (error) => {
          this.loadingProductos = false;
          this.utilsService.abrirMensajeToken(null, null, null, error);
        }
      );
  }

  listarProductosAgregados(){
    this.montosinigv = 0;
    this.montoconigv = 0;
    this.total = 0;
    this.loadingProductosAgregados = true;
    this.compraService
      .verificaCompraDetalle(this.idCompra)
      .subscribe(
        (response) => {
          this.dataSourceAgregados.data = response.dato;
          this.loadingProductosAgregados = false;
          response.dato.forEach((row) => {
            this.total = this.total + row.total
          });
          if (this.incluyeIGV == 1){
            this.montosinigv = (this.total / 1.18).toFixed(2);
            this.montoconigv = (this.total - this.montosinigv).toFixed(2);
          } else {
            this.montosinigv = this.total;
            this.montoconigv = 0;
          }
          this.formCompra.controls.total.setValue(this.total);
          this.formCompra.controls.igv.setValue(this.montoconigv);
          this.formCompra.controls.monto.setValue(this.montosinigv);
          //monto
          //igv
          //total
        },
        (error) => {
          this.loadingProductosAgregados = false;
          this.utilsService.abrirMensajeToken(null, null, null, error);
        }
      );
  }

  agregarProducto(row) {
    this.habilitaBtnListProd = true;
    this.spinBtnListProd = true;
    this.compraService.procesaCompraDetalle(
      1,
      0,
      this.datosCompras.idcompra,
      row.idproducto,
      this.datosCompras.idproveedor,
      0,
      0,
      row.idunidadmedida
    )
    .subscribe(
      (response) => {
        this.habilitaBtnListProd = false;
        this.spinBtnListProd = false;
        this.snackbar.open(response.mensaje, null, {
          duration: Constantes.SNACKBAR_TIME,
          horizontalPosition: "end",
          verticalPosition: "top",
        });
        this.listarProductosAgregados();
      },
      (error) => {
        this.habilitaBtnListProd = false;
        this.spinBtnListProd = false;
        this.utilsService.abrirMensajeToken(null, null, null, error);
      }
    );
  }

  agregarMontos(row,tipo) {
    const dialogRef = this.dialog.open(AgregarProductoComponent, {
      width: "350px",
      disableClose: true,
      data: {
        datosCompra : this.datosCompras,
        tipoAccion:tipo,
        datos: row
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == "OK"){
        this.formCompra.controls.producto.setValue('');
        this.dataSource.data = null;
        this.listarProductosAgregados();
      }
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
      this.compraService.eliminaCompraDetalle(row.idcompradetalle).subscribe(
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
      );
    });
  }

  RegistrarCompra() {
    this.formCompra.markAllAsTouched();
    if (this.formCompra.invalid) {
      this.snackbar.open("Existe información requerida por registrar.", null, {
         duration: Constantes.SNACKBAR_TIME,
         horizontalPosition: "end",
         verticalPosition: "top",
      });
      return;
    }
    if (!this.idCompra){
      this.snackbar.open("Existe un inconveniente en la Orden de Compra.", null, {
        duration: Constantes.SNACKBAR_TIME,
        horizontalPosition: "end",
        verticalPosition: "top",
      });
      return;
    }
    if (this.formCompra.get("total").value <= 0){
      this.snackbar.open("El monto debe ser mayor a 0.", null, {
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
      this.compraService
        .procesaCompra(
          this.tipoAccion,
          this.idCompra,
          this.formCompra.get("proveedor").value,
          this.formCompra.get("recibe").value,
          this.formCompra.get("fechacompra").value,
          this.formCompra.get("fechaentrega").value,
          this.formCompra.get("tipoemision").value,
          this.formCompra.get("nrodocumento").value,
          this.formCompra.get("referencia").value,
          this.incluyeIGV,
          this.formCompra.get("monto").value,
          this.formCompra.get("igv").value,
          this.formCompra.get("total").value
        )
        .subscribe(
          (response) => {
            this.habilitaBtnReg = false;
            this.spinBtnReg = false;
            this.snackbar.open(response.mensaje, null, {
              duration: Constantes.SNACKBAR_TIME,
              horizontalPosition: "end",
              verticalPosition: "top",
            });
            this.Cancelar();
          },
          (error) => {
            this.habilitaBtnReg = false;
            this.spinBtnReg = false;
            this.utilsService.abrirMensajeToken(null, null, null, error);
          }
        );
    });
  }

  //FUNCIONES GEENRALES
  Cancelar() {
    this.verBandejaPrincipal.emit();
  }

  keyPress(event) {
    if (event.keyCode == 13) {
      this.buscarProducto();
    }
  }

  detectaMonto(event: MatCheckboxChange) {
    if (event.checked) {
      this.incluyeIGV = 1;
    } else {
      this.incluyeIGV = 0;
    }
    this.listarProductosAgregados();
  }

  validaFechas() {
    this.minFecha = this.formCompra.get("fechacompra").value;
    this.verificarCompra();
  }

  openModalCatalogo(valor): void {
    var dialogRef = null;
    if (valor == 1) {
      this.titulo = "Crear Unidad de Medida";
      this.tituloInput = "Unidad de Medida";
    } else if (valor == 2) {
      this.titulo = "Crear Proveedor";
      this.tituloInput = "Proveedor";
    }
    //UNIDAD MEDIDA
    if (valor == 1) {
      var dataUnidadMedida = {
        datosUMedida: null,
        idrubro: this.datosConfiguracion.idrubro
      }
      dialogRef = this.dialog.open(GrubrosUnidadMedidaComponent, {
        width: '650px',
        disableClose: true,
        data: dataUnidadMedida
      });
    }
    //PROVEEDOR
    if (valor == 2) {
      var dataProveedor = {
        datosProveedor: null,
      };
      dialogRef = this.dialog.open(CproveedorRegistroComponent, {
        width: "650px",
        disableClose: true,
        data: dataProveedor,
      });
    }
    dialogRef.afterClosed().subscribe((result) => {
      //UNIDAD MEDIDA
      if (valor == 1) {
        this.listarUnidadMedida();
      }
      //PROVEEDOR
      if (valor == 2) {
        this.listarProveedor();
      }
    });
  }

}
