import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Categoria } from '../interfaces/categoria.interface';

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  // Asegúrate de que la URL coincida con tu backend NestJS
  private readonly urlBase = 'http://localhost:3000/categorias'; 
  private readonly http = inject(HttpClient);

  funListar(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.urlBase);
  }

  funGuardar(dato: Partial<Categoria>): Observable<Categoria> {
    return this.http.post<Categoria>(this.urlBase, dato);
  }

  funEditar(dato: Partial<Categoria>, id: number): Observable<Categoria> {
    return this.http.patch<Categoria>(`${this.urlBase}/${id}`, dato);
  }

  funEliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlBase}/${id}`);
  }
}