import { Component, inject, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NavItem } from '../../interfaces/sidebar.interface';
import { version } from '../../../../../package.json';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  private readonly authService = inject(AuthService);
  protected version = version;
  readonly collapsed = input<boolean>(false);

  protected readonly navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'pi pi-home', route: '/dashboard' },
    { label: 'Asociados', icon: 'pi pi-users', route: '/associates' },
    { label: 'Artículos', icon: 'pi pi-box', route: '/items' },
    { label: 'Cuentas', icon: 'pi pi-file-edit', route: '/invoices' },
    { label: 'Remisiones', icon: 'pi pi-truck', route: '/remissions' },
  ];

  protected logout(): void {
    this.authService.logout();
  }
}
