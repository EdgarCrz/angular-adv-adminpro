import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

// esto lo usaremos posteriormente para hacer nuevas instancias de esta clase
export class Usuario {
  constructor(
    public nombre: string,
    public email: string,
    public password?: string,
    public img?: string,
    public google?: boolean,
    public role?: string,
    public uid?: string
  ) {}
  // /upload/usuario/no-image

  // Con este metodo obtendremos o crearemos la url de la img
  // Si inclute https dentro del string simplemente retornamos lo que contenga esa propiedad pues esto indica que es logeo por google
  get imagenUrl() {
    if (this.img?.includes('https')) {
      return this.img; // gracias a que hace el return ya no continuara con las lineas de abajo
    }
    // En caso de que no entre en el if anterior tendremos que armar la url para poder accesar
    if (this.img) {
      return `${base_url}/upload/usuarios/${this.img}`;
    } else {
      return `${base_url}/upload/usuarios/no-image`;
    }
  }
}
