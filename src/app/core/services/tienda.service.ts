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
export class TiendaService {

  private basePath = environment.baseURL + 'api/tienda';
  private headersSeguridad = new HttpHeaders();

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {
  }

  listaTienda(tienda,totalFilasPorPage,nroPage): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePath + '/listar-tienda';
    const data = {
      dato: {
        nombre:tienda,
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

  procesaTienda(tipoaccion,idtienda,idtipo,nombre,telefono,direccion,email,indicadorcentral): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePath + '/procesa-tienda';
    const data = {
      dato: {
        tipoAccion:tipoaccion,
        idtienda:idtienda,
        idtipo:idtipo,
        nombre:nombre,
        telefono:telefono,
        direccion:direccion,
        emailtienda:email,
        indicadorcentral:indicadorcentral
      }
    };
    return this.http.post<any>(urlEndpoint,
      data, { headers: this.headersSeguridad })
      .pipe(
        map(res => res)
      );
  }

  eliminaTienda(idtienda): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePath + '/eliminar-tienda';
    const data = {
      dato: {
        idtienda:idtienda,
      }
    };
    return this.http.post<any>(urlEndpoint,
      data, { headers: this.headersSeguridad })
      .pipe(
        map(res => res)
      );
  }

}
