import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { DetailsComponent } from './pages/details/details.component';

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
	path: 'details/:id',
	component: DetailsComponent
  },

];
