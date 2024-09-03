import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { MatIconModule } from '@angular/material/icon';
import { IconModule } from '@visurel/iconify-angular';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { ModalGeneralComponent } from './modal-general/modal-general.component';
import { ModalConfirmacionComponent } from './modal-confirmacion/modal-confirmacion.component';

@NgModule({
  declarations: [
    ConfirmationComponent,
    ModalGeneralComponent,
    ModalConfirmacionComponent
  ],
  imports: [
    CommonModule,
    IconModule,
    MatIconModule,
    MatToolbarModule,
    MatToolbarModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatDialogModule,
  ]
})
export class SharedModule { }
