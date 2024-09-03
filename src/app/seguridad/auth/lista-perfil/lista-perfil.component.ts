import { Component, Inject, OnInit } from '@angular/core';

import { fadeInUp400ms } from '../../../../@vex/animations/fade-in-up.animation';
import { scaleIn400ms } from '../../../../@vex/animations/scale-in.animation';
import { fadeInRight400ms } from '../../../../@vex/animations/fade-in-right.animation';
import { stagger40ms } from '../../../../@vex/animations/stagger.animation';

import icClose from '@iconify/icons-ic/twotone-close';
import icCheck from '@iconify/icons-ic/baseline-check-box';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'vex-lista-perfil',
  templateUrl: './lista-perfil.component.html',
  styleUrls: ['./lista-perfil.component.scss'],
  animations: [
    fadeInUp400ms,
    fadeInRight400ms,
    scaleIn400ms,
    stagger40ms
  ]
})
export class ListaPerfilComponent implements OnInit {

  form: FormGroup;
  icClose = icClose;
  icCheck = icCheck;
  loading = false;
  titulo: any;
  token: any;
  idSistema: any;
  idModulo: any;
  perfiles = [];

  constructor(
    private dialogRef: MatDialogRef<ListaPerfilComponent>,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) { 
    this.titulo = this.data.titulo;
    this.perfiles = this.data.listaPerfiles;
    this.token = this.data.token;
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      perfil: ['', Validators.required],
    });
  }

  registrarPerfil() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    const perfil = this.form.controls.perfil.value;
    var datosSistema: any;
    var datosMenu = [];
    this.authService.listarMenu(perfil,0,this.token).subscribe(responseMenu =>{
      datosMenu = responseMenu.dato;
      datosSistema = {
        idperfil : perfil,
        datosMenu : datosMenu,
        idsistema : this.idSistema,
        idmodulo : this.idModulo
      }
      this.loading = false;
      this.cerrarVentana(datosSistema);
    }, error => {
      this.loading = false;
      //this.cerrarVentana(null);
      //this.utilsService.abrirMensajeToken(null, null, null, error);
    });
  }

  selectPerfil(valor) {
    this.idSistema = valor.idsistema;
    this.idModulo = valor.idmodulo;
  }

  cerrarVentana(valor) {
    this.dialogRef.close(valor);
  }

}
