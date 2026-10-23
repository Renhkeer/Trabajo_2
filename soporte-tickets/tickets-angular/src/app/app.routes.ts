import { Routes } from '@angular/router';
import { Inicio } from './components/inicio/inicio';
import { Libros } from './components/libros/libros';
import { NuevoLibro } from './components/nuevo-libro/nuevo-libro';
import { EditarLibro } from './components/editar-libro/editar-libro';

export const routes: Routes = [
  { path: '', component: Inicio },
  { path: 'libros', component: Libros },
  { path: 'nuevo-libro', component: NuevoLibro },
  { path: 'editar-libro/:id', component: EditarLibro },
  { path: '**', redirectTo: '' }
];
