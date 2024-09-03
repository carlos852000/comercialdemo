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
export class ParametroService {
  private basePath = environment.baseURL + "api/parametro";
  private headersSeguridad = new HttpHeaders();

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {}

  verificarParametroxAbreviatura(Abreviatura): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization","Bearer " + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePath + "/verifica-parametro-ab";
    const data = {
      dato: {
        abreviatura:Abreviatura
      },
    };
    return this.http
      .post<any>(urlEndpoint, data, { headers: this.headersSeguridad })
      .pipe(map((res) => res));
  }

}
