import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Lote } from '../interfaces/lote.interface';

@Injectable({ providedIn: 'root' })
export class LoteService {
  private readonly urlBase = 'http://localhost:3000/lotes';
  private readonly http = inject(HttpClient);

  funListar(): Observable<Lote[]> {
    return this.http.get<Lote[]>(this.urlBase);
  }

  funObtenerUno(id: number): Observable<Lote> {
    return this.http.get<Lote>(`${this.urlBase}/${id}`);
  }

  funGuardar(dato: Partial<Lote>): Observable<Lote> {
    return this.http.post<Lote>(this.urlBase, dato);
  }

  funEditar(dato: Partial<Lote>, id: number): Observable<Lote> {
    return this.http.patch<Lote>(`${this.urlBase}/${id}`, dato);
  }

  funEliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlBase}/${id}`);
  }
}