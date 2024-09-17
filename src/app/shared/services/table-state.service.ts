import { Injectable } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { PeriodicElement } from '../interfaces/periodic-element';
import { Observable, tap } from 'rxjs';
import { FetchTableDataService } from './fetch-table-data.service';

@Injectable({
  providedIn: 'root'
})

export class TableStateService extends RxState<PeriodicElement[]>{

  constructor(
    private fetchTableDataService: FetchTableDataService,
  ) { 
    super();
  }
  
  fetchTableData(): Observable<PeriodicElement[]> {
    return this.fetchTableDataService.getTableElements().pipe(
      tap(tableData => this.set( tableData )) 
    );
  }

}
