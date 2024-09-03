import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import icReceipt from '@iconify/icons-ic/twotone-receipt';
import icAssigment from '@iconify/icons-ic/twotone-assignment';
import icHelp from '@iconify/icons-ic/twotone-help';
import icDateRange from '@iconify/icons-ic/twotone-date-range';
import icChat from '@iconify/icons-ic/twotone-chat';
import icSettings from '@iconify/icons-ic/twotone-settings';
import icContacts from '@iconify/icons-ic/twotone-contacts';
import icMail from '@iconify/icons-ic/twotone-mail';
import icAttachMoney from '@iconify/icons-ic/twotone-attach-money';
import icError from '@iconify/icons-ic/twotone-error';
import icStar from '@iconify/icons-ic/twotone-star';
import icBook from '@iconify/icons-ic/twotone-book';
import icLayers from '@iconify/icons-ic/twotone-layers';
import icLock from '@iconify/icons-ic/twotone-lock';
import icContactSupport from '@iconify/icons-ic/twotone-contact-support';

import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import icVisibility from '@iconify/icons-ic/twotone-visibility';
import icVisibilityOff from '@iconify/icons-ic/twotone-visibility-off';
import { fadeInUp400ms } from '../../../../@vex/animations/fade-in-up.animation';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { Session } from 'src/app/core/models/session.model';
import { MatDialog } from '@angular/material/dialog';
import { ListaPerfilComponent } from '../lista-perfil/lista-perfil.component';
import { Constantes } from 'src/app/core/constants/constantes';

@Component({
  selector: 'vex-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    fadeInUp400ms
  ]
})
export class LoginComponent implements OnInit {

  dataUsuario: Session;
  form: FormGroup;
  session: Session = new Session();
  loading = false;
  inputType = 'password';
  visible = false;

  icVisibility = icVisibility;
  icVisibilityOff = icVisibilityOff;

  constructor(private router: Router,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private authService: AuthService,
    private storageService: StorageService,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit() {
    if (this.storageService.isAuthenticated()) {
      this.dataUsuario = this.storageService.getCurrentSession();
      this.snackbar.open( `Hola ${this.dataUsuario.nombres} ya estás autenticado!`, null, {
        duration: Constantes.SNACKBAR_TIME,
      });
      this.router.navigate(['/inicio/principal/perfil']);
    }
    this.form = this.fb.group({
      usuario: ['', Validators.required],
      clave: ['', Validators.required]
    });
  }

  ingresar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    const usuario = this.form.controls.usuario.value;
    const clave   = this.form.controls.clave.value;
    this.authService.login(usuario,clave).subscribe(responseLogin =>{
      this.storageService.setCurrentSession(null);
      if(responseLogin){
        this.session.idusuario = responseLogin.usuario.idusuario;
        this.session.idpersona = responseLogin.usuario.idpersona;
        this.session.datospersona = responseLogin.usuario.datospersona;
        this.session.apellidopaterno = responseLogin.usuario.apellidopaterno;
        this.session.apellidomaterno = responseLogin.usuario.apellidomaterno;
        this.session.nombres = responseLogin.usuario.nombres;
        this.session.usuarioauditoria = responseLogin.usuario.usuarioauditoria;
        this.session.tipodocumento = responseLogin.usuario.tipodocumento;
        this.session.numerodocumento = responseLogin.usuario.numerodocumento;
        this.session.idtienda = responseLogin.usuario.idtienda;
        this.session.tienda = responseLogin.usuario.tienda;
        this.session.email = responseLogin.usuario.email;
        this.session.token = responseLogin.access_token;
        //Verifico el Perfil
        this.authService.obtenerPerfil(this.session.token).subscribe(responsePerfil =>{
          var countPerfil = 0;
          var idPerfil : string;
          var idSistema : string;
          var idModulo : string;
          responsePerfil.dato?.forEach((row) => {
            idPerfil = row.idperfil;
            idSistema = row.idsistema;
            idModulo = row.idmodulo;
            countPerfil++;
          });
          if (countPerfil == 1){
            this.authService.listarMenu(idPerfil,0,this.session.token).subscribe(responseMenu =>{
              this.session.idperfil = idPerfil;
              this.session.idsistema = idSistema;
              this.session.idmodulo = idModulo;
              this.session.menu = this.listarSubMenus(idPerfil,responseMenu.dato);
              setTimeout (() => {
                this.storageService.setCurrentSession(this.session);
                this.router.navigate(['/inicio/principal/perfil']);
                this.snackbar.open( `Bienvenido(a), ${this.session.nombres}, ya estás autenticado(a)!`, null, {
                  duration: Constantes.SNACKBAR_TIME,
                });
              }, 1000);
            });
          } else {
            const dialogRef = this.dialog.open(ListaPerfilComponent, {
              width: '450px',
              disableClose: true,
              data: { 
                titulo : "Lista de Perfiles Asignados",
                listaPerfiles : responsePerfil.dato,
                token : this.session.token
              },
            });
            dialogRef.afterClosed().subscribe((result) => {
              if (result){
                this.session.idperfil = result.idperfil;
                this.session.idsistema = result.idsistema;
                this.session.idmodulo = result.idmodulo;
                this.session.menu = this.listarSubMenus(idPerfil,result.datosMenu);
                setTimeout (() => {
                  this.storageService.setCurrentSession(this.session);
                  this.router.navigate(['/inicio/principal/perfil']);
                  this.snackbar.open( `Bienvenido(a), ${this.session.nombres}, ya estás autenticado(a)!`, null, {
                    duration: Constantes.SNACKBAR_TIME,
                  });
                }, 1000);
              }
            });
          }
        }, error => {
          /*this.snackbar.open(err.error.error_description, 'Advertencia', {
            duration: 10000
          });*/
          this.loading = false;
        });
      }
    }, err => {
      this.snackbar.open(err.error.error_description, 'Advertencia', {
        duration: Constantes.SNACKBAR_TIME,
      });
      //this.form.get('recaptchaReactive').setValue('');
      this.loading = false;
    });

  }

