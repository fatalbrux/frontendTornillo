import { Usuario } from './usuario.interface';

export interface AuthResponse {
  access_token: string;
  user: {
    id: number;
    nombre: string;
    apellido: string;
    role: string;
  };
}