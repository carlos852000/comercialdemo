import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA,MatDialogRef, MatDialog,} from "@angular/material/dialog";

import icClose from "@iconify/icons-ic/twotone-close";
import icMenu from "@iconify/icons-ic/twotone-menu";

import { ConfirmationComponent } from "src/app/shared/confirmation/confirmation.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Constantes } from "src/app/core/constants/constantes";
import { SistemaService } from "src/app/core/services/sistema.service";
import { UtilsService } from "src/app/core/funciones/utils.service";
import { StorageService } from "src/app/core/services/storage.service";
import { Session } from "src/app/core/models/session.model";
import { ProductoService } from "src/app/core/services/producto.service";

@Component({
  selector: 'vex-registro-producto-detalle',
  templateUrl: './registro-producto-detalle.component.html',
  styleUrls: ['./registro-producto-detalle.component.scss']
})
export class RegistroProductoDetalleComponent implements OnInit {

  form: FormGroup;
  tituloForm: any;
  btnRegistro: any;

  //icons
  icClose = icClose;
  icMenu = icMenu;

  //Configuración
  idProductoDetalle: any = 0;
  idproducto: any = 0;
  tipoAccion: any = 0;
  datosProductosDetalle: any;
  habilitaBtnReg = false;
  spinBtnReg = false;

  constructor(
    private dialogRef: MatDialogRef<RegistroProductoDetalleComponent>,
    private snackbar: MatSnackBar,
    private productoService: ProductoService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private utilsService: UtilsService,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) { 
    this.datosProductosDetalle = this.data.datosProductoDetalle;
    this.idproducto = this.data.idproducto;
  }

  ngOnInit(): void {
    if (this.datosProductosDetalle) {
      this.tituloForm = "Editar Producto Específico";
      this.btnRegistro = "Actualizar";
      this.idProductoDetalle = this.datosProductosDetalle.idproductodetalle;
      this.tipoAccion = 2;
    } else {
      this.tituloForm = "Registrar Producto Específico";
      this.btnRegistro = "Registrar";
      this.tipoAccion = 1;
    }
    this.form = this.formBuilder.group({
      nombre: [this.data.datosProductoDetalle?.nombre, [Validators.required, Validators.maxLength(250)],],
    });
  }

  RegistrarProductoDetalle() {
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
        .procesaProductoDetalle(
          this.tipoAccion,
          this.idProductoDetalle,
          this.idproducto,
          this.form.get("nombre").value
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

  cerrarVentana(valor) {
    this.dialogRef.close(valor);
  }

}
