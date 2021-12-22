import { Component, OnInit, OnDestroy } from '@angular/core';
import { HospitalService } from '../../../services/hospital.service';
import { Hospital } from '../../../models/hospital.model';
import Swal from 'sweetalert2';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { BusquedasService } from '../../../services/busquedas.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [],
})
export class HospitalesComponent implements OnInit, OnDestroy {
  public hospitales: Hospital[] = [];
  public hospitalesTemp: Hospital[] = [];
  public cargando: boolean = true; // TODO: esto es una "bandera": su funcion solo es indicar cuando ha ocurrido algo, simplemente se cambia el estado actual y esto indica que cambio solo se pode el valor contrario despues de realizar alguna tarea.
  public imgSubs!: Subscription;
  constructor(
    private hospitalService: HospitalService,
    private modalImagenService: ModalImagenService,
    private busquedaService: BusquedasService
  ) {}
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarHospital();

    this.imgSubs = this.modalImagenService.nuevaImagen // Pareciera que recibimos la img y si, pero solo ocupamos el evento para cuando el subscribe recibe la "img" ejecutar el metodo de "cargarUsuario()" pero en ningun momento usamos la img que nos mandaron, solo el evento para activar esta funcion
      .pipe(delay(100)) // usamos el delay, porque hace muy rapido la peticion y no alcanzaba a poner la img nueva
      .subscribe((img) => {
        this.cargarHospital();
      });
  }

  cargarHospital() {
    this.cargando = true;
    // Realizamos la peticion, de los hospitales, en el servicio previamente modificmos la respuesta para obtener unicamente el array de hospitales dejando de lado el "ok"
    this.hospitalService.cargarHospitales().subscribe((hospitales) => {
      console.log(hospitales);
      this.hospitales = hospitales;
      this.cargando = false; // despues de este proceso cambiamos el valor de la "Bandera" para  poder quitar el loading
    });
  }

  // Se manda a llamar al servicio encargado de hacerla peticion de la actualizacion del hospital para eso solo le tenemos que mandar dos parametros
  // el id y el nombre en este caso es el nombre nuevo que nos esta pasando el html
  guardarCambios(hospital: Hospital) {
    console.log(hospital);
    this.hospitalService
      .actualizarHospital(hospital._id!, hospital.nombre) // ! los errores de que no se puede asignar undefined al tipo string se provocan porque Angular indicar que en este caso un string no  puede quedar vacio, en este caso le ponemos el ! indicando que "Nosotros sabemos lo que hacemos y que nose preocupe que esa info vendrá"
      .subscribe((resp) => {
        Swal.fire('Hospital actualizado', hospital.nombre, 'success');
        console.log(resp);
      });
  }

  // Mandamos llamar el servicio que  se encarga de hacer la peticion de eliminacion de el hospital
  eliminarHospital(hospital: Hospital) {
    Swal.fire({
      title: '¿Estas seguro?',
      text: `Eliminaras  ${hospital.nombre}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrar!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.hospitalService.borrarHospital(hospital._id!).subscribe((resp) => {
          this.cargarHospital();
          Swal.fire(
            'Borrado!',
            `Hospital ${hospital.nombre} eliminado`,
            'success'
          );
        });
      }
    });
  }

  async abrirSweetAlert() {
    const { value = '' } = await Swal.fire<string>({
      title: 'Crear Hospital',
      text: 'Ingrese el nombre del nuevo hospital',
      input: 'text',
      inputPlaceholder: 'Nombre del hospital',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
    });
    // trim() elimina los espacios en blanco en ambos extremos del string TODO: Esto en caso de que se oprima por error un espaciado, evitando asi mandar 'espacio vacio'
    if (value!.trim().length > 0) {
      this.hospitalService.crearHospital(value!).subscribe((resp: any) => {
        this.hospitales.push(resp.hospital); //En este caso en vez de llamar el metodo de cargarHospital() lo que se hizo fue hacer un push() directamente al array que muestra la tabla, al push le pasamos la info de la resp del backend
        Swal.fire('Hospital creado', `Se creo ${value}`, 'success');
      });
    } else {
      return;
    }
  }

  abrirModal(hospital: Hospital) {
    this.modalImagenService.abrirModal(
      'hospitales',
      hospital._id,
      hospital.img
    );
  }

  buscar(termino: string) {
    // Esta validacion es para que al borrar la busqueda, nos regrese a los ultimos datos despues de ingresar el termino de busqueda
    if (termino.length === 0) {
      return this.cargarHospital(); // se creo una propiedad publica casi igual al array de usuarios, solo que esta almacenara los resultados de busqueda temporalmente
    }
    console.log('Buscando...');
    return this.busquedaService
      .busquedas('hospitales', termino)
      .subscribe((resultados) => {
        // TODO: para evitar problemas con el tipado es necesario "Castear" yo lo comprendí que le volvemos a indicar que tipo es, ya que como el servicio puede ser de 3 tipos hasta el momento 2 Usuario u Hospital
        this.hospitales = resultados as Hospital[];
      });
  }
}
