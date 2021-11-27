import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../models/usuario.model';
import { BusquedasService } from '../../../services/busquedas.service';
import Swal from 'sweetalert2';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [],
})
export class UsuariosComponent implements OnInit, OnDestroy {
  public totalUsuarios: number = 0;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];
  public imgSubs!: Subscription;
  public desde: number = 0;
  public cargando: boolean = true;

  constructor(
    private usuarioService: UsuarioService,
    private busquedasService: BusquedasService,
    private modalImagenService: ModalImagenService
  ) {}
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarUsuarios();
    this.imgSubs = this.modalImagenService.nuevaImagen // Pareciera que recibimos la img y si, pero solo ocupamos el evento para cuando el subscribe recibe la "img" ejecutar el metodo de "cargarUsuario()" pero en ningun momento usamos la img que nos mandaron, solo el evento para activar esta funcion
      .pipe(delay(100)) // usamos el delay, porque hace muy rapido la peticion y no alcanzaba a poner la img nueva
      .subscribe((img) => {
        this.cargarUsuarios();
      });
  }
  // Creamos este metodo  para mandarlo a llamar al hacer el ngOnInit y tambien mandarlo a llamar cuando se haga el click del boton que activa "cambiarDesde"
  cargarUsuarios() {
    this.cargando = true;
    this.usuarioService
      .cargarUsuarios(this.desde)
      .subscribe(({ total, usuarios }) => {
        this.totalUsuarios = total;
        this.usuarios = usuarios;
        this.usuariosTemp = usuarios;
        console.log(usuarios);
        this.cargando = false;
      });
  }
  cambiarDesde(valor: number) {
    // Hacemos la operacion que va actualizar el valor de "desde" tambien validamos que no sea negativo ni mayor al total de los registros en la base de datos
    this.desde += valor;
    // a desde le iremos sumando el valor de "valor" en caso de que llegue a ser menos que 0 se le asignara el valor de 0 automaticamente, por el contrario si  valor llegase a ser mayo que el total de usuarios, le restaremos 5 para que no sobrepase ese limite nunca
    if (this.desde < 0) {
      this.desde = 0;
    } else if (this.desde >= this.totalUsuarios) {
      this.desde -= valor;
    }
    this.cargarUsuarios(); //volvemos a llamar el metodo para actualizar la vista con los usuarios correspondientes a la paginacion
  }
  // Metodo de BUSQUEDA, consumir nuestra busqueda
  // Cuando usamos este metodo en  el html, nos mandan lo que se encuentre dentro del input y ejecuta esta funcion cada que se oprime una tecla dentro del imput con keyUp
  buscar(termino: string) {
    // Esta validacion es para que al borrar la busqueda, nos regrese a los ultimos datos despues de ingresar el termino de busqueda
    if (termino.length === 0) {
      return (this.usuarios = this.usuariosTemp); // se creo una propiedad publica casi igual al array de usuarios, solo que esta almacenara los resultados de busqueda temporalmente
    }
    return this.busquedasService
      .busquedas('usuarios', termino) //Ya que el servicio requiere estos dos campos, el tipo se lo mandadmos en duro 'usuarios' y el termino es aquello que obtenemos en el input
      .subscribe((resultados) => {
        // para ejecutar el observable nos suscribimos y esperamos el resultado con el resultados hacemos lo que necesitamos
        this.usuarios = resultados; // en este caso lo que queremos es igualar nuestra propedad usuarios(que es el array que nos muestra la tabla) con los resultados y como ambos son tipo array no hay ningun problema
      });
  }

  eliminarUsuario(usuario: Usuario) {
    // Evitar borrarme a mi mismo
    if (usuario.uid === this.usuarioService.uid) {
      return Swal.fire('Error', 'No puede borrarse a si mismo', 'error');
    }

    Swal.fire({
      title: `¿Borrar usuario?`,
      text: `Esta a punto de borrar  a ${usuario.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrarlo',
    }).then((result) => {
      // En este punto mandamos llamar al servicio que realiza la peticion htttp y borra el usuario que le mandemos
      this.usuarioService.eliminarUsuario(usuario).subscribe((resp) => {
        // result.value = True
        if (result.value) {
          Swal.fire(
            'Usuario borrado!',
            `${usuario.nombre}, ha sido eliminado`,
            'success'
          );
          this.cargarUsuarios(); // volvemos a llamar este metodo para actualizar la tabla o bien tambien podriamos borrar el usuario del array, pero esto es mas sencillo
        }
      });
    });
    return true;
  }

  //recibimos el usuario que nos mandan, este usuario ya viene con el nuevo rol cambiado
  cambiarRole(usuario: Usuario) {
    this.usuarioService.guardarUsuario(usuario).subscribe((resp) => {
      console.log(resp);
    });
  }

  // Recordar que este "usuario" es el que obtuvimos del html al hacer el forech del array de "usuarios"
  abrirModal(usuario: Usuario) {
    // Los valores que mandamos son para poder armar la url de la img
    this.modalImagenService.abrirModal('usuarios', usuario.uid, usuario.img);
  }
}
