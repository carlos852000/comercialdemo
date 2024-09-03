import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Session } from "../models/session.model";
import { StorageService } from "./storage.service";

@Injectable({
  providedIn: "root",
})
export class PermisoService {
  private basePath = environment.baseURL + "api/usuario-sistema";
  private headersSeguridad = new HttpHeaders();

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {}

  validaPermisosForms(idperfil, opcion): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set(
        "Authorization",
        "Bearer " + this.storageService.getCurrentSession().token
      );
    const urlEndpoint = this.basePath + "/verifica-permisos";
    const data = {
      dato: {
        idperfil: idperfil,
        opcion: opcion,
      },
    };
    return this.http
      .post<any>(urlEndpoint, data, { headers: this.headersSeguridad })
      .pipe(map((res) => res));
  }

  validaAccesoBoton(idacceso, nombreboton): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set(
        "Authorization",
        "Bearer " + this.storageService.getCurrentSession().token
      );
    const urlEndpoint = this.basePath + "/verifica-acceso-boton";
    const data = {
      dato: {
        idacceso: idacceso,
        nombreboton: nombreboton,
      },
    };
    return this.http
      .post<any>(urlEndpoint, data, { headers: this.headersSeguridad })
      .pipe(map((res) => res));
  }
}
