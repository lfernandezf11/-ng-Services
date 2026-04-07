import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { DetailsComponent } from './pages/details/details.component';
import { authGuard } from './core/guards/auth.guard';
import { LoginFormComponent } from './components/loginForm/login-form.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'login',
    component: LoginFormComponent
  },
  {
    path: 'details/:id',
    component: DetailsComponent
  },
  {
    path: 'admin', loadComponent: () => import('./pages/admin/admin.component')
      .then(m => m.AdminComponent),
    canActivate: [authGuard]
  },

];
