import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { UserService } from "../../services/user.service";
import { User } from "../../models/user";

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

imports: [CommonModule],
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  private userService = inject(UserService);

  ngOnInit() {
    this.userService.getUsers().subscribe({
      next: (data) => this.users = data,
      error: (err) => console.error('Error al obtener usuarios', err)
    });
  }
}