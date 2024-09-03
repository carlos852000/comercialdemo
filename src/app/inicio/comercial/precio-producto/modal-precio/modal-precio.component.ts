
import { Component, OnInit, Inject, ViewChild, Input } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, } from "@angular/material/dialog";
import { fadeInUp400ms } from "../../../../../@vex/animations/fade-in-up.animation";
import { stagger60ms } from "../../../../../@vex/animations/stagger.animation";
import { scaleIn400ms } from "../../../../../@vex/animations/scale-in.animation";
import { fadeInRight400ms } from "../../../../../@vex/animations/fade-in-right.animation";

import icMoreVert from "@iconify/icons-ic/twotone-more-vert";
import icMenu from "@iconify/icons-ic/twotone-menu";
import icBubbleChart from "@iconify/icons-ic/twotone-bubble-chart";
import icClose from '@iconify/icons-ic/twotone-close';
import icAdd from '@iconify/icons-ic/twotone-add';
import icEdit from "@iconify/icons-ic/twotone-edit";
import icDelete from "@iconify/icons-ic/twotone-delete";
import icMoney from '@iconify/icons-ic/round-attach-money';
import icDni from '@iconify/icons-ic/sharp-person-pin';

import { UtilsService } from "src/app/core/funciones/utils.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { Constantes } from "src/app/core/constants/constantes";
import { ProductoService } from "src/app/core/services/producto.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Session } from "src/app/core/models/session.model";
import { ComprasService } from "src/app/core/services/compras.service";
import { MatAccordion } from '@angular/material/expansion';
@Component({
  selector: 'vex-modal-precio',
  templateUrl: './modal-precio.component.html',
  styleUrls: ['./modal-precio.component.scss'],
  animations: [stagger60ms, fadeInUp400ms, scaleIn400ms, fadeInRight400ms],
})
export class ModalPrecioComponent implements OnInit {

  @ViewChild(MatAccordion) accordion: MatAccordion;

  dataUsuario: Session;
  form: FormGroup;
  tituloForm: any;
  tituloProducto: string;
  tituloInput: any;
  btnRegistro: any = 'Asignar';
  //icons
  icMoreVert = icMoreVert;
  icMenu = icMenu;
  icClose = icClose;
  icBubbleChart = icBubbleChart;
  //icons

  icMoney = icMoney;
  icNum = icDni;

  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = [
    "correlativo",
    "preciosto",
    "margen",
    "preciosinimp",
    "igv",
    "preciofinal",
    "preciounitario",
    "datos",

    "costoProducto",
    "precioVentaEntero",
    "precioVentaUnidad",
    "margenEntero",
    "margenUnidad",
  ];

  loadingProductos = false;
  habilitaBtnReg = false;
  spinBtnReg = false;
  datosProducto: any;


  //Configuración
  datosCompra: any;
  tipoAccion: any = 0;

  tipoEntradaNumero = 'onlynumero';
  tipoEntradaMoneda = 'numero';


  constructor(
    private dialogRef: MatDialogRef<ModalPrecioComponent>,
    private snackbar: MatSnackBar,
    private productoService: ProductoService,
    private utilsService: UtilsService,
    private compraService: ComprasService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.datosProducto = this.data;
  }

  ngOnInit(): void {
    this.tituloForm = "Agregar: " + this.datosProducto.nombreProducto;
    this.tituloProducto = this.datosProducto.nombreProducto;
    this.form = this.formBuilder.group({
      cantidad: [this.datosProducto?.cantidad, [Validators.required, Validators.maxLength(5)]],
      preciocosto: [this.datosProducto?.preciocosto, [Validators.required, Validators.maxLength(10)]],
      total: [this.datosProducto?.total, [Validators.required, Validators.maxLength(10)]],
    });
    this.listaHistorial();
  }


  listaHistorial() {
    this.loadingProductos = true;
    this.productoService
      .listaProductoHistorialPrecios(
        this.datosProducto.idproducto
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

  getCalculaPrecio(Tipo) {
    var precioCosto = (this.form.get("preciocosto").value) ? parseFloat(this.form.get("preciocosto").value) : 0;
    var cantidad = (this.form.get("cantidad").value) ? parseFloat(this.form.get("cantidad").value) : 0;
    var total = 0;
    if (Tipo == 1) {
      total = precioCosto * cantidad;
      this.form.controls.total.setValue(total.toFixed(2));
    }
  }

  AsignarProducto() {
    this.form.markAllAsTouched();
    var total = (this.form.get("preciocosto").value) ? parseFloat(this.form.get("preciocosto").value) : 0;
    if ((this.form.invalid) || (total == 0)) {
      this.snackbar.open("Existe información requerida para asignar.", null, {
        duration: Constantes.SNACKBAR_TIME,
        horizontalPosition: "end",
        verticalPosition: "top",
      });
      return;
    }
    this.habilitaBtnReg = true;
    this.spinBtnReg = true;
    this.compraService
      .procesaCompraDetalle(
        1,
        0,
        this.datosCompra.idcompra,
        this.datosProducto.idproducto,
        this.datosCompra.idproveedor,
        this.form.get("cantidad").value,
        this.form.get("preciocosto").value,
        this.datosProducto.idunidadmedida
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
          this.cerrarVentana("OK");
        },
        (error) => {
          this.habilitaBtnReg = false;
          this.spinBtnReg = false;
          this.utilsService.abrirMensajeToken(null, null, null, error);
        }
      );
  }


  cerrarVentana(valor) {
    this.dialogRef.close(valor);
  }

}
