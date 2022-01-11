import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MedicoService } from '../../../services/medico.service';
import { HospitalService } from '../../../services/hospital.service';
import { Hospital } from '../../../models/hospital.model';
import { Medico } from '../../../models/medico.model';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { delay, map } from 'rxjs/operators';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [],
})
export class MedicoComponent implements OnInit {
  public medicoForm!: FormGroup; // FormGroup con esto indicamos que medicoForm va a ser un un conjunto de inputs que conformaran medicoForm,
  public hospitales: Hospital[] = [];
  public medicoSeleccionado!: Medico; // Una vez que se ejecute "cargarMedico" esto tendra la informacion necesaria para poder mostrar la informacion en el html
  public hospitalSeleccionado?: Hospital;

  constructor(
    private fb: FormBuilder,
    private hospitalService: HospitalService,
    private medicoService: MedicoService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {} // que hace formBuilder? : cuando usamos fb evitamos crear una nueva
  // instancia de nuestro grupo de formulario "medicoForm" de lo contrario tendriamos que hacer esto ejemplo:
  // first: new FormControl('Nancy', Validators.minLength(2)), TODO: notemos que generamos una nueva instancia de el formControl (new)
  // last: new FormControl('Drew'), TODO: notemos que generamos una nueva instancia de el formControl (new)

  ngOnInit(): void {
    // En esta parte usamos "activatedRoute" para recuperar el id que esta en la url, lo hacemos el el ngOnInit para obtenerlo inmediatamente al iniciar la app
    // Una vez obtenido el id y gracias a que el "params" es un observable nos podemos suscribir a esto entonces cada que detecte el cambio nos lo va a reflejar y por ende ejecutaremos la funcion que le asignamos
    // Debido a este subscribe se estaban viendo afectados los procesos de abajo, ya que no estaba dando tiempo de cargar la demas informacion, en especifico la de el hospitalSeleccionado(la img) se uso un delay para darle tiempo de cargar lo demas
    this.activatedRoute.params.subscribe(({ id }) => this.cargarMedico(id)); // Notese que pude desestructurar los "params" para reducirlo a "id" ya que de esta forma indique que se llama en el pages.routing



    this.medicoForm = this.fb.group({
      nombre: ['', Validators.required],
      hospital: ['', Validators.required]
    });

    this.cargarHospitales();
    // De esta manera podemos suscribirnos al cambio de valor de un input de un formulario, en este caso queremos obtener ese valor para poder buscar la info de dicho hospital
    this.medicoForm.get('hospital')?.valueChanges.subscribe((hospitalId) => {
      this.hospitalSeleccionado = this.hospitales.find(
        (h) => h._id === hospitalId // En este caso "h" es lo que estamos buscando = donde encuentres un "h" que conincida con la propiedad _id que sea igual al hospitalId(que igual es un id)
        // De esta manera estamos obteniendo el hospital que se seleccione en el select y ya que tenemos la info podemos ponerla en la vista
      );
      console.log(this.hospitalSeleccionado);
    });
  }

  // Esta funcion es la encargada usar el servicio de obtener medico por id y una vez que obtenemos una respuesta indicamos que el "medicoSeleccionado" es el medico que nos responde el Backend
  cargarMedico(id: string) {
    // Con esta validacion verificamos si el id que se encuentra ahi es un id verdadero de mongo, o solo es el string que le estableciomos por defauld
    if (id === 'nuevo') {
      return;
    }

    this.medicoService
      .obtenerMedicoPorId(id)
      .pipe(delay(100)) // con esto arreglamos un bug, el delay es muy util cuando las cosas cargan muy rapido y no termina el proceso para cargar la informacion en este caso era la img del hospital
      .subscribe((medico) => {
        // Esta validacion es por si el usuario ingresa un id que ya no existe o escribe cualquier otra cosa no valida
        if (!medico) {
          this.router.navigateByUrl(`/dashboard/medicos`); //si no nos devulve un medico entonce termina el proceso
          return;
        }

        const {
          nombre,
          hospital: { _id },
        } = medico; // de esta manera obtenemos simplemente esos dos valores en vez de toda la respuesta y los valores que por el momento no nos interesan los dejamos de lado

        this.medicoSeleccionado = medico; // de esta manera el medico seleccionado tiene la informacion para poder mostrarla y es por esto que ahora en el html, el medico puede mostrar una img, porque ahora medicoSeleccionado ahora tiene los valores necesarios del modelo para poder cargarlos en la vista
        this.medicoForm.setValue({ nombre, hospital: _id }); // estos los usamos para setear los inputs vacios
      });
  }

  cargarHospitales() {
    this.hospitalService
      .cargarHospitales()
      .subscribe((hospitales: Hospital[]) => {
        this.hospitales = hospitales;
      });
  }

  guardarMedico() {
    const { nombre } = this.medicoForm.value;

    console.log(this.hospitalSeleccionado);

    // Si ya existe un medico seleccionado entonces voy a hacer la actualizacion
    if (this.medicoSeleccionado) {
      // De esta manera aplanamos los datos de un objeto, cuando tenemos muchos anidados, lo que se puede hacer es desestructurar esos datos(osea sacarlos) u de igual manera con algunos otros que esten anidados de esta manera lo dejamos planos en un objeto
      const data = {
        ...this.medicoForm.value,
        _id: this.medicoSeleccionado._id,
      };

      this.medicoService.actualizarMedico(data).subscribe((resp) => {
        console.log(resp);

        Swal.fire(
          'Actualizado',
          `${nombre} actualizado correctamente`,
          'success'
        );
      });
    } else {
      const { nombre } = this.medicoForm.value;
      this.medicoService
        .crearMedico(this.medicoForm.value)
        .subscribe((resp: any) => {
          // console.log();
          Swal.fire('Exito', `Médico ${nombre} creado con éxito`, 'success');
          this.router.navigateByUrl(`/dashboard/medico/${resp.medico._id}`);
        });
      // console.log(this.hospitalSeleccionado);
    }
  }
}
