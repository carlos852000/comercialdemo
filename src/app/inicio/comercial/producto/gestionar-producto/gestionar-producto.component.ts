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

import {Observable} from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import {FormGroup,FormBuilder,Validators,FormControl,} from "@angular/forms";
import { Session } from "src/app/core/models/session.model";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MAT_DIALOG_DATA,MatDialogRef,MatDialog,} from "@angular/material/dialog";
import { ConfirmationComponent } from "src/app/shared/confirmation/confirmation.component";
import { StorageService } from "src/app/core/services/storage.service";
import { PermisoService } from "src/app/core/services/permisos.service";
import { UtilsService } from "src/app/core/funciones/utils.service";
import { ProductoService } from "src/app/core/services/producto.service";
import { MatTableDataSource } from "@angular/material/table";
import { Constantes } from "src/app/core/constants/constantes";
import { GeneralService } from "src/app/core/services/general.service";
import { ProveedorService } from "src/app/core/services/proveedor.service";
import { ListarProductoDetalleComponent } from "../listar-producto-detalle/listar-producto-detalle.component";
import { HistorialPreciosComponent } from "../historial-precios/historial-precios.component";
import { CproveedorRegistroComponent } from '../../proveedor/cproveedor-registro/cproveedor-registro.component';
import { GcatalogoRegistroComponent } from '../../../general/confcatalogo/gcatalogo-registro/gcatalogo-registro.component';
import { GrubrosUnidadMedidaComponent } from '../../../general/confrubros/grubros-unidad-medida/grubros-unidad-medida.component';
import { GrubrosCaracteristicasDetalleComponent } from '../../../general/confrubros/grubros-caracteristicas-detalle/grubros-caracteristicas-detalle.component';
import { MatCheckboxChange } from "@angular/material/checkbox";

@Component({
  selector: "vex-gestionar-producto",
  templateUrl: "./gestionar-producto.component.html",
  styleUrls: ["./gestionar-producto.component.scss"],
  animations: [stagger60ms, fadeInUp400ms, scaleIn400ms, fadeInRight400ms],
})
export class GestionarProductoComponent implements OnInit {

  //edades = new FormControl();
  //modelo = new FormControl();
  //familia = new FormControl();
  //genero = new FormControl();
  @Input() datosProducto: any;
  @Input() datosConfiguracion: any;
  @Output() verBandejaPrincipal = new EventEmitter();


  //PermisosFormulario
  validandoPermiso = true;
  accesoFormulario = true;
  //moduloOpcion = "modarchproductos";
  itemPrincipal = "Archivo";
  dataUsuario: Session;

  titulo: any;
  tituloInput: any;
  formProducto: FormGroup;
  formProductoPrecio: FormGroup;
  formProductoPrecioGrupos : FormGroup;
  layoutCtrl = new FormControl("layoutCtrl");
  btnRegistro: any;
  tituloForm: any;

  //icons
  icMoreVert = icMoreVert;
  icMenu = icMenu;
  icBubbleChart = icBubbleChart;
  icAdd = icAdd;
  icEdit = icEdit;
  icDelete = icDelete;
  icSearch = icSearch;
  icMoney = icMoney;
  icNum = icDni;
  icpCodigo = icpCodigo;
  icReceipt = icReceipt;

  loadingProductos = false;
  resultado = 0;

  lstUnidadMedida: any[];
  lstMarcas: any[];
  lstProveedor: any[];
  lstEdades: any[];
  lstModelo: any[];
  lstFamilia: any[];
  lstGenero: any[];

  //Configuración
  idProducto: any = 0;
  idProductoRegistrado: any = null;
  idRubroCaractEdades: any = 0;
  idRubroCaractModelo: any = 0;
  idRubroCaractFamilia: any = 0;
  idRubroCaractGenero: any = 0;
  dataMarcas: any = [];
  tipoAccion: any = 0;
  cantUnidadMedida: any = 0;
  precioFinal: any = 0;
  valIGV: any = 0;
  redondeoPrecio: any = 0;
  desagregado: any = 0;
  habilitaBtnReg = false;
  spinBtnReg = false;

  habilitaCboUM = false;
  habilitaCboEdades = false;
  habilitaCboModelo = false;
  habilitaCboFamilia = false;
  habilitaCboGenero = false;
  habilitaCboProveed = false;
  habilitaCboMarca = false;
  /*spinCboUM = false;
  spinCboEdades = false;
  spinCboModelo = false;
  spinCboFamilia = false;
  spinCboGenero = false;
  spinCboProveed = false;
  spinCboMarca = false;*/

