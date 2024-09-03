import { Component, OnInit,Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { fadeInUp400ms } from '../../../../../@vex/animations/fade-in-up.animation';
import { stagger60ms } from '../../../../../@vex/animations/stagger.animation';
import { scaleIn400ms } from '../../../../../@vex/animations/scale-in.animation';
import { fadeInRight400ms } from '../../../../../@vex/animations/fade-in-right.animation';

import icClose from '@iconify/icons-ic/twotone-close';
import icBubbleChart from '@iconify/icons-ic/twotone-bubble-chart';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { SistemaService } from 'src/app/core/services/sistema.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { UtilsService } from 'src/app/core/funciones/utils.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Session } from 'src/app/core/models/session.model';

@Component({
  selector: 'vex-susuario-perfil',
  templateUrl: './susuario-perfil.component.html',
  styleUrls: ['./susuario-perfil.component.scss'],
  animations: [
    stagger60ms,
    fadeInUp400ms,
    scaleIn400ms,
    fadeInRight400ms,
  ]
})
export class SusuarioPerfilComponent implements OnInit {

  form: FormGroup;
  dataUsuario: Session;
  layoutCtrl = new FormControl('layoutCtrl');
  tituloForm: any;

  //icons
  icClose=icClose;
  icBubbleChart = icBubbleChart;

  //Configuración
  datosUsuario: any;
  loadingPerfiles = false;

  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['correlativo', 'perfil'];

  //Paginación
  pagina = 1;
  totalRegistros = 0;
  totalPaginas = 0;
  pageIndex = 0;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  totalRegistrosPorPagina: any = 10;
  Param1Filt: any;
  Param2Filt: any;
  numeracion = 0;
  filtro = [
    {valor:'50'},
    {valor:'100'},
    {valor:'150'},
    {valor:'200'}];

  constructor(
    private dialogRef: MatDialogRef<SusuarioPerfilComponent>,
    private formBuilder: FormBuilder,
    private storageService: StorageService,
    private sistemasService: SistemaService,
    private utilsService: UtilsService,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) { 
    this.dataUsuario = this.storageService.getCurrentSession();
    this.datosUsuario = this.data;
  }

  ngOnInit(): void {
    this.tituloForm = "Usuario: "+this.datosUsuario.nombre+" "+this.datosUsuario.apellidopaterno+" "+this.datosUsuario.apellidomaterno;
    this.form = this.formBuilder.group({
    });
    this.listaPerfiles(this.pagina);
  }

  listaPerfiles(pagina) {
    this.loadingPerfiles = true;
    this.pagina = pagina;
    this.numeracion = this.totalRegistrosPorPagina * (this.pagina - 1);
    let numRegistros = this.totalRegistrosPorPagina;
    let numPagina = this.pagina;
    this.sistemasService.listaPerfiles(
      this.dataUsuario.idsistema,
      null,
      numRegistros,
      numPagina
      ).subscribe(response =>{

        response.dato.forEach((row) => {
          this.form.addControl("group-" + row.idperfil, this.formBuilder.group({
            activecheck: [false],
          }));
          this.sistemasService.verificarUsuarioPerfil(
            row.idperfil,
            this.datosUsuario.idusuario,
            ).subscribe(responseVerifica =>{
              if (responseVerifica.dato?.totalVerifica == 1){
                this.form.get("group-" + row.idperfil).get("activecheck").setValue(true);
              } else {
                this.form.get("group-" + row.idperfil).get("activecheck").setValue(false);
              }
              //totalVerifica
            }, error => {
              //this.utilsService.abrirMensajeToken(null, null, null, error);
              this.form.get("group-" + row.idperfil).get("activecheck").setValue(false);
            });
        });

      this.dataSource.data = response.dato;
      this.totalRegistros = response.totalFilas;
      this.totalPaginas = response.totalPages;
      if(this.totalPaginas == 1){
        this.dataSource.paginator = this.paginator;
        this.pageIndex = 0;
      }
      this.loadingPerfiles = false;
    }, error => {
      this.loadingPerfiles = false;
      this.utilsService.abrirMensajeToken(null, null, null, error);
    });
  }

  isSelectedCheck(event:MatCheckboxChange,Valor): void {
    var valorSelect = 0;
    if (event.checked) {
      valorSelect = 1;
    }
    this.sistemasService.procesaUsuarioPerfil(
      this.datosUsuario.idusuario,
      Valor,
      valorSelect
      ).subscribe(response =>{
      }, error => {
        this.utilsService.abrirMensajeToken(null, null, null, error);
      });
  }

  //Paginacion
  listarPorPagina(event) {
    this.pagina = event.pageIndex + 1;
    this.listaPerfiles(this.pagina);
  }

  cerrarVentana(valor) {
    this.dialogRef.close(valor);
  }

}
