import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SidebarService  {
 

  public menu: any[] = [];


  // Esta funcion se encargara de
  cargarMenu() {
    this.menu = JSON.parse(localStorage.getItem('menu')!) || [];  // previamente en el local guardamos el JSON ahora lo tenemos que transformar en un objeto javascript para poderlo usar en la implementacion de el menu(osea ya no lo necesitamos JSON)
  }

  // TODO:Este era el menu que teniamos inicialmente, era un menu estatico, el nuevo menu, lo estamos obteniendo desde el backend dependiendo el rol que se detecte a la hora de iniciar sesion, sera el menu que mostraremos 
  
  // menu: any[] = [
  //   {
  //     titulo: 'Principal',
  //     icono: 'mdi mdi-gauge',
  //     submenu: [
  //       { titulo: 'Dashboard', url: '/' },
  //       { titulo: 'ProgressBar', url: 'progress' },
  //       { titulo: 'Graficas', url: 'grafica1' },
  //       { titulo: 'Promesas', url: 'promesas' },
  //       { titulo: 'Rxjs', url: 'rxjs' },
  //     ],
  //   },
  //   {
  //     titulo: 'Mantenimiento',
  //     icono: 'mdi mdi-folder-lock-open',
  //     submenu: [
  //       { titulo: 'Usuario', url: 'usuarios' },
  //       { titulo: 'Hospitales', url: 'hospitales' },
  //       { titulo: 'Médicos', url: 'medicos' },
  //       { titulo: 'Médico', url: 'medico/:id' },
  //     ],
  //   },
  // ];
  // este servicio esta siendo usado en el componente ts
  // este arreglo contiene 1 elemento, y el a su vez contiene varias propiedades(basicamnte es un json)
  //  a las cuales accederemos en el html, para manejar el menu que ahi se encuentra, en este caso para facilitar el
  // añadir un nuevo item del menu y no tenerlo que hacer manualmente, ademas de que simplificamos nuestro codigo html
  // al poder usar bucles para repetir items que se encuentren en nuestros arreglos
}
