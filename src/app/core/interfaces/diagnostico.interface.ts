export interface Diagnostico {
  id?: number;
  servicioId?: number;
  usuarioId: number;
  tipoDiagnostico: string;
  descripcionDiagnostico: string;
  fechaRegistro?: Date;
}