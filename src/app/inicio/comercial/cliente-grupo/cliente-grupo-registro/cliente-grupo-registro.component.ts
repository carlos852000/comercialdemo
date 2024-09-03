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
import { ClienteService } from "src/app/core/services/cliente.service";

@Component({
  selector: 'vex-cliente-grupo-registro',
  templateUrl: './cliente-grupo-registro.component.html',
  styleUrls: ['./cliente-grupo-registro.component.scss']
})
export class ClienteGrupoRegistroComponent implements OnInit {

  dataUsuario: Session;
  form: FormGroup;
  tituloForm: any;
  btnRegistro: any;

  //icons
  icClose = icClose;
  icMenu = icMenu;

  //Configuración
  idClienteGrupo: any = 0;
  tipoAccion: any = 0;
  datosGrupo: any;
  habilitaBtnReg = false;
  spinBtnReg = false;

  constructor(
    private dialogRef: MatDialogRef<ClienteGrupoRegistroComponent>,
    private snackbar: MatSnackBar,
    private storageService: StorageService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private clienteService: ClienteService,
    private utilsService: UtilsService,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.dataUsuario = this.storageService.getCurrentSession();
    this.datosGrupo = this.data.datosGrupo;
  }

  ngOnInit(): void {
    if (this.datosGrupo) {
      this.tituloForm = "Editar Grupo de Clientes";
      this.btnRegistro = "Actualizar";
      this.idClienteGrupo = this.datosGrupo.idclientegrupo;
      this.tipoAccion = 2;
    } else {
      this.tituloForm = "Registrar Grupo de Clientes";
      this.btnRegistro = "Registrar";
      this.tipoAccion = 1;
    }
    this.form = this.formBuilder.group({
      nombre: [this.data.datosGrupo?.nombre,[Validators.required, Validators.maxLength(250)],],
    });
  }

  RegistrarGrupo() {
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
      this.clienteService
        .procesaClienteGrupos(
          this.tipoAccion,
          this.idClienteGrupo,
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