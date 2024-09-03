import { Component, OnInit, Output, EventEmitter, Inject, ViewChild, Input } from "@angular/core";

import { fadeInUp400ms } from "../../../../../@vex/animations/fade-in-up.animation";
import { stagger60ms } from "../../../../../@vex/animations/stagger.animation";
import { scaleIn400ms } from "../../../../../@vex/animations/scale-in.animation";
import { fadeInRight400ms } from "../../../../../@vex/animations/fade-in-right.animation";

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
import icReturn from '@iconify/icons-ic/baseline-keyboard-return';

import {FormGroup,FormBuilder,Validators,FormControl,} from "@angular/forms";
import { Session } from "src/app/core/models/session.model";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MAT_DIALOG_DATA,MatDialogRef,MatDialog,} from "@angular/material/dialog";
import { ConfirmationComponent } from "src/app/shared/confirmation/confirmation.component";
import { StorageService } from "src/app/core/services/storage.service";
import { PermisoService } from "src/app/core/services/permisos.service";
import { MatPaginator } from "@angular/material/paginator";
import { UtilsService } from "src/app/core/funciones/utils.service";
import { ProductoService } from "src/app/core/services/producto.service";
import { MatTableDataSource } from "@angular/material/table";
import { MondalCatalogoComponent } from "../mondal-catalogo/mondal-catalogo.component";
import { Constantes } from "src/app/core/constants/constantes";
import { GeneralService } from "src/app/core/services/general.service";
import { ProveedorService } from "src/app/core/services/proveedor.service";
import { RegistroProductoPrecioGrupoComponent } from '../registro-producto-precio-grupo/registro-producto-precio-grupo.component';

@Component({
  selector: 'vex-listar-producto-precio-grupo',
  templateUrl: './listar-producto-precio-grupo.component.html',
  styles: [],
  animations: [stagger60ms, fadeInUp400ms, scaleIn400ms, fadeInRight400ms],
})
export class ListarProductoPrecioGrupoComponent implements OnInit {

  @Input() datosProducto: any;
  @Output() verBandejaPrincipal = new EventEmitter();

  form: FormGroup;
  layoutCtrl = new FormControl("layoutCtrl");

  //icons
  icMoreVert = icMoreVert;
  icMenu = icMenu;
  icBubbleChart = icBubbleChart;
  icAdd = icAdd;
  icEdit = icEdit;
  icDelete = icDelete;
  icSearch = icSearch;
  icReturn = icReturn;

  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ["correlativo", "nombre","aplica","ilimitado","fechas","tipo","cantidad","dcto", "accion"];

  loadingProductosPrecios = false;
  habilitaBtnReg = false;
  spinBtnReg = false;

  //Paginación
  pagina = 1;
  totalRegistros = 0;
  totalPaginas = 0;
  pageIndex = 0;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  totalRegistrosPorPagina: any =
    localStorage.getItem("filtroCM") == null
      ? 100
      : localStorage.getItem("filtroCM");
  Param1Filt: any;
  Param2Filt: any;
  numeracion = 0;
  filtro = [
    { valor: "50" },
    { valor: "100" },
    { valor: "150" },
    { valor: "200" },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    private productoService: ProductoService,
    private utilsService: UtilsService
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nombreProducto: [{value:this.datosProducto?.nombreProducto,disabled: true}],
      nombre: [""],
      filtroBusk: this.totalRegistrosPorPagina,
    });
    this.listaPreciosxGrupo(this.pagina);
  }

  listaPreciosxGrupo(pagina) {
    this.loadingProductosPrecios = true;
    this.pagina = pagina;
    this.numeracion = this.totalRegistrosPorPagina * (this.pagina - 1);
    let numRegistros = this.totalRegistrosPorPagina;
    let numPagina = this.pagina;
    this.productoService
      .listaProductoGrupoPrecio(
        this.datosProducto.idproducto,
        this.form.get("nombre").value,
        numRegistros,
        numPagina
      )
      .subscribe(
        (response) => {
          this.dataSource.data = response.dato;
          this.totalRegistros = response.totalFilas;
          this.totalPaginas = response.totalPages;
          if (this.totalPaginas == 1) {
            this.dataSource.paginator = this.paginator;
            this.pageIndex = 0;
          }
          this.loadingProductosPrecios = false;
        },
        (error) => {
          this.loadingProductosPrecios = false;
          this.utilsService.abrirMensajeToken(null, null, null, error);
        }
      );
  }

  crearProductoPrecio() {
    var data = {
      idproducto:this.datosProducto.idproducto,
      datosProductoPrecio: null,
    };
    this.gestionarProductoPrecio(data);
  }

  actualizarProductoPrecio(row) {
    var data = {
      idproducto:this.datosProducto.idproducto,
      datosProductoPrecio: row,
    };
    this.gestionarProductoPrecio(data);
  }

  gestionarProductoPrecio(datos) {
    const dialogRef = this.dialog.open(RegistroProductoPrecioGrupoComponent, {
      width: "750px",
      disableClose: true,
      data: datos,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == "OK") {
        this.listaPreciosxGrupo(this.pagina);
      }
    });
  }

  eliminarProductoPrecio(row) {
    var mensaje = "¿Desea eliminar esta información?";
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      disableClose: true,
      width: "350px",
      data: { content: mensaje },
    });
    const sub = dialogRef.componentInstance.onSi.subscribe((data) => {
      this.habilitaBtnReg = true;
      this.spinBtnReg = true;
      this.productoService.eliminaProductoGrupoPrecio(row.idproductogrupoprecio).subscribe(
        (response) => {
          this.habilitaBtnReg = false;
          this.spinBtnReg = false;
          this.snackbar.open(response.mensaje, null, {
            duration: Constantes.SNACKBAR_TIME,
            horizontalPosition: "end",
            verticalPosition: "top",
          });
          this.listaPreciosxGrupo(this.pagina);
          dialogRef.close();
        },
        (error) => {
          this.habilitaBtnReg = false;
          this.spinBtnReg = false;
          this.utilsService.abrirMensajeToken(null, null, null, error);
        }
      );
    });
  }

  Cancelar() {
    this.verBandejaPrincipal.emit();
  }

  //Paginacion
  listarPorPagina(event) {
    this.pagina = event.pageIndex + 1;
    this.listaPreciosxGrupo(this.pagina);
  }

  cambiaFiltroBusk() {
    this.totalRegistrosPorPagina = this.form.get("filtroBusk").value;
    localStorage.setItem("filtroCM", this.form.get("filtroBusk").value);
    this.listaPreciosxGrupo(this.pagina);
  }

}
