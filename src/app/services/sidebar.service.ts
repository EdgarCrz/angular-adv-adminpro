import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  menu: any[] = [
    {
      titulo: 'Principal',
      icono: 'mdi mdi-gauge',
      submenu: [
        { titulo: 'Dashboard', url: '/' },
        { titulo: 'ProgressBar', url: 'progress' },
        { titulo: 'Graficas', url: 'grafica1' },
        { titulo: 'Promesas', url: 'promesas' },
        { titulo: 'Rxjs', url: 'rxjs' },
      ],
    },
    {
      titulo: 'Mantenimiento',
      icono: 'mdi mdi-folder-lock-open',
      submenu: [
        { titulo: 'Usuario', url: 'usuarios' },
        { titulo: 'Hospitales', url: 'hospitales' },
        { titulo: 'Médicos', url: 'medicos' },
        { titulo: 'Médico', url: 'medico/:id' },
      ],
    },
  ];
  // este servicio esta siendo usado en el componente ts
  // este arreglo contiene 1 elemento, y el a su vez contiene varias propiedades(basicamnte es un json)
  //  a las cuales accederemos en el html, para manejar el menu que ahi se encuentra, en este caso para facilitar el
  // añadir un nuevo item del menu y no tenerlo que hacer manualmente, ademas de que simplificamos nuestro codigo html
  // al poder usar bucles para repetir items que se encuentren en nuestros arreglos

  constructor() {}
}
