import { inject,Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Presupuesto } from '../interfaces/presupuesto';

@Injectable({
  providedIn:'root'
})
export class PresupuestosService {
  private readonly http=inject(HttpClient);
  private readonly url='http://localhost:3000/presupuestos';

  funListar():Observable<Presupuesto[]>{
    return this.http.get<Presupuesto[]>(this.url);
  }

  funObtenerPorId(id:number):Observable<Presupuesto>{
    return this.http.get<Presupuesto>(`${this.url}/${id}`);
  }

  funGuardar(presupuesto:Partial<Presupuesto>):Observable<Presupuesto>{
    return this.http.post<Presupuesto>(this.url,presupuesto);
  }

  funEditar(presupuesto:Partial<Presupuesto>,id:number):Observable<Presupuesto>{
    return this.http.patch<Presupuesto>(`${this.url}/${id}`,presupuesto);
  }

  funEliminar(id:number):Observable<void>{
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}