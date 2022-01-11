import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [],
})
export class SidebarComponent implements OnInit {
  // public imgUrl = '';esta forma se uso en header para traer y mostrar esta info, es directo del modelo el de abajo es por una instancia del modelo
  // public nombreUsuario = '';esta forma se uso en header para traer y mostrar esta info, es directo del modelo el de abajo es por una instancia del modelo
  public usuario!: Usuario;//Por el contrario de header aqui creamos una nueva propiedad publica usuario de tipoUsuario
  constructor(
    public sidebarServices: SidebarService,
    private usuarioService: UsuarioService
  ) {
    // accedemos al servicio, que a su vez tiene una instancia del modelo usuario y a su vez accedemos a su metodo "imagenUrl"
    this.usuario = usuarioService.usuario; //aqui igualamos nuestro usuario local a la instancia del modelo que se encuentra en ese servicio
  }

  ngOnInit(): void {}
  logout() {
    this.usuarioService.logout();
  }
}
