import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-servicios-asignados',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './servicios-asignados.html',
  styleUrl: './servicios-asignados.css'
})
export class ServiciosAsignados implements OnInit {
  private readonly http = inject(HttpClient);

  protected readonly todosServicios = signal<any[]>([]);
  protected tecnicoId: number = 0;

  protected readonly misServicios = computed(() =>
    this.todosServicios().filter(s => s.tecnicoId === this.tecnicoId)
  );

  protected readonly serviciosActivos = computed(() =>
    this.misServicios().filter(s => s.estado !== 'Completado' && s.estado !== 'Cancelado').length
  );
  protected readonly enDiagnostico = computed(() =>
    this.misServicios().filter(s => s.estado === 'En Diagnóstico').length
  );
  protected readonly enReparacion = computed(() =>
    this.misServicios().filter(s => s.estado === 'En Reparación').length
  );

  ngOnInit(): void {
    this.tecnicoId = this.obtenerIdDesdeToken();
    this.http.get<any[]>('http://localhost:3000/servicios').subscribe({
      next: (res) => this.todosServicios.set(res),
      error: (err) => console.error(err)
    });
  }

  private obtenerIdDesdeToken(): number {
    const token = localStorage.getItem('token');
    if (!token) return 0;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub ?? payload.id ?? payload.userId ?? 0;
    } catch {
      return 0;
    }
  }
}