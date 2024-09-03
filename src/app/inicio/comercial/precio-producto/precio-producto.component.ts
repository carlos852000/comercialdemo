import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { fadeInUp400ms } from "../../../../@vex/animations/fade-in-up.animation";
import { stagger60ms } from "../../../../@vex/animations/stagger.animation";
import { scaleIn400ms } from "../../../../@vex/animations/scale-in.animation";
import { fadeInRight400ms } from "../../../../@vex/animations/fade-in-right.animation";

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

import { FormGroup, FormBuilder, FormControl, } from "@angular/forms";
import { Session } from "src/app/core/models/session.model";
import { MatSnackBar } from "@angular/material/snack-bar";
import { StorageService } from "src/app/core/services/storage.service";
import { PermisoService } from "src/app/core/services/permisos.service";
import { UtilsService } from "src/app/core/funciones/utils.service";
import { ProductoService } from "src/app/core/services/producto.service";
import { MatTableDataSource } from "@angular/material/table";
import { Constantes } from "src/app/core/constants/constantes";
import { GeneralService } from "src/app/core/services/general.service";
import icReturn from '@iconify/icons-ic/baseline-keyboard-return';

import { AbstractControl, FormArray } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'vex-precio-producto',
  templateUrl: './precio-producto.component.html',
  styleUrls: ['./precio-producto.component.scss'],
  animations: [stagger60ms, fadeInUp400ms, scaleIn400ms, fadeInRight400ms],

})
export class PrecioProductoComponent implements OnInit {


  @Input() datosConfiguracion: any;
  @Output() verBandejaPrincipal = new EventEmitter();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constSistema = Constantes;

  validandoPermiso = true;
  accesoFormulario = true;
  itemPrincipal = "Precios de Productos";
  dataUsuario: Session;

  dataSource = new MatTableDataSource<any>([]);
  dataSourceListaProducto = new MatTableDataSource<any>([]);
  displayedColumns: string[] = [
    "idproducto",
    "nombreProducto",
    "marca",
    "codigobarra",
    "cantidadminparaventa",
    "action",
  ];


  // idproducto: new FormControl(val.idproducto),
  // nombreProducto: new FormControl(val.nombreProducto),
  // codigobarra: new FormControl(val.codigobarra),
  // cantidadminparaventa: new FormControl(val.cantidadminparaventa),
  // action: new FormControl('existingRecord'),


  formBuscarProducto: FormGroup;
  layoutCtrl = new FormControl("layoutCtrl");
  btnRegistro: any;
  tituloForm: any;


  //TODO: FROMULARIO DE LISTA DE PRODUCTOS


  isLoading = true;

  pageNumber: number = 1;
  VOForm: FormGroup;
  isEditableNew: boolean = true;


  //icons
  icMoreVert = icMoreVert;
  icMenu = icMenu;
  icBubbleChart = icBubbleChart;
  icReturn = icReturn;
  icAdd = icAdd;
  icEdit = icEdit;
  icDelete = icDelete;
  icSearch = icSearch;
  icMoney = icMoney;
  icNum = icDni;
  icpCodigo = icpCodigo;
  icReceipt = icReceipt;

  //loadingComprasDetalle = false;
  loadingBuscarProducto = false;
  loadingPrincipalPantalla = false;
  resultado = 0;



  //Botones
  btnNuevo: any = false;
  btnModificar: any = false;
  btnEliminar: any = false;

  //Configuración

  minFecha: any;
  nummostrarproducto: any = 0;


  habilitaBtnReg = false;
  spinBtnReg = false;
  habilitaBtnListProd = false;

  habilitaCboUM = false;
  habilitaCboTEmision = false;
  habilitaCboProveed = false;
  habilitaCboTienda = false;
  deshabilitaItems = false;

  tipoEntradaNumero = 'onlynumero';
  tipoEntradaMoneda = 'numero';
  moduloOpcion = "modarchprecproduct";

  constructor(
    private formBuilder: FormBuilder,
    private snackbar: MatSnackBar,
    private storageService: StorageService,
    private permisosService: PermisoService,
    private generalService: GeneralService,
    private productoService: ProductoService,
    private utilsService: UtilsService,
    private fb: FormBuilder,
    private _formBuilder: FormBuilder

  ) {
    this.minFecha = new Date().toISOString();
    this.dataUsuario = this.storageService.getCurrentSession();
  }

