import { Component, inject, output, OnInit, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  templateUrl: './topbar.html',
  styleUrl: './topbar.scss'
})
export class Topbar implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);

  readonly toggleSidebar = output<void>();

  protected readonly userName = signal<string>('');

  ngOnInit(): void {
    this.userService.getMyProfile().subscribe(user => {
      this.userName.set(user.name);
      this.authService.setCurrentUser(user);
    });
  }

  protected onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }
}
