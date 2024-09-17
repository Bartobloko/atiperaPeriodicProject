import { Injectable } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { PeriodicElement } from '../interfaces/periodic-element';
import { Observable, tap } from 'rxjs';
import { FetchTableDataService } from './fetch-table-data.service';

@Injectable({
  providedIn: 'root'
})

export class TableStateService extends RxState<any> {

  constructor(private fetchTableDataService: FetchTableDataService) {
    super();
    this.set({ tableDataItems: {}});
    this.fetchTableData()
  }

  fetchTableData(): void {
    this.fetchTableDataService.getTableElements().pipe(
      tap(tableData => {
        console.log('Raw tableData:', tableData);
        this.set({ tableDataItems: tableData })
      })
    ).subscribe();
  }
}