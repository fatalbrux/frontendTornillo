import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../interfaces/usuario.interface';

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  private readonly urlBase = 'http://localhost:3000/usuarios';
  private readonly http = inject(HttpClient);

  funListar(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.urlBase);
  }

  funGuardar(dato: Partial<Usuario>): Observable<Usuario> {
    return this.http.post<Usuario>(this.urlBase, dato);
  }

  funEditar(dato: Partial<Usuario>, id: number): Observable<Usuario> {
    return this.http.patch<Usuario>(`${this.urlBase}/${id}`, dato);
  }

  funEliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlBase}/${id}`);
  }
}