import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Factura } from '../interfaces/factura.interface';

@Injectable({ providedIn: 'root' })
export class FacturaService {
  private readonly urlBase = 'http://localhost:3000/facturas';
  private readonly http = inject(HttpClient);

  funListar(): Observable<Factura[]> {
    return this.http.get<Factura[]>(this.urlBase);
  }

  funObtenerUno(id: number): Observable<Factura> {
    return this.http.get<Factura>(`${this.urlBase}/${id}`);
  }

  funGuardar(dato: Partial<Factura>): Observable<Factura> {
    return this.http.post<Factura>(this.urlBase, dato);
  }

  funEditar(dato: Partial<Factura>, id: number): Observable<Factura> {
    return this.http.patch<Factura>(`${this.urlBase}/${id}`, dato);
  }

  funEliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlBase}/${id}`);
  }
}