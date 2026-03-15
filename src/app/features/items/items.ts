import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ItemService } from '../../core/services/item.service';
import { ItemForm } from './item-form/item-form';
import { IItem } from '../../shared/interfaces';

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, TagModule, TooltipModule, ConfirmDialogModule],
  providers: [DialogService, ConfirmationService],
  templateUrl: './items.html',
  styleUrl: './items.scss',
})
export class Items implements OnInit {
  private readonly itemService = inject(ItemService);
  private readonly dialogService = inject(DialogService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);

  protected readonly ref = signal<DynamicDialogRef | null>(null);
  protected readonly items = signal<IItem[]>([]);
  protected readonly loading = signal(false);
  protected readonly totalRecords = computed(() => this.items().length);

  ngOnInit(): void {
    this.loadItems();
  }

  protected loadItems(): void {
    this.loading.set(true);
    this.itemService.getAll().subscribe({
      next: items => {
        this.items.set(items);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  protected openForm(item: IItem | null = null): void {
    this.ref.set(
      this.dialogService.open(ItemForm, {
        header: item ? 'Editar Artículo' : 'Nuevo Artículo',
        width: '45vw',
        contentStyle: { 'max-height': '90vh', overflow: 'auto' },
        baseZIndex: 10000,
        data: { item },
      })
    );

    this.ref()?.onClose.subscribe(() => this.loadItems());
  }

  protected deleteItem(item: IItem): void {
    this.confirmationService.confirm({
      key: 'itemDialog',
      message: `¿Estás seguro de eliminar "${item.name}"?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger p-button-outlined',
      accept: () => {
        this.itemService.delete(item.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: `"${item.name}" eliminado correctamente`
            });
            this.loadItems();
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo eliminar el artículo'
            });
          }
        });
      },
    });
  }
}
