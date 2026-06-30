import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UnidadMedida } from '../interfaces/unidad-medida.interface';

@Injectable({ providedIn: 'root' })
export class UnidadMedidaService {
  private readonly urlBase = 'http://localhost:3000/unidades-medida';
  private readonly http = inject(HttpClient);

  funListar(): Observable<UnidadMedida[]> {
    return this.http.get<UnidadMedida[]>(this.urlBase);
  }

  funObtenerUno(id: number): Observable<UnidadMedida> {
    return this.http.get<UnidadMedida>(`${this.urlBase}/${id}`);
  }

  funGuardar(dato: Partial<UnidadMedida>): Observable<UnidadMedida> {
    return this.http.post<UnidadMedida>(this.urlBase, dato);
  }

  funEditar(dato: Partial<UnidadMedida>, id: number): Observable<UnidadMedida> {
    return this.http.patch<UnidadMedida>(`${this.urlBase}/${id}`, dato);
  }

  funEliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlBase}/${id}`);
  }
}