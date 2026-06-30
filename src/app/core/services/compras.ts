import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Compra } from '../interfaces/compra.interface';

@Injectable({ providedIn: 'root' })
export class CompraService {
  private readonly urlBase = 'http://localhost:3000/compras';
  private readonly http = inject(HttpClient);

  funListar(): Observable<Compra[]> {
    return this.http.get<Compra[]>(this.urlBase);
  }

  funObtenerUno(id: number): Observable<Compra> {
    return this.http.get<Compra>(`${this.urlBase}/${id}`);
  }

  funGuardar(dato: Partial<Compra>): Observable<Compra> {
    return this.http.post<Compra>(this.urlBase, dato);
  }

  funEditar(dato: Partial<Compra>, id: number): Observable<Compra> {
    return this.http.patch<Compra>(`${this.urlBase}/${id}`, dato);
  }

  funEliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlBase}/${id}`);
  }
}