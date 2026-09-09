export type Rol = 'admin' | 'encuestador';

export interface UsuarioSesion {
  email: string;
  rol: Rol;
}

export interface Visita {
  id: string | number;
  nombre: string;
  documento: string;
  telefono: string | null;
  direccion: string | null;
  observaciones: string | null;
  encuestador: string;
  latitud: number | null;
  longitud: number | null;
  precision_gps: number | null;
  created_at: string;
}