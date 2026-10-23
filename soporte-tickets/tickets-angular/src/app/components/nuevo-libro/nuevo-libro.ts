import { ChangeDetectorRef, Component } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LibrosService } from '../../services/libros';

@Component({
  selector: 'app-nuevo-libro',
  imports: [ReactiveFormsModule],
  templateUrl: './nuevo-libro.html',
  styleUrl: './nuevo-libro.css'
})
export class NuevoLibro {
  error = '';

  formulario = new FormGroup({
    titulo: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    autor: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    categoria: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    editorial: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    anio: new FormControl(2026, { nonNullable: true, validators: [Validators.required, Validators.min(1000), Validators.max(2100)] }),
    disponible: new FormControl(true, { nonNullable: true })
  });

  constructor(
    private librosService: LibrosService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  guardar(): void {
    this.error = '';
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    this.librosService.crearLibro(this.formulario.getRawValue()).subscribe({
      next: () => this.router.navigate(['/libros']),
      error: (error) => {
        console.error(error);
        this.error = 'No fue posible registrar el libro.';
        this.cdr.detectChanges();
      }
    });
  }
}
