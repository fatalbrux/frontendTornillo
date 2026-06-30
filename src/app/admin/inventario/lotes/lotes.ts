import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Lote } from '../../../core/interfaces/lote.interface';
import { Insumo } from '../../../core/interfaces/insumo.interface';
import { LoteService } from '../../../core/services/lotes';
import { InsumoService } from '../../../core/services/insumos';

@Component({
  selector: 'app-lotes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lotes.html'
})
export class LotesComponent implements OnInit {
  private readonly loteSvc = inject(LoteService);
  private readonly insumoSvc = inject(InsumoService);

  protected readonly listaLotes = signal<Lote[]>([]);
  protected readonly listaInsumos = signal<Insumo[]>([]);
  protected readonly mostrarModal = signal<boolean>(false);
  protected readonly modoEdicion = signal<boolean>(false);
  protected form: Partial<Lote> = {};
  private idEditando: number | null = null;

  ngOnInit(): void {
    this.loteSvc.funListar().subscribe(data => this.listaLotes.set(data));
    this.insumoSvc.funListar().subscribe(data => this.listaInsumos.set(data));
  }

  // Helper para mostrar nombre del insumo en la tabla
  getNombreInsumo(id: number): string {
    return this.listaInsumos().find(i => i.id === id)?.nombre ?? 'Desconocido';
  }

  guardar(): void {
    this.loteSvc.funGuardar(this.form).subscribe(() => {
      this.loteSvc.funListar().subscribe(data => this.listaLotes.set(data));
      this.mostrarModal.set(false);
    });
  }

    // Copia esto en cada uno de tus componentes .ts si les falta
  abrirModalCrear(): void {
    this.form = {};
    this.modoEdicion.set(false);
    this.mostrarModal.set(true);
  }

  editar(lote: Lote): void {
    this.form = { ...lote };
    this.modoEdicion.set(true);
    this.mostrarModal.set(true);
  }
}