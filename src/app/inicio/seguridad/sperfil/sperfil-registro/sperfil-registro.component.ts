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

@Component({
  selector: "vex-sperfil-registro",
  templateUrl: "./sperfil-registro.component.html",
  styleUrls: ["./sperfil-registro.component.scss"],
})
export class SperfilRegistroComponent implements OnInit {
  dataUsuario: Session;
  form: FormGroup;
  tituloForm: any;
  btnRegistro: any;

  //icons
  icClose = icClose;
  icMenu = icMenu;

  //Configuración
  idPerfil: any = 0;
  tipoAccion: any = 0;
  datosPerfil: any;
  habilitaBtnReg = false;
  spinBtnReg = false;

  constructor(
    private dialogRef: MatDialogRef<SperfilRegistroComponent>,
    private snackbar: MatSnackBar,
    private storageService: StorageService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private sistemasService: SistemaService,
    private utilsService: UtilsService,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.dataUsuario = this.storageService.getCurrentSession();
    this.datosPerfil = this.data.datosPerfil;
  }

  ngOnInit(): void {
    if (this.datosPerfil) {
      this.tituloForm = "Editar Perfil";
      this.btnRegistro = "Actualizar";
      this.idPerfil = this.datosPerfil.idperfil;
      this.tipoAccion = 2;
    } else {
      this.tituloForm = "Registrar Perfil";
      this.btnRegistro = "Registrar";
      this.tipoAccion = 1;
    }
    this.form = this.formBuilder.group({
      nombre: [
        this.data.datosPerfil?.nombre,
        [Validators.required, Validators.maxLength(250)],
      ],
    });
  }

  RegistrarPerfil() {
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
      this.sistemasService
        .procesaPerfil(
          this.tipoAccion,
          this.idPerfil,
          this.dataUsuario.idmodulo,
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
