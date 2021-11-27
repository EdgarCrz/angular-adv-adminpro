import { Component, OnInit } from '@angular/core';

import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';
import { FileUploadService } from '../../services/file-upload.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [],
})
export class PerfilComponent implements OnInit {
  public perfilForm!: FormGroup;
  public usuario!: Usuario;
  public imagenSubir!: File;
  public imgTemp: any = null; // creamos esta propiedad de img temporal para colocarla cuando el usuario selecciones una posible nueva img

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private fileUploadService: FileUploadService
  ) {
    this.usuario = this.usuarioService.usuario; //cargamos nuestro usuario(local) con el usuario que viene del sevicio aquel ya viene con toda la informacion del usuario que le cargamos al hacer el renew(al entrar)
  }

  ngOnInit(): void {
    this.perfilForm = this.fb.group({
      nombre: [this.usuario.nombre, [Validators.required]],
      email: [this.usuario.email, [Validators.email, Validators.required]],
    });
  }

  // LLamamos a nuestro servicio
  actualizarPerfil() {
    this.usuarioService.actualizarPerfil(this.perfilForm.value).subscribe(
      (resp) => {
        const { nombre, email } = this.perfilForm.value;
        // console.log(resp); //ver en consola el cambio que se hizo
        // Esto para actualizar los datos en el front al mismo tiempo que hacemos el cambio en el backend de lo contrario el cambio lo hara hasta que refresquemos la pagina y vuelva a cargar los datos del backend
        this.usuario.nombre = nombre; // apuntamos a nuestro usuario(local) que ya viene con toda la info que le paso el servicio y declaramos que su propiedad this.usuario.nombre(la actual) ahora sera = nombre(el nuevo) que obtenemos del perfilForm o tambien lo podemos obtener de la resp
        this.usuario.email = email; // apuntamos a nuestro usuario(local) que ya viene con toda la info que le paso el servicio y declaramos que su propiedad this.usuario.email(la actual) ahora sera =email(el nuevo) que obtenemos del perfilForm o tambien lo podemos obtener de la resp

        Swal.fire('Guardado', 'Modificación exitosa', 'success');
      },
      (err) => {
        console.log(err);

        Swal.fire('Error', err.error.msg, 'error');
      }
    );
  }
  // Esto se ejecuta al detectar el evento change (osea al cargar a img) loque hace esta funcion es buscar en el event el nombre de la img y traerla aqui para vincularla con nuestra propiedad
  cambiarImagen(event: any) {
    const file = event?.target?.files[0]; // en el evento viene el nombre de la img solo hay que encontrar el path
    this.imagenSubir = file; // declaramos que nuestra propiedad va a ser la img que tenemos en el $event

    // TODO: como mostrar la img que el usuario posiblemente cambie
    // Esta validacion es para que no continue con el proceso de abajo si no hay un file
    if (!file) {
      return (this.imgTemp = null);
    }
    const reader = new FileReader(); // FileReader(): Basicamente se encarga de que las aplicaciones web pudan leer ficherons o informacion en buffer almacenados en el cliente de forma asyncrona usando objetos file o blop, osea nos permite ver el archivo que acaba de cargar el usuario
    reader.readAsDataURL(file); // este metodo comienza la lectura del objeto blob o file al terminar tenemos el atributo "result" contiene una data URL que contiene los datos del fichero
    // onloadend: se activa una vez que ha terminado la lectura de el archivo (file) en este caso al terminar ejecuta una funcion
    reader.onloadend = () => {
      this.imgTemp = reader.result; //la img temporarl ahora tendra el valor de el result: que es una img base64 osea el codigo que crea la img
      console.log(reader.result); // mostramos esa info en consola
    };
    return true;
  }
  // Esta funcion se ejecutara al momento de oprimir el boton del formulario
  subirImagen() {
    this.fileUploadService
      .actualizarFoto(this.imagenSubir, 'usuarios', this.usuario.uid!) // usamos el metodo "actualizarFoto()" y le mandamos los parametros que acabos de obtener, esta funcion es una promesa
      // aquí actualizamos la img en tiempo real
      .then((img) => {
        // con then obtenemos el resultado de esa promesa ya sea resolve o reject notese: que en esta promesa no incluimos como tal resolve o reject solo el try and catch y ahi en cada uno de ellos retornamos algo y segun se resulve deolvera un resultado
        this.usuario.img = img;
        Swal.fire('Guardado', 'Imagen actualizada', 'success');
      })
      .catch((err) => {
        console.log(err);
        Swal.fire('Error','No se pudo subir la imagen', 'error');
      });
  }
}
