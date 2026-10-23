import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Libro } from '../../models/libro';
import { LibrosService } from '../../services/libros';

@Component({
  selector: 'app-libros',
  imports: [],
  templateUrl: './libros.html',
  styleUrl: './libros.css'
})
export class Libros implements OnInit {
  libros: Libro[] = [];
  cargando = true;
  error = '';

  constructor(
    private librosService: LibrosService,
    private router: Router,
    private cdr: ChangeDetectorRef // Angular 22 es zoneless: hay que pedirle que redibuje
  ) {}

  ngOnInit(): void {
    this.cargarLibros();
  }

  cargarLibros(): void {
    this.cargando = true;
    this.error = '';
    this.librosService.obtenerLibros().subscribe({
      next: (datos) => {
        this.libros = datos;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(error);
        this.error = 'No fue posible obtener los libros.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  editar(id: number): void {
    this.router.navigate(['/editar-libro', id]);
  }

  eliminar(id: number): void {
    if (!confirm('¿Desea eliminar este libro?')) return;
    this.librosService.eliminarLibro(id).subscribe({
      next: () => this.cargarLibros(),
      error: (error) => {
        console.error(error);
        alert('No fue posible eliminar el libro.');
      }
    });
  }
}