  listarSubMenus(idPerfil,data) {
    var menuOpc : any = [];
    var dmenu : any= [];
    var submenu : any= [];
    for(let row of data) {
      this.authService.listarMenu(idPerfil,row.idopcion,this.session.token).subscribe(responseSubMenu =>{
        if(responseSubMenu.dato){
          submenu = [];
          responseSubMenu.dato.forEach((datoSubmenu: any) => {
            submenu.push({
              type: 'link',
              label: datoSubmenu.nombre,
              route: datoSubmenu.enlace,
            });
          });
          dmenu.push({
            type: 'dropdown',
            label: row.nombre,
            icon: this.getMenu(row.icono),
            children: submenu
          });
        } else {
          dmenu.push({
            type: 'link',
            label: row.nombre,
            route: row.enlace,
            icon: this.getMenu(row.icono),
          });
        }
      });
    }
    //console.log("Datos:",dmenu);
    menuOpc.push({
      type: 'link',
      label: 'Inicio',
      route: '/',
      icon: icLayers,
      routerLinkActiveOptions: { exact: true }
    });
    menuOpc.push({
      type: 'subheading',
      label: 'Opciones del Sistema',
      children: dmenu
    });
    return menuOpc;
  }

  getMenu(valor){
    if (valor == "icReceipt"){
      return icReceipt;
    }
    if (valor == "icAssigment"){
      return icAssigment;
    }
    if (valor == "icHelp"){
      return icHelp;
    }
    if (valor == "icDateRange"){
      return icDateRange;
    }
    if (valor == "icChat"){
      return icChat;
    }
    if (valor == "icSettings"){
      return icSettings;
    }
    if (valor == "icContacts"){
      return icContacts;
    }
    if (valor == "icMail"){
      return icMail;
    }
    if (valor == "icAttachMoney"){
      return icAttachMoney;
    }
    if (valor == "icError"){
      return icError;
    }
    if (valor == "icStar"){
      return icStar;
    }
    if (valor == "icBook"){
      return icBook;
    }
    if (valor == "icLayers"){
      return icLayers;
    }
    if (valor == "icLock"){
      return icLock;
    }
    if (valor == "icContactSupport"){
      return icContactSupport;
    }
  }

  toggleVisibility() {
    if (this.visible) {
      this.inputType = 'password';
      this.visible = false;
      this.cd.markForCheck();
    } else {
      this.inputType = 'text';
      this.visible = true;
      this.cd.markForCheck();
    }
  }

}
