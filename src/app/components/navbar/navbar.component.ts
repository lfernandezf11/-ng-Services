import { Router, RouterLink } from '@angular/router';
import { Component, inject, signal } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  private translate = inject(TranslateService);
  authService = inject(AuthService);
  isAuthenticated = this.authService.isAuthenticated;
  currentLanguage: string = this.translate.getCurrentLang() || 'es';

  constructor() {
    this.translate.setFallbackLang('es'); // setDefaultLang is deprecated
    this.translate.use(this.currentLanguage);
  }

  toggleLanguage(): void {
    this.currentLanguage = this.currentLanguage === 'es' ? 'en' : 'es';
    this.translate.use(this.currentLanguage);
  }

  logout() {
    this.authService.logout();
  }
}
