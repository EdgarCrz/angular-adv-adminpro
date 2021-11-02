import { Injectable, NgZone } from '@angular/core'; //ngZone: Solventa el problema el problema de ejecucion de una libreria de terceros, en este caso es la libreria de google "signOut()"para autentificarnos
// despues de importar en el modulo "httpClientModule" ahora podemos usar "HttpClient"
import { HttpClient } from '@angular/common/http';
import { tap, map, catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment';

import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

const base_url = environment.base_url;
declare const gapi: any;

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  public auth2: any;
  // basicamente esto es un servicio como todos los demas
  constructor(
    private http: HttpClient,
    private router: Router,
    private ngZone: NgZone // pasar el cursor para ver la info
  ) {
    this.googleInit();
  }

  // Logout

  googleInit() {
    return new Promise<void>((resolve) => {
      gapi.load('auth2', () => {
        //cargamos el api auth2 y la inicializamos
        this.auth2 = gapi.auth2.init({
          client_id:
            '575971163309-m6173pckefcha51881kbfh40g3gnuo7m.apps.googleusercontent.com', // necesitamos nuestro id "credencial" de la api que estamos usando
          cookiepolicy: 'single_host_origin',
          // Request scopes in addition to 'profile' and 'email'
          //scope: 'additional_scope'
        });
        resolve();
      });
    });
  }

  // Salir de la aplicaccion de manera adecuada borrando el token del localStorage y ademas cerrando la sesion de google,
  //
  logout() {
    localStorage.removeItem('token'); //Removemos el token
    this.auth2.signOut().then(() => {
      this.ngZone.run(() => {
        this.router.navigateByUrl('/login');
      });
    });
  }

  //Validar token para adar acceso una vez que nos hagamos login, ya que resuelve un booleano  nos sirve para el guard
  validarToken(): Observable<boolean> {
    const token = localStorage.getItem('token') || '';

    return this.http
      .get(`${base_url}/login/renew`, {
        headers: {
          'x-token': token, //al pasarlo por el renew se genera un nuevo token mas actual por ende el token que esta guardado ya no sirve por eso abajo tenemos que mandar el nuevo
        },
      })
      .pipe(
        tap((resp: any) => {
          localStorage.setItem('token', resp.token); //Este token que viene en el resp es una nueva version que nos propporciona el backend diferente ya que el renew token genera un nuevo token, a partir de el viejo token
        }),
        // si hay una respuesta devolvemos un true si hay error false y con eso activamos o desactivamos el
        map((resp) => true), // recordemos que map es un operador de transformacion, cambia el resultado de un observable en lo que nosotros queramos
        catchError((error) => of(false))
      );
  }

  // creamos este metodo/Servicio que recibe "formData" = los datos del formulario en el cual viene lo que solicita nuestra peticion post (email, nombre y contraseña) tambien le añadimos tipado con nuestra interface "RegisterForm"
  crearUsuario = (formData: RegisterForm) => {
    // como es un observable tenemos que retornar la peticion
    // el primer parametrp es la url de la peticion y el segundo el body de la peticion
    return this.http.post(`${base_url}/usuarios`, formData).pipe(
      tap((resp: any) => {
        localStorage.setItem('token', resp.token);
      })
    );
  };

  // Inicio de sesión "normal"
  login = (formData: LoginForm) => {
    // como es un observable tenemos que retornar la peticion
    // el primer parametro es la url de la peticion y el segundo el body de la peticion
    return this.http.post(`${base_url}/login`, formData).pipe(
      tap((resp: any) => {
        localStorage.setItem('token', resp.token); // usamos el metodo "serItem" de "localStorage" para mandar "token" (asi le llamamos es la key puede tener cualquier nombre) como segundo parametro mandamos lo que queremos guardar debe ser un string
      })
    );
  };

  // Inicio de sesión con Autentificacion de "google"
  loginGoogle = (token: string) => {
    // hasta el momento el token es el de google
    // como es un observable tenemos que retornar la peticion
    // el primer parametro es la url de la peticion y el segundo el body de la peticion
    return this.http.post(`${base_url}/login/google`, { token }).pipe(
      tap((resp: any) => {
        localStorage.setItem('token', resp.token); // usamos el metodo "setItem" de "localStorage" para mandar "token" (asi le llamamos es la key puede tener cualquier nombre) como segundo parametro mandamos lo que queremos guardar debe ser un string
      })
    );
  };
}
