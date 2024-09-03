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
export class GeneralService {

  private basePathConfiguracion = environment.baseURL + 'api/configuracion';
  private basePathCatalogo = environment.baseURL + 'api/catalogo';
  private basePathRubro = environment.baseURL + 'api/rubro';
  private headersSeguridad = new HttpHeaders();

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {
  }

  //CONFIGURACION
  verificaConfiguracion(): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePathConfiguracion + '/verifica-datos';
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

  procesaConfiguracion01(idconfiguracion,empresa,direccion,ruc,telefono,igv,cambiodolar,indicadorfactelectronica): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePathConfiguracion + '/procesa-configuracion01';
    const data = {
      dato: {
        idconfiguracion:idconfiguracion,
        empresa:empresa,
        direccion:direccion,
        ruc:ruc,
        telefono:telefono,
        igv:igv,
        cambiodolar:cambiodolar,
        indicadorfactelectronica:indicadorfactelectronica
      }
    };
    return this.http.post<any>(urlEndpoint,
      data, { headers: this.headersSeguridad })
      .pipe(
        map(res => res)
      );
  }

  procesaConfiguracion02(idconfiguracion,idrubro,codigoproductointerno,diasnovedad,indicadordctsventas,indicadorprecioporlocal,indicadorprecioporgrupos,
    gestionarstock,indicadorenviarcorreocliente,indicadordesagregarproducto,nummostrarprodventas,nummostrarprodcompras,indicadoretiquetaprodsinstock,
    etiquetaprodsinstock,indicadoretiquetaprodconstockmin,etiquetaprodconstockmin,indicadoretiquetaprodconstock,etiquetaprodconstock): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePathConfiguracion + '/procesa-configuracion02';
    const data = {
      dato: {
        idconfiguracion:idconfiguracion,
        idrubro:idrubro,
        codigoproductointerno:codigoproductointerno,
        diasnovedad:diasnovedad,
        indicadordctsventas:indicadordctsventas,
        indicadorprecioporlocal:indicadorprecioporlocal,
        indicadorprecioporgrupos:indicadorprecioporgrupos,
        gestionarstock:gestionarstock,
        indicadorenviarcorreocliente:indicadorenviarcorreocliente,
        indicadordesagregarproducto:indicadordesagregarproducto,
        nummostrarprodventas:nummostrarprodventas,
        nummostrarprodcompras:nummostrarprodcompras,
        indicadoretiquetaprodsinstock:indicadoretiquetaprodsinstock,
        etiquetaprodsinstock:etiquetaprodsinstock,
        indicadoretiquetaprodconstockmin:indicadoretiquetaprodconstockmin,
        etiquetaprodconstockmin:etiquetaprodconstockmin,
        indicadoretiquetaprodconstock:indicadoretiquetaprodconstock,
        etiquetaprodconstock:etiquetaprodconstock,
      }
    };
    return this.http.post<any>(urlEndpoint,
      data, { headers: this.headersSeguridad })
      .pipe(
        map(res => res)
      );
  }

  //CATALOGO
  verificaCatalogo(abreviatura): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePathCatalogo + '/verifica-catalogo';
    const data = {
      dato: {
        abreviatura:abreviatura,
      }
    };
    return this.http.post<any>(urlEndpoint,
      data, { headers: this.headersSeguridad })
      .pipe(
        map(res => res)
      );
  }

  verificaCatalogoDetalle(idcatalogo,abreviatura): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePathCatalogo + '/verifica-catalogo-detalle';
    const data = {
      dato: {
        idcatalogo:idcatalogo,
        abreviatura:abreviatura,
      }
    };
    return this.http.post<any>(urlEndpoint,
      data, { headers: this.headersSeguridad })
      .pipe(
        map(res => res)
      );
  }

  listaCatalogo(abreviatura,idcatalogopadre): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePathCatalogo + '/listar-catalogo';
    const data = {
      dato: {
        abreviatura:abreviatura,
        idcatalogopadre:idcatalogopadre
      }
    };
    return this.http.post<any>(urlEndpoint,
      data, { headers: this.headersSeguridad })
      .pipe(
        map(res => res)
      );
  }

  //CATALOGO DETALLE
  listaCatalogodetalle(descripcion,idcatalogo,tipo,totalFilasPorPage,nroPage): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePathCatalogo + '/listar-catalogo-detalle';
    const data = {
      dato: {
        descripcion:descripcion,
        idcatalogo:idcatalogo,
        tipo:tipo,
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

  procesaCatalogoDetalle(tipoaccion,idcatalogodetalle,idcatalogo,descripcion,abreviatura): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePathCatalogo + '/procesa-catalogo-detalle';
    const data = {
      dato: {
        tipoaccion:tipoaccion,
        idcatalogodetalle:idcatalogodetalle,
        idcatalogo:idcatalogo,
        descripcion:descripcion,
        abreviatura:abreviatura
      }
    };
    return this.http.post<any>(urlEndpoint,
      data, { headers: this.headersSeguridad })
      .pipe(
        map(res => res)
      );
  }

  eliminaCatalogoDetalle(idcatalogodetalle): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePathCatalogo + '/eliminar-catalogo-detalle';
    const data = {
      dato: {
        idcatalogodetalle:idcatalogodetalle,
      }
    };
    return this.http.post<any>(urlEndpoint,
      data, { headers: this.headersSeguridad })
      .pipe(
        map(res => res)
      );
  }

  //RUBROS
  listaRubro(rubro,totalFilasPorPage,nroPage): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePathRubro + '/listar-rubro';
    const data = {
      dato: {
        rubro:rubro,
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

  listaRubroCaracteristicaDetalle(abreviatura): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePathRubro + '/listar-rubro-caracteristica-detalle-rubro';
    const data = {
      dato: {
        abreviatura:abreviatura
      }
    };
    return this.http.post<any>(urlEndpoint,
      data, { headers: this.headersSeguridad })
      .pipe(
        map(res => res)
      );
  }

  procesaRubro(tipoaccion,idrubro,idcatalogo): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePathRubro + '/procesa-rubro';
    const data = {
      dato: {
        idcatalogo:idcatalogo,
        idrubro:idrubro,
        tipoaccion:tipoaccion
      }
    };
    return this.http.post<any>(urlEndpoint,
      data, { headers: this.headersSeguridad })
      .pipe(
        map(res => res)
      );
  }

  eliminaRubro(idrubro): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePathRubro + '/eliminar-rubro';
    const data = {
      dato: {
        idrubro:idrubro,
      }
    };
    return this.http.post<any>(urlEndpoint,
      data, { headers: this.headersSeguridad })
      .pipe(
        map(res => res)
      );
  }

  //LISTA UNIDADES MEDIDA
  listaUnidadMedida(idrubro,nombre,totalFilasPorPage,nroPage): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePathRubro + '/listar-rubro-unidad-medida';
    const data = {
      dato: {
        idrubro:idrubro,
        nombre:nombre,
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

  listaUnidadMedidaxRubro(): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePathRubro + '/listar-rubro-unidad-medidaxrubro';
    const data = {
      dato: {}
    };
    return this.http.post<any>(urlEndpoint,
      data, { headers: this.headersSeguridad })
      .pipe(
        map(res => res)
      );
  }

  procesaUnidadMedida(tipoaccion,idrubro,idrubrounidadmedida,idunidadmedida,cantidad): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePathRubro + '/procesa-rubro-unidad-medida';
    const data = {
      dato: {
        tipoaccion:tipoaccion,
        idrubrounidadmedida:idrubrounidadmedida,
        idrubro:idrubro,
        idunidadmedida:idunidadmedida,
        cantidad:cantidad,
      }
    };
    return this.http.post<any>(urlEndpoint,
      data, { headers: this.headersSeguridad })
      .pipe(
        map(res => res)
      );
  }

  eliminaUnidadMedida(idunidadmedida): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePathRubro + '/eliminar-rubro-unidad-medida';
    const data = {
      dato: {
        idrubrounidadmedida:idunidadmedida,
      }
    };
    return this.http.post<any>(urlEndpoint,
      data, { headers: this.headersSeguridad })
      .pipe(
        map(res => res)
      );
  }

  //LISTA CARACTERISTICAS
  listaCaracteristicas(idrubro,nombre,totalFilasPorPage,nroPage): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePathRubro + '/listar-rubro-caracteristica';
    const data = {
      dato: {
        idrubro:idrubro,
        nombre:nombre,
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

  procesaCaracteristica(tipoaccion,idrubro,idrubrocaracteristica,idcaracteristica): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePathRubro + '/procesa-rubro-caracteristica';
    const data = {
      dato: {
        tipoaccion:tipoaccion,
        idrubrocaracteristica:idrubrocaracteristica,
        idrubro:idrubro,
        idcaracteristica:idcaracteristica,
      }
    };
    return this.http.post<any>(urlEndpoint,
      data, { headers: this.headersSeguridad })
      .pipe(
        map(res => res)
      );
  }

  eliminaCaracteristica(idcaracteristica): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePathRubro + '/eliminar-rubro-caracteristica';
    const data = {
      dato: {
        idrubrocaracteristica:idcaracteristica,
      }
    };
    return this.http.post<any>(urlEndpoint,
      data, { headers: this.headersSeguridad })
      .pipe(
        map(res => res)
      );
  }

  //LISTA CARACTERISTICAS DETALLE
  listaCaracteristicasDetalle(idrubrocaracteristica,nombre,totalFilasPorPage,nroPage): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePathRubro + '/listar-rubro-caracteristica-detalle';
    const data = {
      dato: {
        idrubrocaracteristica:idrubrocaracteristica,
        nombre:nombre,
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

  procesaCaracteristicaDetalle(tipoaccion,idrubrocaracteristica,idrubrocaracteristicadetalle,nombre): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePathRubro + '/procesa-rubro-caracteristica-detalle';
    const data = {
      dato: {
        tipoaccion:tipoaccion,
        idrubrocaracteristica:idrubrocaracteristica,
        idrubrocaracteristicadetalle:idrubrocaracteristicadetalle,
        nombre:nombre,
      }
    };
    return this.http.post<any>(urlEndpoint,
      data, { headers: this.headersSeguridad })
      .pipe(
        map(res => res)
      );
  }

  eliminaCaracteristicaDetalle(idrubrocaracteristicadetalle): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePathRubro + '/eliminar-rubro-caracteristica-detalle';
    const data = {
      dato: {
        idrubrocaracteristicadetalle:idrubrocaracteristicadetalle,
      }
    };
    return this.http.post<any>(urlEndpoint,
      data, { headers: this.headersSeguridad })
      .pipe(
        map(res => res)
      );
  }

}
