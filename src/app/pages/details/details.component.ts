import { Component, inject } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-details',
  imports: [FooterComponent],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent {
  user: User | null = null;
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);

  ngOnInit() {
    const id = this.route.snapshot.params['id'];

    this.userService.getUserById(+id).subscribe({
      next: (data) => this.user = data,
      error: (err) => console.error('Error al obtener usuario', err)
    });
  }
}

