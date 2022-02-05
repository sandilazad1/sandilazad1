import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ChartService {
  constructor(private http: HttpClient) {}

  getTempList(): Observable<any> {
    return this.http.get<any>('http://localhost:3000/temp').pipe(
      map((response) =>
        response.isExecuted ? response.data[0].sensorData : []
      ),
      catchError((error) => of(null))
    );
  }
}
