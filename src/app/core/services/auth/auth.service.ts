import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Session } from '../../models/session.model';
import { StorageService } from '../storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _token: string;
  session: Session = new Session();
  private basePath = environment.baseURL + 'oauth';
  private basePathUsuarioSist = environment.baseURL + 'api/usuario-sistema';

  private headers = new HttpHeaders();
  
  private headersSinSeguridad = new HttpHeaders();
  constructor(
    private http: HttpClient,
    private router: Router,
    private snackbar: MatSnackBar,
    private storageService: StorageService
  ) {
    this.session = this.storageService.getCurrentSession();
    /*this.headersSinSeguridad = new HttpHeaders()
    .set('Content-Type', 'application/json');*/
  }

  captcha_key_v2(): string {
   return  environment.CAPTCHA_KEY_V2;
  }

  captcha_secret_v2(): string {
    return  environment.CAPTCHA_SECRET_V2;
  }
   
  captcha_key_v3(): string {
    return  environment.CAPTCHA_KEY_V3;
  }

  captcha_secret_v3(): string {
    return  environment.CAPTCHA_SECRET_V3;
  }

  login(usuario,contrasenia): Observable<any> {
    const urlEndpoint = this.basePath + '/token';
    const credenciales = btoa('angularapp:12345');
    const httpHeadersLog = new HttpHeaders({
      'Content-Type' : 'application/x-www-form-urlencoded',
      'Authorization' : 'Basic ' + credenciales
    });

    let params = new URLSearchParams();
    params.set('username',usuario);
    params.set('password',contrasenia);
    params.set('grant_type','password');
    return this.http.post<any>(urlEndpoint,
      params, { headers: httpHeadersLog })
      .pipe(
        map(res => res)
      );
  }

  obtenerPerfil(token): Observable<any> {
    this.headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Authorization', 'Bearer ' + token);
    const urlEndpoint = this.basePathUsuarioSist + '/verifica-perfil';
    const data = {
      "dato":{

      }
    };
    return this.http.post<any>(urlEndpoint,
      data, { headers: this.headers })
      .pipe(
        map(res => res)
      );
  }

  listarMenu(idPerfil,opcionPadre,token): Observable<any> {
    this.headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Authorization', 'Bearer ' + token);
    const urlEndpoint = this.basePathUsuarioSist + '/obtiene-menu';
    const data = {
      "dato":{
        "idperfil":idPerfil,
		    "idopcionpadre":opcionPadre,
      }
    };
    return this.http.post<any>(urlEndpoint,
      data, { headers: this.headers })
      .pipe(
        map(res => res)
      );
  }

  verificaAuthenticated(): boolean {
    if (!this.storageService.isAuthenticated()){
      this.snackbar.open('Ingrese sus credenciales de acceso', null, {
        duration: 10000
      });
      return false;
    } 
    return true;
  }

  /*refreshToken(): Observable<any> {
    this.headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.storageService.getCurrentSession().token);
    const urlEndpoint = this.basePath + '/refresh-token';
    const data = {
    };
    return this.http.post<any>(urlEndpoint,
      data, { headers: this.headers })
      .pipe(
        map(res => res)
      );
  }*/

}
