import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  //TODO: Hay diferencia entre el style y el styleUrl, en uno directamente metes el estilo en este mismo archivo en el otro le indicas el path de donde quieres que traiga dicha informacion
})
export class LoginComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
