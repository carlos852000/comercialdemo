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
export class ComprasService {
  private basePath = environment.baseURL + "api/compra";
  private headersSeguridad = new HttpHeaders();

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {}

  listaCompras(proveedor,idcompra,totalFilasPorPage,nroPage): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization","Bearer " + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePath + "/listar-compra";
    const data = {
      dato: {
        proveedor: proveedor,
        nrocompra: idcompra,
        totalFilasPorPage: totalFilasPorPage,
        nroPage: nroPage,
      },
    };
    return this.http
      .post<any>(urlEndpoint, data, { headers: this.headersSeguridad })
      .pipe(map((res) => res));
  }

  verificarComprasxUsuario(): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization","Bearer " + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePath + "/verificar-compra-usuario";
    const data = {
      dato: {},
    };
    return this.http
      .post<any>(urlEndpoint, data, { headers: this.headersSeguridad })
      .pipe(map((res) => res));
  }

  procesaPreCompra(
    tipoAccion,
    idcompra,
    idproveedor,
    idtienda,
    fechacompra,
    fechaentrega,
    idtipoemision,
  ): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization","Bearer " + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePath + "/procesa-precompra";
    const data = {
      dato: {
        tipoAccion: tipoAccion,
        idcompra: idcompra,
        idproveedor: idproveedor,
        idtienda: idtienda,
        fechacompra:fechacompra,
        fechaentrega:fechaentrega,
        idtipoemision:idtipoemision
      },
    };
    return this.http
      .post<any>(urlEndpoint, data, { headers: this.headersSeguridad })
      .pipe(map((res) => res));
  }

  procesaCompra(
    tipoAccion,
    idcompra,
    idproveedor,
    idtienda,
    fechacompra,
    fechaentrega,
    idtipoemision,
    nrodocumento,
    referencia,
    incluyeIGV,
    montosinigv,
    montoconigv,
    montototal
  ): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization","Bearer " + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePath + "/procesa-compra";
    const data = {
      dato: {
        tipoAccion: tipoAccion,
        idcompra: idcompra,
        idproveedor: idproveedor,
        idtienda: idtienda,
        fechacompra:fechacompra,
        fechaentrega:fechaentrega,
        referencia:referencia,
        montosinigv:montosinigv,
        montoconigv:montoconigv,
        montototal:montototal,
        idtipoemision:idtipoemision,
        numdocumento:nrodocumento,
        incluidoigv:incluyeIGV
      },
    };
    return this.http
      .post<any>(urlEndpoint, data, { headers: this.headersSeguridad })
      .pipe(map((res) => res));
  }

  eliminaCompra(idcompra): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization","Bearer " + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePath + "/eliminar-compra";
    const data = {
      dato: {
        idcompra: idcompra,
      },
    };
    return this.http
      .post<any>(urlEndpoint, data, { headers: this.headersSeguridad })
      .pipe(map((res) => res));
  }

  eliminaCompraDetalle(idcompradetalle): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization","Bearer " + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePath + "/eliminar-compra-detalle";
    const data = {
      dato: {
        idcompradetalle: idcompradetalle,
      },
    };
    return this.http
      .post<any>(urlEndpoint, data, { headers: this.headersSeguridad })
      .pipe(map((res) => res));
  }

  verificaCompraDetalle(idcompra): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization","Bearer " + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePath + "/verificar-compra-detalle";
    const data = {
      dato: {
        idcompra: idcompra,
      },
    };
    return this.http
      .post<any>(urlEndpoint, data, { headers: this.headersSeguridad })
      .pipe(map((res) => res));
  }

  procesaCompraDetalle(
    tipoAccion,
    idcompradetalle,
    idcompra,
    idproducto,
    idproveedor,
    cantidad,
    preciocosto,
    idunidadmedida
  ): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization","Bearer " + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePath + "/procesa-compra-detalle";
    const data = {
      dato: {
        tipoAccion: tipoAccion,
        idcompradetalle: idcompradetalle,
        idcompra: idcompra,
        idproducto: idproducto,
        idproveedor:idproveedor,
        cantidad:cantidad,
        preciocosto:preciocosto,
        idunidadmedida:idunidadmedida,
      },
    };
    return this.http
      .post<any>(urlEndpoint, data, { headers: this.headersSeguridad })
      .pipe(map((res) => res));
  }

}
