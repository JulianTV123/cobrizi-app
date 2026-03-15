import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { AuthService } from '../../core/services/auth.service';
import { AssociateService } from '../../core/services/associate.service';
import { InvoiceService } from '../../core/services/invoice.service';
import { RemissionService } from '../../core/services/remission.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    DividerModule,
    TagModule,
    RouterLink
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly associateService = inject(AssociateService);
  private readonly invoiceService = inject(InvoiceService);
  private readonly remissionService = inject(RemissionService);

  protected readonly userName = computed(() => this.authService.currentUser()?.name || '');

  protected readonly associatesCount = signal(0);
  protected readonly invoicesCount = signal(0);
  protected readonly draftInvoices = signal(0);
  protected readonly sentInvoices = signal(0);
  protected readonly remissionsCount = signal(0);
  protected readonly draftRemissions = signal(0);
  protected readonly sentRemissions = signal(0);

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.associateService.getAll().subscribe(associates => {
      this.associatesCount.set(associates.length);
    });

    this.invoiceService.getAll().subscribe(invoices => {
      this.invoicesCount.set(invoices.length);
      this.draftInvoices.set(invoices.filter(i => i.status === 'draft').length);
      this.sentInvoices.set(invoices.filter(i => i.status === 'sent').length);
    });

    this.remissionService.getAll().subscribe(remissions => {
      this.remissionsCount.set(remissions.length);
      this.draftRemissions.set(remissions.filter(r => r.status === 'draft').length);
      this.sentRemissions.set(remissions.filter(r => r.status === 'sent').length);
    });
  }
}
