import { Role } from './role.interface';

export interface Usuario {
  id?: number;
  roleId: number;
  ci: string;
  nombre: string;
  apellido: string;
  telefono: string;
  password?: string;
  role?: Role;
}