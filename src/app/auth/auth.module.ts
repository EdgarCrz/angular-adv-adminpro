import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // este modulo es encargado de que podamos hacer uso de los formularios reactivos
import { HttpClientModule } from '@angular/common/http';

import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [RegisterComponent, LoginComponent],
  exports: [RegisterComponent, LoginComponent],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule, // importamos este modulo que es el que nos permite hacer peticiones Http
  ],
})
export class AuthModule {}
