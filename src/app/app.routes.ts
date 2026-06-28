import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout';
import { Servicios } from './admin/servicios/servicios';
import { Clientes } from './admin/clientes/clientes';
import { Electrodomesticos } from './admin/electrodomesticos/electrodomesticos';
import { Diagnosticos } from './admin/diagnosticos/diagnosticos';

export const routes: Routes = [
  { path: '', redirectTo: 'admin', pathMatch: 'full' },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'servicios', pathMatch: 'full' },
      
      // Pantalla de tu compañero
      { path: 'servicios', component: Servicios },
      
      // TUS PANTALLAS ASIGNADAS (Tu responsabilidad de flujo)
      { path: 'clientes', component: Clientes },
      { path: 'electrodomesticos', component: Electrodomesticos },
      { path: 'diagnosticos', component: Diagnosticos }
      
      // TUS COMPAÑEROS SOLO DEBEN AGREGAR SUS PANTALLAS AQUÍ ABAJO...
    ]
  },
  { path: '**', redirectTo: 'admin' }
];