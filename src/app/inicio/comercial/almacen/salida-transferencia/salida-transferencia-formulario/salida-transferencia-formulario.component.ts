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
import { FuncionesService } from "src/app/core/services/funciones.service";
import { ParametroService } from "src/app/core/services/parametro.service";
import { MovimientosService } from "src/app/core/services/movimientos.service";
import { AddProductosComponent } from "../../../producto/add-productos/add-productos.component";
import { MatCheckboxChange } from "@angular/material/checkbox";

@Component({
  selector: 'vex-salida-transferencia-formulario',
  templateUrl: './salida-transferencia-formulario.component.html',
  styleUrls: ['./salida-transferencia-formulario.component.scss'],
  animations: [stagger60ms, fadeInUp400ms, scaleIn400ms, fadeInRight400ms],
})
export class SalidaTransferenciaFormularioComponent implements OnInit {

  @Input() datosSalida: any;
  @Input() datosConfiguracion: any;
  @Output() verBandejaSalida = new EventEmitter();

  constSistema = Constantes;

  validandoPermiso = true;
  accesoFormulario = true;
  itemPrincipal = "Mantenimiento";
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
  formSalida: FormGroup;
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

  loadingSalida = false;
  loadingProductos = false;
  loadingProductosAgregados = false;
  resultado = 0;

  lstUnidadMedida: any[];
  lstTipoDocumento: any[];
  lstProveedor: any[];
  lstTienda: any[];

  //Configuración
  idSalida: any = 0;
  idSalidaRegistrado: any = null;
  tipoAccion: any = 0;
  minFecha: any;
  nummostrarprod: any = 0;
  cuentaVerificaSalidaRegistradas: any = 0;
  total: any =0;
  incluyeIGV: any = 0;
  montosinigv: any = 0;
  montoconigv: any = 0;

  habilitaBtnReg = false;
  spinBtnReg = false;
  habilitaCboTDocumentos = false;
  deshabilitaItems = false;
  flujoSalida = false;
  habilitaBtnListProd = false;
  spinBtnListProd = false;
  habilitaCboTienda = false;
  
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
          this.listarTiendas();
          this.nummostrarprod = this.datosConfiguracion.nummostrarprodcompras;
        }
      },
      (error) => {
        this.utilsService.abrirMensajeToken(null, null, null, error);
      }
    );
  }

  cargaFormulario() {
    this.accesoFormulario = false;
    if (this.datosSalida) {
      this.tituloForm = "Editar Salida de Mercadería x Transferencia";
      this.btnRegistro = "Registrar Salida de Mercadería";
      this.idSalida = this.datosSalida.idmovimiento;
      this.idSalidaRegistrado = this.datosSalida;
      this.tipoAccion = 2;
      this.flujoSalida = true;
      if (this.datosSalida.idestadomovimiento !== this.estadoEnproceso){
        this.deshabilitaItems = true;
      }
      this.listarProductosAgregados();
    } else {
      this.tituloForm = "Registrar Salida de Mercadería x Transferencia";
      this.btnRegistro = "Buscar";
      this.tipoAccion = 1;
      if (this.cuentaVerificaSalidaRegistradas == 0){
        this.verificarSalidaRegistradaxUsuario();
      }
    }
    this.formSalida = this.formBuilder.group({
      origen: [{value:this.dataUsuario.tienda,disabled:true}, [Validators.required]],
      destino: [{value:this.datosSalida?.idsucursaldestino,disabled:true}, [Validators.required]],
      referencia: [{value:this.datosSalida?.referenciamovimiento,disabled: this.deshabilitaItems}, [Validators.required, Validators.maxLength(250)]],
      incluyeIGV: [this.datosSalida?.montoigv],
      monto: [this.datosSalida?.montosinigv],
      igv: [this.datosSalida?.montoigv],
      total: [this.datosSalida?.montototal],
      producto: []
    });
    this.accesoFormulario = true;
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

  verificarSalidaRegistradaxUsuario() {
    this.movimientosService
      .verificarSalidaTransferenciaxUsuario()
      .subscribe(
        (response) => {
          this.idSalidaRegistrado = response.cregistro;
          this.datosSalida = response.dato;
          this.cuentaVerificaSalidaRegistradas = 1;
          this.cargaFormulario();
        },
        (error) => {
          this.utilsService.abrirMensajeToken(null, null, null, error);
        }
      );
  }

  verificarSalida() {
    var recibe    = this.formSalida.get("destino").value;
    if ((recibe)) {
      this.movimientosService
        .registrarPreSalida(
          this.tipoAccion,
          this.idSalida,
          recibe
        )
        .subscribe(
          (response) => {
            this.idSalidaRegistrado = response.cregistro;
            this.datosSalida = response.dato;
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
    if (!this.formSalida.get("producto").value) {
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
        this.formSalida.get("producto").value,
        this.nummostrarprod,
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
    this.movimientosService.listMovimientosDetalle(this.datosSalida.idmovimiento).subscribe(response =>{
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
      this.formSalida.controls.total.setValue(this.total);
      this.formSalida.controls.igv.setValue(this.montoconigv);
      this.formSalida.controls.monto.setValue(this.montosinigv);

    },
    (error) => {
      this.loadingProductosAgregados = false;
      this.utilsService.abrirMensajeToken(null, null, null, error);
    });
  }

  agregarProducto(row) {
    this.habilitaBtnListProd = true;
    this.spinBtnListProd = true;
    this.movimientosService.registrarMovimientoDetalleSalidaTransferencia(
      1,
      0,
      this.datosSalida.idmovimiento,
      row.idproducto,
      this.datosSalida.idproveedor,
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

  agregarCantidad(row,tipo) {
    const dialogRef = this.dialog.open(AddProductosComponent, {
      width: "350px",
      disableClose: true,
      data: {
        datosMovimiento : this.datosSalida,
        tipoAccion: tipo,
        datos: row
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == "OK"){
        this.formSalida.controls.producto.setValue('');
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
      this.movimientosService.eliminarMovimientoDetalle(row.idmovimientodetalle).subscribe(
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

  RegistrarMovimiento() {
    this.formSalida.markAllAsTouched();
    if (this.formSalida.invalid) {
      this.snackbar.open("Existe información requerida por registrar.", null, {
         duration: Constantes.SNACKBAR_TIME,
         horizontalPosition: "center",
         verticalPosition: "top",
      });
      return;
    }
    if (!this.idSalida){
      this.snackbar.open("Existe un inconveniente en la salida de la Mercadería.", null, {
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
        this.idSalida,
        this.datosSalida?.idproveedor,
        this.formSalida.get("destino").value,
        0,
        null,
        this.formSalida.get("monto").value,
        this.formSalida.get("incluyeIGV").value,
        this.formSalida.get("referencia").value,
        'SALXTRANSFERENCIAS'
        ).subscribe(response =>{
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
    this.verBandejaSalida.emit();
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

}
