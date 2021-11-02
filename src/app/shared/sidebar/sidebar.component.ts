import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [],
})
export class SidebarComponent implements OnInit {
  menuItems: any[] = [];
  constructor(private sidebarServices: SidebarService, private usuarioService:UsuarioService) {
    // inyectamoms nuestro servicio
    this.menuItems = this.sidebarServices.menu; // ejecutamos dicho servicio para mantener mas limpio nuestro codigo

    console.log(this.menuItems); //
  }

  ngOnInit(): void { }
  logout() {
    this.usuarioService.logout();
  }
}
