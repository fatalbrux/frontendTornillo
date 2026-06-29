import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { PresupuestosService } from '../../core/services/presupuestos';

@Component({
  selector: 'app-presupuestos',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './presupuestos.html',
  styleUrl: './presupuestos.css'
})
export class Presupuestos implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);
  private readonly presupuestoService = inject(PresupuestosService);

  formPresupuesto!: FormGroup;
  idServicio!: number;
  protected readonly hoy = new Date();
  protected servicio = signal<any>(null);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.idServicio = idParam ? Number(idParam) : 0;
    this.funInicializarFormulario();
    this.funEscucharCambiosMontos();
    this.cargarServicio();
  }

  cargarServicio(): void {
    this.http.get<any>(`http://localhost:3000/servicios/${this.idServicio}`).subscribe({
      next: (res) => this.servicio.set(res),
      error: (err) => console.error(err)
    });
  }

  funInicializarFormulario(): void {
    this.formPresupuesto = this.fb.group({
      servicioId: [this.idServicio, [Validators.required]],
      costoManoObra: [0, [Validators.required, Validators.min(0)]],
      costoRepuestos: [0, [Validators.required, Validators.min(0)]],
      total: [0, [Validators.required, Validators.min(0)]],
      fechaRegistro: [new Date().toISOString()],
      aprobado: [false]
    });
  }

  funEscucharCambiosMontos(): void {
    this.formPresupuesto.valueChanges.subscribe(valores => {
      const manoObra = Number(valores.costoManoObra) || 0;
      const repuestos = Number(valores.costoRepuestos) || 0;
      this.formPresupuesto.patchValue({ total: manoObra + repuestos }, { emitEvent: false });
    });
  }

  funEnviar(): void {
    if (this.formPresupuesto.invalid) return;
    this.presupuestoService.funGuardar(this.formPresupuesto.value).subscribe({
      next: () => this.router.navigate(['/tecnico/servicios-asignados']),
      error: err => console.error('Error guardando presupuesto:', err)
    });
  }
}