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

@Component({
  selector: 'vex-historial-precios',
  templateUrl: './historial-precios.component.html',
  styleUrls: ['./historial-precios.component.scss'],
  animations: [stagger60ms, fadeInUp400ms, scaleIn400ms, fadeInRight400ms],
})
export class HistorialPreciosComponent implements OnInit {

  //icons
  icMoreVert = icMoreVert;
  icMenu = icMenu;
  icClose = icClose;
  icBubbleChart = icBubbleChart;

  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = [
    "correlativo",
    "preciosto",
    "margen",
    "preciosinimp",
    "igv",
    "preciofinal",
    "preciounitario",
    "datos",
  ];

  loadingProductos = false;
  habilitaBtnReg = false;
  spinBtnReg = false;
  datosProducto:any;

  constructor(
    private dialogRef: MatDialogRef<HistorialPreciosComponent>,
    private productoService: ProductoService,
    private utilsService: UtilsService,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) { 
    this.datosProducto = this.data;
  }

  ngOnInit(): void {
    this.listaHistorial();
  }

  listaHistorial() {
    this.loadingProductos = true;
    this.productoService
      .listaProductoHistorialPrecios(
        this.datosProducto.idproducto
      )
      .subscribe(
        (response) => {
          this.dataSource.data = response.dato;
          this.loadingProductos = false;
        },
        (error) => {
          this.loadingProductos = false;
          this.utilsService.abrirMensajeToken(null, null, null, error);
        }
      );
  }

  cerrarVentana(valor) {
    this.dialogRef.close(valor);
  }

}