  tipoEntradaNumero = 'onlynumero';
  tipoEntradaMoneda = 'numero';

  //umedida = new FormControl();
  //filteredUnidadMedida: Observable<any[]>; 

  constructor(
    private formBuilder: FormBuilder,
    private snackbar: MatSnackBar,
    private storageService: StorageService,
    private permisosService: PermisoService,
    private dialog: MatDialog,
    private generalService: GeneralService,
    private productoService: ProductoService,
    private proveedorService: ProveedorService,
    private utilsService: UtilsService,
  ) {
    this.dataUsuario = this.storageService.getCurrentSession();
  }

  ngOnInit(): void {
    this.valIGV = this.datosConfiguracion.igv;
    this.cargaFormulario();
    this.listarUnidadMedida();
    this.listarMarcas();
    this.listarProveedor();
    this.listarEdades();
    this.listarModelo();
    this.listarFamilia();
    this.listarGenero();
    
  }

  cargaFormulario() {
    this.idProductoRegistrado = null;
    if (this.datosProducto) {
      this.tituloForm = "Editar Producto";
      this.btnRegistro = "Actualizar";
      this.idProducto = this.datosProducto.idproducto;
      this.cantUnidadMedida = this.datosProducto.unidadmedidacantidad;
      this.desagregado = this.datosProducto.desagrega;
      this.idProductoRegistrado = this.idProducto;
      this.tipoAccion = 2;
      this.cargaGenero();
      this.cargaFamilia();
      this.cargaModelo();
      this.cargaEdades();
    } else {
      this.tituloForm = "Registrar Productos";
      this.btnRegistro = "Registrar";
      this.tipoAccion = 1;
    }
    this.formProducto = this.formBuilder.group({
      nombreProducto: [this.datosProducto?.nombreProducto, [Validators.required,Validators.maxLength(250)]],
      unidadMedida: [this.datosProducto?.idunidadmedida, Validators.required],
      codigoInterno: [this.datosProducto?.codigointerno, [Validators.maxLength(250)]],
      codigoBarras: [this.datosProducto?.codigobarra, [Validators.maxLength(250)]],
      edades: [[]],
      modelo: [[]],
      familia: [[]],
      genero: [[]],
      porcentanjeUtilidad: [this.datosProducto?.margenutilidad, [Validators.required,Validators.maxLength(5)]],
      cantidad: [this.datosProducto?.cantidad, [Validators.required,Validators.maxLength(5)]],
      cantidadMinimaCompra: [this.datosProducto?.cantidadminparacompra, [Validators.required,Validators.maxLength(5)]],
      activoCompra: [this.datosProducto?.activoparacompra.toString()? this.datosProducto?.activoparacompra.toString():'0'],
      cantidadMinimaVenta: [this.datosProducto?.cantidadminparaventa, [Validators.required,Validators.maxLength(5)]],
      activoVenta: [this.datosProducto?.activoparaventa.toString()? this.datosProducto?.activoparaventa.toString():'0'],
      desagregar: [this.datosProducto?.desagrega.toString()? this.datosProducto?.desagrega.toString():'0'],
      marca: [this.datosProducto?.idmarca, Validators.required],
      proveedor: [this.datosProducto?.idproveedor, Validators.required],
    });
    this.formProductoPrecio = this.formBuilder.group({
      nombreProducto: [{value:this.datosProducto?.nombreProducto,disabled: true}],
      preciocostoNuevo: [this.datosProducto?.preciocostonuevo, [Validators.required,Validators.maxLength(10)]],
      preciocosto: [this.datosProducto?.preciocosto, [Validators.required,Validators.maxLength(10)]],
      porcentanjeUtilidad: [this.datosProducto?.margenutilidad, [Validators.required,Validators.maxLength(5)]],
      preciosinimp: [this.datosProducto?.preciosinimp, [Validators.required,Validators.maxLength(10)]],
      porcentImpuesto: [this.datosProducto?.igv.toString()? this.datosProducto?.igv.toString():'0'],
      precioconimp: [this.datosProducto?.preciofinal, [Validators.required,Validators.maxLength(10)]],
      unidadMedida: [this.datosProducto?.idunidadmedida, Validators.required],
      preciounitario: [this.datosProducto?.preciounitario, [Validators.required,Validators.maxLength(10)]],
      redondeo: this.datosProducto?.indicadorRedondeoPrecio,
    });
    this.precioFinal = this.datosProducto?.preciounitario;
  }

