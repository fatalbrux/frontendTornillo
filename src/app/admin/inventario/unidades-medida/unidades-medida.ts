import { Component, EventEmitter, inject, OnInit, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UnidadMedida } from '../../../core/interfaces/unidad-medida.interface';
import { UnidadMedidaService } from '../../../core/services/unidades-medida';

@Component({
  selector: 'app-unidades-medida',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './unidades-medida.html'
})
export class UnidadesMedidaComponent implements OnInit {
  private readonly uniSvc = inject(UnidadMedidaService);

  @Output() cambio = new EventEmitter<void>();

  protected readonly listaUnidades = signal<UnidadMedida[]>([]);
  protected readonly mostrarModal = signal<boolean>(false);
  protected readonly modoEdicion = signal<boolean>(false);
  protected readonly mensajeError = signal<string | null>(null);

  protected form: Partial<UnidadMedida> = { nombre: '', abreviacion: '' };
  private idEditando: number | null = null;

  ngOnInit(): void { this.listar(); }

  listar(): void {
    this.uniSvc.funListar().subscribe({
      next: (data) => this.listaUnidades.set(data),
      error: (err) => console.error('Error al listar:', err)
    });
  }

  abrirModalCrear(): void {
    this.modoEdicion.set(false);
    this.idEditando = null;
    this.form = { nombre: '', abreviacion: '' };
    this.mostrarModal.set(true);
    this.mensajeError.set(null);
  }

  editar(uni: UnidadMedida): void {
    this.modoEdicion.set(true);
    this.idEditando = uni.id || null;
    this.form = { ...uni };
    this.mostrarModal.set(true);
    this.mensajeError.set(null);
  }

  cerrarModal(): void {
    this.mostrarModal.set(false);
    this.mensajeError.set(null);
  }

  guardar(): void {
    this.mensajeError.set(null);
    if (!this.form.nombre?.trim()) {
      this.mensajeError.set('El nombre es obligatorio.');
      return;
    }

    const peticion = this.modoEdicion() && this.idEditando !== null
      ? this.uniSvc.funEditar(this.form, this.idEditando)
      : this.uniSvc.funGuardar(this.form);

    peticion.subscribe({
      next: () => this.finalizarGuardado(),
      error: (err) => this.mensajeError.set('Error al guardar: ' + err.message)
    });
  }

  private finalizarGuardado(): void {
    this.mostrarModal.set(false);
    this.listar();
    this.cambio.emit();
  }

  eliminar(id: number): void {
    if (!confirm('¿Está seguro de eliminar esta unidad de medida?')) return;
    this.uniSvc.funEliminar(id).subscribe({
      next: () => { this.listar(); this.cambio.emit(); },
      error: (err) => console.error('Error al eliminar:', err)
    });
  }
}