import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PeriodicElement } from '../interfaces/periodic-element';

@Injectable({
  providedIn: 'root'
})
export class FetchTableDataService {

  constructor(
    private httpClient: HttpClient
  ) {}

  getTableElements() {
    const url = "https://mocki.io/v1/d15923fe-4e55-466e-b35a-3f5d764c17a2";
    return this.httpClient.get<PeriodicElement[]>(url);
  }
}