import { Component, inject, signal, OnInit } from '@angular/core';
import { UsuariosService } from '../../../core/services/usuarios';
import { RolesService } from '../../../core/services/roles'; // Asegúrate de tener este servicio
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-personal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './personal.html'
})
export class Personal implements OnInit {
  private readonly usuariosService = inject(UsuariosService);
  private readonly rolesService = inject(RolesService);

  protected readonly listaPersonal = signal<any[]>([]);
  protected readonly listaRoles = signal<any[]>([]);
  protected readonly mostrarModal = signal(false);
  protected readonly mensajeError = signal<string | null>(null);
  
  protected modoEdicion = signal(false);
  protected idSeleccionado = signal<number | null>(null);

  protected formulario = { 
    nombre: '', 
    apellido: '', 
    ci: '', 
    telefono: '0000000', 
    username: '', 
    email: '', 
    password: '', 
    roleId: 2 
  };

  ngOnInit() {
    this.listar();
    this.cargarRoles();
  }

  listar() {
    this.usuariosService.funListar().subscribe({
      next: (res) => {
        this.listaPersonal.set(res.filter((u: any) => u.roleId === 1 || u.roleId === 2));
      },
      error: () => this.mensajeError.set('Error al cargar personal.')
    });
  }

  cargarRoles() {
    this.rolesService.funListar().subscribe(roles => {
      // Excluimos el rol 3 (Clientes) de este selector de personal
      this.listaRoles.set(roles.filter(r => r.id !== 3));
    });
  }

  abrirModalCrear() {
    this.mensajeError.set(null);
    this.modoEdicion.set(false);
    this.formulario = { nombre: '', apellido: '', ci: '', telefono: '0000000', username: '', email: '', password: '', roleId: 2 };
    this.mostrarModal.set(true);
  }

  seleccionarParaEditar(u: any) {
    this.mensajeError.set(null);
    this.modoEdicion.set(true);
    this.idSeleccionado.set(u.id);
    this.formulario = { ...u, password: ' ' };
    this.mostrarModal.set(true);
  }

  guardar() {
    this.mensajeError.set(null);

    // Lógica de auto-completado para nuevos registros
    if (!this.modoEdicion()) {
      this.formulario.username = this.formulario.ci;
      this.formulario.email = `${this.formulario.ci}@taller.com`;
      this.formulario.password = `Admin_${this.formulario.ci}`;
    }

    const obs = this.modoEdicion() 
      ? this.usuariosService.funEditar(this.formulario, this.idSeleccionado()!) 
      : this.usuariosService.funGuardar(this.formulario);

    obs.subscribe({
      next: () => { 
        this.mostrarModal.set(false); 
        this.listar(); 
      },
      error: (err) => this.manejarErrorBackend(err)
    });
  }

  private manejarErrorBackend(err: any) {
    const errorString = JSON.stringify(err).toLowerCase();
    if (err.status === 500 || err.status === 409 || errorString.includes('duplicate')) {
      this.mensajeError.set('Error: El C.I. ya está registrado en el sistema.');
    } else {
      this.mensajeError.set('Error al guardar. Verifica los datos.');
    }
  }
}