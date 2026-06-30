import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UnidadMedidaService } from '../../../core/services/unidad-medida.service';
import { UnidadMedida } from '../../../core/interfaces/unidad-medida.interface';

@Component({
  selector: 'app-unidades-medida',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './unidades-medida.component.html'
})
export class UnidadesMedidaComponent implements OnInit {
  unidades: UnidadMedida[] = [];
  modalAbierto = false;
  modoEdicion = false;
  form: Partial<UnidadMedida> = {};
  idEditando?: number;

  constructor(private unidadSvc: UnidadMedidaService) {}

  ngOnInit(): void { this.cargar(); }

  cargar(): void {
    this.unidadSvc.getAll().subscribe(data => this.unidades = data);
  }

  abrirModal(): void {
    this.form = {};
    this.modoEdicion = false;
    this.modalAbierto = true;
  }

  editar(u: UnidadMedida): void {
    this.form = { ...u };
    this.idEditando = u.id;
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
      ? this.unidadSvc.update(this.idEditando!, this.form as UnidadMedida)
      : this.unidadSvc.create(this.form as UnidadMedida);
    accion.subscribe(() => { this.cargar(); this.cerrarModal(); });
  }

  eliminar(id: number): void {
    if (!confirm('¿Eliminar esta unidad?')) return;
    this.unidadSvc.delete(id).subscribe(() => this.cargar());
  }
}