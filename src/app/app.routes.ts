import { Routes } from '@angular/router';
import { AdminLayout } from './admin/admin-layout/admin-layout';
import { Servicios } from './admin/servicios/servicios';
import { Clientes } from './admin/clientes/clientes';
import { Electrodomesticos } from './admin/electrodomesticos/electrodomesticos';
import { Diagnosticos } from './admin/diagnosticos/diagnosticos';
import { Login } from './auth/login/login';
import { Personal } from './modules/admin/personal/personal';

import { Presupuestos } from './tecnico/presupuestos/presupuestos'; // Cambiado al componente real, no la interfaz
import { ServiciosAsignados } from './tecnico/servicios-asignados/servicios-asignados';
import { TecnicoLayoutComponent } from './tecnico/tecnico-layout/tecnico-layout';
import { Inicio } from './cliente/inicio/inicio';
import { ClienteLayoutComponent } from './cliente/cliente-layout/cliente-layout';
import { ClienteSesion } from './cliente/cliente-sesion/cliente-sesion';
export const routes: Routes = [
  // Si no está logueado, lo mandamos al login por defecto
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', component: Inicio },
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

  {
    path: 'tecnico',
    component: TecnicoLayoutComponent,
    children: [
      { path: 'servicios-asignados', component: ServiciosAsignados },
      { path: 'presupuesto/:id', component: Presupuestos } // Ahora sí cargará el componente formulario
    ]
  },

  {
    path: 'cliente',
    component: ClienteLayoutComponent,
    children: [
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
    { path: 'inicio', component: Inicio },
    { path: 'cliente-sesion', component: ClienteSesion }
    ]
  },


  { path: '**', redirectTo: 'login' }
];