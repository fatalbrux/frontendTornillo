import { Component } from '@angular/core';
import { InsumosComponent } from './insumos/insumos';
@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [InsumosComponent], // Lo declaramos como hijo
  templateUrl: './inventario.html'
})
export class InventarioComponent {}