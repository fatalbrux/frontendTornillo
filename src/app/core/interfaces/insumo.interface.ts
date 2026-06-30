export interface Insumo {
  id?: number;
  nombre: string;
  codigoBase: string;
  descripcion: string;
  stock: number;
  stockMinimo: number;
  tipoElectrodomestico: string;
  // Agregamos estas dos propiedades que faltaban
  categoriaId: number;
  unidadMedidadId: number;
}