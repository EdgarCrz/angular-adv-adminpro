import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2'; //despues de instalar este paquete hacemos la improtacion correspondiente

import { UsuarioService } from '../../services/usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  public formSubmitted = false;

  // Generamos un constructor de formulario, para indicar valicaciones
  // y asi mismo ponerle valores por default al form para no estar batallando al estar haciendo la app despues de quitan
  public registerForm = this.fb.group(
    {
      nombre: ['Edgar', Validators.required],
      email: [
        'pandemia.cruz@gmail.com',
        [Validators.required, Validators.email],
      ],
      password: ['123456', [Validators.required]],
      password2: ['123456', [Validators.required]],
      terminos: [false, [Validators.required, Validators.requiredTrue]],
    },
    {
      // Este validador se encarga de que las contrseñas sean las mismas
      validators: this.passwordsIguales('password', 'password2'), // creamos un validator personalizado, notose que se pone al terminar en este caso vamos a hacer referencia a una funcion que creamos abajo y ahi es donde haremos la validacion, notese que a ese metodo le enviamos como parametros los nombres de las propiedades a evaluar
    }
  );
  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService, // inyeccion de los servicios
    private router: Router
  ) {}

  crearUsuario() {
    this.formSubmitted = true;
    console.log(this.registerForm.value);

    if (this.registerForm.invalid) {
      return;
    }

    //Realizar posteo ó creación del usuario
    // Mandamos a llamar a nuestro servicio encargado de hacer la peticion Post para mandar la solicitud al backend
    // como parametros le mandamos el valor de "registerForm" y como es una promesa nos suscribimos a su resultado
    this.usuarioService.crearUsuario(this.registerForm.value).subscribe(
      (resp) => {
        this.router.navigateByUrl('/');
      },

      (err) => {
        //Al imporar el paquete de sweet alert ya podemos usar sus funciones, se puede consultar su documentacion para ver todo su potencial
        // El primer parametro es el titulo del error, el segundo ahi dice que es un html, aunque aqui metimos accedimos al "err/error/"  esoecificamente al "msg" que nos responde el backend como un json
        // Basicamente accedimos al mensaje que nos manda el bakend para poder usarlo por ultimo es un icono que viene en el paquete
        console.log(err);
        Swal.fire('Error', err.error.msg, 'error');
      }
      // en caso de un error lo mostramos con un warning
    );
  }

  campoNoValido(campo: string): boolean {
    if (this.registerForm.get(campo)?.invalid && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }
  contrasenasNoValidas() {
    const pass1 = this.registerForm.get('password')!.value;
    const pass2 = this.registerForm.get('password2')!.value;

    // si las contraseñas son diferentes y el formulario ha sido posteado devuelve un true(para poder mostrar el error)
    if (pass1 !== pass2 && this.formSubmitted) {
      return true; //(se muestra el error)
    } else {
      return false; //(no se muestra el error)
    }
  }

  aceptaTerminos() {
    // De entrada este check tiene valor False, por ende va a estar oculto, al darle click ahora su valor es TRUE, recordemos que este metodo devuelve TRUE para mostrar el mensaje de error / y False para No mostrar el mensaje
    // hay que invertir esto con "!" para que ahora su valor inicial sea TRUE Y cuando lo oprimamos cambie a false.
    // TRUE + FALSE = NO MOSTRAR EL MENSAJE DE ERROR
    // TRUE + TRUE = MOSTRAR MENSAJE DE ERROR;
    return !this.registerForm.get('terminos')?.value && this.formSubmitted;
  }

  // recibimos  dos parametros(aqui les ponemos otro nombre)
  passwordsIguales(pass1Name: string, pass2Name: string) {
    //vamos a retornar una funcion
    //"formGroup" es la referencia al formulario(solo al formulario en donde se esta ejecutando esta funcion, osea en el validador personalizado)
    return (formGroup: FormGroup) => {
      const pass1Control = formGroup.get(pass1Name); // aqui hacemos referencia a las propiedades que nos estan mandando(los nombres los estamos cambiando aunque pueden ser los mismos)
      const pass2Control = formGroup.get(pass2Name); // aqui hacemos referencia a las propiedades que nos estan mandando(los nombres los estamos cambiando aunque pueden ser los mismos)
      // Evaluamos si las contraseñas son iguales, si son iguales podemos enviarle a una propiedad(puede ser cualquiera de las dos) le mandamos errors en null indicando que no hay errores
      if (pass1Control?.value === pass2Control?.value) {
        pass2Control?.setErrors(null);
      } else {
        // Notese el setErrors registra un error en dicha propiedad
        pass2Control?.setErrors({ noEsIgual: true }); // de lo contrario si no son iguales, asignaremos una propiedad "noEsIgual" con estado true indicando que ese es el error
      }
    };
  }
}
