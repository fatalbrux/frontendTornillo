import { Component, EventEmitter, inject, OnInit, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PagoService } from '../../../core/services/pagos';
import { ServiciosService } from '../../../core/services/servicios';
import { Pago } from '../../../core/interfaces/pago.interface';

@Component({
  selector: 'app-pagos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pagos.html'
})
export class PagosComponent implements OnInit {
  private readonly pagoSvc = inject(PagoService);
  private readonly servicioSvc = inject(ServiciosService);

  @Output() cambio = new EventEmitter<void>();

  protected listaPagos = signal<Pago[]>([]);
  protected listaServicios = signal<any[]>([]);
  protected mostrarModal = signal(false);

  protected formInicial: Partial<Pago> = {
    servicioId: undefined as any,
    montoTotal: 0,
    montoAdelanto: 0,
    saldoPendiente: 0,
    metodoPago: '',
    completado: false
  };

  protected form: Partial<Pago> = { ...this.formInicial };

  ngOnInit(): void { this.cargarDatos(); }

  cargarDatos(): void {
    this.servicioSvc.funListar().subscribe(d => this.listaServicios.set(d));
    this.pagoSvc.funListar().subscribe(d => this.listaPagos.set(d));
  }

  obtenerInfoServicio(id?: number): string {
    const s = this.listaServicios().find(s => s.id === id);
    return s ? `#${s.id} - ${s.estado}` : '-';
  }

  calcularSaldo(): void {
    const total = Number(this.form.montoTotal) || 0;
    const adelanto = Number(this.form.montoAdelanto) || 0;
    this.form.saldoPendiente = total - adelanto;
    this.form.completado = this.form.saldoPendiente <= 0;
  }

  abrirNuevoPago(): void {
    this.form = { ...this.formInicial };
    this.mostrarModal.set(true);
  }

  editarPago(pago: Pago): void {
    this.form = { ...pago };
    this.mostrarModal.set(true);
  }

  eliminarPago(id?: number): void {
    if (!id) return;
    if (!confirm('¿Eliminar este pago?')) return;
    this.pagoSvc.funEliminar(id).subscribe(() => {
      this.cargarDatos();
      this.cambio.emit();
    });
  }

  guardarPago(): void {
    this.calcularSaldo();
    const peticion = this.form.id
      ? this.pagoSvc.funEditar(this.form, this.form.id)
      : this.pagoSvc.funGuardar(this.form);

    peticion.subscribe({
      next: () => {
        this.cargarDatos();
        this.cambio.emit();
        this.mostrarModal.set(false);
        this.form = { ...this.formInicial };
      },
      error: (err) => console.error('Error al guardar pago:', err)
    });
  }

  cerrarModal(): void {
    this.mostrarModal.set(false);
    this.form = { ...this.formInicial };
  }
}