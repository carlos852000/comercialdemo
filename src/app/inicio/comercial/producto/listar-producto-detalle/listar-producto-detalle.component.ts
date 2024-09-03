import { Component, OnInit, Inject, ViewChild, Input } from "@angular/core";
import { MAT_DIALOG_DATA,MatDialogRef, MatDialog,} from "@angular/material/dialog";

import { fadeInUp400ms } from "../../../../../@vex/animations/fade-in-up.animation";
import { stagger60ms } from "../../../../../@vex/animations/stagger.animation";
import { scaleIn400ms } from "../../../../../@vex/animations/scale-in.animation";
import { fadeInRight400ms } from "../../../../../@vex/animations/fade-in-right.animation";

import icMoreVert from "@iconify/icons-ic/twotone-more-vert";
import icMenu from "@iconify/icons-ic/twotone-menu";
import icBubbleChart from "@iconify/icons-ic/twotone-bubble-chart";
import icClose from '@iconify/icons-ic/twotone-close';
import icAdd from '@iconify/icons-ic/twotone-add';
import icEdit from "@iconify/icons-ic/twotone-edit";
import icDelete from "@iconify/icons-ic/twotone-delete";

import { UtilsService } from "src/app/core/funciones/utils.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { Constantes } from "src/app/core/constants/constantes";
import { ProductoService } from "src/app/core/services/producto.service";
import { ConfirmationComponent } from "src/app/shared/confirmation/confirmation.component";
import { RegistroProductoDetalleComponent } from '../registro-producto-detalle/registro-producto-detalle.component';

@Component({
  selector: 'vex-listar-producto-detalle',
  templateUrl: './listar-producto-detalle.component.html',
  styleUrls: ['./listar-producto-detalle.component.scss'],
  animations: [stagger60ms, fadeInUp400ms, scaleIn400ms, fadeInRight400ms],
})
export class ListarProductoDetalleComponent implements OnInit {

  //icons
  icMoreVert = icMoreVert;
  icMenu = icMenu;
  icClose = icClose;
  icBubbleChart = icBubbleChart;
  icAdd = icAdd;
  icEdit = icEdit;
  icDelete = icDelete;

  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = [
    "correlativo",
    "producto",
    "accion",
  ];

  loadingProductos = false;
  habilitaBtnReg = false;
  spinBtnReg = false;
  datosProducto:any;

  //Paginación
  pagina = 1;
  totalRegistros = 0;
  totalPaginas = 0;
  pageIndex = 0;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  totalRegistrosPorPagina: any = localStorage.getItem("filtroCM") == null? 100 : localStorage.getItem("filtroCM");
  Param1Filt: any;
  Param2Filt: any;
  dataEntrante: any;
  numeracion = 0;
  filtro = [
    { valor: "50" },
    { valor: "100" },
    { valor: "150" },
    { valor: "200" },
  ];

  constructor(
    private dialogRef: MatDialogRef<ListarProductoDetalleComponent>,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    private productoService: ProductoService,
    private utilsService: UtilsService,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) { 
    this.datosProducto = this.data;
  }

  ngOnInit(): void {
    this.listaProductosDetalle(this.pagina);
  }

  listaProductosDetalle(pagina) {
    this.loadingProductos = true;
    this.pagina = pagina;
    this.numeracion = this.totalRegistrosPorPagina * (this.pagina - 1);
    let numRegistros = this.totalRegistrosPorPagina;
    let numPagina = this.pagina;
    this.productoService
      .listaProductoDetalle(
        this.datosProducto.idproducto,
        null,
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
          this.loadingProductos = false;
        },
        (error) => {
          this.loadingProductos = false;
          this.utilsService.abrirMensajeToken(null, null, null, error);
        }
      );
  }

  crearProductoDetalle() {
    var data = {
      idproducto:this.datosProducto.idproducto,
      datosProductoDetalle: null,
    };
    this.gestionarProductoDetalle(data);
  }

  actualizarProductoDetalle(row) {
    var data = {
      idproducto:this.datosProducto.idproducto,
      datosProductoDetalle: row,
    };
    this.gestionarProductoDetalle(data);
  }

  gestionarProductoDetalle(datos) {
    const dialogRef = this.dialog.open(RegistroProductoDetalleComponent, {
      width: "750px",
      disableClose: true,
      data: datos,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == "OK") {
        this.listaProductosDetalle(this.pagina);
      }
    });
  }

  eliminarProductoDetalle(row) {
    var mensaje = "¿Desea eliminar esta información?";
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      disableClose: true,
      width: "350px",
      data: { content: mensaje },
    });
    const sub = dialogRef.componentInstance.onSi.subscribe((data) => {
      this.habilitaBtnReg = true;
      this.spinBtnReg = true;
      this.productoService.eliminaProductoDetalle(row.idproductodetalle).subscribe(
        (response) => {
          this.habilitaBtnReg = false;
          this.spinBtnReg = false;
          this.snackbar.open(response.mensaje, null, {
            duration: Constantes.SNACKBAR_TIME,
            horizontalPosition: "end",
            verticalPosition: "top",
          });
          this.listaProductosDetalle(this.pagina);
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

  cerrarVentana(valor) {
    this.dialogRef.close(valor);
  }
}
