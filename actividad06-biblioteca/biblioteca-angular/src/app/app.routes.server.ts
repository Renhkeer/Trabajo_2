import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Estas rutas leen datos de la API: se renderizan en el navegador para no mostrar datos del momento de compilar
  {
    path: 'libros',
    renderMode: RenderMode.Client
  },
  {
    path: 'editar-libro/:id',
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
