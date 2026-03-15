import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { RemissionService } from '../../core/services/remission.service';
import { RemissionForm } from './remission-form/remission-form';
import { IRemission } from '../../shared/interfaces';
import { defaultDialogConfig } from '../../shared/utils/dialog.config';

@Component({
  selector: 'app-remissions',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, TagModule, TooltipModule, ConfirmDialogModule],
  providers: [DialogService, ConfirmationService],
  templateUrl: './remissions.html',
  styleUrl: './remissions.scss',
})
export class Remissions implements OnInit {
  private readonly remissionService = inject(RemissionService);
  private readonly dialogService = inject(DialogService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);

  protected readonly ref = signal<DynamicDialogRef | null>(null);
  protected readonly remissions = signal<IRemission[]>([]);
  protected readonly loading = signal(false);
  protected readonly downloadingId = signal<number | null>(null);
  protected readonly sendingId = signal<number | null>(null);

  ngOnInit(): void {
    this.loadRemissions();
  }

  protected loadRemissions(): void {
    this.loading.set(true);
    this.remissionService.getAll().subscribe({
      next: (remissions) => {
        this.remissions.set(remissions);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  protected openForm(): void {
    this.ref.set(this.dialogService.open(RemissionForm, defaultDialogConfig('Nueva Remisión')));
    this.ref()?.onClose.subscribe(() => this.loadRemissions());
  }

  protected downloadPdf(remission: IRemission): void {
    this.downloadingId.set(remission.id);
    this.remissionService.downloadPdf(remission.id).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `remision_${remission.consecutive}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
        this.downloadingId.set(null);
      },
      error: () => this.downloadingId.set(null),
    });
  }

  protected sendByEmail(remission: IRemission): void {
    this.sendingId.set(remission.id);
    this.remissionService.sendByEmail(remission.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `Remisión #${remission.consecutive} enviada por email`,
        });
        this.loadRemissions();
        this.sendingId.set(null);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo enviar el email',
        });
        this.sendingId.set(null);
      },
    });
  }

  protected deleteRemission(remission: IRemission): void {
    this.confirmationService.confirm({
      key: 'remissionDialog',
      message: `¿Eliminar remisión #${remission.consecutive}?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger p-button-outlined',
      accept: () => {
        this.remissionService.delete(remission.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: `Remisión #${remission.consecutive} eliminada`,
            });
            this.loadRemissions();
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo eliminar la remisión',
            });
          },
        });
      },
    });
  }

  protected getStatusSeverity(status: string): 'success' | 'warn' {
    return status === 'sent' ? 'success' : 'warn';
  }

  protected getStatusLabel(status: string): string {
    return status === 'sent' ? 'Enviada' : 'Borrador';
  }
}
