import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Electrodomestico } from '../interfaces/electrodomestico.interface';

@Injectable({ providedIn: 'root' })
export class ElectrodomesticosService {
  private readonly urlBase = 'http://localhost:3000/electrodomesticos';
  private readonly http = inject(HttpClient);

  funListar(): Observable<Electrodomestico[]> {
    return this.http.get<Electrodomestico[]>(this.urlBase);
  }

  funGuardar(dato: Partial<Electrodomestico>): Observable<Electrodomestico> {
    return this.http.post<Electrodomestico>(this.urlBase, dato);
  }

  funEditar(dato: Partial<Electrodomestico>, id: number): Observable<Electrodomestico> {
    return this.http.patch<Electrodomestico>(`${this.urlBase}/${id}`, dato);
  }

  funEliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlBase}/${id}`);
  }
}