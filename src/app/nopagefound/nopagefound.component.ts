import { Component } from '@angular/core';

@Component({
  selector: 'app-nopagefound',
  templateUrl: './nopagefound.component.html',
  styleUrls: ['./nopagefound.component.css'],
})
export class NopagefoundComponent {
  // year = new Date().getFullYear;
  year = new Date().getFullYear();

  //year sera una variable que almacenara una fecha, en la cual se encontrara el año
  // https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Date
  // https://www.w3schools.com/jsref/jsref_getfullyear.asp
}
