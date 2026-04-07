import { Component, signal } from '@angular/core';
import { TitleComponent } from '../../components/title/title.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { LoginFormComponent } from '../../components/loginForm/login-form.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [TitleComponent, FooterComponent, LoginFormComponent, TranslatePipe],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {

}
