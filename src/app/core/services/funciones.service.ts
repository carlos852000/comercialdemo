import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { Constantes } from '../constants/constantes';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FuncionesService {

  headers = new HttpHeaders();
  constructor(
      public dialog: MatDialog,
      private datePipe: DatePipe,
      private router: Router,
      private http:HttpClient
  ) {
  }

  formatearFechaBD(valor: any){
    if (valor) {
      return this.datePipe.transform(valor, 'dd/MM/yyyy');
    } else {
      return '';
    }
  }

  formatearFecha(valor: any){
    var orig = valor.split("/");
    return new Date(orig[2], orig[1] - 1, orig[0]);
  }

}
