import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Moneda {
  id: number;
  codigo: string;
  descripcion: string;
}

@Injectable({
  providedIn: 'root'
})
export class MonedaService {
  private apiUrl = 'https://localhost:7036/api/Monedas';

  constructor(private http: HttpClient) { }

  /** Obtiene todas las monedas activas */
  getMonedas(): Observable<Moneda[]> {
    return this.http.get<Moneda[]>(this.apiUrl);
  }
}
