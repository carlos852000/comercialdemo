import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VexRoutes } from '../@vex/interfaces/vex-route.interface';
import { QuicklinkModule, QuicklinkStrategy } from 'ngx-quicklink';

import { LoginComponent } from './seguridad/auth/login/login.component';
import { ForgotPasswordComponent } from './seguridad/auth/forgot-password/forgot-password.component';
import { InicioComponent } from './inicio/inicio.component';
import { AuthGuard } from './core/guards/guards/auth.guard';

const childrenRoutes: VexRoutes = [
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full',
  },
  {
    path: 'inicio',
    loadChildren: () => import('./inicio/inicio.module').then(m => m.InicioModule),
    canActivate: [ AuthGuard ]
  },
];

const routes: Routes = [
  { 
    path: 'login', 
    component: LoginComponent,
  },
  {
    path: 'recupera-clave',
    component: ForgotPasswordComponent
  },
  {
    path: '',
    component: InicioComponent,
    children: childrenRoutes
  },
  { path: '**', pathMatch: 'full', redirectTo: 'login'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    relativeLinkResolution: 'corrected',
    anchorScrolling: 'enabled',
    enableTracing: true,
    useHash:true
  }),],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
