import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PopoverService } from '../../../components/popover/popover.service';
import { ToolbarUserDropdownComponent } from './toolbar-user-dropdown/toolbar-user-dropdown.component';
import icPerson from '@iconify/icons-ic/twotone-person';
import { Session } from 'src/app/core/models/session.model';
import { StorageService } from 'src/app/core/services/storage.service';
import { PermisoService } from 'src/app/core/services/permisos.service';
import { UtilsService } from 'src/app/core/funciones/utils.service';
import { ToolbarUserDropdownAdminComponent } from './toolbar-user-dropdown-admin/toolbar-user-dropdown-admin.component';

@Component({
  selector: 'vex-toolbar-user',
  templateUrl: './toolbar-user.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolbarUserComponent implements OnInit {

  dataUsuario: Session;
  dropdownOpen: boolean;
  icPerson = icPerson;

  validandoPermiso = false;
  moduloOpcion = "modsegsistema";

  constructor(
    private popover: PopoverService,
    private storageService: StorageService,
    private permisosService: PermisoService,
    private utilsService: UtilsService,
    private cd: ChangeDetectorRef) { 
      this.dataUsuario = this.storageService.getCurrentSession();
    }

  ngAfterContentInit(): void { 
    this.validandoPermiso = false;
    this.permisosService.validaPermisosForms(this.dataUsuario.idperfil,this.moduloOpcion).subscribe(response =>{
      if (response.dato.permiso == 1) {
        this.validandoPermiso = true;
      } else {
        this.validandoPermiso = false;
      }
    }, error => {
      this.validandoPermiso = false;
      this.utilsService.abrirMensajeToken(null, null, null, error);
    });
  }

  ngOnInit() {
  }

  showPopover(originRef: HTMLElement) {
    this.dropdownOpen = true;
    this.cd.markForCheck();
    var popoverRef = null;
    if (this.validandoPermiso) {
      popoverRef = this.popover.open({
        content: ToolbarUserDropdownAdminComponent,
        origin: originRef,
        offsetY: 12,
        position: [
          {
            originX: 'center',
            originY: 'top',
            overlayX: 'center',
            overlayY: 'bottom'
          },
          {
            originX: 'end',
            originY: 'bottom',
            overlayX: 'end',
            overlayY: 'top',
          },
        ]
      });
    } else {
      popoverRef = this.popover.open({
        content: ToolbarUserDropdownComponent,
        origin: originRef,
        offsetY: 12,
        position: [
          {
            originX: 'center',
            originY: 'top',
            overlayX: 'center',
            overlayY: 'bottom'
          },
          {
            originX: 'end',
            originY: 'bottom',
            overlayX: 'end',
            overlayY: 'top',
          },
        ]
      });
    }
    popoverRef.afterClosed$.subscribe(() => {
      this.dropdownOpen = false;
      this.cd.markForCheck();
    });
    
  }
}
