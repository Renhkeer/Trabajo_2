import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CATEGORIAS, ESTADOS, PRIORIDADES } from '../../models/ticket';
import { TicketsService } from '../../services/tickets';

@Component({
  selector: 'app-editar-ticket',
  imports: [ReactiveFormsModule],
  templateUrl: './editar-ticket.html',
  styleUrl: './editar-ticket.css'
})
export class EditarTicket implements OnInit {
  id = 0;
  cargando = true;
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
    estado: new FormControl('', { nonNullable: true, validators: [Validators.required] })
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ticketsService: TicketsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.id) {
      this.error = 'Identificador de ticket inválido.';
      this.cargando = false;
      return;
    }
    this.ticketsService.obtenerTicket(this.id).subscribe({
      next: (ticket) => {
        this.formulario.patchValue({
          asunto: ticket.asunto,
          solicitante: ticket.solicitante,
          descripcion: ticket.descripcion,
          categoria: ticket.categoria,
          prioridad: ticket.prioridad,
          estado: ticket.estado
        });
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(error);
        this.error = 'No fue posible cargar el ticket.';
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
    this.ticketsService.actualizarTicket(this.id, this.formulario.getRawValue()).subscribe({
      next: () => this.router.navigate(['/tickets']),
      error: (error) => {
        console.error(error);
        this.error = 'No fue posible actualizar el ticket.';
        this.cdr.detectChanges();
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/tickets']);
  }
}
