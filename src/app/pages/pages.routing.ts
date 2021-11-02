import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { AuthGuard } from '../guards/auth.guard';

const routes: Routes = [
  // implementacion de rutas hijas(son las que se encuentran dentro de una ruta padre como las de abajo)
  {
    path: 'dashboard',
    component: PagesComponent,
    canActivate:[ AuthGuard], // agregamos nuestro guard, esto determinara si puede o no mostrar las siguientes rutas
    children: [
      {
        path: '',
        component: DashboardComponent,
        data: { titulo: 'Dashboard' },
      },
      {
        path: 'progress',
        component: ProgressComponent,
        data: { titulo: 'Progress' },
      },
      {
        path: 'grafica1',
        component: Grafica1Component,
        data: { titulo: 'Grafica' },
      },
      {
        path: 'account-settings',
        component: AccountSettingsComponent,
        data: { titulo: 'Account' },
      },
      {
        path: 'promesas',
        component: PromesasComponent,
        data: { titulo: 'Promesas' },
      },
      { path: 'rxjs', component: RxjsComponent, data: { titulo: 'Rxjs' } },
    ],
  },
  //   Traduccion, tenemos nuestras rutas principales, que nos rutean a nuestros modulos, cada modulo
  //   tiene componentes, y pueden llegar a ser muchos, asi que cada modulo trabaja su propio sistema de rutas
  // asi todas las rutas se vuelven menos complejas y no tenemos un cagadero
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
