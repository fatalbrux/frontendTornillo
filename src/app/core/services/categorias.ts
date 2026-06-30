import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Categoria } from '../interfaces/categoria.interface';

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private readonly urlBase = 'http://localhost:3000/categorias';
  private readonly http = inject(HttpClient);

  funListar(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.urlBase);
  }

  funObtenerUno(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.urlBase}/${id}`);
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