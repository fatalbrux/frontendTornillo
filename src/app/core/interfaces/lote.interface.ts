export interface Lote {
  id?: number;
  insumoId: number;
  codigoLote: string;
  precioCompra: number;
  precioVentaSugerido: number;
  stockActual: number;
  fechaIngreso: string;
}