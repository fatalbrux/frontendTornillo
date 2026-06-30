import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cliente-sesion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cliente-sesion.html'
})
export class ClienteSesion {
  solicitud = { equipo: 'Refrigerador', detalle: '' };
  mostrarModal = false;

  enviarSolicitud(): void {
    if (this.solicitud.detalle.trim()) {
      this.mostrarModal = true;
    } else {
      alert('Por favor, ingresa el detalle del problema.');
    }
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.solicitud = { equipo: 'Refrigerador', detalle: '' };
  }
}