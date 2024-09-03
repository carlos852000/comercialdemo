import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { Session } from '../models/session.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private localStorageService;
  private currentSession: Session = null;

  constructor(private router: Router) {
    this.localStorageService = localStorage;
    this.currentSession = this.loadSessionData();
  }
  
  loadSessionData(): Session {
    const sessionStr = this.localStorageService.getItem(
      environment._JWT_TOKEN_AUTH
    );
    return sessionStr ? (JSON.parse(sessionStr) as Session) : null;
  }
  
  setCurrentSession(session: Session): void {
    this.currentSession = session;
    this.localStorageService.setItem(
      environment._JWT_TOKEN_AUTH,
      JSON.stringify(session)
    );
  }

  getCurrentSession(): Session {
    return this.currentSession;
  }
  
  isAuthenticated(): boolean {
    return this.getCurrentSession()?.token != null ? true : false;
  }

  logout(): void {
    this.removeCurrentSession();
  }

  removeCurrentSession(): void {
    this.localStorageService.removeItem(environment._JWT_TOKEN_AUTH);
    this.currentSession = null;
    this.router.navigateByUrl('/login');
  }


}
