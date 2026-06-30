import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { InsumoService } from '../../../core/services/insumo.service';
import { CategoriaService } from '../../../core/services/categoria.service';
import { UnidadMedidaService } from '../../../core/services/unidad-medida.service';
import { Insumo } from '../../../core/interfaces/insumo.interface';
import { Categoria } from '../../../core/interfaces/categoria.interface';
import { UnidadMedida } from '../../../core/interfaces/unidad-medida.interface';

@Component({
  selector: 'app-insumos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './insumos.component.html'
})
export class InsumosComponent implements OnInit {
  insumos: Insumo[] = [];
  insumosFiltrados: Insumo[] = [];
  categorias: Categoria[] = [];
  unidades: UnidadMedida[] = [];
  busqueda = '';
  modalAbierto = false;
  modoEdicion = false;
  form: Partial<Insumo> = {};
  idEditando?: number;

  constructor(
    private insumoSvc: InsumoService,
    private categoriaSvc: CategoriaService,
    private unidadSvc: UnidadMedidaService
  ) {}

  ngOnInit(): void {
    forkJoin({
      categorias: this.categoriaSvc.getAll(),
      unidades: this.unidadSvc.getAll()
    }).subscribe(({ categorias, unidades }) => {
      this.categorias = categorias;
      this.unidades = unidades;
      this.cargar();
    });
  }

  cargar(): void {
    this.insumoSvc.getAll().subscribe(data => {
      this.insumos = data;
      this.insumosFiltrados = data;
    });
  }

  filtrar(): void {
    const q = this.busqueda.toLowerCase();
    this.insumosFiltrados = this.insumos.filter(i =>
      i.nombre.toLowerCase().includes(q) || i.codigoBase.toLowerCase().includes(q)
    );
  }

  getNombreCategoria(id: number): string {
    return this.categorias.find(c => c.id === id)?.nombre ?? '—';
  }

  getNombreUnidad(id: number): string {
    return this.unidades.find(u => u.id === id)?.nombre ?? '—';
  }

  abrirModal(): void {
    this.form = {};
    this.modoEdicion = false;
    this.modalAbierto = true;
  }

  editar(ins: Insumo): void {
    this.form = { ...ins };
    this.idEditando = ins.id;
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
      ? this.insumoSvc.update(this.idEditando!, this.form as Insumo)
      : this.insumoSvc.create(this.form as Insumo);
    accion.subscribe(() => { this.cargar(); this.cerrarModal(); });
  }

  eliminar(id: number): void {
    if (!confirm('¿Eliminar este insumo?')) return;
    this.insumoSvc.delete(id).subscribe(() => this.cargar());
  }
}