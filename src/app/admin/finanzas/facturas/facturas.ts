import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FacturaService } from '../../../core/services/facturas';
import { ServiciosService } from '../../../core/services/servicios';
import { Factura } from '../../../core/interfaces/factura.interface';
import { PagosComponent } from '../pagos/pagos';

@Component({
  selector: 'app-facturas',
  standalone: true,
  imports: [CommonModule, FormsModule, PagosComponent],
  templateUrl: './facturas.html'
})
export class FacturasComponent implements OnInit {
  private readonly facturaSvc = inject(FacturaService);
  private readonly servicioSvc = inject(ServiciosService);

  protected listaFacturas = signal<Factura[]>([]);
  protected listaServicios = signal<any[]>([]);

  protected mostrarModal = signal(false);

  protected formInicial: Partial<Factura> = {
    servicioId: undefined as any,
    numeroFactura: '',
    fechaEmision: '',
    monto: 0,
    nit: '',
    razonSocial: ''
  };

  protected form: Partial<Factura> = { ...this.formInicial };

  ngOnInit(): void { this.cargarDatos(); }

  cargarDatos(): void {
    this.servicioSvc.funListar().subscribe(d => this.listaServicios.set(d));
    this.facturaSvc.funListar().subscribe(d => this.listaFacturas.set(d));
  }

  obtenerInfoServicio(id?: number): string {
    const s = this.listaServicios().find(s => s.id === id);
    return s ? `#${s.id} - ${s.estado}` : '-';
  }

  abrirNuevaFactura(): void {
    this.form = { ...this.formInicial };
    this.mostrarModal.set(true);
  }

  editarFactura(fact: Factura): void {
    this.form = { ...fact };
    this.mostrarModal.set(true);
  }

  eliminarFactura(id?: number): void {
    if (!id) return;
    if (!confirm('¿Eliminar esta factura?')) return;
    this.facturaSvc.funEliminar(id).subscribe(() => this.cargarDatos());
  }

  guardarFactura(): void {
    const peticion = this.form.id
      ? this.facturaSvc.funEditar(this.form, this.form.id)
      : this.facturaSvc.funGuardar(this.form);

    peticion.subscribe({
      next: () => {
        this.cargarDatos();
        this.mostrarModal.set(false);
        this.form = { ...this.formInicial };
      },
      error: (err) => console.error('Error al guardar factura:', err)
    });
  }

  cerrarModal(): void {
    this.mostrarModal.set(false);
    this.form = { ...this.formInicial };
  }

  refrescar(): void {
    this.cargarDatos();
  }
}