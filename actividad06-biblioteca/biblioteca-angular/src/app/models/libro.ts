export interface Libro {
  id: number;
  titulo: string;
  autor: string;
  categoria: string;
  anio: number;
  disponible: boolean;
  editorial: string;
}

export type LibroNuevo = Omit<Libro, 'id'>;
