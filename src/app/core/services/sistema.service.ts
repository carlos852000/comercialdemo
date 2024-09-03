import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Session } from '../models/session.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class SistemaService {

  private basePathUsuarioSistema = environment.baseURL + 'api/usuario-sistema';
  private basePath = environment.baseURL + 'api/sistema';
  private headersSeguridad = new HttpHeaders();

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {
  }

  //SISTEMA
  verificaSistema(): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePath + '/verifica-sistema';
    const data = {
      dato: {
      }
    };
    return this.http.post<any>(urlEndpoint,
      data, { headers: this.headersSeguridad })
      .pipe(
        map(res => res)
      );
  }

  procesaSistema(idsistema,nombre,abreviatura,version,enlace): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePath + '/procesa-sistema';
    const data = {
      dato: {
        idsistema:idsistema,
        nombre:nombre,
        abreviatura:abreviatura,
        version:version,
        enlace:enlace
      }
    };
    return this.http.post<any>(urlEndpoint,
      data, { headers: this.headersSeguridad })
      .pipe(
        map(res => res)
      );
  }

  //PERFIL
  listaPerfiles(idsistema,nombreperfil,totalFilasPorPage,nroPage): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePath + '/lista-perfil';
    const data = {
      dato: {
        nombre:nombreperfil,
        idsistema:idsistema,
        totalFilasPorPage:totalFilasPorPage,
        nroPage:nroPage
      }
    };
    return this.http.post<any>(urlEndpoint,
      data, { headers: this.headersSeguridad })
      .pipe(
        map(res => res)
      );
  }

  procesaPerfil(tipoaccion,idperfil,idmodulo,nombre): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePath + '/procesa-perfil';
    const data = {
      dato: {
        tipoaccion:tipoaccion,
        idperfil:idperfil,
        idmodulo:idmodulo,
        nombre:nombre
      }
    };
    return this.http.post<any>(urlEndpoint,
      data, { headers: this.headersSeguridad })
      .pipe(
        map(res => res)
      );
  }

  eliminaPerfil(idperfil): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePath + '/elimina-perfil';
    const data = {
      dato: {
        idperfil:idperfil,
      }
    };
    return this.http.post<any>(urlEndpoint,
      data, { headers: this.headersSeguridad })
      .pipe(
        map(res => res)
      );
  }

  //OPCIONES
  listaOpciones(idsistema,nombreperfil,totalFilasPorPage,nroPage): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePath + '/lista-opciones';
    const data = {
      dato: {
        nombre:nombreperfil,
        idsistema:idsistema,
        totalFilasPorPage:totalFilasPorPage,
        nroPage:nroPage
      }
    };
    return this.http.post<any>(urlEndpoint,
      data, { headers: this.headersSeguridad })
      .pipe(
        map(res => res)
      );
  }

  listarMenu(idmodulo,opcionPadre,verOcultos,token): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Authorization', 'Bearer ' + token);
    const urlEndpoint = this.basePath + '/obtiene-menu';
    const data = {
      dato:{
        idmodulo:idmodulo,
		    idopcionpadre:opcionPadre,
        veropcion:verOcultos
      }
    };
    return this.http.post<any>(urlEndpoint,
      data, { headers: this.headersSeguridad })
      .pipe(
        map(res => res)
      );
  }

  procesaOpcion(tipoaccion,idopcion,idmodulo,idpadre,idopcionpadre,habilitador,icono,nombre,abreviatura,enlace,destino,veropcion): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePath + '/procesa-opcion';
    const data = {
      dato: {
        tipoaccion:tipoaccion,
        idopcion:idopcion,
        idmodulo:idmodulo,
        idpadre:idpadre,
        idopcionpadre:idopcionpadre,
        habilitador:habilitador,
        icono:icono,
        nombre:nombre,
        abreviatura:abreviatura,
        enlace:enlace,
        destino:destino,
        veropcion:veropcion
      }
    };
    return this.http.post<any>(urlEndpoint,
      data, { headers: this.headersSeguridad })
      .pipe(
        map(res => res)
      );
  }

  ordenarOpcion(idopcion,tipoorden): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePath + '/ordena-opcion';
    const data = {
      dato: {
        idopcion:idopcion,
        tipoorden:tipoorden,
      }
    };
    return this.http.post<any>(urlEndpoint,
      data, { headers: this.headersSeguridad })
      .pipe(
        map(res => res)
      );
  }

  eliminaOpcion(idopcion): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePath + '/opcion-elimina';
    const data = {
      dato: {
        idopcion:idopcion,
      }
    };
    return this.http.post<any>(urlEndpoint,
      data, { headers: this.headersSeguridad })
      .pipe(
        map(res => res)
      );
  }

  //BOTONES
  listaBotones(idopcion): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePath + '/lista-botones';
    const data = {
      dato: {
        idopcion:idopcion,
      }
    };
    return this.http.post<any>(urlEndpoint,
      data, { headers: this.headersSeguridad })
      .pipe(
        map(res => res)
      );
  }

  procesaBoton(tipoaccion,idopcion,idboton,boton): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePath + '/opcion-boton-procesa';
    const data = {
      dato: {
        tipoaccion:tipoaccion,
        idopcion:idopcion,
        idboton:idboton,
        boton:boton
      }
    };
    return this.http.post<any>(urlEndpoint,
      data, { headers: this.headersSeguridad })
      .pipe(
        map(res => res)
      );
  }

  eliminaBoton(idboton): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePath + '/opcion-boton-elimina';
    const data = {
      dato: {
        idboton:idboton,
      }
    };
    return this.http.post<any>(urlEndpoint,
      data, { headers: this.headersSeguridad })
      .pipe(
        map(res => res)
      );
  }

  verificarAccesoBoton(idacceso,idopcionboton): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePath + '/verifica-acceso-boton';
    const data = {
      dato: {
        idacceso:idacceso,
        idopcionboton:idopcionboton,
      }
    };
    return this.http.post<any>(urlEndpoint,
      data, { headers: this.headersSeguridad })
      .pipe(
        map(res => res)
      );
  }

  procesaAccesoBoton(idacceso,idopcionboton,accion): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePath + '/procesa-acceso-boton';
    const data = {
      dato: {
        idacceso:idacceso,
        idopcionboton:idopcionboton,
        accion:accion,
      }
    };
    return this.http.post<any>(urlEndpoint,
      data, { headers: this.headersSeguridad })
      .pipe(
        map(res => res)
      );
  }

  //ACCESO
  procesaAcceso(idperfil,idopcion,accion): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePath + '/procesa-acceso';
    const data = {
      dato: {
        idperfil:idperfil,
        idopcion:idopcion,
        accion:accion,
      }
    };
    return this.http.post<any>(urlEndpoint,
      data, { headers: this.headersSeguridad })
      .pipe(
        map(res => res)
      );
  }

  verificarAcceso(idperfil,idopcion): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePath + '/verifica-acceso';
    const data = {
      dato: {
        idperfil:idperfil,
        idopcion:idopcion,
      }
    };
    return this.http.post<any>(urlEndpoint,
      data, { headers: this.headersSeguridad })
      .pipe(
        map(res => res)
      );
  }

  //USUARIOS
  listaUsuario(nrodocumentousuario,nombreusuario,totalFilasPorPage,nroPage): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePath + '/lista-usuario';
    const data = {
      dato: {
        nrodocumentousuario:nrodocumentousuario,
        nombreusuario:nombreusuario,
        totalFilasPorPage:totalFilasPorPage,
        nroPage:nroPage
      }
    };
    return this.http.post<any>(urlEndpoint,
      data, { headers: this.headersSeguridad })
      .pipe(
        map(res => res)
      );
  }

  buscaDatosUsuario(idtipodocumentousuario,nrodocumentousuario): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePath + '/buscar-usuario-dni';
    const data = {
      dato: {
        idtipodocumentousuario:idtipodocumentousuario,
        nrodocumentousuario:nrodocumentousuario,
      }
    };
    return this.http.post<any>(urlEndpoint,
      data, { headers: this.headersSeguridad })
      .pipe(
        map(res => res)
      );
  }

  procesaUsuario(tipoaccion,idsistema,idperfil,idusuario,idpersona,idtipodocumentousuario,nrodocumentousuario,
    apellidopaternousuario,apellidomaternousuario,nombreusuario,idsexousuario,emailusuario,idtienda): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePath + '/procesa-usuario';
    const data = {
      dato: {
        tipoaccion:tipoaccion,
        idsistema:idsistema,
        idperfil:idperfil,
        idusuariosistema:idusuario,
        idpersonasistema:idpersona,
        idtipodocumentousuario:idtipodocumentousuario,
        nrodocumentousuario:nrodocumentousuario,
        apellidopaternousuario:apellidopaternousuario,
        apellidomaternousuario:apellidomaternousuario,
        nombreusuario:nombreusuario,
        idsexousuario:idsexousuario,
        emailusuario:emailusuario,
        idtienda:idtienda
      }
    };
    return this.http.post<any>(urlEndpoint,
      data, { headers: this.headersSeguridad })
      .pipe(
        map(res => res)
      );
  }

  eliminaUsuario(idusuario): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePath + '/elimina-usuario';
    const data = {
      dato: {
        idusuario:idusuario,
      }
    };
    return this.http.post<any>(urlEndpoint,
      data, { headers: this.headersSeguridad })
      .pipe(
        map(res => res)
      );
  }

  cambiaClave(idusuario,clave): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePath + '/cambia-clave';
    const data = {
      dato: {
        idusuariosistema:idusuario,
        nrodocumentousuario:clave
      }
    };
    return this.http.post<any>(urlEndpoint,
      data, { headers: this.headersSeguridad })
      .pipe(
        map(res => res)
      );
  }

  verificarUsuarioPerfil(idperfil,idusuario): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePath + '/verifica-usuario-perfil';
    const data = {
      dato: {
        idperfil:idperfil,
        idusuariosistema:idusuario,
      }
    };
    return this.http.post<any>(urlEndpoint,
      data, { headers: this.headersSeguridad })
      .pipe(
        map(res => res)
      );
  }

  //ACCESO
  procesaUsuarioPerfil(idusuario,idperfil,accion): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePath + '/procesa-usuario-perfil';
    const data = {
      dato: {
        idperfil:idperfil,
        idusuariosistema:idusuario,
        accion:accion,
      }
    };
    return this.http.post<any>(urlEndpoint,
      data, { headers: this.headersSeguridad })
      .pipe(
        map(res => res)
      );
  }

  //ACTUALIZA-DATOS-USUARIO
  actualizaDatosUsuario(email): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePathUsuarioSistema + '/actualiza-datos-usuario';
    const data = {
      dato: {
        emailusuario:email
      }
    };
    return this.http.post<any>(urlEndpoint,
      data, { headers: this.headersSeguridad })
      .pipe(
        map(res => res)
      );
  }
}
