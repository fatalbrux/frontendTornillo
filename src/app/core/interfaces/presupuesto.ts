export interface Presupuesto {
  id:number;
  servicioId:number;
  costoManoObra:number;
  costoRepuestos:number;
  total:number;
  fechaRegistro:string;
  aprobado:boolean;
}