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
export class ProductoService {
  private basePath = environment.baseURL + "api/producto";
  private headersSeguridad = new HttpHeaders();

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {}

  listaProducto(codigobarra,nombreProducto,totalFilasPorPage,nroPage): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization","Bearer " + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePath + "/listar-producto";
    const data = {
      dato: {
        codigobarra: codigobarra,
        nombre: nombreProducto,
        totalFilasPorPage: totalFilasPorPage,
        nroPage: nroPage,
      },
    };
    return this.http
      .post<any>(urlEndpoint, data, { headers: this.headersSeguridad })
      .pipe(map((res) => res));
  }

  procesaProducto(
    tipoaccion,
    idproducto,
    nombre,
    codigointerno,
    codigobarra,
    idproveedor,
    idmarca,
    margenutilidad,
    cantidad,
    idunidadmedida,
    cantidadminparacompra,
    activoparacompra,
    cantidadminparaventa,
    activoparaventa,
    desagrega,
    edades,
    modelo,
    familia,
    genero
  ): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization","Bearer " + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePath + "/procesa-producto";
    const data = {
      dato: {
        tipoaccion: tipoaccion,
        idproducto: idproducto,
        nombre: nombre,
        codigointerno: codigointerno,
        codigobarra: codigobarra,
        idproveedor: idproveedor,
        idmarca: idmarca,
        margenutilidad: margenutilidad,
        igv:1,
        cantidad: cantidad,
        idunidadmedida: idunidadmedida,
        cantidadminparacompra: cantidadminparacompra,
        activoparacompra: activoparacompra,
        cantidadminparaventa: cantidadminparaventa,
        activoparaventa: activoparaventa,
        desagrega:desagrega,
        edades:edades,
        modelo:modelo,
        familia:familia,
        genero:genero
      },
    };
    return this.http
      .post<any>(urlEndpoint, data, { headers: this.headersSeguridad })
      .pipe(map((res) => res));
  }

  procesaProductoPrecio(
    idproducto,
    preciocosto,
    porcentanjeUtilidad,
    preciosinimp,
    porcentImpuesto,
    precioconimp,
    preciounitario,
    unidadMedida,
    redondeo
  ): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization","Bearer " + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePath + "/procesa-producto-precio";
    const data = {
      dato: {
        idproducto: idproducto,
        preciocosto:preciocosto,
        margenutilidad:porcentanjeUtilidad,
        preciosinimp:preciosinimp,
        igv:porcentImpuesto,
        preciofinal:precioconimp,
        preciounitario:preciounitario,
        idunidadmedida:unidadMedida,
        redondeo:redondeo
      },
    };
    return this.http
      .post<any>(urlEndpoint, data, { headers: this.headersSeguridad })
      .pipe(map((res) => res));
  }

  eliminaProducto(idproducto): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization","Bearer " + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePath + "/eliminar-producto";
    const data = {
      dato: {
        idproducto: idproducto,
      },
    };
    return this.http
      .post<any>(urlEndpoint, data, { headers: this.headersSeguridad })
      .pipe(map((res) => res));
  }

  listaProductoGrupoPrecio(idproducto,nombre,totalFilasPorPage,nroPage): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization","Bearer " + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePath + "/listar-producto-grupo-precio";
    const data = {
      dato: {
        idproducto: idproducto,
        nombre: nombre,
        totalFilasPorPage: totalFilasPorPage,
        nroPage: nroPage,
      },
    };
    return this.http
      .post<any>(urlEndpoint, data, { headers: this.headersSeguridad })
      .pipe(map((res) => res));
  }

  procesaProductoGrupoPrecio(
    tipoaccion,
    idproductogrupoprecio,
    idproducto,
    nombre,
    tipoaplicacion,
    idclientegrupo,
    ilimitado,
    fechainicio,
    fechafin,
    tipocantidad,
    cantidad,
    tipodcto,
    descuento
  ): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization","Bearer " + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePath + "/procesa-producto-grupo-precio";
    const data = {
      dato: {
        tipoaccion:tipoaccion,
        idproductogrupoprecio:idproductogrupoprecio,
        idproducto: idproducto,
        nombre:nombre,
        tipoaplicacion:tipoaplicacion,
        idclientegrupo:idclientegrupo,
        ilimitado:ilimitado,
        fechainicio:fechainicio,
        fechafin:fechafin,
        tipocantidad:tipocantidad,
        cantidad:cantidad,
        tipodcto:tipodcto,
        descuento:descuento
      },
    };
    return this.http
      .post<any>(urlEndpoint, data, { headers: this.headersSeguridad })
      .pipe(map((res) => res));
  }

  eliminaProductoGrupoPrecio(idproductogrupoprecio): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization","Bearer " + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePath + "/eliminar-producto-grupo-precio";
    const data = {
      dato: {
        idproductogrupoprecio: idproductogrupoprecio,
      },
    };
    return this.http
      .post<any>(urlEndpoint, data, { headers: this.headersSeguridad })
      .pipe(map((res) => res));
  }

  listaProductoCaracteristica(idproducto,abreviatura): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization","Bearer " + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePath + "/listar-producto-caracteristica";
    const data = {
      dato: {
        idproducto: idproducto,
        abreviatura: abreviatura,
      },
    };
    return this.http
      .post<any>(urlEndpoint, data, { headers: this.headersSeguridad })
      .pipe(map((res) => res));
  }

  procesaProductoDetalle(
    tipoaccion,
    idproductodetalle,
    idproducto,
    nombre,
  ): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization","Bearer " + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePath + "/procesa-producto-detalle";
    const data = {
      dato: {
        tipoaccion:tipoaccion,
        idproductodetalle:idproductodetalle,
        idproducto: idproducto,
        nombre:nombre,
      },
    };
    return this.http
      .post<any>(urlEndpoint, data, { headers: this.headersSeguridad })
      .pipe(map((res) => res));
  }

  eliminaProductoDetalle(idproductodetalle): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization","Bearer " + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePath + "/eliminar-producto-detalle";
    const data = {
      dato: {
        idproductodetalle: idproductodetalle,
      },
    };
    return this.http
      .post<any>(urlEndpoint, data, { headers: this.headersSeguridad })
      .pipe(map((res) => res));
  }

  listaProductoDetalle(idproducto,nombre,totalFilasPorPage,nroPage): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization","Bearer " + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePath + "/listar-producto-detalle";
    const data = {
      dato: {
        idproducto: idproducto,
        nombre: nombre,
        totalFilasPorPage:totalFilasPorPage,
        nroPage:nroPage
      },
    };
    return this.http
      .post<any>(urlEndpoint, data, { headers: this.headersSeguridad })
      .pipe(map((res) => res));
  }

  listaProductoHistorialPrecios(idproducto): Observable<any> {
    this.headersSeguridad = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization","Bearer " + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePath + "/listar-producto-historial-precio";
    const data = {
      dato: {
        idproducto: idproducto,
      },
    };
    return this.http
      .post<any>(urlEndpoint, data, { headers: this.headersSeguridad })
      .pipe(map((res) => res));
  }
}
