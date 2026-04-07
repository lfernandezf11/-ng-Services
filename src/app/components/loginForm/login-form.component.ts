import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TitleComponent } from '../title/title.component';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule, TitleComponent],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss'
})
export class LoginFormComponent {
  private router = inject(Router); // para redirigir al usuario después del login
  private authService = inject(AuthService);

  error: string | null = null;

  loginForm = new FormGroup({
    name: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });
  // Alternativa con FormBuilder:
  // private fb = inject(FormBuilder);

  // loginForm = this.fb.group({
  //   name: [''],      // Esto crea un FormControl internamente
  //   password: [''],
  // });  

 login() {
  const { name, password } = this.loginForm.getRawValue();

  this.authService.login(name ?? '', password ?? '').subscribe({ // La llamada a la api es obligatoriamente un Observable
    next: (isValid: boolean) => {
      if (isValid) {
        this.error = null;
        this.router.navigate(['/admin']);
      } else {
        this.error = 'Credenciales incorrectas';
      }
    },
    error: (err) => {
      this.error = 'No se ha podido conectar con el servidor';
      console.error('Error en la petición:', err);
    }
  });
}
  
  logout() {
    this.authService.logout();
  }
  resetFields() {
    this.loginForm.reset();
  }

}