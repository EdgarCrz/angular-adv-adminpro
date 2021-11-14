import { Injectable, NgZone } from '@angular/core'; //ngZone: Solventa el problema el problema de ejecucion de una libreria de terceros, en este caso es la libreria de google "signOut()"para autentificarnos
// despues de importar en el modulo "httpClientModule" ahora podemos usar "HttpClient"
import { HttpClient } from '@angular/common/http';
import { tap, map, catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment';

import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';
import { HeaderComponent } from '../shared/header/header.component';

const base_url = environment.base_url;
declare const gapi: any;

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  public auth2: any;
  public usuario!: Usuario; // es nuestra nueva instancia de tipo modelo
  // basicamente esto es un servicio como todos los demas
  constructor(
    private http: HttpClient,
    private router: Router,
    private ngZone: NgZone // pasar el cursor para ver la info
  ) {
    this.googleInit();
  }

  get token() {
    return localStorage.getItem('token') || ''; //para evitar estar haciendo esto cada que necesitemos el token del localstorage
  }

  get uid(): string {
    return this.usuario.uid || '';
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
    return this.http
      .get(`${base_url}/login/renew`, {
        headers: {
          'x-token': this.token, //al pasarlo por el renew se genera un nuevo token mas actual por ende el token que esta guardado ya no sirve por eso abajo tenemos que mandar el nuevo
        },
      })
      .pipe(
        map((resp: any) => {
          const { email, google, img = '', nombre, role, uid } = resp.usuario; // desestructuramos la info de la respuesta json
          this.usuario = new Usuario(nombre, email, '', img, google, role, uid); //creamos una nueva instancia del usuario
          localStorage.setItem('token', resp.token); //Este token que viene en el resp es una nueva version que nos propporciona el backend diferente ya que el renew token genera un nuevo token, a partir de el viejo token
          return true;
        }),
        // si hay una respuesta devolvemos un true si hay error false y con eso activamos o desactivamos el
        // recordemos que map es un operador de transformacion, cambia el resultado de un observable en lo que nosotros queramos
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

  // Actualizar usuario
  actualizarPerfil(data: { email: string; nombre: string; role: any }) {
    // Agregamos el role
    data = {
      ...data,
      role: this.usuario.role,
    };
    //url/params/body/headers
    return this.http.put(`${base_url}/usuarios/${this.uid}`, data, {
      headers: {
        'x-token': this.token, //al pasarlo por el renew se genera un nuevo token mas actual por ende el token que esta guardado ya no sirve por eso abajo tenemos que mandar el nuevo
      },
    });
  }

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
