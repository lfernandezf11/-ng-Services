import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { UserService } from "../../services/user.service";
import { User } from "../../models/user";
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
  // Con las variables de control de flujo nativas, no es necesario CommonModule. 
  // Sin embargo, si queremos usar *ngFor, *ngIf, etc., sí es necesario importar CommonModule.
  // <ul>
  //       @for (user of users; track user.id) {
  //   <li>{{ user.name }
  // } </li>
  //       }
  // </ul>

  imports: [TranslatePipe],
})

export class UserListComponent implements OnInit {
  private userService = inject(UserService);
  private router = inject(Router);

  nameFilter = signal(''); // Variables de estado
  cityFilter = signal('');
  users = signal<User[]>([]);

  uniqueCities = computed(() => {
    return [...new Set(this.users().map(user => user.address?.city ?? ''))].filter(city => city !== '');
  });

  filteredUsers = computed(() => { // Variable de estado computada que se actualiza automáticamente al cambiar los filtros
    const name = this.nameFilter().toLowerCase();
    const city = this.cityFilter(); // Viene de un select, no necesita toLowerCase()

    return this.users().filter(user => {
      const matchesName = user.name.toLowerCase().includes(name);
      const matchesCity = city ? user.address?.city === city : true;
      return matchesName && matchesCity;
    });
  });

  ngOnInit() {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users.set(data);
      },
      error: (err) => console.error('Error al obtener usuarios', err)
    });
  }

  goToDetails(id: number) {
    this.router.navigate(['/details', id]);
  }

  resetFilters() {
    this.nameFilter.set('');
    this.cityFilter.set('');
  }

}