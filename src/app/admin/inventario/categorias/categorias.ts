import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoriaService } from '../../../core/services/categoria.service';
import { Categoria } from '../../../core/interfaces/categoria.interface';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categorias.component.html'
})
export class CategoriasComponent implements OnInit {
  categorias: Categoria[] = [];
  modalAbierto = false;
  modoEdicion = false;
  form: Partial<Categoria> = {};
  idEditando?: number;

  constructor(private categoriaSvc: CategoriaService) {}

  ngOnInit(): void { this.cargar(); }

  cargar(): void {
    this.categoriaSvc.getAll().subscribe(data => this.categorias = data);
  }

  abrirModal(): void {
    this.form = {};
    this.modoEdicion = false;
    this.modalAbierto = true;
  }

  editar(cat: Categoria): void {
    this.form = { ...cat };
    this.idEditando = cat.id;
    this.modoEdicion = true;
    this.modalAbierto = true;
  }

  cerrarModal(): void {
    this.modalAbierto = false;
    this.form = {};
  }

  guardar(): void {
    if (!this.form.nombre?.trim()) return;
    const accion = this.modoEdicion
      ? this.categoriaSvc.update(this.idEditando!, this.form as Categoria)
      : this.categoriaSvc.create(this.form as Categoria);
    accion.subscribe(() => { this.cargar(); this.cerrarModal(); });
  }

  eliminar(id: number): void {
    if (!confirm('¿Eliminar esta categoría?')) return;
    this.categoriaSvc.delete(id).subscribe(() => this.cargar());
  }
}