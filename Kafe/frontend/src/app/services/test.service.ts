import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  constructor(private http: HttpClient) {}

  doubleArray(array: number[]): Observable<{ doubledArray: number[] }> {
    return this.http.post<{ doubledArray: number[] }>(
      'http://localhost:3000/api/double-array',
      { array }
    );
  }
}
