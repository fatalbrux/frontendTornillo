import { Component, inject, OnInit, signal } from '@angular/core';
import { UsuariosService } from '../../core/services/usuarios';
import { Usuario } from '../../core/interfaces/usuario.interface';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './clientes.html'
})
export class Clientes implements OnInit {
  private readonly usuariosService = inject(UsuariosService);

  protected readonly listaClientes = signal<Usuario[]>([]);
  protected readonly errorConexion = signal<string|null>(null);
  protected readonly modoEdicion = signal<boolean>(false);
  protected readonly idSeleccionado = signal<number|null>(null);
  protected readonly mostrarModal = signal<boolean>(false);
  protected readonly mostrarConfirmarEliminar = signal<boolean>(false);
  protected idClienteAEliminar: number|null = null;

  protected formulario = {
    nombre: '',
    apellido: '',
    ci: '',
    telefono: '',
    roleId: 3 // Rol fijo de Cliente para tu backend
  };

  ngOnInit(): void {
    this.listar();
  }

  listar(): void {
    this.usuariosService.funListar().subscribe({
      next: (res) => {
        // Filtramos de forma inteligente para listar solo los usuarios que son clientes
        const clientes = res.filter(u => u.roleId === 3);
        this.listaClientes.set(clientes);
      },
      error: (err) => {
        console.error(err);
        this.errorConexion.set('Error al cargar la lista de clientes');
      }
    });
  }

  abrirModalCrear(): void {
    this.modoEdicion.set(false);
    this.idSeleccionado.set(null);
    this.formulario = {
      nombre: '',
      apellido: '',
      ci: '',
      telefono: '',
      roleId: 3
    };
    this.mostrarModal.set(true);
  }

  seleccionarParaEditar(cliente: Usuario): void {
    this.modoEdicion.set(true);
    this.idSeleccionado.set(cliente.id || null);
    this.formulario.nombre = cliente.nombre;
    this.formulario.apellido = cliente.apellido;
    this.formulario.ci = cliente.ci;
    this.formulario.telefono = cliente.telefono;
    this.formulario.roleId = cliente.roleId;
    this.mostrarModal.set(true);
  }

  cerrarModal(): void {
    this.mostrarModal.set(false);
  }

  guardar(): void {
    if (this.modoEdicion() && this.idSeleccionado() !== null) {
      this.usuariosService.funEditar(this.formulario, this.idSeleccionado()!).subscribe({
        next: () => this.reiniciarYRefrescar(),
        error: (err) => console.error(err)
      });
    } else {
      this.usuariosService.funGuardar(this.formulario).subscribe({
        next: () => this.reiniciarYRefrescar(),
        error: (err) => console.error(err)
      });
    }
  }

  eliminar(id: number): void {
    this.idClienteAEliminar = id;
    this.mostrarConfirmarEliminar.set(true);
  }

  confirmarEliminarReal(): void {
    if (this.idClienteAEliminar !== null) {
      this.usuariosService.funEliminar(this.idClienteAEliminar).subscribe({
        next: () => {
          this.mostrarConfirmarEliminar.set(false);
          this.idClienteAEliminar = null;
          this.listar();
        },
        error: (err) => console.error(err)
      });
    }
  }

  reiniciarYRefrescar(): void {
    this.mostrarModal.set(false);
    this.modoEdicion.set(false);
    this.idSeleccionado.set(null);
    this.listar();
  }
}