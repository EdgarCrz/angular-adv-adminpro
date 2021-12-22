import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { map, delay } from 'rxjs/operators';
import { Hospital } from '../models/hospital.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class HospitalService {
  constructor(private http: HttpClient) {}

  // Traer el token de localStorage
  get token() {
    return localStorage.getItem('token') || ''; //para evitar estar haciendo esto cada que necesitemos el token del localstorage
  }

  // Traer los headers

  get headers() {
    return {
      headers: {
        'x-token': this.token,
      },
    };
  }

  // TODO:CRUD DE HOSPITALES
  // TODO: nota importante en est parte no manejaremos el paginado, esto se tiene que implementar tambien en el backend entonces como plus del curso podriamos implementarlo basandonos en el de usuarios, ya que de lo contrario nuestra tabla sera demasiado larga, si lo paginamos podremos mostrar cierta cantidad por tabla
  
  // Cargar los Hospitales
  cargarHospitales() {
    const url = `${base_url}/hospitales`;
    // Ya que esta peticion solo nos devolvia la info del usuario(mas no creaba una instancia de el modelo Usuario acá en el fron)
    // Se tuvo que crear una nueva instancia para cada usuario dentro de el array y como viene toda la info fue sencillo
    return this.http
      .get<{ ok: boolean; hospitales: Hospital[] }>(url, this.headers)
      .pipe(
        map((resp: { ok: boolean; hospitales: Hospital[] }) => resp.hospitales) //transformamos la respuesta para solo mandar el array de hospitales
      );
  }

  crearHospital(nombre: string) {
    const url = `${base_url}/hospitales`;
    // Ya que esta peticion solo nos devolvia la info del usuario(mas no creaba una instancia de el modelo Usuario acá en el fron)
    // Se tuvo que crear una nueva instancia para cada usuario dentro de el array y como viene toda la info fue sencillo
    return this.http.post(
      url,
      { nombre }, //segun yo se le manda {} con eso ya que el body es un objeto y ademas del nombre podria venir algo mas ademas de el nombre solo que para esta peticion solo se necesita esto
      this.headers
    );
  }

  actualizarHospital(_id: string, nombre: string) {
    const url = `${base_url}/hospitales/${_id}`;
    // Ya que esta peticion solo nos devolvia la info del usuario(mas no creaba una instancia de el modelo Usuario acá en el fron)
    // Se tuvo que crear una nueva instancia para cada usuario dentro de el array y como viene toda la info fue sencillo
    return this.http.put(
      url,
      { nombre }, //segun yo se le manda {} con eso ya que el body es un objeto y ademas del nombre podria venir algo mas ademas de el nombre solo que para esta peticion solo se necesita esto
      this.headers
    );
  }

  borrarHospital(_id: string) {
    const url = `${base_url}/hospitales/${_id}`;
    // Ya que esta peticion solo nos devolvia la info del usuario(mas no creaba una instancia de el modelo Usuario acá en el fron)
    // Se tuvo que crear una nueva instancia para cada usuario dentro de el array y como viene toda la info fue sencillo
    return this.http.delete(url, this.headers);
  }
}
