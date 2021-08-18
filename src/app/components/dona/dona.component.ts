import { Component, Input } from '@angular/core';
import { MultiDataSet, Label, Color } from 'ng2-charts';

@Component({
  selector: 'app-dona',
  templateUrl: './dona.component.html',
  styles: [],
})
export class DonaComponent {
  @Input() titulo: string = 'Sin titulo'; //estos valores los estamos recibiendo del componente padre pa esto usamos el @Input notese que podemos renombrar y aqui mismo ponemos los valores por defauld en caso de que no nos mande nada
  @Input('labels') labels1: Label[] = ['sin label', 'sin label', 'sin label']; //estos valores los estamos recibiendo del componente padre pa esto usamos el @Input notese que podemos renombrar y aqui mismo ponemos los valores por defauld en caso de que no nos mande nada
  @Input() datas: number[] = [1, 1, 1]; //estos valores los estamos recibiendo del componente padre pa esto usamos el @Input notese que podemos renombrar y aqui mismo ponemos los valores por defauld en caso de que no nos mande nada

  // public doughnutChartLabels: Label[] = ['Ventas1', 'Ventas2', 'Ventas3'];
  // public doughnutChartData: MultiDataSet = [[100, 200, 300]];

  public colors: Color[] = [
    { backgroundColor: ['#9E120E', '#FF5800', '#FFB414'] },
  ];
}
