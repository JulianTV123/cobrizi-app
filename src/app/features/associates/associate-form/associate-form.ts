import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AssociateService } from '../../../core/services/associate.service';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { IAssociate, IAssociateCreate, IAssociateUpdate } from '../../../shared/interfaces';
import { TextareaModule } from 'primeng/textarea';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-associate-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
  ],
  templateUrl: './associate-form.html',
  styleUrl: './associate-form.scss',
})
export class AssociateForm {
  private readonly fb = inject(FormBuilder);
  private readonly associateService = inject(AssociateService);
  private readonly ref = inject(DynamicDialogRef);
  private readonly messageService = inject(MessageService);
  private readonly config = inject(DynamicDialogConfig);

  protected readonly loading = signal(false);
  protected readonly associate = computed(
    () => this.config.data?.associate as IAssociate | undefined,
  );

  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    id_number: ['', []],
    address: ['', []],
    phone: ['', []],
    email: ['', [Validators.email]],
  });

  ngOnInit(): void {
    if (this.associate()) {
      this.form.patchValue(this.associate()!);
    }
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const formValue = this.form.getRawValue();

    if (this.associate()) {
      this.associateService.update(this.associate()!.id, formValue).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Asociado actualizado correctamente',
          });
          this.ref.close();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo actualizar el asociado',
          });
          this.loading.set(false);
        },
      });
    } else {
      this.associateService.create(formValue).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Asociado creado correctamente',
          });
          this.ref.close();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo crear el asociado',
          });
          this.loading.set(false);
        },
      });
    }
  }

  protected onCancel(): void {
    this.ref.close();
  }
}
