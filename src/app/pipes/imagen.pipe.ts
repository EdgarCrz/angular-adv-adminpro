import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';
const base_url = environment.base_url;
@Pipe({
  name: 'imagen', // de esta manera podremos hacer uso de nuestro pipe
})
export class ImagenPipe implements PipeTransform {
  // Recibimos los parametros que modificaremos  y tambien les pondremos su tipado, tambien podriamos crear una interface para esto
  transform(img: any, tipo: 'usuarios' | 'hospitales' | 'medicos'): string {
    // return 'hola mundo' + img + ' ' + tipo;
    if (!img) {
      return `${base_url}/upload/${tipo}/no-image`;
    }
    if (img.includes('https')) {
      return img; // gracias a que hace el return ya no continuara con las lineas de abajo
    }
    // En caso de que no entre en el if anterior tendremos que armar la url para poder accesar
    if (img) {
      return `${base_url}/upload/${tipo}/${img}`; // armamos la url  la cual podremos insertar dentro de una <img> para poderla mostrar en la vista 
    } else {
      return `${base_url}/upload/${tipo}/no-image`; //notemos que esta linea ya no tien sentido ya que en este caso esta validacion ya se hizo arriba
    }
  }
}

// TODO: ¿como crear un pipe? R: Usando ng creamos el pipe  aqui recibimos el dato que queremos modificar,
// en este caso recibimos dos parametros img y tipo ambos los reemplazamos en el transform que nos crea por
// defecto pone unos parametros pero los podemos reemplazar y definir que tipo seran
// Una vez procesados los datos los tenemos que retornar ya modificados
