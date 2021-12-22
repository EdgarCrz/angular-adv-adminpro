import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { Medico } from '../models/medico.model';
import { map } from 'rxjs/operators';
import { Hospital } from '../models/hospital.model';

const baseUrl = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class MedicoService {
  constructor(private http: HttpClient) {}

  get token() {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token,
      },
    };
  }
  // De esta manera realizamos la peticion http de carga, para obtener el arreglo de medicos, Notese que estamos
  // especificando el tipado de la resp del backend y usamos map para transformar esas respuesta y solo mandar el array de medicos
  cargarMedicos() {
    const url = `${baseUrl}/medicos`;

    return this.http
      .get<{ ok: boolean; medicos: Medico[] }>(url, this.headers)
      .pipe(map((resp: { ok: boolean; medicos: Medico[] }) => resp.medicos));
  }

  // Este es el endpoint para recuperar un solo medico, para realizar esto necesitamos un id el cual nos van a pasar en el componente, de igual manera en el componente "medico.component.ts" podemos ver como lo recuperan mediante "activtedRoute"
  obtenerMedicoPorId(id:string) {
    const url = `${baseUrl}/medicos/${id}`;  // creamos la url y le pasamos el id que nos mandan para poder hacer la petición

    return this.http
      .get(url, this.headers)
      .pipe(
        map((resp: any) => resp.medico));
    
  }

  // De esta manera creamos un medico construimos la url con la bseUrl que ya declaramos en las variables de entorno, Notese que podemos recibir el obj medico completo ya que el backend omitira la informacion que no necesite
  crearMedico(medico: {nombre:string, hospital:string}) {
    const url = `${baseUrl}/medicos`;
    return this.http.post(url, medico, this.headers); // no importa si como body le mandamos el objeto completo el backend solo sean el nombre y el hospital de igual manera nosotros en el back ya hizimos las validaciones para poder ignorar esos datos que vengan extras
  }

  // Peticion de actualizacion, solo basta checar los datos que necesita para poder realizar la peticion
  actualizarMedico(medico: Medico) {
    const url = `${baseUrl}/medicos/${medico._id}`;

    return this.http.put(url, medico, this.headers);
  }
  // Peticion de eliminacion, solo basta checar los datos que necesita para poder realizar la peticion

  borrarMedico(_id: string) {
    const url = `${baseUrl}/medicos/${_id}`;

    return this.http.delete(url, this.headers);
  }
}
