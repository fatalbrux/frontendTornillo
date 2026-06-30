export interface DetalleCompra {
  id?: number;
  compraId: number;
  insumoId: number;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}