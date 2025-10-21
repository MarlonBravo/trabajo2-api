import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { ProductListComponent } from './components/product-list/product-list';
import { ProductFormComponent } from './components/product-form/product-form';

export const routes: Routes = [
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'products', component: ProductListComponent },
    { path: 'products/new', component: ProductFormComponent },
{ path: 'products/edit/:id', component: ProductFormComponent },
  { path: '**', redirectTo: '/products' }

];