import { Component, inject } from '@angular/core';
import { TitleComponent } from '../../components/title/title.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { AuthService } from '../../services/auth.service';
import { SaludoPipe } from '../../pipes/saludo.pipe';
import { DoblePipe } from '../../pipes/doble.pipe';

@Component({
  selector: 'app-admin',
  imports: [TitleComponent, FooterComponent, SaludoPipe],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  authService = inject(AuthService);

}
