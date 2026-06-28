import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Servicio } from '../interfaces/servicio';

@Injectable({ providedIn: 'root' })
export class ServiciosService {
  private readonly urlBase='http://localhost:3000/servicios';
  private readonly http=inject(HttpClient);

  funListar():Observable<Servicio[]>{
    return this.http.get<Servicio[]>(this.urlBase);
  }

  funGuardar(dato:Partial<Servicio>){
    return this.http.post(this.urlBase,dato);
  }

  funEditar(dato:Partial<Servicio>,id:number){
    return this.http.patch(`${this.urlBase}/${id}`,dato);
  }

  funEliminar(id:number){
    return this.http.delete(`${this.urlBase}/${id}`);
  }
}