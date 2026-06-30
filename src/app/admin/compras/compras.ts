import { Component } from '@angular/core';
import { DetalleComprasComponent } from './detalle-compras/detalle-compras';

@Component({
  selector: 'app-compras',
  standalone: true,
  imports: [DetalleComprasComponent],
  templateUrl: './compras.html'
})
export class ComprasComponent {}