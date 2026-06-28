import { Routes } from '@angular/router';
import { AdminLayout } from './admin/admin-layout/admin-layout';
import { Servicios } from './admin/servicios/servicios';
import { Clientes } from './admin/clientes/clientes';
import { Electrodomesticos } from './admin/electrodomesticos/electrodomesticos';
import { Diagnosticos } from './admin/diagnosticos/diagnosticos';
import { Login } from './auth/login/login';
import { Personal } from './modules/admin/personal/personal';

export const routes: Routes = [
  // Si no está logueado, lo mandamos al login por defecto
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  
  {
    path: 'admin',
    component: AdminLayout,
    children: [
      { path: '', redirectTo: 'servicios', pathMatch: 'full' },
      { path: 'servicios', component: Servicios },
      { path: 'clientes', component: Clientes },
      { path: 'electrodomesticos', component: Electrodomesticos },
      { path: 'diagnosticos', component: Diagnosticos },
      { path: 'personal', component: Personal }
    ]
  },
  { path: '**', redirectTo: 'login' }
];