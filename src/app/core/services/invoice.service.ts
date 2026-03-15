import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../shared/constants';
import { IInvoice, IInvoiceCreate, IInvoiceUpdate } from '../../shared/interfaces';

@Injectable({ providedIn: 'root' })
export class InvoiceService {
  private readonly http = inject(HttpClient);

  getAll(): Observable<IInvoice[]> {
    return this.http.get<IInvoice[]>(API_ENDPOINTS.invoices.base);
  }

  getById(id: number): Observable<IInvoice> {
    return this.http.get<IInvoice>(API_ENDPOINTS.invoices.byId(id));
  }

  create(data: IInvoiceCreate): Observable<IInvoice> {
    return this.http.post<IInvoice>(API_ENDPOINTS.invoices.base, data);
  }

  update(id: number, data: IInvoiceUpdate): Observable<IInvoice> {
    return this.http.put<IInvoice>(API_ENDPOINTS.invoices.byId(id), data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(API_ENDPOINTS.invoices.byId(id));
  }

  downloadPdf(id: number): Observable<Blob> {
    return this.http.get(API_ENDPOINTS.invoices.pdf(id), { responseType: 'blob' });
  }

  sendByEmail(id: number): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(API_ENDPOINTS.invoices.send(id), {});
  }
}
