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
export class ProveedorService {

  private basePath = environment.baseURL + 'api/proveedor';
  private headersSeguridad = new HttpHeaders();

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {
  }

  listarProveedores(nombre,totalFilasPorPage,nroPage): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePath + '/listar-proveedor';
    const data = {
      dato: {
        representante:nombre,
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

  procesaProveedor(tipoAccion,idProveedor,representante,ruc,direccion,telefono,email,web): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePath + '/procesa-proveedor';
    const data = {
      dato: {
        tipoAccion:tipoAccion,
        idProveedor:idProveedor,
        representante:representante,
        ruc:ruc,
        direccionProveedor:direccion,
        telefonoProveedor:telefono,
        emailProveedor:email,
        web:web,
      }
    };
    return this.http.post<any>(urlEndpoint,
      data, { headers: this.headersSeguridad })
      .pipe(
        map(res => res)
      );
  }

  eliminaProveedor(idProveedor): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePath + '/eliminar-proveedor';
    const data = {
      dato: {
        idProveedor:idProveedor,
      }
    };
    return this.http.post<any>(urlEndpoint,
      data, { headers: this.headersSeguridad })
      .pipe(
        map(res => res)
      );
  }

}
