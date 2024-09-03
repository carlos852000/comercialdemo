import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MenuItem } from '../interfaces/menu-item.interface';
import { trackById } from '../../../../utils/track-by';
import icPerson from '@iconify/icons-ic/twotone-person';
import icSettings from '@iconify/icons-ic/twotone-settings';
import icAccountCircle from '@iconify/icons-ic/twotone-account-circle';
import icMoveToInbox from '@iconify/icons-ic/twotone-move-to-inbox';
import icListAlt from '@iconify/icons-ic/twotone-list-alt';
import icTableChart from '@iconify/icons-ic/twotone-table-chart';
import icCheckCircle from '@iconify/icons-ic/twotone-check-circle';
import icAccessTime from '@iconify/icons-ic/twotone-access-time';
import icDoNotDisturb from '@iconify/icons-ic/twotone-do-not-disturb';
import icOfflineBolt from '@iconify/icons-ic/twotone-offline-bolt';
import icChevronRight from '@iconify/icons-ic/twotone-chevron-right';
import icArrowDropDown from '@iconify/icons-ic/twotone-arrow-drop-down';
import icBusiness from '@iconify/icons-ic/twotone-business';
import icVerifiedUser from '@iconify/icons-ic/twotone-verified-user';
import icLock from '@iconify/icons-ic/twotone-lock';
import icNotificationsOff from '@iconify/icons-ic/twotone-notifications-off';
import { Icon } from '@visurel/iconify-angular';
import { PopoverRef } from '../../../../components/popover/popover-ref';
import { StorageService } from 'src/app/core/services/storage.service';
import { Router } from '@angular/router';
import { Session } from 'src/app/core/models/session.model';
import icAssignmentTurnedIn from '@iconify/icons-ic/twotone-assignment-turned-in';
import icChromeReaderMode from '@iconify/icons-ic/twotone-chrome-reader-mode';
import icBallot from '@iconify/icons-ic/twotone-ballot';
import { PermisoService } from 'src/app/core/services/permisos.service';
import { UtilsService } from 'src/app/core/funciones/utils.service';

export interface OnlineStatus {
  id: 'online' | 'away' | 'dnd' | 'offline';
  label: string;
  icon: Icon;
  colorClass: string;
}

@Component({
  selector: 'vex-toolbar-user-dropdown-admin',
  templateUrl: './toolbar-user-dropdown-admin.component.html',
  styleUrls: ['./toolbar-user-dropdown-admin.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolbarUserDropdownAdminComponent implements OnInit {

  dataUsuario: Session;
  items: MenuItem[] = [
    {
      id: '1',
      icon: icAccountCircle,
      label: 'Mi Perfil',
      description: 'Información Personal',
      colorClass: 'text-teal',
      route: '/inicio/principal/miperfil'
    },
    {
      id: '2',
      icon: icMoveToInbox,
      label: 'Mis Mensajes',
      description: 'Mensajes y Notificaciones',
      colorClass: 'text-primary',
      route: '/apps/chat'
    },
  ];

  statuses: OnlineStatus[] = [
    {
      id: 'online',
      label: 'Online',
      icon: icCheckCircle,
      colorClass: 'text-green'
    },
    {
      id: 'away',
      label: 'Away',
      icon: icAccessTime,
      colorClass: 'text-orange'
    },
    {
      id: 'dnd',
      label: 'Do not disturb',
      icon: icDoNotDisturb,
      colorClass: 'text-red'
    },
    {
      id: 'offline',
      label: 'Offline',
      icon: icOfflineBolt,
      colorClass: 'text-gray'
    }
  ];

  activeStatus: OnlineStatus = this.statuses[0];

  trackById = trackById;
  icPerson = icPerson;
  icSettings = icSettings;
  icChevronRight = icChevronRight;
  icArrowDropDown = icArrowDropDown;
  icBusiness = icBusiness;
  icVerifiedUser = icVerifiedUser;
  icAssignmentTurnedIn = icAssignmentTurnedIn;
  icChromeReaderMode = icChromeReaderMode;
  icBallot = icBallot;
  
  icLock = icLock;
  icNotificationsOff = icNotificationsOff;

  constructor(private cd: ChangeDetectorRef,
    private storageService: StorageService,
    private router: Router,
    private popoverRef: PopoverRef<ToolbarUserDropdownAdminComponent>) { 
      this.dataUsuario = this.storageService.getCurrentSession();
    }

  ngOnInit() {
  }

  setStatus(status: OnlineStatus) {
    this.activeStatus = status;
    this.cd.markForCheck();
  }

  redirect() {
    this.popoverRef.close();
  }

  close() {
    this.storageService.logout();
    this.popoverRef.close();
    this.router.navigateByUrl('/login');
  }

  configuracionSistema() {
    this.router.navigateByUrl('inicio/general/configuracion');
    this.popoverRef.close();
  }

  configuracionTiendas() {
    this.router.navigateByUrl('inicio/general/tiendas');
    this.popoverRef.close();
  }

  configuracionCatalogo() {
    this.router.navigateByUrl('inicio/general/catalogo');
    this.popoverRef.close();
  }

  configuracionRubros() {
    this.router.navigateByUrl('inicio/general/rubros');
    this.popoverRef.close();
  }

}
