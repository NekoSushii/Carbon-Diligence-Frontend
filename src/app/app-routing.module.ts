import { Routes } from '@angular/router';
import { AuthCallbackComponent } from './auth-callback.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'auth-callback', component: AuthCallbackComponent },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
