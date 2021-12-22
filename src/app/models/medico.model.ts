import { Hospital } from './hospital.model';
interface _MedicoUser {
  _id: string;
  nombre: string;
  img: string;
}

// Creamos nuestro modelo, estas son las propiedades que componen a un usuario, de esta manera cuando recibamos como respuesta del backend
// podremos crear instancias de este modelo, de esa manera obtenemos un "Medico" externo, y aqui creamos una nueva instancia de el medico para poder usarlo de manera "local"
//Esto tambien ayuda al manejo del tipado
export class Medico {
  constructor(
    public nombre: string,
    public _id?: string,
    public img?: string,
    public usuario?: _MedicoUser,
    public hospital?: Hospital
  ) {}
}