  listarProveedor() {
    this.habilitaCboProveed = true;
    this.proveedorService.listarProveedores(null,50,1).subscribe(
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

  listarUnidadMedida() {
    this.habilitaCboUM = true;
    this.generalService.listaUnidadMedidaxRubro().subscribe(response =>{
      this.lstUnidadMedida = response.dato;
      /*this.filteredUnidadMedida = this.umedida.valueChanges.pipe(
        startWith(''),
        map(value => this.filtrarUnidadMedida(value)),
      );*/
      this.habilitaCboUM = false;
    }, error => {
      this.habilitaCboUM = false;
      this.utilsService.abrirMensajeToken(null, null, null, error);
    });
  }

  /*filtrarUnidadMedida(valor) {
    console.log("Texto",valor);
    return this.lstUnidadMedida.filter(state =>
      state.descripcion.toLowerCase().indexOf(valor) === 0);
  }

  getTitleUMedida(id) {
    if (id){
      this.lstUnidadMedida.find(row => row.idrubrounidadmedida == id).descripcion;
    }
    
  }*/

  listarMarcas() {
    this.habilitaCboMarca = true;
    let abreviatura = "TMARCAS";
    this.generalService.verificaCatalogo(abreviatura).subscribe(response =>{
      if (response.resultado == 1){
        this.dataMarcas = response.dato;
        //LISTA EL CATALOGO DETALLE
        this.generalService.listaCatalogo(null,response.dato.idcatalogo).subscribe(responseDetalle =>{
          this.lstMarcas = responseDetalle.dato;
          this.habilitaCboMarca = false;
        }, error => {
          this.habilitaCboMarca = false;
          this.utilsService.abrirMensajeToken(null, null, null, error);
        });
      }
    }, error => {
      this.utilsService.abrirMensajeToken(null, null, null, error);
    });
  }

  listarEdades() {
    this.habilitaCboEdades = true;
    let abreviatura = "CAREDADES";
    this.generalService.listaRubroCaracteristicaDetalle(abreviatura).subscribe(response =>{
      this.lstEdades = response.dato;
      this.idRubroCaractEdades = response.dato[0]?.idrubrocaracteristica;
      this.habilitaCboEdades = false;
      /*if (this.datosProducto) {
        this.cargaEdades();
      }*/
    }, error => {
      this.habilitaCboEdades = false;
      this.utilsService.abrirMensajeToken(null, null, null, error);
    });
  }

  cargaEdades() {
    const lstEdades = [];
    let abreviatura = "CAREDADES";
    this.productoService.listaProductoCaracteristica(this.idProducto,abreviatura).subscribe(responseEdades =>{
      responseEdades.dato.forEach((row) => {
        lstEdades.push(row.idcaracteristica);
      });
      this.formProducto.controls.edades.setValue(lstEdades);
    }, error => {
      this.utilsService.abrirMensajeToken(null, null, null, error);
    });
  }

  listarModelo() {
    this.habilitaCboModelo = true;
    let abreviatura = "CARMODELO";
    this.generalService.listaRubroCaracteristicaDetalle(abreviatura).subscribe(response =>{
      this.lstModelo = response.dato;
      this.idRubroCaractModelo = response.dato[0]?.idrubrocaracteristica;
      this.habilitaCboModelo = false;
      /*if (this.datosProducto) {
        this.cargaModelo();
      }*/
    }, error => {
      this.habilitaCboModelo = false;
      this.utilsService.abrirMensajeToken(null, null, null, error);
    });
  }

  cargaModelo() {
    const lstModelos = [];
    let abreviatura = "CARMODELO";
    this.productoService.listaProductoCaracteristica(this.idProducto,abreviatura).subscribe(responseModelo =>{
      responseModelo.dato.forEach((row) => {
        lstModelos.push(row.idcaracteristica);
      });
      this.formProducto.controls.modelo.setValue(lstModelos);
    }, error => {
      this.utilsService.abrirMensajeToken(null, null, null, error);
    });
  }

  listarFamilia() {
    this.habilitaCboFamilia = true;
    let abreviatura = "CARFAMILIA";
    this.generalService.listaRubroCaracteristicaDetalle(abreviatura).subscribe(response =>{
      this.lstFamilia = response.dato;
      this.idRubroCaractFamilia = response.dato[0]?.idrubrocaracteristica;
      this.habilitaCboFamilia = false;
      /*if (this.datosProducto) {
        this.cargaFamilia();
      }*/
    }, error => {
      this.habilitaCboFamilia = false;
      this.utilsService.abrirMensajeToken(null, null, null, error);
    });
  }

  cargaFamilia() {
    const lstFamilia = [];
    let abreviatura = "CARFAMILIA";
    this.productoService.listaProductoCaracteristica(this.idProducto,abreviatura).subscribe(responseFamilia =>{
      responseFamilia.dato.forEach((row) => {
        lstFamilia.push(row.idcaracteristica);
      });
      this.formProducto.controls.familia.setValue(lstFamilia);
    }, error => {
      this.utilsService.abrirMensajeToken(null, null, null, error);
    });
  }

  listarGenero() {
    this.habilitaCboGenero = true;
    let abreviatura = "CARGENERO";
    this.generalService.listaRubroCaracteristicaDetalle(abreviatura).subscribe(response =>{
      this.lstGenero = response.dato;
      this.idRubroCaractGenero = response.dato[0]?.idrubrocaracteristica;
      this.habilitaCboGenero = false;
      /*if (this.datosProducto) {
        this.cargaGenero();
      }*/
    }, error => {
      this.habilitaCboGenero = false;
      this.utilsService.abrirMensajeToken(null, null, null, error);
    });
  }

  cargaGenero() {
    const lstGenero = [];
    let abreviatura = "CARGENERO";
    this.productoService.listaProductoCaracteristica(this.idProducto,abreviatura).subscribe(responseGenero =>{
      responseGenero.dato.forEach((row) => {
        lstGenero.push(row.idcaracteristica);
      });
      this.formProducto.controls.genero.setValue(lstGenero);
    }, error => {
      this.utilsService.abrirMensajeToken(null, null, null, error);
    });
  }

  RegistrarProducto() {
    this.formProducto.markAllAsTouched();
    if (this.formProducto.invalid) {
      this.snackbar.open("Existe información requerida por registrar.", null, {
         duration: Constantes.SNACKBAR_TIME,
         horizontalPosition: "end",
         verticalPosition: "top",
      });
      return;
    }
    this.idProductoRegistrado = null;
    var mensaje = "¿Desea procesar esta información?";
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      disableClose: true,
      width: "350px",
      data: { content: mensaje },
    });

    const sub = dialogRef.componentInstance.onSi.subscribe((data) => {
      this.habilitaBtnReg = true;
      this.spinBtnReg = true;
      this.productoService
        .procesaProducto(
          this.tipoAccion,
          this.idProducto,
          this.formProducto.get("nombreProducto").value,
          this.formProducto.get("codigoInterno").value,
          this.formProducto.get("codigoBarras").value,
          this.formProducto.get("proveedor").value,
          this.formProducto.get("marca").value,
          this.formProducto.get("porcentanjeUtilidad").value,
          this.formProducto.get("cantidad").value,
          this.formProducto.get("unidadMedida").value,
          this.formProducto.get("cantidadMinimaCompra").value,
          this.formProducto.get("activoCompra").value,
          this.formProducto.get("cantidadMinimaVenta").value,
          this.formProducto.get("activoVenta").value,
          this.formProducto.get("desagregar").value,
          this.formProducto.get("edades").value.toString(),
          this.formProducto.get("modelo").value.toString(),
          this.formProducto.get("familia").value.toString(),
          this.formProducto.get("genero").value.toString(),
        )
        .subscribe(
          (response) => {
            this.habilitaBtnReg = false;
            this.spinBtnReg = false;
            this.idProductoRegistrado = response.cregistro;
            this.datosProducto = response.dato;
            this.snackbar.open(response.mensaje, null, {
              duration: Constantes.SNACKBAR_TIME,
              horizontalPosition: "end",
              verticalPosition: "top",
            });
            this.cargaFormulario();
          },
          (error) => {
            this.habilitaBtnReg = false;
            this.spinBtnReg = false;
            this.utilsService.abrirMensajeToken(null, null, null, error);
          }
        );
    });
  }

