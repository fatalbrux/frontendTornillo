import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AuthResponse } from '../interfaces/auth.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly urlBase = 'http://localhost:3000/auth';
  private readonly http = inject(HttpClient);
  
  public currentUser = signal<AuthResponse['user'] | null>(null);

  funLogin(credenciales: { ci: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.urlBase}/login`, credenciales).pipe(
      tap(res => {
        localStorage.setItem('token', res.access_token);
        this.currentUser.set(res.user);
      })
    );
  }

  funLogout(): void {
    localStorage.removeItem('token');
    this.currentUser.set(null);
  }

  funObtenerToken(): string | null {
    return localStorage.getItem('token');
  }
}