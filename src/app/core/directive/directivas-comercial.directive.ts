import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { timer } from 'rxjs';

@Directive({
  selector: '[vexDirectivasComercial]'
})

export class DirectivasComercialDirective {
  @Input('entrada') entrada = 'string';
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home'];
  constructor(private el: ElementRef) { }

  private checkearTipoEntrada(value): RegExpMatchArray {
    let retorno: RegExpMatchArray;
    switch (this.entrada) {
      case 'cadena':
        retorno = String(value).match(new RegExp(/^[a-zA-Z0-9ñÑ]*$/g));
        break;
      case 'numero':
        retorno = String(value).match(new RegExp(/^[0-9]+(\.[0-9]*){0,1}$/g));
        break;
      case 'onlynumero':
        retorno = String(value).match(new RegExp(/^[0-9]*$/g));
        break;
      default:
        break;
    }
    return retorno;
  }

  private run(oldValue) {
    timer(0).subscribe(
      () => {
        const currentValue: string = this.el.nativeElement.value;
        if (currentValue !== '' && !this.checkearTipoEntrada(currentValue)) {
          this.el.nativeElement.value = oldValue;
        }
      }
    )
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    const current: string = this.el.nativeElement.value;
    const next: string = current.concat(event.key);
    if (next && !this.checkearTipoEntrada(next)) {
      event.preventDefault();
    }
    // this.run(this.el.nativeElement.value);
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    const current = this.el.nativeElement.value;
    const next: string = current.concat(event.clipboardData.getData('text/plain'));
    if (next && !this.checkearTipoEntrada(next)) {
      event.preventDefault();
    }
  }
}
