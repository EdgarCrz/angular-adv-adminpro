import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Hospital } from 'src/app/models/hospital.model';
import { Medico } from 'src/app/models/medico.model';
import { Usuario } from 'src/app/models/usuario.model';
import { BusquedasService } from 'src/app/services/busquedas.service';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styles: [],
})
export class BusquedaComponent implements OnInit {
  public usuarios: Usuario[] = [];
  public hospitales: Hospital[] = [];
  public medicos: Medico[] = [];
  constructor(
    private activatedRoute: ActivatedRoute,
    private busquedasService: BusquedasService
  ) {}

  ngOnInit(): void {
    // Al iniciar esta vista obtendremos el parametro que nos mandaron por el input de buscar. gracias al activatedRoute.params
    this.activatedRoute.params.subscribe(({ termino }) => {
      this.busquedaGlobal(termino);
    });
  }

  // Este medoto va a pedir el servicio y va a obtener una respuesta, la cual va ser un objeto con 3 arrays uno por cada modelo
  busquedaGlobal(termino: string) {
    this.busquedasService.busquedaGlobal(termino).subscribe((resp: any) => {
      console.log(resp);
      this.usuarios = resp.usuarios; // al inicio declaramos nuestras propiedades publicas para cada arreglo, y en cada uno guardaremos lo obtenido de la respuesta indicando el arreglo que queremos obtener
      this.medicos = resp.medicos; // al inicio declaramos nuestras propiedades publicas para cada arreglo, y en cada uno guardaremos lo obtenido de la respuesta indicando el arreglo que queremos obtener
      this.hospitales = resp.hospitales; // al inicio declaramos nuestras propiedades publicas para cada arreglo, y en cada uno guardaremos lo obtenido de la respuesta indicando el arreglo que queremos obtener
    });
    // Despues de esto, podremos acceder a la informacion en el html y podremos poner la informacion de la busqueda
  }


  // abrirMedico(medico) {


    
  // }
}
