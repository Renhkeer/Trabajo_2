import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Libro, LibroNuevo } from '../models/libro';

@Injectable({ providedIn: 'root' })
export class LibrosService {
  private readonly apiUrl =
    'http://localhost:3000/api/libros';

  constructor(private http: HttpClient) {}

  obtenerLibros(): Observable<Libro[]> {
    return this.http.get<Libro[]>(this.apiUrl);
  }

  obtenerLibro(id: number): Observable<Libro> {
    return this.http.get<Libro>(`${this.apiUrl}/${id}`);
  }

  crearLibro(libro: LibroNuevo): Observable<Libro> {
    return this.http.post<Libro>(this.apiUrl, libro);
  }

  actualizarLibro(
    id: number,
    libro: LibroNuevo
  ): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string }>(
      `${this.apiUrl}/${id}`,
      libro
    );
  }

  eliminarLibro(id: number): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(
      `${this.apiUrl}/${id}`
    );
  }
}
