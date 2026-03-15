import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../shared/constants';
import { IRemission, IRemissionCreate, IRemissionUpdate } from '../../shared/interfaces';

@Injectable({ providedIn: 'root' })
export class RemissionService {
  private readonly http = inject(HttpClient);

  getAll(): Observable<IRemission[]> {
    return this.http.get<IRemission[]>(API_ENDPOINTS.remissions.base);
  }

  getById(id: number): Observable<IRemission> {
    return this.http.get<IRemission>(API_ENDPOINTS.remissions.byId(id));
  }

  create(data: IRemissionCreate): Observable<IRemission> {
    return this.http.post<IRemission>(API_ENDPOINTS.remissions.base, data);
  }

  update(id: number, data: IRemissionUpdate): Observable<IRemission> {
    return this.http.put<IRemission>(API_ENDPOINTS.remissions.byId(id), data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(API_ENDPOINTS.remissions.byId(id));
  }

  downloadPdf(id: number): Observable<Blob> {
    return this.http.get(API_ENDPOINTS.remissions.pdf(id), { responseType: 'blob' });
  }

  sendByEmail(id: number): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(API_ENDPOINTS.remissions.send(id), {});
  }
}
