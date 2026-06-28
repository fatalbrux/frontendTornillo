import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PresupuestosService } from '../../core/services/presupuestos';

@Component({
  selector: 'app-presupuestos',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './presupuestos.html',
  styleUrl: './presupuestos.css'
})
export class Presupuestos implements OnInit {
  private readonly fb=inject(FormBuilder);
  private readonly route=inject(ActivatedRoute);
  private readonly router=inject(Router);
  private readonly presupuestoService=inject(PresupuestosService);

  formPresupuesto!:FormGroup;
  idServicio!:number;

  ngOnInit():void{
    const idParam=this.route.snapshot.paramMap.get('id');
    this.idServicio=idParam?Number(idParam):0;

    this.funInicializarFormulario();
    this.funEscucharCambiosMontos();
  }

  funInicializarFormulario():void{
    this.formPresupuesto=this.fb.group({
      servicioId:[this.idServicio,[Validators.required]],
      costoManoObra:[0,[Validators.required,Validators.min(0)]],
      costoRepuestos:[0,[Validators.required,Validators.min(0)]],
      total:[0,[Validators.required,Validators.min(0)]],
      fechaRegistro:[new Date().toISOString()],
      aprobado:[false]
    });
  }

  funEscucharCambiosMontos():void{
    this.formPresupuesto.valueChanges.subscribe(valores=>{
      const manoObra=Number(valores.costoManoObra)||0;
      const repuestos=Number(valores.costoRepuestos)||0;
      const sumaTotal=manoObra+repuestos;

      this.formPresupuesto.patchValue(
        {total:sumaTotal},
        {emitEvent:false}
      );
    });
  }

  funEnviar():void{
    if(this.formPresupuesto.invalid)return;

    const payload=this.formPresupuesto.value;
    this.presupuestoService.funGuardar(payload).subscribe({
      next:()=>{
        this.router.navigate(['/tecnico/servicios-asignados']);
      },
      error:err=>console.error('Error guardando presupuesto:',err)
    });
  }
}