import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Insumo } from '../interfaces/insumo.interface'; // Importa la interfaz que creamos antes

@Injectable({ providedIn: 'root' })
export class InsumosService {
  // Asegúrate de que la URL coincida con tu backend NestJS
  private readonly urlBase = 'http://localhost:3000/insumos'; 
  private readonly http = inject(HttpClient);

  funListar(): Observable<Insumo[]> {
    return this.http.get<Insumo[]>(this.urlBase);
  }

  funGuardar(dato: Partial<Insumo>): Observable<Insumo> {
    return this.http.post<Insumo>(this.urlBase, dato);
  }

  funEditar(dato: Partial<Insumo>, id: number): Observable<Insumo> {
    return this.http.patch<Insumo>(`${this.urlBase}/${id}`, dato);
  }

  funEliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlBase}/${id}`);
  }
}