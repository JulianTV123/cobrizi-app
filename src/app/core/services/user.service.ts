import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../shared/constants';
import { IUser, IUserUpdate } from '../../shared/interfaces';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);

  getMyProfile(): Observable<IUser> {
    return this.http.get<IUser>(API_ENDPOINTS.users.me);
  }

  updateMyProfile(data: IUserUpdate): Observable<IUser> {
    return this.http.put<IUser>(API_ENDPOINTS.users.me, data);
  }
}
