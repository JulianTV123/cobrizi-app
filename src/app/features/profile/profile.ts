import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { MessageService } from 'primeng/api';
import { UserService } from '../../core/services/user.service';
import { IUser } from '../../shared/interfaces';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    DividerModule,
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);
  private readonly messageService = inject(MessageService);

  protected readonly loading = signal(false);
  protected readonly loadingProfile = signal(false);
  protected readonly user = signal<IUser | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    id_number: ['', []],
    address: ['', []],
    phone: ['', []],
    email: ['', [Validators.required, Validators.email]],
    password: ['', []],
  });

  ngOnInit(): void {
    this.loadProfile();
  }

  private loadProfile(): void {
    this.loadingProfile.set(true);
    this.userService.getMyProfile().subscribe({
      next: user => {
        this.user.set(user);
        this.form.patchValue({
          name: user.name,
          id_number: user.id_number,
          address: user.address ?? '',
          phone: user.phone ?? '',
          email: user.email,
        });
        this.loadingProfile.set(false);
      },
      error: () => this.loadingProfile.set(false),
    });
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const raw = this.form.getRawValue();

    // Solo enviar password si fue llenado
    const data = raw.password
      ? raw
      : { name: raw.name, id_number: raw.id_number, address: raw.address, phone: raw.phone, email: raw.email };

    this.userService.updateMyProfile(data).subscribe({
      next: user => {
        this.user.set(user);
        this.form.patchValue({ password: '' });
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Perfil actualizado correctamente'
        });
        this.loading.set(false);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo actualizar el perfil'
        });
        this.loading.set(false);
      },
    });
  }
}
