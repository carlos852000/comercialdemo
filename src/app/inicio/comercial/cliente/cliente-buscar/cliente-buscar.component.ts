import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA,MatDialogRef, MatDialog,} from "@angular/material/dialog";
import { fadeInUp400ms } from '../../../../../@vex/animations/fade-in-up.animation';
import { stagger60ms } from '../../../../../@vex/animations/stagger.animation';
import { scaleIn400ms } from '../../../../../@vex/animations/scale-in.animation';
import { fadeInRight400ms } from '../../../../../@vex/animations/fade-in-right.animation';

import icClose from "@iconify/icons-ic/twotone-close";
import icMenu from "@iconify/icons-ic/twotone-menu";
import icDni from '@iconify/icons-ic/sharp-person-pin';
import icPerson from '@iconify/icons-ic/twotone-person';

import { ConfirmationComponent } from "src/app/shared/confirmation/confirmation.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Constantes } from "src/app/core/constants/constantes";
import { MatTableDataSource } from "@angular/material/table";
import { SistemaService } from "src/app/core/services/sistema.service";
import { UtilsService } from "src/app/core/funciones/utils.service";
import { StorageService } from "src/app/core/services/storage.service";
import { Session } from "src/app/core/models/session.model";
import { ClienteService } from "src/app/core/services/cliente.service";
import { GeneralService } from "src/app/core/services/general.service";
import { enumTipoMensaje } from "src/app/core/enum/enum-tipo-mensaje.enum";

@Component({
  selector: 'vex-cliente-buscar',
  templateUrl: './cliente-buscar.component.html',
  styleUrls: ['./cliente-buscar.component.scss'],
  animations: [
    stagger60ms,
    fadeInUp400ms,
    scaleIn400ms,
    fadeInRight400ms,
  ]
})
export class ClienteBuscarComponent implements OnInit {

  dataUsuario: Session;
  form: FormGroup;
  tituloForm: any;
  btnRegistro: any;

  //Iconos
  icPerson =icPerson;
  icClose = icClose;
  icDni = icDni;

  //Configuración
  listaTipoDocumentos : any;

  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ["correlativo", "grupo", "accion"];

  //Loads
  loadingClientes = false;
  loadTipoDocumentos = false;
  habilitaBtnReg = false;
  spinBtnReg = false;

  tipoEntradaNumero = 'onlynumero';

  constructor(
    private dialogRef: MatDialogRef<ClienteBuscarComponent>,
    private snackbar: MatSnackBar,
    private storageService: StorageService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private generalService: GeneralService,
    private clienteService: ClienteService,
    private utilsService: UtilsService,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.dataUsuario = this.storageService.getCurrentSession();
  }
  ngOnInit(): void {
    this.CargaInicial();
    this.tituloForm = "Búsqueda de Clientes";
    this.form = this.formBuilder.group({
      tipoDocumento: ['', [Validators.required,Validators.maxLength(250)]],
      dni: ['', [Validators.required,Validators.maxLength(250)]],
    });
  }

  CargaInicial() {
    this.loadTipoDocumentos = true;
    this.generalService.listaCatalogo('TDOC',0).subscribe(response =>{
      this.loadTipoDocumentos = false;
      this.listaTipoDocumentos = response.dato;
    }, error => {
      this.loadTipoDocumentos = false;
      this.utilsService.abrirMensajeToken(null, null, null, error);
    });
  }

  BuscarCliente() {
    var numDNI = null;
    if (this.form.get('dni').value){
      numDNI = (this.form.get('dni').value).length;
    }
    if (numDNI == 8){
      var tipoDoc = this.form.get('tipoDocumento').value;
      var numDoc = this.form.get('dni').value;
      if (tipoDoc && numDoc){
        this.loadingClientes = true;
        this.clienteService.buscaDatosCliente02(
          tipoDoc,numDoc
        ).subscribe(response =>{
          if ((response.resultado == 1)){
            this.dataSource.data = response.dato;
            this.loadingClientes = false;
          } else {
            this.loadingClientes = false;
          }
        }, error => {
          this.loadingClientes = false;
          this.utilsService.abrirMensajeToken(null, null, null, error);
        });
      } else {
        this.loadingClientes = false;
        this.utilsService.abrirMensajeToken('Información', 'Debe seleccionar el tipo de Documento', enumTipoMensaje.ERROR, null);
      }
    }
  }

  seleccionarCliente(row) {
    var dataCliente = {
      idCliente: row.idcliente,
      mensaje: "OK"
    };
    this.cerrarVentana(dataCliente);
  }

  cerrarVentana(valor) {
    this.dialogRef.close(valor);
  }

}
