import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'sendEmails',
    loadComponent: () =>
      import('./../app/email/email.component').then((a) => a.EmailComponent),
  },
];
