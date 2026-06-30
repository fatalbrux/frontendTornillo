import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pago } from '../interfaces/pago.interface';

@Injectable({ providedIn: 'root' })
export class PagoService {
  private readonly urlBase = 'http://localhost:3000/pagos';
  private readonly http = inject(HttpClient);

  funListar(): Observable<Pago[]> {
    return this.http.get<Pago[]>(this.urlBase);
  }

  funObtenerUno(id: number): Observable<Pago> {
    return this.http.get<Pago>(`${this.urlBase}/${id}`);
  }

  funGuardar(dato: Partial<Pago>): Observable<Pago> {
    return this.http.post<Pago>(this.urlBase, dato);
  }

  funEditar(dato: Partial<Pago>, id: number): Observable<Pago> {
    return this.http.patch<Pago>(`${this.urlBase}/${id}`, dato);
  }

  funEliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlBase}/${id}`);
  }
}