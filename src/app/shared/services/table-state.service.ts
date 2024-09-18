import { Injectable } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { PeriodicElement } from '../interfaces/periodic-element';
import { Observable, tap } from 'rxjs';
import { FetchTableDataService } from './fetch-table-data.service';

@Injectable({
  providedIn: 'root'
})

export class TableStateService extends RxState<{ tableDataItems: PeriodicElement[] }> {

  constructor(private fetchTableDataService: FetchTableDataService) {
    super();
  }

  fetchTableData(): void {
    this.fetchTableDataService.getTableElements().pipe(
      tap(tableData => {
        this.set({ tableDataItems: tableData })
      })
    ).subscribe();
  }
}