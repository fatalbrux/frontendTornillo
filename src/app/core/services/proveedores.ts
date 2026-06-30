import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Proveedor } from '../interfaces/proveedor.interface';

@Injectable({ providedIn: 'root' })
export class ProveedorService {
  private readonly urlBase = 'http://localhost:3000/proveedores';
  private readonly http = inject(HttpClient);

  funListar(): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>(this.urlBase);
  }

  funObtenerUno(id: number): Observable<Proveedor> {
    return this.http.get<Proveedor>(`${this.urlBase}/${id}`);
  }

  funGuardar(dato: Partial<Proveedor>): Observable<Proveedor> {
    return this.http.post<Proveedor>(this.urlBase, dato);
  }

  funEditar(dato: Partial<Proveedor>, id: number): Observable<Proveedor> {
    return this.http.patch<Proveedor>(`${this.urlBase}/${id}`, dato);
  }

  funEliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlBase}/${id}`);
  }
}