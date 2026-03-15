import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InvoiceService } from '../../core/services/invoice.service';
import { InvoiceForm } from './invoice-form/invoice-form';
import { IInvoice } from '../../shared/interfaces';

@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, TagModule, TooltipModule, ConfirmDialogModule],
  providers: [DialogService, ConfirmationService],
  templateUrl: './invoices.html',
  styleUrl: './invoices.scss',
})
export class Invoices implements OnInit {
  private readonly invoiceService = inject(InvoiceService);
  private readonly dialogService = inject(DialogService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);

  protected readonly ref = signal<DynamicDialogRef | null>(null);
  protected readonly invoices = signal<IInvoice[]>([]);
  protected readonly loading = signal(false);
  protected readonly downloadingId = signal<number | null>(null);
  protected readonly sendingId = signal<number | null>(null);

  ngOnInit(): void {
    this.loadInvoices();
  }

  protected loadInvoices(): void {
    this.loading.set(true);
    this.invoiceService.getAll().subscribe({
      next: (invoices) => {
        this.invoices.set(invoices);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  protected openForm(): void {
    this.ref.set(
      this.dialogService.open(InvoiceForm, {
        header: 'Nueva Cuenta de Cobro',
        width: '45vw',
        contentStyle: { 'max-height': '90vh', overflow: 'auto' },
        baseZIndex: 10000,
      }),
    );
    this.ref()?.onClose.subscribe(() => this.loadInvoices());
  }

  protected downloadPdf(invoice: IInvoice): void {
    this.downloadingId.set(invoice.id);
    this.invoiceService.downloadPdf(invoice.id).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cuenta_cobro_${invoice.consecutive}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
        this.downloadingId.set(null);
      },
      error: () => this.downloadingId.set(null),
    });
  }

  protected sendByEmail(invoice: IInvoice): void {
    this.sendingId.set(invoice.id);
    this.invoiceService.sendByEmail(invoice.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `Cuenta de cobro #${invoice.consecutive} enviada por email`,
        });
        this.loadInvoices();
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

  protected markAsSent(invoice: IInvoice): void {
    this.invoiceService.update(invoice.id, { status: 'sent' }).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `Cuenta #${invoice.consecutive} marcada como enviada`,
        });
        this.loadInvoices();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo actualizar el estado',
        });
      },
    });
  }

  protected deleteInvoice(invoice: IInvoice): void {
    this.confirmationService.confirm({
      key: 'invoiceDialog',
      message: `¿Eliminar cuenta de cobro #${invoice.consecutive}?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger p-button-outlined',
      accept: () => {
        this.invoiceService.delete(invoice.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: `Cuenta de cobro #${invoice.consecutive} eliminada`,
            });
            this.loadInvoices();
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo eliminar la cuenta de cobro',
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
