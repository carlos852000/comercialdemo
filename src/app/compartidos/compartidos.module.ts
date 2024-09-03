import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DirectivasComercialDirective } from '../core/directive/directivas-comercial.directive';

@NgModule({
  declarations: [DirectivasComercialDirective],
  imports: [
    CommonModule
  ],
  exports: [DirectivasComercialDirective],
})
export class CompartidosModule { }
