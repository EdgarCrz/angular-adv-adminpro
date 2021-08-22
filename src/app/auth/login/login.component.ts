import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  //TODO: Hay diferencia entre el style y el styleUrl, en uno directamente metes el estilo en este mismo archivo en el otro le indicas el path de donde quieres que traiga dicha informacion
})
export class LoginComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  login() {
    this.router.navigateByUrl('/');
  }
}
