import { Routes } from '@angular/router';
import { AdminLayout } from './admin/admin-layout/admin-layout';
import { Servicios } from './admin/servicios/servicios';
import { Clientes } from './admin/clientes/clientes';
import { Electrodomesticos } from './admin/electrodomesticos/electrodomesticos';
import { Diagnosticos } from './admin/diagnosticos/diagnosticos';
import { Login } from './auth/login/login';
import { Personal } from './modules/admin/personal/personal';
import { Presupuestos } from './tecnico/presupuestos/presupuestos';
import { ServiciosAsignados } from './tecnico/servicios-asignados/servicios-asignados';
import { TecnicoLayoutComponent } from './tecnico/tecnico-layout/tecnico-layout';
import { Inicio } from './cliente/inicio/inicio';
import { ClienteLayoutComponent } from './cliente/cliente-layout/cliente-layout';
import { ClienteSesion } from './cliente/cliente-sesion/cliente-sesion';
import { InventarioComponent } from './admin/inventario/inventario';
import { ComprasComponent } from './admin/compras/compras';
import { FinanzasComponent } from './admin/finanzas/finanzas';

export const routes: Routes = [
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
      { path: 'personal', component: Personal },
      // 👇 Nueva ruta de inventario dentro del admin
      { path: 'inventario', component: InventarioComponent },
      { path: 'compras', component: ComprasComponent },
      { path: 'finanzas', component: FinanzasComponent }
    ]
  },

  {
    path: 'tecnico',
    component: TecnicoLayoutComponent,
    children: [
      { path: 'servicios-asignados', component: ServiciosAsignados },
      { path: 'presupuesto/:id', component: Presupuestos }
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