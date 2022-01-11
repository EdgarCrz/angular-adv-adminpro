import { Component, OnInit, Output } from '@angular/core';
import { SettingsService } from '../services/settings.service';
import { SidebarService } from '../services/sidebar.service';
declare function customInitFunctions(): any;

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: [],
})
export class PagesComponent implements OnInit {
  constructor(
    private settingsService: SettingsService,
    private sideBarService: SidebarService
  ) {}

  ngOnInit(): void {
    customInitFunctions();
    this.sideBarService.cargarMenu(); // al iniciar sesion vamos a recuperar lo que se encuentra en el local storage
  }
}
