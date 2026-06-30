import { Component, EventEmitter, inject, OnInit, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Categoria } from '../../../core/interfaces/categoria.interface';
import { CategoriaService } from '../../../core/services/categorias';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categorias.html'
})
export class CategoriasComponent implements OnInit {
  private readonly categoriaSvc = inject(CategoriaService);

  @Output() cambio = new EventEmitter<void>();

  protected readonly listaCategorias = signal<Categoria[]>([]);
  protected readonly mostrarModal = signal<boolean>(false);
  protected readonly modoEdicion = signal<boolean>(false);
  protected readonly mensajeError = signal<string | null>(null);

  protected form: Partial<Categoria> = { nombre: '', descripcion: '' };
  private idEditando: number | null = null;

  ngOnInit(): void { this.listar(); }

  listar(): void {
    this.categoriaSvc.funListar().subscribe({
      next: (data) => this.listaCategorias.set(data),
      error: (err) => console.error('Error al listar:', err)
    });
  }

  abrirModalCrear(): void {
    this.modoEdicion.set(false);
    this.idEditando = null;
    this.form = { nombre: '', descripcion: '' };
    this.mostrarModal.set(true);
    this.mensajeError.set(null);
  }

  editar(cat: Categoria): void {
    this.modoEdicion.set(true);
    this.idEditando = cat.id || null;
    this.form = { nombre: cat.nombre, descripcion: cat.descripcion };
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
      ? this.categoriaSvc.funEditar(this.form, this.idEditando)
      : this.categoriaSvc.funGuardar(this.form);

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
    if (!confirm('¿Está seguro de eliminar esta categoría?')) return;
    this.categoriaSvc.funEliminar(id).subscribe({
      next: () => { this.listar(); this.cambio.emit(); },
      error: (err) => console.error('Error al eliminar:', err)
    });
  }
}