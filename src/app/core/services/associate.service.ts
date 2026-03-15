import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../shared/constants';
import { IAssociate, IAssociateCreate, IAssociateUpdate } from '../../shared/interfaces';

@Injectable({ providedIn: 'root' })
export class AssociateService {
  private readonly http = inject(HttpClient);

  getAll(): Observable<IAssociate[]> {
    return this.http.get<IAssociate[]>(API_ENDPOINTS.associates.base);
  }

  getById(id: number): Observable<IAssociate> {
    return this.http.get<IAssociate>(API_ENDPOINTS.associates.byId(id));
  }

  create(data: IAssociateCreate): Observable<IAssociate> {
    return this.http.post<IAssociate>(API_ENDPOINTS.associates.base, data);
  }

  update(id: number, data: IAssociateUpdate): Observable<IAssociate> {
    return this.http.put<IAssociate>(API_ENDPOINTS.associates.byId(id), data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(API_ENDPOINTS.associates.byId(id));
  }
}
