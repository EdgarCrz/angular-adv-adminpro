import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { UsuarioService } from './usuario.service';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  constructor() {}
// TODO:esta peticion se manejo fetch api, es la manera nativa de hacer peticiones http, por el contrario tambien se puede usar httpclient para hacer esta petocion, solo se enseño otra forma de hacerlo

  // Ya que este metodo va a trabajar en base a promesas tenemos que agregar el async
  async actualizarFoto(
    archivo: File,
    tipo: 'usuarios' | 'medicos' | 'hospitales',
    id: string
  ) {
    try {
      const url = `${base_url}/upload/${tipo}/${id}`; //con los valores que nos pasara el componente "perfil" podemos armar nuestra url
      const formData = new FormData(); // Facil formData crea una interfas clave/valor que representan campos de un formulario que luego pueden ser enviados facilmente por el metodo XMLHttpRequest()/ Basicamente creamos una interface con los campos que puede tener el formulario indicando una key y el valor para despues enviar en conjunto por una peticion http
      formData.append('imagen', archivo); //append() agregar un nuevo par clave/valor al final de el formData/ osea agregamos un nuevo campo al conjunto de datos que enviaremos TODO: en este ejercicio solo tenemos un campo que es la img7
      // formData.append('ejemplo1', archivo1); asi se agregarian mas campos
      // formData.append('ejemplo2', archivo2); asi se agregarian mas campos

      // TODO:Como hacer una peticion por el metodo fetch esta es la manera nativa de javascript a diferencia de el otro que es de angular
      // Cabe recalcar que esto solo es demostrativo bien podremos hacer la peticion como las hemos ido manejando siempre http.put(bla bla bla)
      const resp = await fetch(url, {
        method: 'PUT',
        headers: {
          'X-token': localStorage.getItem('token') || '',
        },
        body: formData, //aqui enviamos el body que es el formData() que construimos
      });
      const data = await resp.json(); // como la respuesta viene en formato json tenemos que usar ese metodo para que podamos leerlo
// recordar una ves mas que los if son en base a true o false y "ok" vendra con un true o un false
      if (data.ok) {
        return data.nombreArchivo;
      } else {
        console.log(data.msg);
        return false;
      }

      // return 'nombre de la imagen';
    } catch (error) {
      console.log(error);

      return false;
    }
  }
}
