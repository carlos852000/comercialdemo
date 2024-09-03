import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA,MatDialogRef, MatDialog,} from "@angular/material/dialog";

import icClose from '@iconify/icons-ic/twotone-close';
import icMenu from '@iconify/icons-ic/twotone-menu';
import icPerson from '@iconify/icons-ic/twotone-person';
import icMail from '@iconify/icons-ic/twotone-mail';
import icDni from '@iconify/icons-ic/sharp-person-pin';
import icSearch from '@iconify/icons-ic/twotone-search';
import icPhone from '@iconify/icons-ic/twotone-phone';

import { ConfirmationComponent } from "src/app/shared/confirmation/confirmation.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Constantes } from "src/app/core/constants/constantes";
import { SistemaService } from "src/app/core/services/sistema.service";
import { UtilsService } from "src/app/core/funciones/utils.service";
import { StorageService } from "src/app/core/services/storage.service";
import { Session } from "src/app/core/models/session.model";
import { ProveedorService } from "src/app/core/services/proveedor.service";

@Component({
  selector: 'vex-cproveedor-registro',
  templateUrl: './cproveedor-registro.component.html',
  styleUrls: ['./cproveedor-registro.component.scss']
})
export class CproveedorRegistroComponent implements OnInit {

  dataUsuario: Session;
  form: FormGroup;
  tituloForm: any;
  btnRegistro: any;

  //icons
  icClose=icClose;
  icMenu = icMenu;
  icPerson = icPerson;
  icMail = icMail;
  icDni = icDni;
  icSearch = icSearch;
  icPhone = icPhone;

  //Configuración
  idProveedor: any = 0;
  tipoAccion: any = 0;
  datosProveedor: any;
  habilitaBtnReg = false;
  spinBtnReg = false;

  tipoEntradaNumero = 'onlynumero';

  constructor(
    private dialogRef: MatDialogRef<CproveedorRegistroComponent>,
    private snackbar: MatSnackBar,
    private storageService: StorageService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private proveedorService: ProveedorService,
    private utilsService: UtilsService,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.dataUsuario = this.storageService.getCurrentSession();
    this.datosProveedor = this.data.datosProveedor;
  }

  ngOnInit(): void {
    if (this.datosProveedor) {
      this.tituloForm = "Editar Proveedor";
      this.btnRegistro = "Actualizar";
      this.idProveedor = this.datosProveedor.idproveedor;
      this.tipoAccion = 2;
    } else {
      this.tituloForm = "Registrar Proveedor";
      this.btnRegistro = "Registrar";
      this.tipoAccion = 1;
    }
    this.form = this.formBuilder.group({
      nombre: [this.data.datosProveedor?.representante,[Validators.required, Validators.maxLength(250)],],
      ruc: [this.data.datosProveedor?.ruc,[Validators.required, Validators.maxLength(12)],],
      direccion: [this.data.datosProveedor?.direccion,[Validators.maxLength(250)],],
      telefono: [this.data.datosProveedor?.telefono,[Validators.maxLength(250)],],
      web: [this.data.datosProveedor?.web,[Validators.maxLength(250)],],
      email: [this.data.datosProveedor?.email, [Validators.maxLength(150), Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],
    });
  }

  RegistrarProveedor() {
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
      this.proveedorService
        .procesaProveedor(
          this.tipoAccion,
          this.idProveedor,
          this.form.get("nombre").value,
          this.form.get("ruc").value,
          this.form.get("direccion").value,
          this.form.get("telefono").value,
          this.form.get("email").value,
          this.form.get("web").value,
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
