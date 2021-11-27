import { Injectable, EventEmitter } from '@angular/core';
import { environment } from '../../environments/environment.prod';

const base_url = environment.base_url;
@Injectable({
  providedIn: 'root',
})
export class ModalImagenService {
  private _ocultarModal: boolean = true; // para ocultarlo necesita tener true inicialmente ya que gracias a esto, el modal tendra una propiedad css display:none
  public tipo!: 'usuarios' | 'medicos' | 'hospitales';
  public id?: string;
  public img?: string;

  public nuevaImagen: EventEmitter<string> = new EventEmitter<string>() // EventEmitter: Nos permite enviar informacion entre componentes, independientemente la jerarquia padre/hijo: esto contendra la img/ TODO: en este caso no ocupamos la img, solo el evento de carga,

  // Inicialmente la vista recurrira a este getter obteniendo asi el valor actual que será true con esto se mantendra oculto
  get ocultarModal() {
    return this._ocultarModal;
  }

  // Para abrir el modal, cambiamos el valor a false, de esta manera la vista del modal ya no tendra la clase ocultar, de esta manera sera visible el modal
  abrirModal(
    tipo: 'usuarios' | 'medicos' | 'hospitales',
    id?: string,
    img: string = 'no-img'
  ) {
    this._ocultarModal = false;
    this.tipo = tipo;
    this.id = id;
    this.img = img;

    // Validamos que la img sea el path completo(google) de ser el caso ya viene la url completa de lo contrario procedemos a armarla
    if (img.includes('https')) {
      this.img = img;
    } else {
      this.img = `${base_url}/upload/${tipo}/${img}`; // con los parametros que nos mandaron armamos la url
    }
  }
  // Para cerrar el modal hacemos lo contrario cambiamos a true el valor de la propiedad, de esta manera se le añade la clase ocultar
  cerrarModal() {
    this._ocultarModal = true;
  }
  constructor() {}
}

// Basicamente el echo de que se vea o no el modal dependerá de el valor de this._ocultarModal ya que con esto pondremos y quitaremos la clase ocultar que usa un display none
