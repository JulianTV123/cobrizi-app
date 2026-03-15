import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AssociateService } from '../../core/services/associate.service';
import { AssociateForm } from './associate-form/associate-form';
import { IAssociate } from '../../shared/interfaces';

@Component({
  selector: 'app-associates',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, TagModule, ConfirmDialogModule],
  providers: [DialogService, ConfirmationService],
  templateUrl: './associates.html',
  styleUrl: './associates.scss',
})
export class Associates implements OnInit {
  private readonly associateService = inject(AssociateService);
  private readonly dialogService = inject(DialogService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);

  protected readonly ref = signal<DynamicDialogRef | null>(null);
  protected readonly selectedAssociate = signal<IAssociate | null>(null);

  protected readonly associates = signal<IAssociate[]>([]);
  protected readonly loading = signal(false);
  protected readonly totalRecords = computed(() => this.associates().length);

  ngOnInit(): void {
    this.loadAssociates();
  }

  protected loadAssociates(): void {
    this.loading.set(true);
    this.associateService.getAll().subscribe({
      next: (associates) => {
        this.associates.set(associates);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  protected openForm(associate: IAssociate | null = null): void {
    this.selectedAssociate.set(associate);
    this.ref.set(
      this.dialogService.open(AssociateForm, {
        header: associate ? 'Editar Asociado' : 'Nuevo Asociado',
        width: '45vw',
        contentStyle: { 'max-height': '90vh', overflow: 'auto' },
        baseZIndex: 10000,
        data: { associate },
      }),
    );

    this.ref()?.onClose.subscribe(() => {
      this.loadAssociates();
      this.selectedAssociate.set(null);
    });
  }

  protected deleteAssociate(associate: IAssociate): void {
    this.confirmationService.confirm({
      key: 'associateDialog',
      message: `¿Estás seguro de eliminar a "${associate.name}"?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger p-button-outlined',
      accept: () => {
        this.associateService.delete(associate.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: `"${associate.name}" eliminado correctamente`,
            });
            this.loadAssociates();
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo eliminar el asociado',
            });
          },
        });
      },
    });
  }
}
