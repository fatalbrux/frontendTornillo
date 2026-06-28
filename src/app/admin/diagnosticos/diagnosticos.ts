import { Component, inject, OnInit, signal } from '@angular/core';
import { UsuariosService } from '../../core/services/usuarios';
import { FormsModule } from '@angular/forms';
import { DiagnosticosService } from '../../core/services/diagnosticos';
import { ServiciosService } from '../../core/services/servicios';

@Component({
  selector: 'app-diagnosticos',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './diagnosticos.html'
})
export class Diagnosticos implements OnInit {
  private readonly diagService = inject(DiagnosticosService);
  private readonly clienteService = inject(UsuariosService);
  private readonly serviciosService = inject(ServiciosService);

  protected readonly listaDiagnosticos = signal<any[]>([]);
  protected readonly mostrarModal = signal<boolean>(false);
  protected readonly modoEdicion = signal<boolean>(false);
  protected readonly idSeleccionado = signal<number | null>(null);
  protected nombreClienteEncontrado = signal<string>('');

  protected formulario = {
    usuarioId: null as number | null,
    servicioId: null as number | null, // <--- Agrégalo aquí
    ciBusqueda: '',
    tipoDiagnostico: '',
    descripcionDiagnostico: ''
  };

  protected readonly listaServicios = signal<any[]>([]); // Nueva lista para el ComboBox




  // En ngOnInit, carga también los servicios
  ngOnInit(): void {
    this.listar();
    this.cargarServicios();
  }

  cargarServicios(): void {
    // Ajusta según el nombre de tu servicio de servicios
    this.serviciosService.funListar().subscribe(servicios => {
      this.listaServicios.set(servicios);
    });
  }
  mostrarModalEliminar = false;
  idAEliminar: number | null = null;

  abrirModalEliminar(id: number): void {
    this.idAEliminar = id;
    this.mostrarModalEliminar = true;
  }

  confirmarEliminacion(): void {
    if (this.idAEliminar) {
      this.diagService.funEliminar(this.idAEliminar).subscribe(() => {
        this.mostrarModalEliminar = false;
        this.listar();
      });
    }
  }

  listar(): void {
    this.diagService.funListar().subscribe(diagnosticos => {
      this.clienteService.funListar().subscribe(clientes => {
        const listaConNombres = diagnosticos.map(d => ({
          ...d,
          nombreUsuario: clientes.find(c => c.id === d.usuarioId)?.nombre || 'Desconocido'
        }));
        this.listaDiagnosticos.set(listaConNombres);
      });
    });
  }

  buscarCliente(ci: string): void {
    if (!ci) { this.nombreClienteEncontrado.set(''); return; }

    this.clienteService.funListar().subscribe(clientes => {
      const cliente = clientes.find((c: any) => c.ci.toString() === ci.toString());

      if (cliente) {
        this.formulario.usuarioId = Number(cliente.id);
        this.nombreClienteEncontrado.set(`${cliente.nombre} ${cliente.apellido}`);
      } else {
        this.nombreClienteEncontrado.set('Cliente no registrado');
        this.formulario.usuarioId = null;
      }
    });
  }



  guardar(): void {
    const payload: any = {
      usuarioId: Number(this.formulario.usuarioId),
      servicioId: this.formulario.servicioId ? Number(this.formulario.servicioId) : null,
      tipoDiagnostico: this.formulario.tipoDiagnostico,
      descripcionDiagnostico: this.formulario.descripcionDiagnostico
    };

    const id = this.idSeleccionado();

    const obs = this.modoEdicion()
      ? this.diagService.funEditar(payload, id!)
      : this.diagService.funGuardar(payload);

    obs.subscribe({
      next: () => {
        this.cerrarModal();
        this.listar();
      },
      error: (err) => console.error('Error de edición:', err)
    });
  }

  seleccionarParaEditar(d: any): void {
    this.modoEdicion.set(true);
    this.idSeleccionado.set(d.id);

    this.formulario = {
      usuarioId: d.usuarioId,
      servicioId: d.servicioId || null, // Asegúrate de incluirlo aquí también
      ciBusqueda: d.cliente?.ci || '',
      tipoDiagnostico: d.tipoDiagnostico,
      descripcionDiagnostico: d.descripcionDiagnostico
    };

    if (d.cliente) {
      this.nombreClienteEncontrado.set(`${d.cliente.nombre} ${d.cliente.apellido}`);
    } else {
      this.buscarCliente(d.cliente?.ci || '');
    }

    this.mostrarModal.set(true);
  }

  private reiniciarYRefrescar(): void {
    this.mostrarModal.set(false);
    this.formulario = {
      usuarioId: null,
      servicioId: null, // <--- AÑADE ESTO
      ciBusqueda: '',
      tipoDiagnostico: '',
      descripcionDiagnostico: ''
    };
    this.nombreClienteEncontrado.set('');
    this.listar();
  }

  abrirModalCrear(): void {
    this.modoEdicion.set(false);
    this.idSeleccionado.set(null);
    this.formulario = {
      usuarioId: null,
      servicioId: null,
      ciBusqueda: '',
      tipoDiagnostico: '',
      descripcionDiagnostico: ''
    };
    this.nombreClienteEncontrado.set('');
    this.mostrarModal.set(true);
  }


  cerrarModal(): void { this.mostrarModal.set(false); }
}