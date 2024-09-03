import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";

import { InicioRoutingModule } from "./inicio-routing.module";
import { InicioComponent } from "./inicio.component";
import { FlexLayoutModule } from "@angular/flex-layout";
import { PageLayoutModule } from "../../@vex/components/page-layout/page-layout.module";
import { PrincipalComponent } from "./principal/principal.component";
import { LayoutModule } from "../../@vex/layout/layout.module";
import { MatInputModule } from "@angular/material/input";

import { MatSelectModule } from "@angular/material/select";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatTabsModule } from "@angular/material/tabs";
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from "@angular/material/form-field";
import { MatSliderModule } from "@angular/material/slider";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatRadioModule } from "@angular/material/radio";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatTableModule } from "@angular/material/table";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatDialogModule } from "@angular/material/dialog";
import { MatMenuModule } from "@angular/material/menu";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { IconModule } from "@visurel/iconify-angular";
import { SidenavModule } from "../../@vex/layout/sidenav/sidenav.module";
import { ToolbarModule } from "../../@vex/layout/toolbar/toolbar.module";
import { FooterModule } from "../../@vex/layout/footer/footer.module";
import { ConfigPanelModule } from "../../@vex/components/config-panel/config-panel.module";
import { SidebarModule } from "../../@vex/components/sidebar/sidebar.module";
import { QuickpanelModule } from "../../@vex/layout/quickpanel/quickpanel.module";
import {MatChipsModule} from '@angular/material/chips';
import { SecondaryToolbarModule } from "../../@vex/components/secondary-toolbar/secondary-toolbar.module";
import { BreadcrumbsModule } from "../../@vex/components/breadcrumbs/breadcrumbs.module";
import { ContainerModule } from "../../@vex/directives/container/container.module";
import { ReactiveFormsModule } from "@angular/forms";
import { PerfilComponent } from "./perfil/perfil.component";
import { SeguridadComponent } from "./seguridad/seguridad.component";
import { SistemaComponent } from "./seguridad/sistema/sistema.component";
import { SperfilComponent } from "./seguridad/sperfil/sperfil.component";
import { SperfilRegistroComponent } from "./seguridad/sperfil/sperfil-registro/sperfil-registro.component";
import { UsuarioComponent } from "./seguridad/usuario/usuario.component";
import { SusuarioRegistroComponent } from "./seguridad/usuario/susuario-registro/susuario-registro.component";
import { CompartidosModule } from "../compartidos/compartidos.module";
import { OpcionComponent } from "./seguridad/opcion/opcion.component";
import { ComercialComponent } from './comercial/comercial.component';
import { GeneralComponent } from './general/general.component';
import { ProductoComponent } from './comercial/producto/producto.component';
import { ProveedorComponent } from './comercial/proveedor/proveedor.component';
import { GestionarProductoComponent } from './comercial/producto/gestionar-producto/gestionar-producto.component';
import { SopcionRegistroComponent } from './seguridad/opcion/sopcion-registro/sopcion-registro.component';
import { SaccesoComponent } from './seguridad/sacceso/sacceso.component';
import { SaccesoRegistroComponent } from './seguridad/sacceso/sacceso-registro/sacceso-registro.component';
import { SusuarioPerfilComponent } from './seguridad/usuario/susuario-perfil/susuario-perfil.component';
import { MiperfilComponent } from './seguridad/miperfil/miperfil.component';
import { ActualizaClaveComponent } from './seguridad/miperfil/actualiza-clave/actualiza-clave.component';
import { SbotonBandejaComponent } from './seguridad/opcion/sboton-bandeja/sboton-bandeja.component';
import { SbotonRegistroComponent } from './seguridad/opcion/sboton-registro/sboton-registro.component';
import { SbotonesAccesoComponent } from './seguridad/sacceso/sbotones-acceso/sbotones-acceso.component';
import { TiendasComponent } from './general/tiendas/tiendas.component';
import { StiendaRegistroComponent } from './general/tiendas/stienda-registro/stienda-registro.component';
import { ConfsistemasComponent } from './general/confsistemas/confsistemas.component';
import { ConfcatalogoComponent } from './general/confcatalogo/confcatalogo.component';
import { ConfrubrosComponent } from './general/confrubros/confrubros.component';
import { GrubrosRegistroComponent } from './general/confrubros/grubros-registro/grubros-registro.component';
import { GrubrosUnidadMedidaComponent } from './general/confrubros/grubros-unidad-medida/grubros-unidad-medida.component';
import { GrubrosCaracteristicasComponent } from './general/confrubros/grubros-caracteristicas/grubros-caracteristicas.component';
import { GcatalogoRegistroComponent } from './general/confcatalogo/gcatalogo-registro/gcatalogo-registro.component';
import { ClienteComponent } from './comercial/cliente/cliente.component';
import { ClienteRegistroComponent } from './comercial/cliente/cliente-registro/cliente-registro.component';
import { MondalCatalogoComponent } from "./comercial/producto/mondal-catalogo/mondal-catalogo.component";
import { CproveedorRegistroComponent } from './comercial/proveedor/cproveedor-registro/cproveedor-registro.component';
import { ClienteGrupoComponent } from './comercial/cliente-grupo/cliente-grupo.component';
import { ClienteGrupoRegistroComponent } from './comercial/cliente-grupo/cliente-grupo-registro/cliente-grupo-registro.component';
import { ClienteBuscarComponent } from './comercial/cliente/cliente-buscar/cliente-buscar.component';
import { GrubrosCaracteristicasDetalleComponent } from './general/confrubros/grubros-caracteristicas-detalle/grubros-caracteristicas-detalle.component';
import { ListarProductoPrecioGrupoComponent } from './comercial/producto/listar-producto-precio-grupo/listar-producto-precio-grupo.component';
import { RegistroProductoPrecioGrupoComponent } from './comercial/producto/registro-producto-precio-grupo/registro-producto-precio-grupo.component';
import { DatePipe, CurrencyPipe } from "@angular/common";
import { ListarProductoDetalleComponent } from './comercial/producto/listar-producto-detalle/listar-producto-detalle.component';
import { RegistroProductoDetalleComponent } from './comercial/producto/registro-producto-detalle/registro-producto-detalle.component';
import { HistorialPreciosComponent } from './comercial/producto/historial-precios/historial-precios.component';
import { ComprasComponent } from './comercial/compras/compras.component';
import { GestionarCompraComponent } from './comercial/compras/gestionar-compra/gestionar-compra.component';
import { AgregarProductoComponent } from './comercial/compras/agregar-producto/agregar-producto.component';
import { PrecioProductoComponent } from './comercial/precio-producto/precio-producto.component';
import { ModalPrecioComponent } from './comercial/precio-producto/modal-precio/modal-precio.component';
import { AlmacenComponent } from './comercial/almacen/almacen.component';
import { MatCardModule } from '@angular/material/card';
import { IngresoCompraComponent } from './comercial/almacen/ingreso-compra/ingreso-compra.component';
import { IngresoCompraFormularioComponent } from './comercial/almacen/ingreso-compra/ingreso-compra-formulario/ingreso-compra-formulario.component';
import { KardexComponent } from './comercial/almacen/kardex/kardex.component';
import { KardexBandejaComponent } from './comercial/almacen/kardex/kardex-bandeja/kardex-bandeja.component';
import { IngresoTransferenciasComponent } from './comercial/almacen/ingreso-transferencias/ingreso-transferencias.component';
import { SalidaTransferenciaComponent } from './comercial/almacen/salida-transferencia/salida-transferencia.component';
import { SalidaTransferenciaFormularioComponent } from './comercial/almacen/salida-transferencia/salida-transferencia-formulario/salida-transferencia-formulario.component';
import { IngresoTransferenciasFormularioComponent } from './comercial/almacen/ingreso-transferencias/ingreso-transferencias-formulario/ingreso-transferencias-formulario.component';
import { AddProductosComponent } from './comercial/producto/add-productos/add-productos.component';

