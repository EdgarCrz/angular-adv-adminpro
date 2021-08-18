import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styles: [],
})
export class IncrementadorComponent implements OnInit {
  ngOnInit() {
    this.btnClass = `btn ${this.btnClass}`;
  }
  //con @Input() le indicamos que ahora puede recibir un valir desde el padre/ al añadir un nuevo nombre entre los () rebautizamos la propiedad esperada por el padre
  // es una forma para llamar a esta variable progreso, para poder modificarlo por ejemplo añadiendole %
  // en caso de que en el padre no nos den ningun valor, procedera a asignarle el valor que aqui le dimos
  @Input('valor') progreso: number = 1;
  @Input() btnClass: string = 'btn-primary'; //de esta manera igualpodemos jugar con el DOM para modificar una clase, por defauld se mantiene la asignada, pero en caso de que en componente padre le mandemos otra desde el DOM indicamos que va a tener las clase que ahi le asignemos
  @Output()
  valorSalida: EventEmitter<number> = new EventEmitter();

  cambiarValor(valor: number) {
    if (this.progreso >= 100 && valor >= 0) {
      this.valorSalida.emit(100);
      this.progreso = 100;
      return;
    }
    // csi el progreso sea mayor o igual que 100 y el valor sea mayor o igual que 0 entonces progreso se mantendra en 100 no mas, ademas el eventemitter mandara "valorSalida=100"
    if (this.progreso <= 0 && valor < 0) {
      this.valorSalida.emit(0);
      this.progreso = 0;
      return;
    }
    //si el progreso es menor o igual que 0 y el valor es menor que 0 entonces mandaras 0 no menos que ese numero, de igual manera emiteme un 0 al padre
    this.progreso = this.progreso + valor;
    this.valorSalida.emit(this.progreso);
    // si se encuentra dentro del intervalo de 0 a 100 mandame el valor actual
  }

  onChange(nuevoValor: number) {
    if (nuevoValor >= 100) {
      this.progreso = 100;
    } else if (nuevoValor <= 0) {
      this.progreso = 0;
    } else {
      this.progreso = nuevoValor;
    }
    this.valorSalida.emit(this.progreso);
  }
}
