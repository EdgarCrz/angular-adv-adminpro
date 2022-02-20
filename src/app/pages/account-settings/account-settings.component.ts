import { Component, OnInit } from '@angular/core';
import { element } from 'protractor';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styles: [],
})
export class AccountSettingsComponent implements OnInit {
  constructor(private settingsService: SettingsService) {}

  ngOnInit(): void {
    this.settingsService.checkCurrentTheme(); //se refactorizo el codigo para llevarnos toda la logica como un servicio y aqui solamente usar ese servicio para limpiar nuestro componente y mantener un mejor orden
  }
  changeTheme(theme: string) {
    this.settingsService.changeTheme(theme); //esta funcion  proviene de un servicio que almacena el proceso haya, y aqui solamente le mandamos el parametro y recibimos el resultado
  }
}
