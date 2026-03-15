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
import { InvoiceService } from '../../../core/services/invoice.service';
import { AssociateService } from '../../../core/services/associate.service';
import { ItemService } from '../../../core/services/item.service';
import { IAssociate, IItem, IInvoiceItemCreate, InvoiceRow } from '../../../shared/interfaces';

@Component({
  selector: 'app-invoice-form',
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
  templateUrl: './invoice-form.html',
  styleUrl: './invoice-form.scss',
})
export class InvoiceForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly invoiceService = inject(InvoiceService);
  private readonly associateService = inject(AssociateService);
  private readonly itemService = inject(ItemService);
  private readonly ref = inject(DynamicDialogRef);
  private readonly messageService = inject(MessageService);

  protected readonly loading = signal(false);
  protected readonly associates = signal<IAssociate[]>([]);
  protected readonly items = signal<IItem[]>([]);
  protected readonly rows = signal<InvoiceRow[]>([]);
  protected readonly selectedItem = signal<IItem | null>(null);

  protected readonly total = computed(() =>
    this.rows().reduce((acc, row) => acc + row.quantity * row.unit_price, 0)
  );

  protected readonly form = this.fb.nonNullable.group({
    user_associate_id: [0, [Validators.required, Validators.min(1)]],
    date: [new Date(), Validators.required],
  });

  ngOnInit(): void {
    this.associateService.getAll().subscribe(a => this.associates.set(a));
    this.itemService.getAll().subscribe(i => this.items.set(i));
  }

  protected addRow(): void {
    const item = this.selectedItem();
    if (!item) return;

    const exists = this.rows().find(r => r.item.id === item.id);
    if (exists) return;

    this.rows.update(rows => [...rows, { item, quantity: 1, unit_price: 0 }]);
    this.selectedItem.set(null);
  }

  protected removeRow(index: number): void {
    this.rows.update(rows => rows.filter((_, i) => i !== index));
  }

  protected updateRow(index: number, field: 'quantity' | 'unit_price', value: number): void {
    this.rows.update(rows =>
      rows.map((row, i) => i === index ? { ...row, [field]: value } : row)
    );
  }

  protected onSubmit(): void {
    if (this.form.invalid || !this.rows().length) {
      this.form.markAllAsTouched();
      if (!this.rows().length) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Atención',
          detail: 'Agrega al menos un artículo'
        });
      }
      return;
    }

    this.loading.set(true);
    const { user_associate_id, date } = this.form.getRawValue();

    const items: IInvoiceItemCreate[] = this.rows().map(row => ({
      item_id: row.item.id,
      quantity: row.quantity,
      unit_price: row.unit_price,
    }));

    this.invoiceService.create({
      user_associate_id,
      date: date instanceof Date ? date.toISOString().split('T')[0] : date,
      items,
    }).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Cuenta de cobro creada correctamente'
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
