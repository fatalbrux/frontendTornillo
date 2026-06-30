import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoteService } from '../../../core/services/lote.service';
import { InsumoService } from '../../../core/services/insumo.service';
import { Lote } from '../../../core/interfaces/lote.interface';
import { Insumo } from '../../../core/interfaces/insumo.interface';

@Component({
  selector: 'app-lotes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lotes.component.html'
})
export class LotesComponent implements OnInit {
  lotes: Lote[] = [];
  insumos: Insumo[] = [];
  modalAbierto = false;
  modoEdicion = false;
  form: Partial<Lote> = {};
  idEditando?: number;

  constructor(
    private loteSvc: LoteService,
    private insumoSvc: InsumoService
  ) {}

  ngOnInit(): void {
    this.insumoSvc.getAll().subscribe(data => {
      this.insumos = data;
      this.cargar();
    });
  }

  cargar(): void {
    this.loteSvc.getAll().subscribe(data => this.lotes = data);
  }

  getNombreInsumo(id: number): string {
    return this.insumos.find(i => i.id === id)?.nombre ?? '—';
  }

  abrirModal(): void {
    this.form = {};
    this.modoEdicion = false;
    this.modalAbierto = true;
  }

  editar(lote: Lote): void {
    this.form = { ...lote };
    this.idEditando = lote.id;
    this.modoEdicion = true;
    this.modalAbierto = true;
  }

  cerrarModal(): void {
    this.modalAbierto = false;
    this.form = {};
  }

  guardar(): void {
    if (!this.form.codigoLote?.trim()) return;
    const accion = this.modoEdicion
      ? this.loteSvc.update(this.idEditando!, this.form as Lote)
      : this.loteSvc.create(this.form as Lote);
    accion.subscribe(() => { this.cargar(); this.cerrarModal(); });
  }

  eliminar(id: number): void {
    if (!confirm('¿Eliminar este lote?')) return;
    this.loteSvc.delete(id).subscribe(() => this.cargar());
  }
}