import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { UsuarioService } from '../services/usuario.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private usuarioService: UsuarioService, private router: Router) {}

  // El canActivate espera un booleando para determinar si va a activar la ruta o no(puede recibir un observable, una promesa o directamente un booleando)
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    // Ya que para activar o desactivar el guard necesitamos true o false, hacemos uso del metodo validar token(es un obersvable que resuelve un booleano)
    return this.usuarioService.validarToken().pipe(
      // "estaAutenticado" en realidad es el true o false que nos resuelve el observable
      tap((estaAutenticado: any) => {
        if (!estaAutenticado) {
          this.router.navigateByUrl('/login');
        }
      })
    );
  }
}
