import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { RemissionService } from '../../../core/services/remission.service';
import { AssociateService } from '../../../core/services/associate.service';
import { ItemService } from '../../../core/services/item.service';
import {
  IAssociate,
  IItem,
  IPropertyRow,
  IRemissionItemCreate,
  IRemissionRow,
} from '../../../shared/interfaces';

@Component({
  selector: 'app-remission-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    DatePickerModule,
    InputNumberModule,
  ],
  templateUrl: './remission-form.html',
  styleUrl: './remission-form.scss',
})
export class RemissionForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly remissionService = inject(RemissionService);
  private readonly associateService = inject(AssociateService);
  private readonly itemService = inject(ItemService);
  private readonly ref = inject(DynamicDialogRef);
  private readonly messageService = inject(MessageService);

  protected readonly loading = signal(false);
  protected readonly associates = signal<IAssociate[]>([]);
  protected readonly items = signal<IItem[]>([]);
  protected readonly rows = signal<IRemissionRow[]>([]);
  protected readonly selectedItem = signal<IItem | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    user_associate_id: [0, [Validators.required, Validators.min(1)]],
    date: [new Date(), Validators.required],
  });

  ngOnInit(): void {
    this.associateService.getAll().subscribe((a) => this.associates.set(a));
    this.itemService.getAll().subscribe((i) => this.items.set(i));
  }

  protected addRow(): void {
    const item = this.selectedItem();
    if (!item) return;

    const exists = this.rows().find((r) => r.item.id === item.id);
    if (exists) return;

    const propertyRows: IPropertyRow[] = item.properties.map((p) => ({
      property: p,
      quantity: 0,
    }));

    this.rows.update((rows) => [
      ...rows,
      {
        item,
        propertyRows,
        total_quantity: 0,
      },
    ]);

    this.selectedItem.set(null);
  }

  protected removeRow(index: number): void {
    this.rows.update((rows) => rows.filter((_, i) => i !== index));
  }

  protected updatePropertyQuantity(rowIndex: number, propIndex: number, value: number): void {
    this.rows.update((rows) =>
      rows.map((row, i) => {
        if (i !== rowIndex) return row;
        const propertyRows = row.propertyRows.map((pr, pi) =>
          pi === propIndex ? { ...pr, quantity: value } : pr,
        );
        const total_quantity = propertyRows.reduce((acc, pr) => acc + pr.quantity, 0);
        return { ...row, propertyRows, total_quantity };
      }),
    );
  }

  protected onSubmit(): void {
    if (this.form.invalid || !this.rows().length) {
      this.form.markAllAsTouched();
      if (!this.rows().length) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Atención',
          detail: 'Agrega al menos un artículo',
        });
      }
      return;
    }

    const hasEmptyRows = this.rows().some((row) => row.total_quantity === 0);
    if (hasEmptyRows) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atención',
        detail: 'Todos los artículos deben tener al menos una cantidad mayor a 0',
      });
      return;
    }

    this.loading.set(true);
    const { user_associate_id, date } = this.form.getRawValue();

    const items: IRemissionItemCreate[] = this.rows().map((row) => ({
      item_id: row.item.id,
      total_quantity: row.total_quantity,
      property_quantities: row.propertyRows
        .filter((pr) => pr.quantity > 0)
        .map((pr) => ({
          item_property_id: pr.property.id,
          quantity: pr.quantity,
        })),
    }));

    this.remissionService
      .create({
        user_associate_id,
        date: date instanceof Date ? date.toISOString().split('T')[0] : date,
        items,
      })
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Remisión creada correctamente',
          });
          this.ref.close();
        },
        error: () => this.loading.set(false),
      });
  }

  protected onCancel(): void {
    this.ref.close();
  }
}
