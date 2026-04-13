import { Component } from '@angular/core';
import { TitleComponent } from '../../components/title/title.component';
import { TranslatePipe } from '@ngx-translate/core';
import {
  CurrencyPipe,
  DatePipe,
  JsonPipe,
  LowerCasePipe,
  PercentPipe,
  SlicePipe,
  TitleCasePipe,
  UpperCasePipe
} from '@angular/common';
import { DoblePipe } from '../../pipes/doble.pipe';
import { SaludoPipe } from '../../pipes/saludo.pipe';
import { ResaltarPipe } from '../../pipes/resaltar.pipe';
import { EdadPipe } from '../../pipes/edad.pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    TitleComponent,
    TranslatePipe,
    UpperCasePipe,
    LowerCasePipe,
    TitleCasePipe,
    DatePipe,
    CurrencyPipe,
    PercentPipe,
    SlicePipe,
    JsonPipe,
    SaludoPipe,
    DoblePipe,
    ResaltarPipe,
    EdadPipe
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  today = new Date();
  birthDate = new Date('1996-03-15');
  price = 1234.56;
  progress = 0.72;
  completed = 0.95;
  longText = 'homePipes.slice.longText';
  
  userProfile = {
    name: 'Lucia',
    role: 'Admin',
    active: true,
    lastLogin: this.today
  };
}
