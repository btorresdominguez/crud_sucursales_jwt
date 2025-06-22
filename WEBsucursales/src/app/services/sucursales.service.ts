import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service'; // Asegúrate de que la ruta sea correcta

export interface Sucursal {
  id: number;
  codigo: string;
  descripcion: string;
  direccion: string;
  identificacion: string;
  fechaCreacion: string;
  idMoneda: number;
  estado: boolean;  
}

@Injectable({
  providedIn: 'root'
})
export class SucursalesService {
  private apiUrl = 'https://localhost:7036/api/Sucursales';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken(); // Obtiene el token
    return new HttpHeaders({
      'Authorization': `Bearer ${token}` // Agrega el token a las cabeceras
    });
  }

  getById(codigo: number): Observable<Sucursal> {
    return this.http.get<Sucursal>(`${this.apiUrl}/${codigo}`, { headers: this.getHeaders() });
  }

  create(sucursal: Partial<Sucursal>): Observable<Sucursal> {
    return this.http.post<Sucursal>(this.apiUrl, sucursal, { headers: this.getHeaders() });
  }

  update(id: number, sucursal: Partial<Sucursal>): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, sucursal, { headers: this.getHeaders() });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  getAll(): Observable<Sucursal[]> {
    return this.http.get<Sucursal[]>(this.apiUrl, { headers: this.getHeaders() });
  }
}