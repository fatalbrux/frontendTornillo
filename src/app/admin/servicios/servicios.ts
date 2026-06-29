import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ServiciosService } from '../../core/services/servicios';
import { Servicio } from '../../core/interfaces/servicio';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './servicios.html',
  styleUrl: './servicios.css'
})
export class Servicios implements OnInit {
  private readonly serviciosService=inject(ServiciosService);
  private readonly http=inject(HttpClient);
  
  protected readonly datosBack=signal<Servicio[]>([]);
  protected readonly errorConexion=signal<string|null>(null);
  protected readonly modoEdicion=signal<boolean>(false);
  protected readonly idSeleccionado=signal<number|null>(null);
  protected readonly mostrarModal=signal<boolean>(false);
  protected readonly mostrarConfirmarEliminar=signal<boolean>(false);
  
  protected listaClientes=signal<any[]>([]);
  protected listaTecnicos=signal<any[]>([]);
  
  protected idServicioAEliminar:number|null=null;
  protected formulario={
    ciBusqueda: '',
    estado:'Programado',
    direccionServicio:'',
    recargoDomicilio:0,
    estDomicilio:false,
    duracionEstimada:'02:00:00',
    duracionReal:'00:00:00',
    clienteId:0,
    tecnicoId:0,
    electrodomesticoId:0,
    costoAproximado:0,
    adelanto:0,
    tipoElectro:'Refrigerador',
    marcaElectro:'',
    descProblema:''
  };

  protected readonly serviciosActivos=computed(()=>this.datosBack().filter(s=>s.estado!=='Completado').length);
  protected readonly serviciosPendientes=computed(()=>this.datosBack().filter(s=>s.estado==='Programado').length);
  protected readonly serviciosCompletados=computed(()=>this.datosBack().filter(s=>s.estado==='Completado').length);
  protected readonly ingresosDelDia=computed(()=>this.datosBack().reduce((acc,s:any)=>acc+(Number(s.adelanto)||0),0));
    protected readonly clienteEncontrado = computed(() =>
  this.listaClientes().find(u => u.ci === this.formulario.ciBusqueda) ?? null
);

protected readonly electrodomesticoEncontrado = computed(() => {
  const cliente = this.clienteEncontrado();
  if (!cliente) return null;
  return this.datosBack().find(s => s.clienteId === cliente.id)?.electrodomestico ?? null;
});
  ngOnInit():void{
    this.listar();
    this.cargarUsuarios();
  }

  onCiChange(): void {
  const cliente = this.listaClientes().find(u => u.ci === this.formulario.ciBusqueda);
  if (cliente) {
    this.formulario.clienteId = cliente.id;
    const servicio = this.datosBack().find(s => s.clienteId === cliente.id);
    this.formulario.electrodomesticoId = servicio?.electrodomestico?.id ?? 0;
  } else {
    this.formulario.clienteId = 0;
    this.formulario.electrodomesticoId = 0;
  }
}

  listar():void{
    this.serviciosService.funListar().subscribe({
      next:(res)=>this.datosBack.set(res),
      error:(err)=>{
        console.error(err);
        this.errorConexion.set('Error al cargar datos');
      }
    });
  }

  cargarUsuarios():void{
    this.http.get<any[]>('http://localhost:3000/usuarios').subscribe({
      next:(res)=>{
        this.listaClientes.set(res.filter(u=>u.roleId===3));
        this.listaTecnicos.set(res.filter(u=>u.roleId===2));
      },
      error:(err)=>console.error(err)
    });
  }

  abrirModalCrear():void{
    this.modoEdicion.set(false);
    this.idSeleccionado.set(null);
    this.formulario={
      ciBusqueda: '',
      estado:'Programado',
      direccionServicio:'',
      recargoDomicilio:0,
      estDomicilio:false,
      duracionEstimada:'02:00:00',
      duracionReal:'00:00:00',
      clienteId:this.listaClientes()[0]?.id??0,
      tecnicoId:this.listaTecnicos()[0]?.id??0,
      electrodomesticoId:0,
      costoAproximado:0,
      adelanto:0,
      tipoElectro:'Refrigerador',
      marcaElectro:'',
      descProblema:''
    };
    this.mostrarModal.set(true);
  }

  seleccionarParaEditar(serv:any):void{
    this.modoEdicion.set(true);
    this.idSeleccionado.set(serv.id??null);
    this.formulario.ciBusqueda = serv.cliente?.ci || '';
    this.formulario.estado=serv.estado;
    this.formulario.direccionServicio=serv.direccionServicio??'';
    this.formulario.recargoDomicilio=serv.recargoDomicilio;
    this.formulario.estDomicilio=serv.estDomicilio;
    this.formulario.duracionEstimada=serv.duracionEstimada;
    this.formulario.duracionReal=serv.duracionReal??'';
    this.formulario.clienteId=serv.clienteId;
    this.formulario.tecnicoId=serv.tecnicoId;
    this.formulario.costoAproximado=serv.costoAproximado;
    this.formulario.adelanto=serv.adelanto;
    this.formulario.tipoElectro=serv.electrodomestico?.tipo??'';
    this.formulario.marcaElectro=serv.electrodomestico?.marca??'';
    this.formulario.descProblema=serv.electrodomestico?.observaciones??'';
    this.mostrarModal.set(true);
  }

  cerrarModal():void{
    this.mostrarModal.set(false);
  }


guardar(): void {
  const { electrodomesticoId, ciBusqueda, ...resto } = this.formulario;

  const payload: any = {
    ...resto,
    ...(electrodomesticoId ? { electrodomesticoId } : {})
  };

  if (this.modoEdicion() && this.idSeleccionado() !== null) {
    this.serviciosService.funEditar(payload, this.idSeleccionado()!).subscribe({
      next: () => this.reiniciarYRefrescar(),
      error: (err) => console.error(err)
    });
  } else {
    const nuevo = { ...payload, fechaProgramada: new Date().toISOString() };
    this.serviciosService.funGuardar(nuevo).subscribe({
      next: () => this.reiniciarYRefrescar(),
      error: (err) => console.error(err)
    });
  }
}

  eliminar(id:number):void{
    this.idServicioAEliminar=id;
    this.mostrarConfirmarEliminar.set(true);
  }

  reiniciarYRefrescar():void{
    this.mostrarModal.set(false);
    this.modoEdicion.set(false);
    this.idSeleccionado.set(null);
    this.listar();
  }

  confirmarEliminarReal():void{
    if(this.idServicioAEliminar!==null){
      this.serviciosService.funEliminar(this.idServicioAEliminar).subscribe({
        next:()=>{
          this.mostrarConfirmarEliminar.set(false);
          this.idServicioAEliminar=null;
          this.listar();
        },
        error:(err)=>console.error(err)
      });
    }
  }
}