import { Component } from '@angular/core';
import { FacturasComponent } from './facturas/facturas';

@Component({
  selector: 'app-finanzas',
  standalone: true,
  imports: [FacturasComponent],
  templateUrl: './finanzas.html'
})
export class FinanzasComponent {}