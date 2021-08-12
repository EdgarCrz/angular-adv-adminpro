import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Grafica1Component } from './grafica1/grafica1.component';

const routes: Routes = [
  // implementacion de rutas hijas(son las que se encuentran dentro de una ruta padre como las de abajo)
  {
    path: 'dashboard',
    component: PagesComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'progress', component: ProgressComponent },
      { path: 'grafica1', component: Grafica1Component },
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