@NgModule({
  declarations: [
    InicioComponent,
    PrincipalComponent,
    PerfilComponent,
    SeguridadComponent,
    SistemaComponent,
    SperfilComponent,
    SperfilRegistroComponent,
    UsuarioComponent,
    SusuarioRegistroComponent,
    OpcionComponent,
    ComercialComponent,
    GeneralComponent,
    ProductoComponent,
    ProveedorComponent,
    GestionarProductoComponent,
    SopcionRegistroComponent,
    SaccesoComponent,
    SaccesoRegistroComponent,
    SusuarioPerfilComponent,
    MiperfilComponent,
    MondalCatalogoComponent,
    ActualizaClaveComponent,
    SbotonBandejaComponent,
    SbotonRegistroComponent,
    SbotonesAccesoComponent,
    TiendasComponent,
    StiendaRegistroComponent,
    ConfsistemasComponent,
    ConfcatalogoComponent,
    ConfrubrosComponent,
    GrubrosRegistroComponent,
    GrubrosUnidadMedidaComponent,
    GrubrosCaracteristicasComponent,
    GcatalogoRegistroComponent,
    ClienteComponent,
    ClienteRegistroComponent,
    CproveedorRegistroComponent,
    ClienteGrupoComponent,
    ClienteGrupoRegistroComponent,
    ClienteBuscarComponent,
    GrubrosCaracteristicasDetalleComponent,
    ListarProductoPrecioGrupoComponent,
    RegistroProductoPrecioGrupoComponent,
    ListarProductoDetalleComponent,
    RegistroProductoDetalleComponent,
    HistorialPreciosComponent,
    ComprasComponent,
    GestionarCompraComponent,
    AgregarProductoComponent,
    PrecioProductoComponent,
    ModalPrecioComponent,
    AlmacenComponent,
    IngresoCompraComponent,
    IngresoCompraFormularioComponent,
    KardexComponent,
    KardexBandejaComponent,
    IngresoTransferenciasComponent,
    SalidaTransferenciaComponent,
    SalidaTransferenciaFormularioComponent,
    IngresoTransferenciasFormularioComponent,
    AddProductosComponent,
  ],
  imports: [
    CompartidosModule,
    CommonModule,
    InicioRoutingModule,
    LayoutModule,
    FlexLayoutModule,
    SidenavModule,
    ToolbarModule,
    FooterModule,
    ConfigPanelModule,
    SidebarModule,
    QuickpanelModule,
    MatIconModule,
    MatProgressSpinnerModule,
    IconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatAutocompleteModule,
    MatSlideToggleModule,
    MatPaginatorModule,
    MatTableModule,
    MatTooltipModule,
    MatButtonModule,
    MatDividerModule,
    MatSliderModule,
    MatCheckboxModule,
    MatRadioModule,
    MatInputModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatDialogModule,
    MatMenuModule,
    SecondaryToolbarModule,
    ContainerModule,
    BreadcrumbsModule,
    PageLayoutModule,
    MatChipsModule,
    MatCardModule
  ],
  entryComponents: [SperfilRegistroComponent, SopcionRegistroComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'fill'}},
    DatePipe, CurrencyPipe
  ]
})
export class InicioModule {}
