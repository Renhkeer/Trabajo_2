import { ChangeDetectorRef, Component } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CATEGORIAS, ESTADOS, PRIORIDADES } from '../../models/ticket';
import { TicketsService } from '../../services/tickets';

@Component({
  selector: 'app-nuevo-ticket',
  imports: [ReactiveFormsModule],
  templateUrl: './nuevo-ticket.html',
  styleUrl: './nuevo-ticket.css'
})
export class NuevoTicket {
  error = '';
  categorias = CATEGORIAS;
  prioridades = PRIORIDADES;
  estados = ESTADOS;

  formulario = new FormGroup({
    asunto: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(5), Validators.maxLength(150)] }),
    solicitante: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(100)] }),
    descripcion: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(10)] }),
    categoria: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    prioridad: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    estado: new FormControl('Abierto', { nonNullable: true, validators: [Validators.required] })
  });

  constructor(
    private ticketsService: TicketsService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  guardar(): void {
    this.error = '';
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    this.ticketsService.crearTicket(this.formulario.getRawValue()).subscribe({
      next: () => this.router.navigate(['/tickets']),
      error: (error) => {
        console.error(error);
        this.error = 'No fue posible registrar el ticket.';
        this.cdr.detectChanges();
      }
    });
  }
}
