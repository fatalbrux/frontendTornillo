export interface Servicio {
  id:number;
  estado:string; // <-- Asegúrate de que no diga boolean aquí
  fechaProgramada:string;
  duracionEstimada:string;
  duracionReal:string;
  estDomicilio:boolean;
  direccionServicio:string;
  recargoDomicilio:number;
}