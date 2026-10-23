import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LibrosService } from '../../services/libros';

@Component({
  selector: 'app-editar-libro',
  imports: [ReactiveFormsModule],
  templateUrl: './editar-libro.html',
  styleUrl: './editar-libro.css'
})
export class EditarLibro implements OnInit {
  id = 0;
  cargando = true;
  error = '';

  formulario = new FormGroup({
    titulo: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    autor: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    categoria: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    editorial: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    anio: new FormControl(2026, { nonNullable: true, validators: [Validators.required, Validators.min(1000), Validators.max(2100)] }),
    disponible: new FormControl(true, { nonNullable: true })
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private librosService: LibrosService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.id) {
      this.error = 'Identificador de libro inválido.';
      this.cargando = false;
      return;
    }
    this.librosService.obtenerLibro(this.id).subscribe({
      next: (libro) => {
        this.formulario.patchValue({
          titulo: libro.titulo,
          autor: libro.autor,
          categoria: libro.categoria,
          editorial: libro.editorial,
          anio: libro.anio,
          disponible: Boolean(libro.disponible)
        });
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(error);
        this.error = 'No fue posible cargar el libro.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  guardar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    this.librosService.actualizarLibro(this.id, this.formulario.getRawValue()).subscribe({
      next: () => this.router.navigate(['/libros']),
      error: (error) => {
        console.error(error);
        this.error = 'No fue posible actualizar el libro.';
        this.cdr.detectChanges();
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/libros']);
  }
}
