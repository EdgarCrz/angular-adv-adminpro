import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private linkTheme = document.querySelector('#theme');

  constructor() {
    const url =
      localStorage.getItem('theme') || './assets/css/colors/purple-dark.css';
    this.linkTheme?.setAttribute('href', url);
    // Al iniciar la app vamos a traer el Item guardado en Localstorege en caso de no tener ninguno le vamos
    // a mandar un url por defauld y se lo mandamos con el setAtribute, para asignarle un href
  }

  changeTheme(theme: string) {
    //esta funcion recibe como parametro un valor theme de tipo string(en este caso nos trae el color)
    const url = `./assets/css/colors/${theme}.css`;
    // creamos una url modificable, segun la propiedad que nos manden, en este caso la cargamos en una constante "url"

    this.linkTheme?.setAttribute('href', url);
    // por ultimo, usamos la constante que viene cargada con la seleccion del elemento HTML, y modificamos su propiedad href y le insertamos la nueva url
    // y todo esto se repetira cada que se clicke en un boton de color

    localStorage.setItem('theme', url);
    this.checkCurrentTheme();
  }

  checkCurrentTheme() {
    const links = document.querySelectorAll('.selector'); // obtenemos todos los elementos html que contengan la clase ".selector"

    links.forEach((element: any) => {
      //vamos a recorrer los elementos que haya encontrado y para cad uno vamos a ejecutar una funcion
      element.classList.remove('working'); // gracias a classList listamos las clases que tenga ese elemento, y borramos la clase "working"

      const btnTheme = element.getAttribute('data-theme'); //aqui solo estoy extrayendo uno de los colores que me traje de las coincidencias
      const btnThemeUrl = `./assets/css/colors/${btnTheme}.css`;
      const currentTheme = this.linkTheme?.getAttribute('href');
      if (btnThemeUrl === currentTheme) {
        element.classList.add('working');
      }
    });
    // TODO:Para la la logica dentro de  checkCurrenTheme
    // Gracias al foreach, esto se va a repetir las veces que conicida la clase "selector"
    // vamos a extraer el color de cada boton y construiremos una Url con dicho color
    // despues vamos a extraer la Url actual que crea el color
    // y por ultimo vamos comparar la url que creamos con el boton y la url actual
    // en caso de coincidir a esa elemento con la clase que conicidio con la url que creamos a partir de esta, y que conicidio con la url actual7
    // a esa le añadiremos la clase working que es la palomita
  }
}

// TODO:para los metodos changeTheme y el checkCurrenTheme
// aqui se utilizo mucha manipulacion del DOM por medio de vanilla, en este caso se añadieron clases y se quitaron
// se usaron funciones para añadir y quitar clases, para seleccionar propiedades en un elemento html,
//  TODO:getAttribute Y setAttribute, son indispensables para traer añadir atributos a las etiquetas html
