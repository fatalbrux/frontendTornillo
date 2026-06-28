import { Component, inject, OnInit, signal } from '@angular/core';
import { ServiciosService } from '../../core/services/servicios';
import { Servicio } from '../../core/interfaces/servicio';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './servicios.html',
  styleUrl: './servicios.css'
})
export class Servicios implements OnInit {
  private readonly serviciosService=inject(ServiciosService);
  
  protected readonly datosBack=signal<Servicio[]>([]);
  protected readonly errorConexion=signal<string|null>(null);
  protected readonly modoEdicion=signal<boolean>(false);
  protected readonly idSeleccionado=signal<number|null>(null);
  protected readonly mostrarModal=signal<boolean>(false);
  protected readonly mostrarConfirmarEliminar=signal<boolean>(false);
  protected idServicioAEliminar:number|null=null;
  protected formulario={
    estado:'Programado',
    direccionServicio:'',
    recargoDomicilio:0,
    estDomicilio:false, // Inicializa en taller por defecto según mockup
    duracionEstimada:'02:00:00',
    duracionReal:'00:00:00'
  };

  ngOnInit():void{
    this.listar();
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

  abrirModalCrear():void{
    this.modoEdicion.set(false);
    this.idSeleccionado.set(null);
    this.formulario={
      estado:'Programado',
      direccionServicio:'',
      recargoDomicilio:0,
      estDomicilio:false,
      duracionEstimada:'02:00:00',
      duracionReal:'00:00:00'
    };
    this.mostrarModal.set(true);
  }

  seleccionarParaEditar(serv:Servicio):void{
    this.modoEdicion.set(true);
    this.idSeleccionado.set(serv.id);
    this.formulario.estado=serv.estado;
    this.formulario.direccionServicio=serv.direccionServicio;
    this.formulario.recargoDomicilio=serv.recargoDomicilio;
    this.formulario.estDomicilio=serv.estDomicilio;
    this.formulario.duracionEstimada=serv.duracionEstimada;
    this.formulario.duracionReal=serv.duracionReal; // Corregido el corte de la línea 68
    this.mostrarModal.set(true);
  }

  cerrarModal():void{
    this.mostrarModal.set(false);
  }

  guardar():void{
    if(this.modoEdicion()&&this.idSeleccionado()!==null){
      this.serviciosService.funEditar(this.formulario,this.idSeleccionado()!).subscribe({
        next:()=>this.reiniciarYRefrescar(),
        error:(err)=>console.error(err)
      });
    }else{
      const nuevo={...this.formulario,fechaProgramada:new Date().toISOString()};
      this.serviciosService.funGuardar(nuevo).subscribe({
        next:()=>this.reiniciarYRefrescar(),
        error:(err)=>console.error(err)
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