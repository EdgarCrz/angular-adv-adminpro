import { Component } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [],
})
export class HeaderComponent {
  public usuario!: Usuario;

  constructor(private usuarioService: UsuarioService, private router: Router) {
    // accedemos al servicio, que a su vez tiene una instancia del modelo usuario y a su vez accedemos a su metodo "imagenUrl"

    this.usuario = usuarioService.usuario;
  }

  logout() {
    this.usuarioService.logout();
  }

  // En esta funcion obtenemos el termion que nos mandaron por el input el cual vamos a ocupara para realizar la busqueda en en el servicio de busqueda

  buscar(termino: string) {
    // Con esta validacion indicamos que se busco un espacio vacio
    if (termino.length === 0) {
      
      Swal.fire(
        'No encontrado',
        `El termino "  " no existe`,
        'question'
      );
    }
    this.router.navigateByUrl(`/dashboard/buscar/${termino}`); // Al ultimo de esta funcion vamos a hacer la navegacion hacia el componente busqueda el cual nos mostrara la informacion obtenida despues de la peticion, notese que ya le estamos mandando el termino  mediante los parametros
  }
}
