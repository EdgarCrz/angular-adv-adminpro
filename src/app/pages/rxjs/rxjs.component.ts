import { Component, OnDestroy } from '@angular/core';
import { Observable, interval, Subscription } from 'rxjs'; //en rxjs encontramos funciones en general,
import { retry, take, map, filter } from 'rxjs/operators'; // son partes mas chicas que se le pueden añadir a los observables, y tambien se pueden encadenar entre si

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: [],
})
export class RxjsComponent implements OnDestroy {
  public intervalSubs!: Subscription;
  constructor() {
    // this.retornaObservable()
    //   .pipe(retry(2))
    //   .subscribe(
    //     (valor) => console.log('Subs:', valor), //NEXT:primer argumento del subscribe, siguiente funcion que se ejecutara
    //     (error) => console.warn('Error:', error), //ERROR: segundo argumento del subscribe, esta funcion se ejecutara en caso de que se presente un error
    //     () => console.info('obs terminado') // COMPLETE, tercer argumento, da por terminado el observable
    //   );
    // me suscribo a todo lo que conlleva "obs$" y en este caso subscribe recibe un valor de nuestro obvservable
    // dicho valor que recibe lo podemos llamar como queramos y hacer lo que queramos con el, en este caso con
    // nuesta subscripcion lo que quereos hacer es imprimirlo en consola
    // y como nuestro observable es sumarle 1 cada segundo asi continuara imprimiendo el mensaje cada que aumenta
    this.intervalSubs = this.retornaIntervalo().subscribe((valor) => {
      console.log(valor);
    });
    // this.retornaIntervalo().subscribe(console.log);  Esta es la forma simplificada de imprimir en consola
    //Esto es propio de vanilla, es como si dijera, sea lo que sea que me devuelva esta funcion, imprimelo en
    // consoloa
  }
  ngOnDestroy(): void {
    this.intervalSubs.unsubscribe();
  }
  // Restructuracion del codigo de hasta abajo
  retornaIntervalo(): Observable<number> {
    return interval(100).pipe(
      // take(10) //este operador sirve para indicar el numero de emiciones por parte del observable
      map((valor) => valor + 1), //transforma el valor que recibimos en lo que queramos
      filter((valor) => (valor % 2 === 0 ? true : false))
    ); //Interval:Esta funcion crea numeros secuenciales, cada intervalo que le indique
  }
  // Esta funcion es basicamente la misma que abajo pero echa de una manera mas limpia y con mejores metodos mas eficientes

  retornaObservable(): Observable<number> {
    let i = -1;

    return new Observable<number>((observer) => {
      const intervalo = setInterval(() => {
        i++;
        observer.next(i);

        if (i === 4) {
          clearInterval(intervalo);
          observer.complete();
        }
        if (i === 2) {
          observer.error('i llego al valor de 2');
        }
      }, 1000);
    });
    // creamos una constante obs$ que será un nuevo observable
    // declaramos una variable local i inicializada en -1
    // usamos setInterval() para repetir una funcion cada cierto tiempo, en este  caso sumarle 1 a i, por ende en cada vuelta el valor de i ira en aumento
    //ahora para notificar a las personas que esten subscritas a ese nuevo valor se usa "observer" y el .next para mandarles el nuevo valor cada que aparezca uno nuevo, en este caso i
  }
}
