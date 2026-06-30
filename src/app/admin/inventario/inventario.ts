import { Component } from '@angular/core';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html'
})
export class InventarioComponent {
  seccionActiva: string | null = null;
  subSeccionActiva: string | null = null;

  toggleSeccion(seccion: string): void {
    this.seccionActiva = this.seccionActiva === seccion ? null : seccion;
    this.subSeccionActiva = null; // resetea sub al cambiar sección
  }

  toggleSubSeccion(sub: string): void {
    this.subSeccionActiva = this.subSeccionActiva === sub ? null : sub;
  }
}