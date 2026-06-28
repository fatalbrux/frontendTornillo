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
  protected readonly errorConexion = signal<string | null>(null);
  protected readonly mensajeError = signal<string | null>(null); // Alerta dinámica para el formulario
  protected readonly modoEdicion = signal<boolean>(false);
  protected readonly idSeleccionado = signal<number | null>(null);
  protected readonly mostrarModal = signal<boolean>(false);
  protected readonly mostrarConfirmarEliminar = signal<boolean>(false);
  protected idClienteAEliminar: number | null = null;

  protected formulario = {
    nombre: '',
    apellido: '',
    ci: '',
    telefono: '',
    username: '',
    email: '',
    password: '',
    roleId: 3
  };

  abrirModalCrear(): void {
    this.modoEdicion.set(false);
    this.idSeleccionado.set(null);
    this.mensajeError.set(null); // Limpiamos errores anteriores
    this.formulario = {
      nombre: '',
      apellido: '',
      ci: '',
      telefono: '',
      username: '',
      email: '',
      password: '',
      roleId: 3
    };
    this.mostrarModal.set(true);
  }

  ngOnInit(): void {
    this.listar();
  }

  listar(): void {
    this.usuariosService.funListar().subscribe({
      next: (res) => {
        const clientes = res.filter(u => u.roleId === 3);
        this.listaClientes.set(clientes);
      },
      error: (err) => {
        console.error(err);
        this.errorConexion.set('Error al cargar la lista de clientes');
        this.listaClientes.set([]);
      }
    });
  }

  seleccionarParaEditar(cliente: Usuario): void {
    this.modoEdicion.set(true);
    this.idSeleccionado.set(cliente.id || null);
    this.mensajeError.set(null); // Limpiamos errores anteriores
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
    this.mensajeError.set(null);
    const ciDuplicado = this.listaClientes().some(
      (cli) => cli.ci === this.formulario.ci && cli.id !== this.idSeleccionado()
    );

    if (ciDuplicado) {
      this.mensajeError.set(`El usuario con C.I. ${this.formulario.ci} ya existe.`);
      return; 
    }
    if (this.formulario.ci.length < 5) {
      this.mensajeError.set('La Cédula de Identidad debe tener al menos 5 caracteres.');
      return;
    }
    if (this.formulario.telefono.length < 7) {
      this.mensajeError.set('El número de teléfono debe tener al menos 7 dígitos.');
      return;
    }
    if (!this.modoEdicion()) {
      this.formulario.username = this.formulario.ci;
      this.formulario.email = `${this.formulario.ci}@tornilloloko.com`;
      this.formulario.password = `Cli_${this.formulario.ci}`;
    }
    if (this.modoEdicion() && this.idSeleccionado() !== null) {
      this.usuariosService.funEditar(this.formulario, this.idSeleccionado()!).subscribe({
        next: () => this.reiniciarYRefrescar(),
        error: (err) => this.manejarErrorBackend(err, 'editar')
      });
    } else {
      this.usuariosService.funGuardar(this.formulario).subscribe({
        next: () => this.reiniciarYRefrescar(),
        error: (err) => this.manejarErrorBackend(err, 'guardar')
      });
    }
  }

  private manejarErrorBackend(err: any, accion: string): void {
    console.error(`Error al ${accion}:`, err);
    
    const mensajeServidor = err.error?.message;
    const statusCode = err.status;
    const errorString = JSON.stringify(err).toLowerCase();
    if (
      statusCode === 500 || 
      statusCode === 409 || 
      errorString.includes('duplicate') || 
      errorString.includes('already exists') || 
      errorString.includes('ya existe')
    ) {
      this.mensajeError.set(`El usuario con C.I. o datos ${this.formulario.ci} ya existe en el sistema.`);
      return;
    }
    if (mensajeServidor) {
      if (Array.isArray(mensajeServidor)) {
        this.mensajeError.set(mensajeServidor[0]);
      } else {
        this.mensajeError.set(mensajeServidor);
      }
      return;
    }
    this.mensajeError.set('No se pudo procesar la solicitud. Verifica los datos o el estado del servidor.');
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
    this.mensajeError.set(null);
    this.listar();
  }
}