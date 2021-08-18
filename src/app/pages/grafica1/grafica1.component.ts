import { Component } from '@angular/core';

@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styles: [],
})
export class Grafica1Component {
  public labels1: string[] = ['Pan', 'Refrescos', 'Tacos']; // aqui guardamos estos valores en una propiedad para "agruparlos y asi poderlos mandar al hijo, el envio lo hacemos en el html"
  public data1 = [10, 15, 40]; // aqui guardamos estos valores en una propiedad para "agruparlos y asi poderlos mandar al hijo, el envio lo hacemos en el html"
}
