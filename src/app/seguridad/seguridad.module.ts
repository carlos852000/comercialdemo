import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SeguridadRoutingModule } from './seguridad-routing.module';
import { LoginComponent } from './auth/login/login.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { IconModule } from '@visurel/iconify-angular';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ListaPerfilComponent } from './auth/lista-perfil/lista-perfil.component';

@NgModule({
  declarations: [
    LoginComponent,
    ForgotPasswordComponent,
    ListaPerfilComponent
  ],
  imports: [
    CommonModule,
    SeguridadRoutingModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatSelectModule,
    IconModule,
    MatTooltipModule,
    MatButtonModule,
    MatCheckboxModule
  ],
  entryComponents: [
    ListaPerfilComponent
  ]
})
export class SeguridadModule { }
