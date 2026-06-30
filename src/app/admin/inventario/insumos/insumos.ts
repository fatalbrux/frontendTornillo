import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InsumoService } from '../../../core/services/insumos';
import { CategoriaService } from '../../../core/services/categorias';
import { UnidadMedidaService } from '../../../core/services/unidades-medida';
import { Insumo } from '../../../core/interfaces/insumo.interface';
import { CategoriasComponent } from '../categorias/categorias';
import { UnidadesMedidaComponent } from '../unidades-medida/unidades-medida';
import { ElectrodomesticosService } from '../../../core/services/electrodomesticos';

@Component({
  selector: 'app-insumos',
  standalone: true,
  imports: [CommonModule, FormsModule, CategoriasComponent, UnidadesMedidaComponent],
  templateUrl: './insumos.html'
})
export class InsumosComponent implements OnInit {
  private readonly insumoSvc = inject(InsumoService);
  private readonly catSvc = inject(CategoriaService);
  private readonly uniSvc = inject(UnidadMedidaService);
  private readonly electroSvc = inject(ElectrodomesticosService);

  protected listaInsumos = signal<Insumo[]>([]);
  protected listaCat = signal<any[]>([]);
  protected listaUni = signal<any[]>([]);
  protected listaElectro = signal<any[]>([]);

  protected mostrarModal = signal(false);

  protected formInicial: Partial<Insumo> = {
    nombre: '', codigoBase: '', descripcion: '', stock: 0,
    stockMinimo: 0, tipoElectrodomestico: '', categoriaId: undefined, unidadMedidadId: undefined
  };

  protected form: Partial<Insumo> = { ...this.formInicial };

  ngOnInit(): void { this.cargarDatos(); }

  cargarDatos(): void {
    this.catSvc.funListar().subscribe(d => this.listaCat.set(d));
    this.uniSvc.funListar().subscribe(d => this.listaUni.set(d));
    this.insumoSvc.funListar().subscribe(d => this.listaInsumos.set(d));
    this.electroSvc.funListar().subscribe(d => this.listaElectro.set(d));
  }

  abrirNuevoInsumo() {
    this.form = { ...this.formInicial };
    this.mostrarModal.set(true);
  }

  editarInsumo(ins: Insumo) {
    this.form = { ...ins };
    this.mostrarModal.set(true);
  }

  eliminarInsumo(id?: number) {
    if (!id) return;
    if (!confirm('¿Eliminar este producto?')) return;
    this.insumoSvc.funEliminar(id).subscribe(() => this.cargarDatos());
  }

  guardarInsumo() {
    const peticion = this.form.id
      ? this.insumoSvc.funEditar(this.form, this.form.id)
      : this.insumoSvc.funGuardar(this.form);

    peticion.subscribe({
      next: () => {
        this.cargarDatos();
        this.mostrarModal.set(false);
        this.form = { ...this.formInicial };
      },
      error: (err) => console.error('Error al guardar insumo:', err)
    });
  }

  cerrarModal() {
    this.mostrarModal.set(false);
    this.form = { ...this.formInicial };
  }

  // Llamado por los componentes hijos cuando guardan/editan/eliminan
  refrescar(): void {
    this.cargarDatos();
  }
}