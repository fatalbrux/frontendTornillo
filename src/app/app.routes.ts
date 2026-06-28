import { Routes } from '@angular/router';
import { AdminLayoutComponent} from './admin/admin-layout/admin-layout';
import { Servicios } from './admin/servicios/servicios';

export const routes: Routes = [
  { path: '', redirectTo: 'admin', pathMatch: 'full' },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      // 1. Ruta por defecto al entrar a /admin (redirige a servicios por ejemplo)
      { path: '', redirectTo: 'servicios', pathMatch: 'full' },
      
      // 2. Tu pantalla asignada
      { path: 'servicios', component: Servicios }
      
      // TUS COMPAÑEROS SOLO DEBEN AGREGAR SUS PANTALLAS AQUÍ ABAJO:
      // { path: 'repuestos', component: RepuestosComponent },
    ]
  },
  { path: '**', redirectTo: 'admin' }
];