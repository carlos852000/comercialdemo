import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA,MatDialogRef, MatDialog,} from "@angular/material/dialog";

import { fadeInUp400ms } from "../../../../../@vex/animations/fade-in-up.animation";
import { stagger60ms } from "../../../../../@vex/animations/stagger.animation";
import { scaleIn400ms } from "../../../../../@vex/animations/scale-in.animation";
import { fadeInRight400ms } from "../../../../../@vex/animations/fade-in-right.animation";

import icClose from "@iconify/icons-ic/twotone-close";
import icMenu from "@iconify/icons-ic/twotone-menu";
import icBubbleChart from '@iconify/icons-ic/twotone-bubble-chart';
import icReceipt from '@iconify/icons-ic/twotone-receipt';

import { ConfirmationComponent } from "src/app/shared/confirmation/confirmation.component";
import { DateAdapter,MAT_DATE_FORMATS,MAT_DATE_LOCALE,} from "@angular/material/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Constantes } from "src/app/core/constants/constantes";
import { ProductoService } from "src/app/core/services/producto.service";
import { UtilsService } from "src/app/core/funciones/utils.service";
import { StorageService } from "src/app/core/services/storage.service";
import { Session } from "src/app/core/models/session.model";
import { ClienteService } from "src/app/core/services/cliente.service";
import { FuncionesService } from "src/app/core/services/funciones.service";

@Component({
  selector: 'vex-registro-producto-precio-grupo',
  templateUrl: './registro-producto-precio-grupo.component.html',
  styleUrls: ['./registro-producto-precio-grupo.component.scss'],
  animations: [stagger60ms, fadeInUp400ms, scaleIn400ms, fadeInRight400ms],
})
export class RegistroProductoPrecioGrupoComponent implements OnInit {

  dataUsuario: Session;
  form: FormGroup;
  tituloForm: any;
  btnRegistro: any;

  //icons
  icClose = icClose;
  icMenu = icMenu;
  icBubbleChart = icBubbleChart;
  icReceipt = icReceipt;

  //Configuración
  idProductoGrupoPrecio: any = 0;
  idProducto: any = 0;
  tipoAccion: any = 0;
  datosProductoPrecio: any;
  habilitaBtnReg = false;
  spinBtnReg = false;
  minFecha: any;
  maxFecha: any;
  divGrupo = true;
  divTemporada = true;
  lstGrupoClientes: any = [];

  tipoEntradaNumero = 'onlynumero';
  tipoEntradaMoneda = 'numero';

  constructor(
    private dialogRef: MatDialogRef<RegistroProductoPrecioGrupoComponent>,
    private dateAdapter: DateAdapter<Date>,
    private snackbar: MatSnackBar,
    private storageService: StorageService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private productoService: ProductoService,
    private funcionesService: FuncionesService,
    private clienteService: ClienteService,
    private utilsService: UtilsService,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.dateAdapter.setLocale("es-ES");
    this.minFecha = new Date().toISOString();
    this.dataUsuario = this.storageService.getCurrentSession();
    this.datosProductoPrecio = this.data.datosProductoPrecio;
    this.idProducto = this.data.idproducto;
  }

  ngOnInit(): void {
    this.listaGrupos();
    if (this.datosProductoPrecio) {
      this.tituloForm = "Editar Precio Específico";
      this.btnRegistro = "Actualizar";
      this.idProductoGrupoPrecio = this.datosProductoPrecio.idproductogrupoprecio;
      this.tipoAccion = 2;
    } else {
      this.tituloForm = "Registrar Precio Específico";
      this.btnRegistro = "Registrar";
      this.tipoAccion = 1;
    }
    this.form = this.formBuilder.group({
      nombre: [this.data.datosProductoPrecio?.nombre,[Validators.required, Validators.maxLength(250)],],
      tipoaplicacion: [this.datosProductoPrecio?.tipoaplicacion.toString()? this.datosProductoPrecio?.tipoaplicacion.toString():'1'],
      clientegrupo: [this.data.datosProductoPrecio?.idclientegrupo,[Validators.required],],
      ilimitado: [this.datosProductoPrecio?.ilimitado.toString()? this.datosProductoPrecio?.ilimitado.toString():'1'],
      fechainicio: [null,[Validators.required, Validators.maxLength(10)],],
      fechafin: [null,[Validators.required, Validators.maxLength(10)],],
      //fechainicio: [this.datosProductoPrecio?.fechainicio? this.funcionesService.formatearFecha(this.data.datosProductoPrecio?.fechainicio):null,[Validators.required],],
      //fechafin: [this.datosProductoPrecio?.fechafin? this.funcionesService.formatearFecha(this.data.datosProductoPrecio?.fechafin):null,[Validators.required],],
      tipocantidad: [this.datosProductoPrecio?.tipocantidad.toString()? this.datosProductoPrecio?.tipocantidad.toString():'0'],
      cantidad: [this.data.datosProductoPrecio?.cantidad,[Validators.required, Validators.maxLength(5)],],
      tipodcto: [this.data.datosProductoPrecio?.tipodcto,[Validators.required],],
      descuento: [this.datosProductoPrecio?.descuento? this.datosProductoPrecio?.descuento:1],
    });
    if (this.tipoAccion == 2){
      this.validaGrupo(this.datosProductoPrecio?.tipoaplicacion);
      this.validaTemporada(this.datosProductoPrecio?.ilimitado);
      this.form.controls.fechainicio.setValue(this.funcionesService.formatearFecha(this.funcionesService.formatearFechaBD(this.data.datosProductoPrecio?.fechainicio)));
      this.form.controls.fechafin.setValue(this.funcionesService.formatearFecha(this.funcionesService.formatearFechaBD(this.data.datosProductoPrecio?.fechafin)));
      //this.funcionesService.formatearFecha(this.data.datosProductoPrecio?.fechainicio)
    }
  }

  listaGrupos() {
    this.clienteService.listarClientesGrupos(null,100,1).subscribe(response =>{
      this.lstGrupoClientes = response.dato;
    }, error => {
      this.utilsService.abrirMensajeToken(null, null, null, error);
    });
  }

  RegistrarPrecioEspecifico() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
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
        .procesaProductoGrupoPrecio(
          this.tipoAccion,
          this.idProductoGrupoPrecio,
          this.idProducto,
          this.form.get("nombre").value,
          this.form.get("tipoaplicacion").value,
          this.form.get("clientegrupo").value,
          this.form.get("ilimitado").value,
          this.form.get("fechainicio").value,
          this.form.get("fechafin").value,
          this.form.get("tipocantidad").value,
          this.form.get("cantidad").value,
          this.form.get("tipodcto").value,
          this.form.get("descuento").value,
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
    });
  }

  validaFechas() {
    this.minFecha = this.form.get("fechainicio").value;
  }

  validaGrupo(valor) {
    if (valor == 1){
      this.divGrupo = true;
      this.form.get('clientegrupo').enable();
    } else {
      this.divGrupo = false;
      this.form.controls.clientegrupo.setValue(null);
      this.form.get('clientegrupo').disable();
    }
  }

  validaTemporada(valor) {
    if (valor == 1){
      this.divTemporada = true;
      this.form.get('fechainicio').enable();
      this.form.get('fechafin').enable();
    } else {
      this.divTemporada = false;
      this.form.controls.fechainicio.setValue(null);
      this.form.controls.fechafin.setValue(null);
      this.form.get('fechainicio').disable();
      this.form.get('fechafin').disable();
    }
  }

  cerrarVentana(valor) {
    this.dialogRef.close(valor);
  }

}