  // !PARA VALIDAR SI TIENE PERMISO PARA INGRESAR AL MODULO
  ngAfterContentInit(): void {
    this.validandoPermiso = true;

    this.permisosService
      .validaPermisosForms(this.dataUsuario.idperfil, this.moduloOpcion)
      .subscribe(
        (response) => {
          console.log("validaPermisosForms = ", response);
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
    this.tituloForm = "Precios de Productos";
    this.cargaFormulario();
    this.nummostrarproducto = 1000;

    this.VOForm = this._formBuilder.group({
      VORows: this._formBuilder.array([])
    });



  }

  cargaFormulario() {
    this.formBuscarProducto = this.formBuilder.group({
      producto: []
    });

  }







  //TODO: buscar producto
  buscarProducto() {
    if (!this.formBuscarProducto.get("producto").value) {
      this.snackbar.open("Ingrese información a buscar.", null, {
        duration: Constantes.SNACKBAR_TIME,
        horizontalPosition: "end",
        verticalPosition: "top",
      });
      return;
    }
    this.loadingBuscarProducto = true;
    this.productoService
      .listaProducto(
        null,
        this.formBuscarProducto.get("producto").value,
        this.nummostrarproducto,
        1
      )
      .subscribe(
        (response) => {
          console.log("response listaProducto = ", response.dato)

          this.VOForm = this.fb.group({
            VORows: this.fb.array(response.dato.map(val => this.fb.group({
              idproducto: new FormControl(val.idproducto),
              nombreProducto: new FormControl(val.nombreProducto),
              marca: new FormControl(val.marca),
              codigobarra: new FormControl(val.codigobarra),
              cantidadminparaventa: new FormControl(val.cantidadminparaventa),
              action: new FormControl('existingRecord'),
              isEditable: new FormControl(true),
              isNewRow: new FormControl(false),
            })
            )) //end of fb array
          }); // end of form group cretation
          this.isLoading = false;
          this.dataSourceListaProducto = new MatTableDataSource((this.VOForm.get('VORows') as FormArray).controls);
          this.dataSourceListaProducto.paginator = this.paginator;

          console.log("Form", this.VOForm.value.VORows);
          this.dataSource.data = response.dato;
          this.loadingBuscarProducto = false;
        },
        (error) => {
          this.loadingBuscarProducto = false;
          this.utilsService.abrirMensajeToken(null, null, null, error);
        }
      );
  }
  keyPress(event) {
    if (event.keyCode == 13) {
      this.buscarProducto();
    }
  }


  //TODO: buscar producto

  // !PARA VALIDAR BOTONES PARA AL MODULO
  //ValidaBotones
  validaBotones(idacceso) {
    this.permisosService
      .validaAccesoBoton(idacceso, "btnnuevo")
      .subscribe((responseBoton) => {
        if (responseBoton.dato.permiso == 1) {
          this.btnNuevo = true;
        }
      });
    this.permisosService
      .validaAccesoBoton(idacceso, "btneditar")
      .subscribe((responseBoton) => {
        if (responseBoton.dato.permiso == 1) {
          this.btnModificar = true;
        }
      });
    this.permisosService
      .validaAccesoBoton(idacceso, "btneliminar")
      .subscribe((responseBoton) => {
        if (responseBoton.dato.permiso == 1) {
          this.btnEliminar = true;
        }
      });
  }
  obtieneDatosConfiguracion() {
    this.generalService.verificaConfiguracion().subscribe(response => {
      this.datosConfiguracion = response.dato;
    }, error => {
      this.utilsService.abrirMensajeToken(null, null, null, error);
    });
  }
  // !PARA VALIDAR BOTONES PARA AL MODULO


  EditSVO(VOFormElement, i) {

    // VOFormElement.get('VORows').at(i).get('name').disabled(false)
    VOFormElement.get('VORows').at(i).get('isEditable').patchValue(false);
    // this.isEditableNew = false;

  }
  // On click of correct button in table (after click on edit) this method will call
  SaveVO(VOFormElement, i) {
    VOFormElement.get('VORows').at(i).get('isEditable').patchValue(true);

    const arraySave = VOFormElement.value;

    console.log("arraySave =", arraySave);


  }

  // On click of cancel button in the table (after click on edit) this method will call and reset the previous data
  CancelSVO(VOFormElement, i) {
    VOFormElement.get('VORows').at(i).get('isEditable').patchValue(true);
  }
}
