import { Component, OnDestroy } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: [],
})
export class BreadcrumbsComponent implements OnDestroy {
  public titulo: string = '';
  public tituloSubs$: Subscription; // de tipo Subscripcion: representa la ejecucion de un observable, para despues poder usar el unSubscribe() para detener la ejecucion del mismo

  constructor(private router: Router) {
    this.tituloSubs$ = this.getArgumentosRuta()
      // Al suscribirnos recibimos como parametro el titulo, en este caso recibiamos "data" pero gracias a la desestructuracion de objetos, "desempaquetamos" esa propiedad "titulo" para obtener su valor directamente
      .subscribe(({ titulo }) => {
        this.titulo = titulo; //a nuestra propiedad de la clase, le asignamos este valor para poder asi usarlo en el html
        document.title = `AdminPro - ${titulo}`; // de esta manera cambiamos el titulo de la pestaña de la pagina
      });
  }
  ngOnDestroy(): void {
    this.tituloSubs$.unsubscribe(); // al terminar con esa vista,  lo proximo que hara es desuscribirnos para detener la ejecucion del observable
  }
  getArgumentosRuta() {
    return this.router.events.pipe(
      filter((event: any) => event instanceof ActivationEnd), //primer Filtro: instanceof verifica si el parametro es instancia de ActivationEnd(Este devuelve true el false si es o no instancia de), Filter dejara pasar si true || false
      filter((event: ActivationEnd) => event.snapshot.firstChild === null), //segundo filtro: Una vez que pasa al segundo filtro, accedemos al e"vent" en su propiedad "snapshot", exactamente en su propiedad "firstChild" si es  null dejala pasar/ esta parte es como un if pero implicito
      map((event: ActivationEnd) => event.snapshot.data) // por ultimo "Transformamos ese event" mas bien accedemos a su propiedad "data" y eso es el valor que obtendremos al  subscribimos
    );
  }
}
