export interface Factura {
  id?: number;
  servicioId: number;
  numeroFactura: string;
  fechaEmision: string;
  monto: number;
  nit: string;
  razonSocial: string;
}