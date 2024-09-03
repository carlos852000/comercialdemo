import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog,} from "@angular/material/dialog";

import icClose from "@iconify/icons-ic/twotone-close";
import icMenu from "@iconify/icons-ic/twotone-menu";
import icMoney from '@iconify/icons-ic/round-attach-money';
import icDni from '@iconify/icons-ic/sharp-person-pin';

import { ConfirmationComponent } from "src/app/shared/confirmation/confirmation.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Constantes } from "src/app/core/constants/constantes";
import { SistemaService } from "src/app/core/services/sistema.service";
import { UtilsService } from "src/app/core/funciones/utils.service";
import { StorageService } from "src/app/core/services/storage.service";
import { Session } from "src/app/core/models/session.model";
import { MovimientosService } from "src/app/core/services/movimientos.service";

@Component({
  selector: 'vex-add-productos',
  templateUrl: './add-productos.component.html',
  styleUrls: ['./add-productos.component.scss']
})
export class AddProductosComponent implements OnInit {
  dataUsuario: Session;
  form: FormGroup;
  tituloForm: any;
  tituloInput: any;
  btnRegistro: any = 'Asignar';

  //icons
  icClose = icClose;
  icMenu = icMenu;
  icMoney = icMoney;
  icNum = icDni;

  //Configuración
  datosMovimiento: any;
  tipoAccion: any = 0;
  datosProducto: any;
  habilitaBtnReg = false;
  spinBtnReg = false;

  tipoEntradaNumero = 'onlynumero';
  tipoEntradaMoneda = 'numero';

  constructor(
    private dialogRef: MatDialogRef<AddProductosComponent>,
    private snackbar: MatSnackBar,
    private storageService: StorageService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private movimientosService: MovimientosService,
    private sistemasService: SistemaService,
    private utilsService: UtilsService,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.dataUsuario = this.storageService.getCurrentSession();
    this.datosProducto = this.data.datos;
    this.datosMovimiento = this.data.datosMovimiento;
    this.tipoAccion = this.data.tipoAccion;
  }

  ngOnInit(): void {
    this.tituloForm = "Agregar: "+this.datosProducto.nombreProducto;
    this.form = this.formBuilder.group({
      cantidad: [this.datosProducto?.cantidad, [Validators.required,Validators.maxLength(5)]],
      preciocosto: [this.datosProducto?.preciocosto, [Validators.required,Validators.maxLength(10)]],
      total: [this.datosProducto?.total, [Validators.required,Validators.maxLength(10)]],
    });
    this.form.controls.total.setValue(this.datosProducto?.cantidad*this.datosProducto?.preciocosto);
  }

  AsignarProducto(){ 
    this.form.markAllAsTouched();
    var total = (this.form.get("preciocosto").value)? parseFloat(this.form.get("preciocosto").value):0;
    if ((this.form.invalid) || (total == 0)) {
      this.snackbar.open("Existe información requerida para asignar.", null, {
        duration: Constantes.SNACKBAR_TIME,
        horizontalPosition: "end",
        verticalPosition: "top",
      });
      return;
    }
    if (this.datosProducto?.cantidad < this.form.get("cantidad").value){
      this.snackbar.open("La cantidad ingresada no debe exceder el stock", null, {
        duration: Constantes.SNACKBAR_TIME,
        horizontalPosition: "end",
        verticalPosition: "top",
      });
      return;
    }
    this.habilitaBtnReg = true;
    this.spinBtnReg = true;
    this.movimientosService.registrarMovimientoDetalleSalidaTransferencia(
          this.tipoAccion,
          this.datosProducto.idmovimientodetalle,
          this.datosMovimiento.idmovimiento,
          this.datosProducto.idproducto,
          this.datosMovimiento.idproveedor,
          this.form.get("cantidad").value,
          this.datosProducto.preciocosto,
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

  getCalculaPrecio(Tipo) {
    var precioCosto = (this.form.get("preciocosto").value)? parseFloat(this.form.get("preciocosto").value):0;
    var cantidad = (this.form.get("cantidad").value)? parseFloat(this.form.get("cantidad").value):0;
    var total = 0;
    if (Tipo == 1){
      total = precioCosto*cantidad;
      this.form.controls.total.setValue(total.toFixed(2));
    }
  }

  cerrarVentana(valor) {
    this.dialogRef.close(valor);
  }

}
