import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../services/usuario.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private usuarioService: UsuarioService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    // Debido a que ya tenemos todo lo necesario no necesitamos manejarlo de manera async asi que bien podemos solo usar un booleano
    state: RouterStateSnapshot
  ): boolean {
    const role = this.usuarioService.role;
    console.log('ADMIN GUARD');
    // Usando un ternario se ve mas mamalon
    // return role === 'ADMIN_ROLE' ? true : false;
    if (role === 'ADMIN_ROLE') {
      return true;
    } else {
      this.router.navigateByUrl('/dashboard');
      return false;
    }
  }
}
