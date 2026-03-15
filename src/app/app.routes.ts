import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: '',
    loadComponent: () => import('./shared/components/layout/layout').then((m) => m.Layout),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'associates',
        loadComponent: () => import('./features/associates/associates').then((m) => m.Associates),
      },
      {
        path: 'items',
        loadComponent: () => import('./features/items/items').then((m) => m.Items),
      },
      {
        path: 'invoices',
        loadComponent: () => import('./features/invoices/invoices').then((m) => m.Invoices),
      },
      {
        path: 'invoices/new',
        loadComponent: () =>
          import('./features/invoices/invoice-form/invoice-form').then((m) => m.InvoiceForm),
      },
      {
        path: 'remissions',
        loadComponent: () => import('./features/remissions/remissions').then((m) => m.Remissions),
      },
      {
        path: 'remissions/new',
        loadComponent: () =>
          import('./features/remissions/remission-form/remission-form').then(
            (m) => m.RemissionForm,
          ),
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/profile/profile').then((m) => m.Profile),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
