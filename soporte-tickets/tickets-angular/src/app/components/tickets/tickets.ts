import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { Ticket } from '../../models/ticket';
import { TicketsService } from '../../services/tickets';

@Component({
  selector: 'app-tickets',
  imports: [DatePipe],
  templateUrl: './tickets.html',
  styleUrl: './tickets.css'
})
export class Tickets implements OnInit {
  tickets: Ticket[] = [];
  cargando = true;
  error = '';

  constructor(
    private ticketsService: TicketsService,
    private router: Router,
    private cdr: ChangeDetectorRef // Angular 22 es zoneless: hay que pedirle que redibuje
  ) {}

  ngOnInit(): void {
    this.cargarTickets();
  }

  cargarTickets(): void {
    this.cargando = true;
    this.error = '';
    this.ticketsService.obtenerTickets().subscribe({
      next: (datos) => {
        this.tickets = datos;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(error);
        this.error = 'No fue posible obtener los tickets. Revise que la API esté funcionando.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Convierte "En proceso" en "en-proceso" para usarlo como clase CSS
  clase(valor: string): string {
    return valor.toLowerCase().replace(' ', '-');
  }

  editar(id: number): void {
    this.router.navigate(['/editar-ticket', id]);
  }

  eliminar(id: number): void {
    if (!confirm('¿Desea eliminar este ticket?')) return;
    this.ticketsService.eliminarTicket(id).subscribe({
      next: () => this.cargarTickets(),
      error: (error) => {
        console.error(error);
        alert('No fue posible eliminar el ticket.');
      }
    });
  }
}
