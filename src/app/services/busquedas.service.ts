import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';
import { Hospital } from '../models/hospital.model';
import { Medico } from '../models/medico.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class BusquedasService {
  constructor(private http: HttpClient) {}

  get token() {
    return localStorage.getItem('token') || ''; //para evitar estar haciendo esto cada que necesitemos el token del localstorage
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token,
      },
    };
  }

  // Debido a que buscar solo estaba recibiendo el resultado de la peticion, osea simplemente estaba recibiendo un objeto con la info del usuario
  // No se podia mostrar la foto, para esto con el resultado(resp) de la busqueda se creo una nueva instancia de Usuario, con ello ahora si podiamos usar el imagenUrl()

  private transformarUsuarios(resultados: any[]): Usuario[] {
    return resultados.map(
      (user) =>
        new Usuario(
          user.nombre,
          user.email,
          ' ',
          user.img,
          user.google,
          user.role,
          user.uid
        )
    );
  }

  private transformarHospitales(resultados: any[]): Hospital[] {
    return resultados.map(
      (hospital) =>
        new Hospital(
          hospital.nombre,
          hospital._id,
          hospital.img,
          hospital.usuario
        )
    );
  }

  private transformarMedicos(resultados: any[]): Medico[] {
    return resultados.map(
      (medico) =>
        new Medico(
          medico.nombre,
          medico._id,
          medico.img,
          medico.usuario,
          medico.hospital
        )
    );
  }

  // Realizando la peticion de busqueda hacia el backend, determinamos que este servicio se llama busquedas, y va a recibir 2 parametros, "tipo" y "termino"
  // Construimos nuestra url verificando el path que tenemos indicado para nuestra peticion, y le inscrustamos los parametros que nos estan mandando esto con la finalidad que se la url sea mas dinamica para poderse usar tanto para usuarios, medicos y hospitales
  busquedas(tipo: 'usuarios' | 'medicos' | 'hospitales', termino: string) {
    const url = `${base_url}/todo/coleccion/${tipo}/${termino}`;
    console.log('Estoy en servicio');

    return this.http
      .get<any[]>(url, this.headers) // Declaramos que va a ser de tipo any y a su vez que sera un array, esto con la finalidad de poder igualar el resultado en esta busqueda con nuestra propiedad usuario misma que es tipo array
      .pipe(
        map((resp: any) => {
          switch (tipo) {
            case 'usuarios':
              return this.transformarUsuarios(resp.resultados);

            case 'hospitales':
              return this.transformarHospitales(resp.resultados);

            case 'medicos':
              return this.transformarMedicos(resp.resultados);
            default:
              return [];
          }
        })
      ); //transformamos el resp que es un json, para obtener solamente la propiedas "resultados" resultados es un array con las coincidencias que obtuvimos
  }

  busquedaGlobal(termino: string) {
    const url = `${base_url}/todo/${termino}`;

    return this.http.get<any>(url, this.headers);
  }
}
