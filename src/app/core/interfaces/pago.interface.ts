export interface Pago {
  id?: number;
  servicioId: number;
  montoTotal: number;
  montoAdelanto?: number;
  saldoPendiente: number;
  metodoPago: string;
  completado: boolean;
}