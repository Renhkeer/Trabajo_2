export interface Ticket {
  id: number;
  asunto: string;
  solicitante: string;
  descripcion: string;
  categoria: string;
  prioridad: string;
  estado: string;
  fechaRegistro: string;
}

// Al crear o editar no se envía el id ni la fecha (los pone la base de datos)
export type TicketNuevo = Omit<Ticket, 'id' | 'fechaRegistro'>;

// Opciones de los select de los formularios
export const CATEGORIAS = ['Hardware', 'Software', 'Red', 'Cuentas'];
export const PRIORIDADES = ['Baja', 'Media', 'Alta'];
export const ESTADOS = ['Abierto', 'En proceso', 'Cerrado'];
