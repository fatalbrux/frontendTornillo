import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DetalleCompraService } from '../../../core/services/detalle-compras';
import { CompraService } from '../../../core/services/compras';
import { InsumoService } from '../../../core/services/insumos';
import { DetalleCompra } from '../../../core/interfaces/detalle-compra.interface';
import { ProveedoresComponent } from '../proveedores/proveedores';

@Component({
  selector: 'app-detalle-compras',
  standalone: true,
  imports: [CommonModule, FormsModule, ProveedoresComponent],
  templateUrl: './detalle-compras.html'
})
export class DetalleComprasComponent implements OnInit {
  private readonly detalleSvc = inject(DetalleCompraService);
  private readonly compraSvc = inject(CompraService);
  private readonly insumoSvc = inject(InsumoService);

  protected listaDetalles = signal<DetalleCompra[]>([]);
  protected listaCompras = signal<any[]>([]);
  protected listaInsumos = signal<any[]>([]);

  protected mostrarModal = signal(false);

  protected formInicial: Partial<DetalleCompra> = {
    compraId: undefined as any,
    insumoId: undefined as any,
    cantidad: 0,
    precioUnitario: 0,
    subtotal: 0
  };

  protected form: Partial<DetalleCompra> = { ...this.formInicial };

  ngOnInit(): void { this.cargarDatos(); }

  cargarDatos(): void {
    this.compraSvc.funListar().subscribe(d => this.listaCompras.set(d));
    this.insumoSvc.funListar().subscribe(d => this.listaInsumos.set(d));
    this.detalleSvc.funListar().subscribe(d => this.listaDetalles.set(d));
  }

  obtenerInfoCompra(id?: number): string {
    const c = this.listaCompras().find(c => c.id === id);
    return c ? `#${c.id} - ${c.fechaCompra}` : '-';
  }

  obtenerNombreInsumo(id?: number): string {
    return this.listaInsumos().find(i => i.id === id)?.nombre ?? '-';
  }

  calcularSubtotal(): void {
    const cant = Number(this.form.cantidad) || 0;
    const precio = Number(this.form.precioUnitario) || 0;
    this.form.subtotal = cant * precio;
  }

  abrirNuevoDetalle(): void {
    this.form = { ...this.formInicial };
    this.mostrarModal.set(true);
  }

  editarDetalle(det: DetalleCompra): void {
    this.form = { ...det };
    this.mostrarModal.set(true);
  }

  eliminarDetalle(id?: number): void {
    if (!id) return;
    if (!confirm('¿Eliminar este detalle de compra?')) return;
    this.detalleSvc.funEliminar(id).subscribe(() => this.cargarDatos());
  }

  guardarDetalle(): void {
    this.calcularSubtotal();
    const peticion = this.form.id
      ? this.detalleSvc.funEditar(this.form, this.form.id)
      : this.detalleSvc.funGuardar(this.form);

    peticion.subscribe({
      next: () => {
        this.cargarDatos();
        this.mostrarModal.set(false);
        this.form = { ...this.formInicial };
      },
      error: (err) => console.error('Error al guardar detalle de compra:', err)
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