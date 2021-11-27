import { Component, OnInit } from '@angular/core';
import { ModalImagenService } from '../../services/modal-imagen.service';
import { FileUploadService } from '../../services/file-upload.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styles: [],
})
export class ModalImagenComponent implements OnInit {
  public imagenSubir!: File;
  public imgTemp: any = null; // creamos esta propiedad de img temporal para colocarla cuando el usuario selecciones una posible nueva img

  constructor(
    public modalImagenService: ModalImagenService,
    public fileUploadService: FileUploadService
  ) {}

  ngOnInit(): void {}

  cerrarModal() {
    this.imgTemp = null;
    this.modalImagenService.cerrarModal();
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
    reader.readAsDataURL(file); // este metodo comienza la lectura del objeto blob o file al terminar tenemos el atributo "result" contiene una data URL que contiene los datos del fichero, osea encontro la ruta en la maquina donde se hubica la img
    // onloadend: se activa una vez que ha terminado la lectura de el archivo (file) en este caso al terminar ejecuta una funcion
    reader.onloadend = () => {
      this.imgTemp = reader.result; //la img temporarl ahora tendra el valor de el result: que es una img base64 osea el codigo que crea la img
      console.log(reader.result); // mostramos esa info en consola
    };
    return true;
  }

  // Esta funcion se ejecutara al momento de oprimir el boton del formulario
  subirImagen() {
    const id: any = this.modalImagenService.id; // tenía problemas con el tipado, asi que use any / este id proviene del service y lo obtuvimos al abrir el modal, revisar ese proceso de obtencion
    const tipo = this.modalImagenService.tipo;  //ir al servicio en caso de olvidar el origen de estos datos

    this.fileUploadService
      .actualizarFoto(this.imagenSubir, tipo, id) // usamos el metodo "actualizarFoto()" y le mandamos los parametros que acabos de obtener, esta funcion es una promesa
      // aquí actualizamos la img en tiempo real
      .then((img) => {
        // con then obtenemos el resultado de esa promesa ya sea resolve o reject notese: que en esta promesa no incluimos como tal resolve o reject solo el try and catch y ahi en cada uno de ellos retornamos algo y segun se resulve deolvera un resultado

        Swal.fire('Guardado', 'Imagen actualizada', 'success');
        this.modalImagenService.nuevaImagen.emit(img) // con este EventEmitter, mandamos esta img al servicio, y por ende ahora la podemos mandar a cualquier otro componente donde usemos el servicio

        this.cerrarModal();
      })
      .catch((err) => {
        console.log(err);
        Swal.fire('Error', 'No se pudo subir la imagen', 'error');
      });
  }
}
