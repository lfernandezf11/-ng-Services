import { Component } from '@angular/core';
import { TitleComponent } from '../../components/title/title.component';
import { UserListComponent } from '../../components/user-list/user-list.component';
import { Router } from '@angular/router';
import { FooterComponent } from '../../components/footer/footer.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [TitleComponent, UserListComponent, FooterComponent, TranslatePipe],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  constructor(private router: Router) {}

  id: number = 1;

  goToDetails() {
    this.router.navigate(['/details']);
  }
}
