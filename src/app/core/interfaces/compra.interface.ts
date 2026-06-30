export interface Compra {
  id?: number;
  proveedorId: number;
  fechaCompra: string;
  estado: string;
  total: number;
}