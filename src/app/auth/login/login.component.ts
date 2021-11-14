import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2';

declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  //TODO: Hay diferencia entre el style y el styleUrl, en uno directamente metes el estilo en este mismo archivo en el otro le indicas el path de donde quieres que traiga dicha informacion
})
export class LoginComponent implements OnInit {
  public formSubmitted = false;
  public auth2: any;
  // Construimos con "fb"  un grupo de formulario llamado "loginForm" y agregamos los validadores necesarios
  public loginForm = this.fb.group({
    email: [localStorage.getItem('email') || '', [Validators.email]], // de esta manera treaemos los valores que tengamos guardados en localStorage
    password: ['', [Validators.requiredTrue]],
    remember: [false],
  });

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private ngZone: NgZone
  ) {}
  ngOnInit(): void {
    this.renderButton(); // este metodo se ejecutara al iniciar la app
  }

  // tenemos un metodo el cual ejecutamos al detectar el submit en el archivo html
  login() {
    // A su vez este metodo manda a llamar a un "servicio" el cual previamente inyectamos en el constructor
    // del servicios usamos la propiedad "login" como usamos peticiones http que devuelven un observable
    // Nos tenemos que suscribir, de lo contrario no se ejecutara si no hay ninguna subscriocion a ello
    this.usuarioService.login(this.loginForm.value).subscribe(
      (resp) => {
        console.log(resp);
        if (this.loginForm.get('remember')?.value) {
          localStorage.setItem('email', this.loginForm.get('email')?.value); // Asi mandamos a localStorage un valor de nuestor form reactive
        } else {
          localStorage.removeItem('email'); //asi removemos un valor guardado en localStorage
        }
        //TODO:Movernos al dash
        // NOTA IMPORTANTE: Cuando queramos navegar esta URL es ahi cuando se ejecuta nuestro Guard que nos dara o no el acceso
        this.router.navigateByUrl('/');
      },
      (err) => {
        Swal.fire('Error', err.error.msg, 'error');
      }
    );
    // console.log(this.loginForm.value);

    // this.router.navigateByUrl('/');
  }

  //Esta funcion la ejecutamos en el ciclo de vida  OnInit(osea al iniciar la app)
  //Renderizara el btn en el html
  renderButton() {
    gapi.signin2.render('my-signin2', {
      scope: 'profile email',
      width: 240,
      height: 50,
      longtitle: true,
      theme: 'dark',
    });
    this.startApp(); // mandamos llamar el metodo que nos da google,
  }

  // Esta funcion ahora metodo nos lo proporciona google

  async startApp() {
    //cargamos el api auth2 y la inicializamos
    await this.usuarioService.googleInit(); // en este servicio ya se hizo la verificacion de credenciales necesarias para usar el auth2 solo se mando llamar
    this.auth2 = this.usuarioService.auth2; // despues solo igualamos el auth2 de aqui con el del servicio que ya viene cargada con el inicio del auth2

    this.attachSignin(document.getElementById('my-signin2'));
  }
  // al boton que renderizamos le adjuntamos la api auth2
  attachSignin(element: any) {
    // al hacer click en el "element"(element es nuestro boton renderizado) se va a inicializar nuestra api de inicio de sesion
    this.auth2.attachClickHandler(
      element,
      {},
      (googleUser: any) => {
        const id_token = googleUser.getAuthResponse().id_token; // de esta manera obtenemos el id, proveniente del parametro "googleUser"

        this.usuarioService.loginGoogle(id_token).subscribe((resp) => {
          //TODO:Movernos al dash

          // Ya que estamos usando librerias que no son de angular tenemos que usar ngZone, para poder ejecutar trabajos fuera de angular
          this.ngZone.run(() => {
            // de nuevo aqui accedemos no sin antes pasar por el auth y conel token podemos pasar
            this.router.navigateByUrl('/');
          });
        }); //llamamos a nuestro servicio que tiene la peticion http para logearnos con google y ya que es un observable para que se ejecute nos suscribimos
      },
      (error: any) => {
        alert(JSON.stringify(error, undefined, 2));
      }
    );
  }
}
