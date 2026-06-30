import { Component, EventEmitter, inject, OnInit, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProveedorService } from '../../../core/services/proveedores';
import { Proveedor } from '../../../core/interfaces/proveedor.interface';

@Component({
  selector: 'app-proveedores',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './proveedores.html'
})
export class ProveedoresComponent implements OnInit {
  private readonly proveedorSvc = inject(ProveedorService);

  @Output() cambio = new EventEmitter<void>();

  protected listaProveedores = signal<Proveedor[]>([]);
  protected mostrarModal = signal(false);

  protected formInicial: Partial<Proveedor> = {
    nombre: '', telefono: '', direccion: '', tipoProveedor: ''
  };

  protected form: Partial<Proveedor> = { ...this.formInicial };

  ngOnInit(): void { this.cargarDatos(); }

  cargarDatos(): void {
    this.proveedorSvc.funListar().subscribe(d => this.listaProveedores.set(d));
  }

  abrirNuevoProveedor(): void {
    this.form = { ...this.formInicial };
    this.mostrarModal.set(true);
  }

  editarProveedor(prov: Proveedor): void {
    this.form = { ...prov };
    this.mostrarModal.set(true);
  }

  eliminarProveedor(id?: number): void {
    if (!id) return;
    if (!confirm('¿Eliminar este proveedor?')) return;
    this.proveedorSvc.funEliminar(id).subscribe(() => {
      this.cargarDatos();
      this.cambio.emit();
    });
  }

  guardarProveedor(): void {
    const peticion = this.form.id
      ? this.proveedorSvc.funEditar(this.form, this.form.id)
      : this.proveedorSvc.funGuardar(this.form);

    peticion.subscribe({
      next: () => {
        this.cargarDatos();
        this.cambio.emit();
        this.mostrarModal.set(false);
        this.form = { ...this.formInicial };
      },
      error: (err) => console.error('Error al guardar proveedor:', err)
    });
  }

  cerrarModal(): void {
    this.mostrarModal.set(false);
    this.form = { ...this.formInicial };
  }
}