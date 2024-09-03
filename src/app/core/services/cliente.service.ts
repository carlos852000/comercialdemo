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
export class ClienteService {

  private basePath = environment.baseURL + 'api/cliente';
  private headersSeguridad = new HttpHeaders();

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {
  }

  buscaDatosCliente(idTipoDocumento,nroDocumento): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePath + '/buscar-cliente';
    const data = {
      dato: {
        idTipoDocumentoCliente:idTipoDocumento,
        nroDocumentoCliente:nroDocumento,
      }
    };
    return this.http.post<any>(urlEndpoint,
      data, { headers: this.headersSeguridad })
      .pipe(
        map(res => res)
      );
  }

  buscaDatosCliente02(idTipoDocumento,nroDocumento): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePath + '/buscar-cliente-02';
    const data = {
      dato: {
        idTipoDocumentoCliente:idTipoDocumento,
        nroDocumentoCliente:nroDocumento,
      }
    };
    return this.http.post<any>(urlEndpoint,
      data, { headers: this.headersSeguridad })
      .pipe(
        map(res => res)
      );
  }

  listarClientes(nombre,totalFilasPorPage,nroPage): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePath + '/listar-cliente';
    const data = {
      dato: {
        nombresCliente:nombre,
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

  procesaCliente(tipoAccion,idcliente,idpersona,tipoDocumento,dni,apellidopaterno,apellidomaterno,nombres,ruc,empresa,direccion,telefono,sexo,email,observacion): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePath + '/procesa-cliente';
    const data = {
      dato: {
        tipoAccion:tipoAccion,
        idcliente:idcliente,
        idpersona:idpersona,
        idTipoDocumentoCliente:tipoDocumento,
        nroDocumentoCliente:dni,
        apellidoPaternoCliente:apellidopaterno,
        apellidoMaternoCliente:apellidomaterno,
        nombresCliente:nombres,
        ruc:ruc,
        nombreempresa:empresa,
        direccionCliente:direccion,
        telefonoCliente:telefono,
        sexoCliente:sexo,
        emailCliente:email,
        observacion:observacion
      }
    };
    return this.http.post<any>(urlEndpoint,
      data, { headers: this.headersSeguridad })
      .pipe(
        map(res => res)
      );
  }

  eliminaCliente(idcliente): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePath + '/eliminar-cliente';
    const data = {
      dato: {
        idcliente:idcliente,
      }
    };
    return this.http.post<any>(urlEndpoint,
      data, { headers: this.headersSeguridad })
      .pipe(
        map(res => res)
      );
  }

  listarClientesGrupos(nombre,totalFilasPorPage,nroPage): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePath + '/listar-cliente-grupo';
    const data = {
      dato: {
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

  procesaClienteGrupos(tipoAccion,idclientegrupo,nombre): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePath + '/procesa-cliente-grupo';
    const data = {
      dato: {
        tipoAccion:tipoAccion,
        idclientegrupo:idclientegrupo,
        nombre:nombre,
      }
    };
    return this.http.post<any>(urlEndpoint,
      data, { headers: this.headersSeguridad })
      .pipe(
        map(res => res)
      );
  }

  eliminaClienteGrupos(idclientegrupo): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePath + '/eliminar-cliente-grupo';
    const data = {
      dato: {
        idclientegrupo:idclientegrupo,
      }
    };
    return this.http.post<any>(urlEndpoint,
      data, { headers: this.headersSeguridad })
      .pipe(
        map(res => res)
      );
  }

  listarClientesGruposDetalle(idclientegrupo,cliente,totalFilasPorPage,nroPage): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePath + '/listar-cliente-grupo-detalle';
    const data = {
      dato: {
        idclientegrupo:idclientegrupo,
        cliente:cliente,
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

  procesaClienteGruposDetalle(idclientegrupo,idcliente): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePath + '/procesa-cliente-grupo-detalle';
    const data = {
      dato: {
        idclientegrupo:idclientegrupo,
        idcliente:idcliente,
      }
    };
    return this.http.post<any>(urlEndpoint,
      data, { headers: this.headersSeguridad })
      .pipe(
        map(res => res)
      );
  }

  eliminaClienteGruposDetalle(idclientegrupodet): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePath + '/eliminar-cliente-grupo-detalle';
    const data = {
      dato: {
        idclientegrupodet:idclientegrupodet,
      }
    };
    return this.http.post<any>(urlEndpoint,
      data, { headers: this.headersSeguridad })
      .pipe(
        map(res => res)
      );
  }

}
