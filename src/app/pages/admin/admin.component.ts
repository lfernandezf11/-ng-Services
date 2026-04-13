import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { TitleComponent } from '../../components/title/title.component';
import { AuthService } from '../../services/auth.service';
import { SaludoPipe } from '../../pipes/saludo.pipe';

@Component({
  selector: 'app-admin',
  imports: [TitleComponent, SaludoPipe, TranslatePipe],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  authService = inject(AuthService);

}
