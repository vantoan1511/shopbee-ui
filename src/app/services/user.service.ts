import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PageRequest } from '../types/page-request.type';
import { Response } from '../types/response.type';
import { User } from '../types/user.type';
import { Sort } from '../types/sort.type';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getBy(pageRequest?: PageRequest, sort?: Sort) {
    return this.http.get<Response<User>>('http://localhost:8081/api/users', {
      params: {
        ...pageRequest,
        ...sort,
      },
    });
  }
}
