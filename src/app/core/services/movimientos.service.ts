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
export class MovimientosService {
  private basePath = environment.baseURL + "api/movimiento";
  private headersSeguridad = new HttpHeaders();

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {}

  buscarCompra(idCompra): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization","Bearer " + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePath + "/buscar-compra";
    const data = {
      dato: {
        nromodulo: idCompra
      },
    };
    return this.http
      .post<any>(urlEndpoint, data, { headers: this.headersSeguridad })
      .pipe(map((res) => res));
  }

  verificarSalidaTransferenciaxUsuario(): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization","Bearer " + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePath + "/verificar-movimiento-salida-transf-usuario";
    const data = {
      dato: {}
    };
    return this.http
      .post<any>(urlEndpoint, data, { headers: this.headersSeguridad })
      .pipe(map((res) => res));
  }

  listMovimientos(proveedor,nroingreso,nrotabla,totalFilasPorPage,nroPage,TipoMovimientos): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization","Bearer " + this.storageService.getCurrentSession().token);
      let urlEndpoint = "";
    if (TipoMovimientos=="INGXCOMPRAS"){
      urlEndpoint = this.basePath + "/listar-ingresos-compras";
    }
    if (TipoMovimientos=="INGXTRANSFERENCIAS"){
      urlEndpoint = this.basePath + "/listar-ingresos-transferencias";
    }
    if (TipoMovimientos=="SALXTRANSFERENCIAS"){
      urlEndpoint = this.basePath + "/listar-salidas-transferencias";
    }
    const data = {
      dato: {
        proveedor: proveedor,
        nromovimiento: nroingreso,
        nromodulo: nrotabla,
        totalFilasPorPage: totalFilasPorPage,
        nroPage: nroPage,
      },
    };
    return this.http
      .post<any>(urlEndpoint, data, { headers: this.headersSeguridad })
      .pipe(map((res) => res));
  }

  registrarPreSalida(tipoAccion,idmovimiento,idtiendadestino): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization","Bearer " + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePath + "/procesa-pre-movimiento-salida-transferencia";
    const data = {
      dato: {
        tipoAccion:tipoAccion,
        idmovimiento: idmovimiento,
        idtienda: idtiendadestino,
      },
    };
    return this.http
      .post<any>(urlEndpoint, data, { headers: this.headersSeguridad })
      .pipe(map((res) => res));
  }

  registrarMovimiento(
    idmovimiento,
    idproveedor,
    idtiendadestino,
    idtipodocumento,
    numdocumento,
    montosinigv,
    montoconigv,
    referencia_movimiento,
    TipoMovimientos): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization","Bearer " + this.storageService.getCurrentSession().token);
    let urlEndpoint = "";
    if (TipoMovimientos=="INGXCOMPRAS"){
      urlEndpoint = this.basePath + "/procesa-movimiento-ing-compras";
    }
    if (TipoMovimientos=="INGXTRANSFERENCIAS"){
      urlEndpoint = this.basePath + "/procesa-movimiento";
    }
    if (TipoMovimientos=="SALXTRANSFERENCIAS"){
      urlEndpoint = this.basePath + "/procesa-movimiento-sal-transferencias";
    }
    const data = {
      dato: {
        idmovimiento: idmovimiento,
        idproveedor: idproveedor,
        idtienda: idtiendadestino,
        idtipodocumento: idtipodocumento,
        numdocumento: numdocumento,
        montosinigv: montosinigv,
        montoconigv: montoconigv,
        referenciamovimiento: referencia_movimiento,

      },
    };
    return this.http
      .post<any>(urlEndpoint, data, { headers: this.headersSeguridad })
      .pipe(map((res) => res));
  }

  registrarMovimientoDetalleSalidaTransferencia(
    tipoAccion,
    idmovimientodetalle,
    idmovimiento,
    idproducto,
    idproveedor,
    cantidad,
    preciocosto,
    idunidadmedida): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization","Bearer " + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePath + "/procesa-movimiento-detalle-salida-transferencia";
    const data = {
      dato: {
        tipoAccion: tipoAccion,
        idmovimientodetalle: idmovimientodetalle,
        idmovimiento: idmovimiento,
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

  eliminarMovimiento(idmovimiento): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization","Bearer " + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePath + "/eliminar-movimiento";
    const data = {
      dato: {
        idmovimiento: idmovimiento
      },
    };
    return this.http
      .post<any>(urlEndpoint, data, { headers: this.headersSeguridad })
      .pipe(map((res) => res));
  }

  listMovimientosDetalle(idmovimiento): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization","Bearer " + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePath + "/listar-movimiento-detalle";
    const data = {
      dato: {
        idmovimiento: idmovimiento
      },
    };
    return this.http
      .post<any>(urlEndpoint, data, { headers: this.headersSeguridad })
      .pipe(map((res) => res));
  }

  listarKardexxProducto(idproducto,totalFilasPorPage,nroPage): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization","Bearer " + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePath + "/kardex-producto";
    const data = {
      dato: {
        idproducto: idproducto,
        totalFilasPorPage: totalFilasPorPage,
        nroPage: nroPage,
      },
    };
    return this.http
      .post<any>(urlEndpoint, data, { headers: this.headersSeguridad })
      .pipe(map((res) => res));
  }

  listarKardexxProductoTienda(idproducto): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization","Bearer " + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePath + "/kardex-producto-tienda";
    const data = {
      dato: {
        idproducto: idproducto
      },
    };
    return this.http
      .post<any>(urlEndpoint, data, { headers: this.headersSeguridad })
      .pipe(map((res) => res));
  }

  eliminarMovimientoDetalle(idmovimientoDetalle): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization","Bearer " + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePath + "/eliminar-movimiento-detalle";
    const data = {
      dato: {
        idmovimientodetalle: idmovimientoDetalle
      },
    };
    return this.http
      .post<any>(urlEndpoint, data, { headers: this.headersSeguridad })
      .pipe(map((res) => res));
  }

}
