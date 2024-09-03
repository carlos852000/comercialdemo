import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormControl,} from "@angular/forms";

import { stagger60ms } from "src/@vex/animations/stagger.animation";
import { fadeInUp400ms } from "src/@vex/animations/fade-in-up.animation";
import { scaleIn400ms } from "src/@vex/animations/scale-in.animation";
import { fadeInRight400ms } from "src/@vex/animations/fade-in-right.animation";

import icMoreVert from "@iconify/icons-ic/twotone-more-vert";
import icMenu from "@iconify/icons-ic/twotone-menu";
import icBubbleChart from "@iconify/icons-ic/twotone-bubble-chart";
import icAdd from "@iconify/icons-ic/twotone-add";
import icEdit from "@iconify/icons-ic/twotone-edit";
import icDelete from "@iconify/icons-ic/twotone-delete";
import icSearch from "@iconify/icons-ic/twotone-search";

import { GeneralService } from 'src/app/core/services/general.service';
import { UtilsService } from "src/app/core/funciones/utils.service";
import { PermisoService } from "src/app/core/services/permisos.service";
import { StorageService } from "src/app/core/services/storage.service";
import { Session } from "src/app/core/models/session.model";

@Component({
  selector: 'vex-almacen',
  templateUrl: './almacen.component.html',
  styleUrls: ['./almacen.component.scss'],
  animations: [stagger60ms, fadeInUp400ms, scaleIn400ms, fadeInRight400ms],
})
export class AlmacenComponent implements OnInit {

  validandoPermiso = false;
  accesoFormulario = false;

  //recibidoDePadre: string; // esta variable contiene los datos para el hijo
  moduloOpcion = "modmantmercaderia";
  itemPrincipal = "Mantenimiento";
  dataUsuario: Session;

  layoutCtrl = new FormControl("layoutCtrl");

  //icons
  icMoreVert = icMoreVert;
  icMenu = icMenu;
  icBubbleChart = icBubbleChart;
  icAdd = icAdd;
  icEdit = icEdit;
  icDelete = icDelete;
  icSearch = icSearch;

  //Botones
  btnIngresoxCompra: any = false;
  btnIngresoxTransferencia: any = false;
  btnSalidaxTransferencia: any = false;
  btnKardex: any = false;

  //General
  datosConfiguracion: any;

  verInicio: any;
  verIngresoCompras: any = false;
  verIngresoTransferencia: any = false;
  verSalidaTransferencia: any = false;
  verKardex: any = false;

  constructor(
    private storageService: StorageService,
    private permisosService: PermisoService,
    private generalService: GeneralService,
    private utilsService: UtilsService
  ) { 
    this.dataUsuario = this.storageService.getCurrentSession();
  }

  ngAfterContentInit(): void {
    this.validandoPermiso = true;
    this.verInicio = true;
    this.verIngresoCompras = false;
    this.verIngresoTransferencia = false;
    this.verKardex = false;
    this.permisosService
      .validaPermisosForms(this.dataUsuario.idperfil, this.moduloOpcion)
      .subscribe(
        (response) => {
          if (response.dato.permiso == 1) {
            this.validaBotones(response.dato.idacceso);
            this.accesoFormulario = true;
            this.obtieneDatosConfiguracion();
          } else {
            this.validandoPermiso = false;
          }
        },
        (error) => {
          this.validandoPermiso = false;
          this.utilsService.abrirMensajeToken(null, null, null, error);
        }
      );
  }

  ngOnInit(): void {
  }

  obtieneDatosConfiguracion() {
    this.generalService.verificaConfiguracion().subscribe(response =>{
      this.datosConfiguracion = response.dato;
    }, error => {
      this.utilsService.abrirMensajeToken(null, null, null, error);
    });
  }

  //FUNCIONES GENERALES
  irBandejaPrincipal() {
    this.verInicio = true;
    this.verIngresoCompras = false;
    this.verKardex = false;
    this.verIngresoTransferencia = false;
    this.verSalidaTransferencia = false;
  }

  ingresoxCompras() {
    this.verIngresoCompras = true;
    this.verInicio = false;
    this.verKardex = false;
    this.verIngresoTransferencia = false;
    this.verSalidaTransferencia = false;
  }

  ingresoxTransferencia() {
    this.verIngresoTransferencia = true;
    this.verInicio = false;
    this.verIngresoCompras = false;
    this.verKardex = false;
    this.verSalidaTransferencia = false;
  }

  salidaxTransferencias() {
    this.verSalidaTransferencia = true;
    this.verIngresoTransferencia = false;
    this.verInicio = false;
    this.verIngresoCompras = false;
    this.verKardex = false;
  }

  karedex() {
    this.verKardex = true;
    this.verInicio = false;
    this.verIngresoCompras = false;
    this.verIngresoTransferencia = false;
    this.verSalidaTransferencia = false;
  }

  //ValidaBotones
  validaBotones(idacceso) {
    this.permisosService
      .validaAccesoBoton(idacceso, "btnINGRESO-COMPRA")
      .subscribe((responseBoton) => {
        if (responseBoton.dato.permiso == 1) {
          this.btnIngresoxCompra = true;
        }
      });

    this.permisosService
      .validaAccesoBoton(idacceso, "btnINGRESO-TRANSFERENCIA")
      .subscribe((responseBoton) => {
        if (responseBoton.dato.permiso == 1) {
          this.btnIngresoxTransferencia = true;
        }
      });
    
    this.permisosService
      .validaAccesoBoton(idacceso, "btnSALIDA-TRANSFERENCIA")
      .subscribe((responseBoton) => {
        if (responseBoton.dato.permiso == 1) {
          this.btnSalidaxTransferencia = true;
        }
      });

    this.permisosService
      .validaAccesoBoton(idacceso, "btnKARDEX")
      .subscribe((responseBoton) => {
        if (responseBoton.dato.permiso == 1) {
          this.btnKardex = true;
        }
      });

  }

}
