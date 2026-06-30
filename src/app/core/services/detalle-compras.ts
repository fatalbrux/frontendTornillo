import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DetalleCompra } from '../interfaces/detalle-compra.interface';

@Injectable({ providedIn: 'root' })
export class DetalleCompraService {
  private readonly urlBase = 'http://localhost:3000/detalle_compras';
  private readonly http = inject(HttpClient);

  funListar(): Observable<DetalleCompra[]> {
    return this.http.get<DetalleCompra[]>(this.urlBase);
  }

  funObtenerUno(id: number): Observable<DetalleCompra> {
    return this.http.get<DetalleCompra>(`${this.urlBase}/${id}`);
  }

  funGuardar(dato: Partial<DetalleCompra>): Observable<DetalleCompra> {
    return this.http.post<DetalleCompra>(this.urlBase, dato);
  }

  funEditar(dato: Partial<DetalleCompra>, id: number): Observable<DetalleCompra> {
    return this.http.patch<DetalleCompra>(`${this.urlBase}/${id}`, dato);
  }

  funEliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlBase}/${id}`);
  }
}