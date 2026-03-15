import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../shared/constants';
import { IItem, IItemCreate, IItemUpdate, IItemProperty, IItemPropertyCreate } from '../../shared/interfaces';

@Injectable({ providedIn: 'root' })
export class ItemService {
  private readonly http = inject(HttpClient);

  getAll(): Observable<IItem[]> {
    return this.http.get<IItem[]>(API_ENDPOINTS.items.base);
  }

  getById(id: number): Observable<IItem> {
    return this.http.get<IItem>(API_ENDPOINTS.items.byId(id));
  }

  create(data: IItemCreate): Observable<IItem> {
    return this.http.post<IItem>(API_ENDPOINTS.items.base, data);
  }

  update(id: number, data: IItemUpdate): Observable<IItem> {
    return this.http.put<IItem>(API_ENDPOINTS.items.byId(id), data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(API_ENDPOINTS.items.byId(id));
  }

  addProperty(itemId: number, data: IItemPropertyCreate): Observable<IItemProperty> {
    return this.http.post<IItemProperty>(API_ENDPOINTS.items.properties(itemId), data);
  }

  deleteProperty(itemId: number, propertyId: number): Observable<void> {
    return this.http.delete<void>(API_ENDPOINTS.items.propertyById(itemId, propertyId));
  }
}
