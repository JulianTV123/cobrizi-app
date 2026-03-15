import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { ItemService } from '../../../core/services/item.service';
import { IItem, IItemProperty } from '../../../shared/interfaces';

@Component({
  selector: 'app-item-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
  ],
  templateUrl: './item-form.html',
  styleUrl: './item-form.scss',
})
export class ItemForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly itemService = inject(ItemService);
  private readonly ref = inject(DynamicDialogRef);
  private readonly config = inject(DynamicDialogConfig);
  private readonly messageService = inject(MessageService);

  protected readonly loading = signal(false);
  protected readonly addingProperty = signal(false);
  protected readonly item = computed(() => this.config.data?.item as IItem | undefined);

  // Para crear: lista local de properties
  protected readonly localProperties = signal<string[]>([]);
  // Para editar: properties del servidor
  protected readonly properties = signal<IItemProperty[]>([]);

  protected readonly newPropertyName = signal('');

  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    description: [''],
  });

  ngOnInit(): void {
    if (this.item()) {
      this.form.patchValue({
        name: this.item()!.name,
        description: this.item()!.description ?? '',
      });
      this.properties.set([...this.item()!.properties]);
    }
  }

  // ── Crear: manejo local ──────────────────────────────

  protected addLocalProperty(): void {
    const name = this.newPropertyName().trim();
    if (!name) return;
    this.localProperties.update(props => [...props, name]);
    this.newPropertyName.set('');
  }

  protected removeLocalProperty(index: number): void {
    this.localProperties.update(props => props.filter((_, i) => i !== index));
  }

  // ── Editar: manejo contra API ────────────────────────

  protected addProperty(): void {
    const name = this.newPropertyName().trim();
    if (!name) return;

    this.addingProperty.set(true);
    this.itemService.addProperty(this.item()!.id, { name }).subscribe({
      next: prop => {
        this.properties.update(props => [...props, prop]);
        this.newPropertyName.set('');
        this.addingProperty.set(false);
      },
      error: () => this.addingProperty.set(false),
    });
  }

  protected deleteProperty(prop: IItemProperty): void {
    this.itemService.deleteProperty(this.item()!.id, prop.id).subscribe({
      next: () => {
        this.properties.update(props => props.filter(p => p.id !== prop.id));
      }
    });
  }

  // ── Submit ───────────────────────────────────────────

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const { name, description } = this.form.getRawValue();

    if (this.item()) {
      // Editar — solo nombre/descripción, properties se manejan en tiempo real
      this.itemService.update(this.item()!.id, { name, description }).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Artículo actualizado' });
          this.ref.close();
        },
        error: () => this.loading.set(false),
      });
    } else {
      // Crear — enviamos con properties locales
      this.itemService.create({
        name,
        description,
        properties: this.localProperties().map(n => ({ name: n })),
      }).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Artículo creado' });
          this.ref.close();
        },
        error: () => this.loading.set(false),
      });
    }
  }

  protected onCancel(): void {
    this.ref.close();
  }
}
