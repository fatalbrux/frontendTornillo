import { Component, inject, OnInit, signal } from '@angular/core';
import { ElectrodomesticosService } from '../../core/services/electrodomesticos';
import { UsuariosService } from '../../core/services/usuarios';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-electrodomesticos',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './electrodomesticos.html'
})
export class Electrodomesticos implements OnInit {
  private readonly electroService = inject(ElectrodomesticosService);
  private readonly usuariosService = inject(UsuariosService);

  protected readonly listaEquipos = signal<any[]>([]);
  protected readonly listaClientes = signal<any[]>([]);
  protected readonly mensajeError = signal<string | null>(null);
  protected readonly modoEdicion = signal<boolean>(false);
  protected readonly idSeleccionado = signal<number | null>(null);
  protected readonly mostrarModal = signal<boolean>(false);
  protected readonly mostrarConfirmarEliminar = signal<boolean>(false);
  protected idEquipoAEliminar: number | null = null;

  protected formulario = {
    clientId: null as number | null,
    tipo: '',
    marca: '',
    modelo: '',
    numeroSerie: '',
    observaciones: ''
  };

  ngOnInit(): void {
    this.listar();
    this.cargarClientes();
  }

  listar(): void {
    this.electroService.funListar().subscribe(res => {
      const equiposConCliente = res.map(equipo => ({
        ...equipo,
        cliente: this.listaClientes().find(c => c.id === equipo.clientId)
      }));
      this.listaEquipos.set(equiposConCliente);
    });
  }

  cargarClientes(): void {
    this.usuariosService.funListar().subscribe(res => {
      this.listaClientes.set(res.filter(u => u.roleId === 3));
    });
  }

  abrirModalCrear(): void {
    this.modoEdicion.set(false);
    this.formulario = { clientId: null, tipo: '', marca: '', modelo: '', numeroSerie: '', observaciones: '' };
    this.mostrarModal.set(true);
  }

  seleccionarParaEditar(e: any): void {
    this.modoEdicion.set(true);
    this.idSeleccionado.set(e.id);
    this.mensajeError.set(null);

    this.formulario = {
      clientId: e.clientId,
      tipo: e.tipo,
      marca: e.marca,
      modelo: e.modelo,
      numeroSerie: e.numeroSerie,
      observaciones: e.observaciones
    };

    this.mostrarModal.set(true);
  }

  guardar(): void {
    this.mensajeError.set(null);
    const payload: any = {
      clientId: Number(this.formulario.clientId),
      tipo: this.formulario.tipo,
      marca: this.formulario.marca,
      modelo: this.formulario.modelo,
      numeroSerie: this.formulario.numeroSerie,
      observaciones: this.formulario.observaciones
    };

    if (this.modoEdicion() && this.idSeleccionado() !== null) {
      this.electroService.funEditar(payload, this.idSeleccionado()!).subscribe({
        next: () => this.reiniciarYRefrescar(),
        error: () => this.mensajeError.set('Error al actualizar.')
      });
    } else {
      this.electroService.funGuardar(payload).subscribe({
        next: () => this.reiniciarYRefrescar(),
        error: () => this.mensajeError.set('Error al registrar.')
      });
    }
  }
  eliminar(id: number): void {
    this.idEquipoAEliminar = id;
    this.mostrarConfirmarEliminar.set(true);
  }

  confirmarEliminarReal(): void {
    if (this.idEquipoAEliminar !== null) {
      this.electroService.funEliminar(this.idEquipoAEliminar).subscribe({
        next: () => {
          this.mostrarConfirmarEliminar.set(false);
          this.idEquipoAEliminar = null;
          this.listar();
        },
        error: (err) => console.error('Error al eliminar:', err)
      });
    }
  }

  reiniciarYRefrescar(): void {
    this.mostrarModal.set(false);
    this.modoEdicion.set(false);
    this.idSeleccionado.set(null);
    this.mensajeError.set(null);

    this.formulario = {
      clientId: null,
      tipo: '',
      marca: '',
      modelo: '',
      numeroSerie: '',
      observaciones: ''
    };

    this.listar();
  }

  cerrarModal(): void { this.mostrarModal.set(false); }
}