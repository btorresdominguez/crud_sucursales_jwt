import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export interface LoginResponse {
  token: string;
  usuario: string;
  roles: string[];
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'https://localhost:7036/api/Auth/login';
  private tokenKey = 'accesToken';  
  private token: string | null = null;
  constructor(private http: HttpClient) {
   this.token = localStorage.getItem('token');
  }

  login(username: string, password: string) {
    return this.http.post<LoginResponse>(this.apiUrl, { username, password })
      .pipe(
        tap(res => localStorage.setItem(this.tokenKey, res.token)),
        catchError(err => {
          console.error('Error en el login:', err);
          return throwError(err);
        })
      );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
  }

  getToken(): string | null {
  return localStorage.getItem('accesToken'); // Asegúrate de que este valor sea el token correcto
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
