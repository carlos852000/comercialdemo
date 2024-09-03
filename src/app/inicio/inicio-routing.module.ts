import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { VexRoutes } from "src/@vex/interfaces/vex-route.interface";
import { PerfilComponent } from "./perfil/perfil.component";
import { PrincipalComponent } from "./principal/principal.component";
import { SistemaComponent } from "./seguridad/sistema/sistema.component";
import { SperfilComponent } from "./seguridad/sperfil/sperfil.component";
import { UsuarioComponent } from "./seguridad/usuario/usuario.component";
import { OpcionComponent } from "./seguridad/opcion/opcion.component";
import { ProductoComponent } from "./comercial/producto/producto.component";
import { SaccesoComponent } from './seguridad/sacceso/sacceso.component';
import { MiperfilComponent } from "./seguridad/miperfil/miperfil.component";
import { TiendasComponent } from "./general/tiendas/tiendas.component";
import { ConfsistemasComponent } from "./general/confsistemas/confsistemas.component";
import { ConfcatalogoComponent } from "./general/confcatalogo/confcatalogo.component";
import { ConfrubrosComponent } from "./general/confrubros/confrubros.component";
import { ClienteComponent } from "./comercial/cliente/cliente.component";
import { ProveedorComponent } from "./comercial/proveedor/proveedor.component";
import { ClienteGrupoComponent } from "./comercial/cliente-grupo/cliente-grupo.component";
import { ComprasComponent } from "./comercial/compras/compras.component";
import { PrecioProductoComponent } from "./comercial/precio-producto/precio-producto.component";
import { AlmacenComponent } from "./comercial/almacen/almacen.component";

const routes: VexRoutes = [
  {
    path: "",
    redirectTo: "principal",
    pathMatch: "full",
  },
  {
    path: "principal",
    component: PrincipalComponent,
    data: {
      //scrollDisabled: true,
      toolbarShadowEnabled: false,
    },
    children: [
      {
        path: "",
        redirectTo: "perfil",
        pathMatch: "full",
      },
      {
        path: "perfil",
        component: PerfilComponent,
      },
      {
        path: "sistema",
        component: SistemaComponent,
      },
      {
        path: "sperfil",
        component: SperfilComponent,
      },
      {
        path: "opcion",
        component: OpcionComponent,
      },
      {
        path: "acceso",
        component: SaccesoComponent,
      },
      {
        path: "usuario",
        component: UsuarioComponent,
      },
      {
        path: "miperfil",
        component: MiperfilComponent,
      },
    ],
  },
  {
    path: "general",
    component: PrincipalComponent,
    data: {
      //scrollDisabled: true,
      toolbarShadowEnabled: false,
    },
    children: [
      {
        path: "configuracion",
        component: ConfsistemasComponent,
      },
      {
        path: "tiendas",
        component: TiendasComponent,
      },
      {
        path: "catalogo",
        component: ConfcatalogoComponent,
      },
      {
        path: "rubros",
        component: ConfrubrosComponent,
      },
    ],
  },
  {
    path: "comercial",
    component: PrincipalComponent,
    data: {
      //scrollDisabled: true,
      toolbarShadowEnabled: false,
    },
    children: [
      {
        path: "cliente",
        component: ClienteComponent,
      },
      {
        path: "producto",
        component: ProductoComponent,
      },
      {
        path: "proveedor",
        component: ProveedorComponent,
      },
      {
        path: "clientegrupo",
        component: ClienteGrupoComponent,
      },
      {
        path: "compras",
        component: ComprasComponent,
      },
      {
        path: "precio-producto",
        component: PrecioProductoComponent,
      },
      {
        path: "mercaderia",
        component: AlmacenComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InicioRoutingModule { }
