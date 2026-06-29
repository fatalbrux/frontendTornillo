import { Electrodomestico } from "./electrodomestico.interface";

export interface Usuario{
id:number;
roleId:number;
ci:string;
nombre:string;
apellido:string;
telefono:string;
}
export interface Servicio {
  id?:number;
  estado:string;
  fechaProgramada:string|Date;
  duracionEstimada:string;
  duracionReal?:string;
  estDomicilio:boolean;
  direccionServicio?:string;
  recargoDomicilio:number;
  clienteId:number;
  tecnicoId:number;
  costoAproximado?: number;
  adelanto?: number;
  cliente?:Usuario;
  tecnico?:Usuario;
  electrodomestico?:Electrodomestico;
}