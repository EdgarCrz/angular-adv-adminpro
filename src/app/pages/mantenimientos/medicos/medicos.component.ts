import { Component, OnInit, OnDestroy } from '@angular/core';
import { MedicoService } from 'src/app/services/medico.service';
import { Medico } from '../../../models/medico.model';
import { delay } from 'rxjs/operators';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { BusquedasService } from '../../../services/busquedas.service';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [],
})
export class MedicosComponent implements OnInit, OnDestroy {
  public medicos: Medico[] = [];
  public cargando: boolean = true;
  public imgSubs!: Subscription; //creamos esta propiedad de tipo SUBSCRIPTION, solo para juntarlo con el eventEmitter de esta mandera nos suscribimos en el ngOninit y ya solo esta suscrito y a la espera de que detecte el evento emit

  constructor(
    private medicosService: MedicoService,
    private modalImagenService: ModalImagenService,
    private busquedasService: BusquedasService
  ) {}
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarMedicos();

    this.imgSubs = this.modalImagenService.nuevaImagen // Pareciera que recibimos la img y si, pero solo ocupamos el evento para cuando el subscribe recibe la "img" ejecutar el metodo de "cargarUsuario()" pero en ningun momento usamos la img que nos mandaron, solo el evento para activar esta funcion
      .pipe(delay(100)) // usamos el delay, porque hace muy rapido la peticion y no alcanzaba a poner la img nueva
      .subscribe((img) => {
        this.cargarMedicos();
      });
  }
  cargarMedicos() {
    this.cargando;
    this.medicosService
      .cargarMedicos()
      .pipe(delay(300))
      .subscribe((medicos) => {
        console.log(medicos);
        this.medicos = medicos;
        this.cargando = false;
      });
  }
  abrirModal(medico: Medico) {
    this.modalImagenService.abrirModal('medicos', medico._id, medico.img);
  }

  buscar(termino: string) {
    if (termino.length === 0) {
      return this.cargarMedicos();
    }

    this.busquedasService
      .busquedas('medicos', termino)
      .subscribe((resultados) => {
        this.medicos = resultados as Medico[];
        // Esta parte es por mi cuenta no del curso, solo es agregar una alerta en caso de que no se encuentre la busqueda
        // if (this.medicos.length === 0) {
        //   Swal.fire('Sin resultados', 'No se encontro ningun registro', 'info');
        //   this.cargarMedicos()
        // }
      });

    // TODO: como plus despues de terminar este curso o para implementacion en otros proyectos se podria mostrar un alert con un mensaje indicando que no hay nada en la busqueda
  }

  borrarMedico(medico: Medico) {
    Swal.fire({
      title: '¿Estas seguro?',
      text: `Eliminaras  ${medico.nombre}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrar!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.medicosService.borrarMedico(medico._id!).subscribe((resp) => {
          this.cargarMedicos();
          Swal.fire('Borrado!', `Médico ${medico.nombre} eliminado`, 'success');
        });
      }
    });
  }
}
