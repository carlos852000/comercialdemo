import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService,
              private router: Router){
  }

  canActivate(): boolean  {
    if (this.auth.verificaAuthenticated()){
      console.log("TRUE")
      return true; 
    } else {
      this.router.navigateByUrl('/login');
      console.log("FALSE")
      return false;
    }
  }
  
}
