export interface Electrodomestico {
  id?: number;
  clientId: number;
  tipo: string;
  marca: string;
  modelo: string;
  numeroSerie: string;
  observaciones?: string;
}