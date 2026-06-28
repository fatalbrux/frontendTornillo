import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Diagnostico } from '../interfaces/diagnostico.interface';

@Injectable({ providedIn: 'root' })
export class DiagnosticosService {
  private readonly urlBase = 'http://localhost:3000/diagnosticos';
  private readonly http = inject(HttpClient);

  funListar(): Observable<Diagnostico[]> {
    return this.http.get<Diagnostico[]>(this.urlBase);
  }

  funGuardar(dato: Partial<Diagnostico>): Observable<Diagnostico> {
    return this.http.post<Diagnostico>(this.urlBase, dato);
  }

  funEditar(dato: Partial<Diagnostico>, id: number): Observable<Diagnostico> {
    return this.http.patch<Diagnostico>(`${this.urlBase}/${id}`, dato);
  }

  funEliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlBase}/${id}`);
  }
}