  CargarProductosDesagregados(){
    const dialogRef = this.dialog.open(ListarProductoDetalleComponent, {
      width: "750px",
      disableClose: true,
      data: this.datosProducto,
    });
    dialogRef.afterClosed().subscribe((result) => {
    });
  }

  verHistorialPrecios() {
    const dialogRef = this.dialog.open(HistorialPreciosComponent, {
      width: "850px",
      disableClose: true,
      data: this.datosProducto,
    });
  }

  RegistrarProductoPrecio() {
    this.formProductoPrecio.markAllAsTouched();
    if (this.formProductoPrecio.invalid) {
      this.snackbar.open("Existe información requerida por registrar.", null, {
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
      this.productoService
        .procesaProductoPrecio(
          this.idProductoRegistrado,
          this.formProductoPrecio.get("preciocosto").value,
          this.formProductoPrecio.get("porcentanjeUtilidad").value,
          this.formProductoPrecio.get("preciosinimp").value,
          this.formProductoPrecio.get("porcentImpuesto").value,
          this.formProductoPrecio.get("precioconimp").value,
          this.formProductoPrecio.get("preciounitario").value,
          this.formProductoPrecio.get("unidadMedida").value,
          this.redondeoPrecio
        )
        .subscribe(
          (response) => {
            this.habilitaBtnReg = false;
            this.spinBtnReg = false;
            this.idProductoRegistrado = response.cregistro;
            this.datosProducto = response.dato;
            this.snackbar.open(response.mensaje, null, {
              duration: Constantes.SNACKBAR_TIME,
              horizontalPosition: "end",
              verticalPosition: "top",
            });
            this.cargaFormulario();
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

  porcentajeImpuesto(Valor) {
    if (Valor == 0){
      this.formProductoPrecio.controls.porcentImpuesto.setValue(0);
    } else {
      this.formProductoPrecio.controls.porcentImpuesto.setValue(1);
    }
    this.getCalculaPrecio(4);
  }

  getCalculaPrecio(Tipo) {
    var precioCosto     = (this.formProductoPrecio.get("preciocosto").value)? parseFloat(this.formProductoPrecio.get("preciocosto").value):0;
    var utlidad         = (this.formProductoPrecio.get("porcentanjeUtilidad").value)? parseFloat(this.formProductoPrecio.get("porcentanjeUtilidad").value):0;
    var preciocUtil     = (this.formProductoPrecio.get("preciosinimp").value)? parseFloat(this.formProductoPrecio.get("preciosinimp").value):0;
    var checkimpuesto   = (this.formProductoPrecio.get("porcentImpuesto").value)? parseFloat(this.formProductoPrecio.get("porcentImpuesto").value):0;
    var precioFinal     = (this.formProductoPrecio.get("precioconimp").value)? parseFloat(this.formProductoPrecio.get("precioconimp").value):0;
    var impuesto        = 0;
    if (checkimpuesto == 1){
      impuesto          = this.valIGV;
    }
    if (Tipo == 1){
      preciocUtil             = (precioCosto * (utlidad/100)) + precioCosto;
      precioFinal             = (preciocUtil * (impuesto/100)) + preciocUtil;
      this.formProductoPrecio.controls.porcentanjeUtilidad.setValue(utlidad.toFixed(2));
      this.formProductoPrecio.controls.preciosinimp.setValue(preciocUtil.toFixed(2));
      this.formProductoPrecio.controls.precioconimp.setValue(precioFinal.toFixed(2));
    }
    if (Tipo == 2){
      preciocUtil             = (precioCosto * (utlidad/100)) + precioCosto;
      precioFinal             = (preciocUtil * (impuesto/100)) + preciocUtil;
      this.formProductoPrecio.controls.preciocosto.setValue(precioCosto.toFixed(2));
      this.formProductoPrecio.controls.preciosinimp.setValue(preciocUtil.toFixed(2));
      this.formProductoPrecio.controls.precioconimp.setValue(precioFinal.toFixed(2));
    }
    if (Tipo == 3){
      precioCosto             = preciocUtil / (1+(utlidad/100));
      precioFinal             = (preciocUtil * (impuesto/100)) + preciocUtil;
      this.formProductoPrecio.controls.preciocosto.setValue(precioCosto.toFixed(2));
      this.formProductoPrecio.controls.precioconimp.setValue(precioFinal.toFixed(2));
    }
    if (Tipo == 4){
      if (impuesto > 0){
        precioFinal           = (preciocUtil * (impuesto/100)) + preciocUtil;
      } else {
        precioFinal           = preciocUtil;
      }
      this.formProductoPrecio.controls.precioconimp.setValue(precioFinal.toFixed(2));
    }
    if (Tipo == 5){
      if (impuesto > 0){
        preciocUtil           = precioFinal / (1+(impuesto/100));
      } else {
        preciocUtil           = precioFinal;
      }
      precioCosto             = preciocUtil / (1+(utlidad/100));
      this.formProductoPrecio.controls.preciocosto.setValue(precioCosto.toFixed(2));
      this.formProductoPrecio.controls.preciosinimp.setValue(preciocUtil.toFixed(2));
    }
    if (this.cantUnidadMedida > 0) {
      this.precioFinal = precioFinal;
      this.formProductoPrecio.controls.preciounitario.setValue((precioFinal/this.cantUnidadMedida).toFixed(2));
    }
  }

  redondearPrecio(event:MatCheckboxChange) {
    var monto = this.precioFinal/this.cantUnidadMedida;
    if (event.checked) {
      //monto = monto.toFixed;
      monto = Math.ceil(monto);
      this.redondeoPrecio = 1;
      this.formProductoPrecio.controls.preciounitario.setValue(monto);
    } else {
      this.redondeoPrecio = 0;
      this.getCalculaPrecio(2);
    }
  }

  getUnidadMedida(row) {
    this.cantUnidadMedida = row.cantidad;
  }

  desagregaProductos(valor) {
    if (valor == 1){
      this.desagregado = 1;
    } else {
      this.desagregado = 0;
    }
  }

  openModalCatalogo(valor): void {
    var dialogRef = null;
    if (valor == 1) {
      this.titulo = "Crear Unidad de Medida";
      this.tituloInput = "Unidad de Medida";
    } else if (valor == 2) {
      this.titulo = "Crear Edades";
      this.tituloInput = "Edades";
    } else if (valor == 3) {
      this.titulo = "Crear Modelo";
      this.tituloInput = "Modelo";
    } else if (valor == 4) {
      this.titulo = "Crear Familia";
      this.tituloInput = "Familia";
    } else if (valor == 5) {
      this.titulo = "Crear Genero";
      this.tituloInput = "Genero";
    } else if (valor == 6) {
      this.titulo = "Crear Proveedor";
      this.tituloInput = "Proveedor";
    } else if (valor == 7) {
      this.titulo = "Crear Marca";
      this.tituloInput = "Marca";
    }
    //UNIDAD MEDIDA
    if (valor == 1){
      var dataUnidadMedida = {
        datosUMedida: null,
        idrubro : this.datosConfiguracion.idrubro
      }
      dialogRef = this.dialog.open(GrubrosUnidadMedidaComponent, {
        width: '650px',
        disableClose: true,
        data: dataUnidadMedida
      });
    }
    if ((valor == 2) || (valor == 3) || (valor == 4) || (valor == 5)){
      var idRubroCaracteristica = 0;
      if (valor == 2){
        idRubroCaracteristica = this.idRubroCaractEdades;
      }
      if (valor == 3){
        idRubroCaracteristica = this.idRubroCaractModelo;
      }
      if (valor == 4){
        idRubroCaracteristica = this.idRubroCaractFamilia;
      }
      if (valor == 5){
        idRubroCaracteristica = this.idRubroCaractGenero;
      }
      var dataCaracteristicas = {
        datosCaracteristicaDetalle: null,
        idrubroCaracteristica : idRubroCaracteristica
      }
      dialogRef = this.dialog.open(GrubrosCaracteristicasDetalleComponent, {
        width: '650px',
        disableClose: true,
        data: dataCaracteristicas
      });
    }
    //PROVEEDOR
    if (valor == 6){
      var dataProveedor = {
        datosProveedor: null,
      };
      dialogRef = this.dialog.open(CproveedorRegistroComponent, {
        width: "650px",
        disableClose: true,
        data: dataProveedor,
      });
    }
    //MARCAS
    if (valor == 7){
      var datosMarcas = {
        datosItem: null,
        idCatalogo : this.dataMarcas.idcatalogo,
        abreviaturaCatalogo : this.dataMarcas.abreviatura,
      }
      dialogRef = this.dialog.open(GcatalogoRegistroComponent, {
        width: '650px',
        disableClose: true,
        data: datosMarcas
      });
    }
    dialogRef.afterClosed().subscribe((result) => {
      //UNIDAD MEDIDA
      if (valor == 1){
        this.listarUnidadMedida();
      }
      if (valor == 2){
        this.listarEdades();
      }
      if (valor == 3){
        this.listarModelo();
      }
      if (valor == 4){
        this.listarFamilia();
      }
      if (valor == 5){
        this.listarGenero();
      }
      //PROVEEDOR
      if (valor == 6){
        this.listarProveedor();
      }
      //MARCO
      if (valor == 7){
        this.listarMarcas();
      }
    });
  }

}
