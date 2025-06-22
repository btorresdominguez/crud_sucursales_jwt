import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SucursalesFormComponent } from './components/sucursales-form/sucursales-form.component'; // Asegúrate de importar el componente

export const routes: Routes = [
  { path: '', component: LoginComponent }, // Main path loads LoginComponent
  { path: 'sucursales', component: SucursalesFormComponent }, // Route for the sucursales form
  { path: '**', redirectTo: '' } // Redirect any unknown routes to Login
];