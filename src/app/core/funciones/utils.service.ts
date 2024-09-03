import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { Constantes } from '../constants/constantes';
import { environment } from 'src/environments/environment';
import { enumTipoMensaje } from '../enum/enum-tipo-mensaje.enum';
import { ModalGeneralComponent as  MensajeComponent } from 'src/app/shared/modal-general/modal-general.component';
import { ModalConfirmacionComponent as ConfirmarComponent } from 'src/app/shared/modal-confirmacion/modal-confirmacion.component';
import { StorageService } from '../services/storage.service';
@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  constructor(public dialog: MatDialog, public storageService: StorageService ) { }
  dialogRefConfirmar = null;
  abrirMensaje(titulo, mensaje, tipoMensaje): void {
    const dialogRef = this.dialog.open(MensajeComponent, {
      width: '350px',
      data: { titulo, mensaje, tipoMensaje },
      disableClose: true,
      panelClass: 'style-modal-mensaje'
    });
  }

  abrirMensajeToken(titulo = null, mensaje = null, tipoMensaje = null, error = null): void {
    if (titulo === null) {
      titulo = 'Información';
    }
    if (error !== null) {
      if (error.status === Constantes.CODIGO_ERROR_TOKEN_EXPIRED) {
        //mensaje = error.error.mensaje;
        mensaje = "Token inválido. Vuelva a loguearse.";
        titulo = 'Información';
        tipoMensaje = enumTipoMensaje.ERROR;
      } else if (error.status === Constantes.CODIGO_ERROR_INTERNAL_SERVER_ERROR) {
        //mensaje = error.error.mensaje === undefined ? error.error.message : error.error.mensaje;
        mensaje = error.error.mensajeInteno? error.error.mensajeInteno : error.error.mensaje;
        titulo = 'Error';
        tipoMensaje = enumTipoMensaje.ERROR;
      } else if (error.status === Constantes.CODIGO_ERROR_BAD_REQUEST) {
        titulo = 'Error';
        if (error.error.errors !== null) {
          let msg = '';
          error.error.errors.forEach(element => {
            msg += element.defaultMessage;
          });
          mensaje = msg;
        } else {
          mensaje = error.mensaje;
        }
        tipoMensaje = enumTipoMensaje.ERROR;
      } else if (mensaje === null) {
        tipoMensaje = enumTipoMensaje.ERROR;
        mensaje = '¡Ha ocurrido un error interno.!';
      }
    }
    const dialogRef = this.dialog.open(MensajeComponent, {
      width: '350px',
      data: { titulo, mensaje, tipoMensaje },
      disableClose: true,
      panelClass: 'style-modal-mensaje'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (error !== null) {
        if (error.status === Constantes.CODIGO_ERROR_TOKEN_EXPIRED) {
          console.log("token expirado");
         this.storageService.logout();
        }
      }
    });
  }
  confirmar(mensaje): Observable<any> {
    this.dialogRefConfirmar = this.dialog.open(ConfirmarComponent, {
      width: '350px',
      data: { mensaje },
      disableClose: true,
      panelClass: 'style-modal-confirmar'
    });
    return this.dialogRefConfirmar.componentInstance.onSiEmiter;
  }
  
}
